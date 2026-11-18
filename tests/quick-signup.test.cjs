'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '..', 'inscricao.js'), 'utf8');
function fixture(options = {}) {
  const controls = Object.fromEntries(['quick-signup-form','quick-email','quick-phone','quick-email-error','quick-phone-error','quick-error','submit'].map(id => [id, { value: '', textContent: '', disabled: false, attributes: {}, events: {}, setAttribute(key, value) { this.attributes[key] = value; }, removeAttribute(key) { delete this.attributes[key]; }, addEventListener(name, fn) { this.events[name] = fn; }, focus() {} }]));
  controls['quick-signup-form'].querySelector = () => controls.submit;
  const writes = [], navigations = [], events = [], windowEvents = {};
  const history = { state: null, replaceState(value) { this.state = value; } };
  const window = { history, requestAnimationFrame: callback => callback(), addEventListener: (name, fn) => { windowEvents[name] = fn; }, location: { assign: value => navigations.push(value) }, MARGEX_SIGNUP_DRAFT: { read: () => null, write: value => { writes.push(value); return !options.blocked; } }, MARGEX_TRACKING: { formStarted: () => events.push('form_open'), context: () => ({ utm_source: 'meta', utm_campaign: 'black_live' }) } };
  vm.runInNewContext(source, { window, document: { getElementById: id => controls[id] } });
  return { controls, writes, navigations, events, windowEvents, history, submit: () => controls['quick-signup-form'].events.submit({ preventDefault() {} }) };
}
test('quick contact stage only writes the functional draft and navigates, never persists a Lead', () => {
  const f = fixture(); f.controls['quick-email'].value = 'qa@example.invalid'; f.controls['quick-phone'].value = '11999999999';
  f.submit(); f.submit();
  assert.equal(f.writes.length, 1); assert.equal(f.navigations.length, 1); assert.equal(f.navigations[0], '/formulario.html');
  assert.equal(f.writes[0].campaign.utm_source, 'meta');
  assert.deepEqual(JSON.parse(JSON.stringify(f.history.state)), { margexQuickHandoff: true });
  assert.equal(JSON.stringify(f.history.state).includes('qa@example.invalid'), false);
  assert.equal(f.events.includes('Lead'), false); assert.equal(f.events.includes('generate_lead'), false);
});
test('invalid quick contacts cannot leave the page or enter a draft', () => {
  const f = fixture(); f.controls['quick-email'].value = 'invalid'; f.controls['quick-phone'].value = '1'; f.submit();
  assert.equal(f.writes.length, 0); assert.equal(f.navigations.length, 0);
  assert.match(f.controls['quick-email-error'].textContent, /Confira seu e-mail/);
});
test('blocked draft storage offers the complete form without silently losing contacts', () => {
  const f = fixture({ blocked: true }); f.controls['quick-email'].value = 'qa@example.invalid'; f.controls['quick-phone'].value = '11999999999'; f.submit();
  assert.equal(f.navigations.length, 0); assert.match(f.controls['quick-error'].textContent, /formulário completo/);
});

test('browser Back restores an actionable quick form and clears expired or already submitted contacts', () => {
  const f = fixture(); f.controls['quick-email'].value = 'qa@example.invalid'; f.controls['quick-phone'].value = '11999999999'; f.submit();
  assert.equal(f.controls.submit.disabled, true);
  f.windowEvents.pageshow({ persisted: true });
  assert.equal(f.controls.submit.disabled, false); assert.equal(f.controls['quick-email'].value, '');
  f.controls['quick-email'].value = 'new@example.invalid'; f.controls['quick-phone'].value = '21999999999'; f.submit();
  assert.equal(f.navigations.length, 2);
  f.windowEvents.pageshow({ persisted: false });
  assert.equal(f.controls['quick-email'].value, ''); assert.equal(f.controls['quick-phone'].value, '');
});
