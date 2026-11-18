'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '..', 'signup-draft.js'), 'utf8');
const key = 'margex_signup_draft_v1';
function fixture(options = {}) {
  const values = new Map(); let now = 1800000000000;
  const storage = { getItem: name => values.get(name) || null, setItem: (name, value) => values.set(name, value), removeItem: name => values.delete(name) };
  const window = {};
  if (options.blocked) Object.defineProperty(window, 'sessionStorage', { get() { throw new Error('blocked'); } });
  else window.sessionStorage = storage;
  vm.runInNewContext(source, { window, Date: { now: () => now } });
  return { api: window.MARGEX_SIGNUP_DRAFT, values, advance: duration => { now += duration; }, now: () => now };
}
const contacts = { email: 'qa@example.invalid', phone: '(11) 99999-9999' };
test('draft only stores validated contacts and safe campaign keys in session storage', () => {
  const f = fixture();
  assert.equal(f.api.write({ ...contacts, arbitrary: 'not retained', campaign: { utm_source: 'meta', utm_campaign: 'black_live', utm_term: 'private@example.invalid', token: 'not retained' } }), true);
  const stored = JSON.parse(f.values.get(key));
  assert.deepEqual(Object.keys(stored).sort(), ['campaign','created_at','email','phone','source','version']);
  assert.equal(stored.source, 'quick_signup');
  assert.equal(stored.campaign.utm_source, 'meta'); assert.equal(stored.campaign.utm_term, '');
  assert.equal(stored.campaign.token, undefined);
  assert.equal(f.api.read().email, contacts.email);
});
test('draft expires after thirty minutes and removes the stale contacts', () => {
  const f = fixture(); f.api.write(contacts); f.advance(30 * 60 * 1000 + 1);
  assert.equal(f.api.read(), null); assert.equal(f.values.has(key), false);
});
test('invalid source, malformed JSON and future timestamps are rejected and removed', () => {
  const f = fixture();
  for (const raw of ['{broken', JSON.stringify({ ...contacts, version: 1, source: 'other', created_at: f.now() }), JSON.stringify({ ...contacts, version: 1, source: 'quick_signup', created_at: f.now() + 120000 })]) {
    f.values.set(key, raw); assert.equal(f.api.read(), null); assert.equal(f.values.has(key), false);
  }
});
test('email controls and invalid phone values never become a draft', () => {
  const f = fixture();
  for (const value of [{ ...contacts, email: 'bad\u0000@example.invalid' }, { ...contacts, email: 'bad\u007f@example.invalid' }, { ...contacts, phone: 'not-a-phone' }, { ...contacts, email: 'not-an-email' }]) assert.equal(f.api.write(value), false);
  assert.equal(f.values.has(key), false);
});
test('blocked storage fails safely and clearing removes valid contacts', () => {
  const blocked = fixture({ blocked: true });
  assert.equal(blocked.api.write(contacts), false); assert.equal(blocked.api.read(), null); assert.doesNotThrow(() => blocked.api.clear());
  const f = fixture(); f.api.write(contacts); f.api.clear(); assert.equal(f.api.read(), null);
});
