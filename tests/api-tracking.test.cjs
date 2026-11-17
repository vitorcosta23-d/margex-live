'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const { createTrackingApi } = require('../server/tracking.cjs');

const ID = '00000000-0000-4000-8000-000000000001';
const ORIGIN = 'https://margex-live.vercel.app';
const NOW = 1794916800000;
const ENV = { NODE_ENV: 'production', META_CAPI_ACCESS_TOKEN: 'test-only-placeholder-value-not-a-real-token' };
const WEBHOOK = 'https://script.google.com/macros/s/test-script-id/exec';
const LEAD_ENV = { ...ENV, MARGEX_LEADS_WEBHOOK_URL: WEBHOOK, MARGEX_LEADS_WEBHOOK_SECRET: 'test-placeholder-secret-for-mock-only' };
const digest = value => createHash('sha256').update(value).digest('hex');
function event(overrides = {}) {
  return { event_name: 'PageView', event_id: ID, event_source_url: ORIGIN + '/', origin: 'sales_page', consent: { analytics: true, marketing: true }, ...overrides };
}
function lead(overrides = {}) {
  const payload = event(); delete payload.event_name;
  return { ...payload, form_id: 'margex_live_signup', name: 'Seller de teste', email: 'Seller@Example.test', phone: '(11) 99999-9999', ...overrides };
}
function request(body, { method = 'POST', headers = {}, ip = '192.0.2.1' } = {}) {
  return { method, body, socket: { remoteAddress: ip }, headers: { origin: ORIGIN, 'content-type': 'application/json', 'user-agent': 'MargeX local mock test', ...headers } };
}
async function invoke(handler, body, options) {
  const headers = {}; let result;
  const res = { setHeader: (name, value) => { headers[name] = value; }, end: value => { result = JSON.parse(value); } };
  await handler(request(body, options), res);
  return { status: res.statusCode, body: result, headers };
}
function mockFetch(responses) {
  const calls = [];
  const fetcher = async (url, options) => {
    calls.push({ url, options, body: JSON.parse(options.body) });
    const next = responses.shift();
    if (next instanceof Error) throw next;
    assert.notEqual(next, undefined, 'No unexpected provider request');
    return { ok: next.status === undefined || next.status < 400, json: async () => next.json || next };
  };
  return { fetcher, calls };
}
test('standard event uses same UUID, server time and private header token, strips URL query/hash', async () => {
  const mock = mockFetch([{ events_received: 1 }]);
  const api = createTrackingApi({ env: ENV, fetcher: mock.fetcher, now: () => NOW });
  const result = await invoke(api.events, event({ event_source_url: ORIGIN + '/?email=not-forwarded@example.test#private', fbp: 'fb.1.1794916800000.12345' }));
  assert.equal(result.status, 200); assert.equal(result.body.event_id, ID);
  const call = mock.calls[0]; const sent = call.body.data[0];
  assert.equal(sent.event_id, ID); assert.equal(sent.event_time, Math.floor(NOW / 1000));
  assert.equal(sent.event_source_url, ORIGIN + '/'); assert.equal(sent.action_source, 'website');
  assert.equal(sent.user_data.client_ip_address, '192.0.2.1');
  assert.equal(sent.user_data.client_user_agent, 'MargeX local mock test');
  assert.equal(call.url, 'https://graph.facebook.com/v26.0/1768495497553870/events');
  assert.equal(call.options.headers.Authorization, 'Bearer ' + ENV.META_CAPI_ACCESS_TOKEN);
  assert.equal(call.url.includes(ENV.META_CAPI_ACCESS_TOKEN), false);
  assert.equal(JSON.stringify(call.body).includes('not-forwarded'), false);
  assert.equal(result.headers['Cache-Control'], 'no-store');
  assert.equal(result.headers['Access-Control-Allow-Origin'], ORIGIN);
});
for (const eventName of ['ViewContent', 'WhatsAppGroupClick']) test(eventName + ' is accepted without personal data', async () => {
  const mock = mockFetch([{ events_received: 1 }]);
  const api = createTrackingApi({ env: ENV, fetcher: mock.fetcher });
  assert.equal((await invoke(api.events, event({ event_name: eventName }))).status, 200);
  assert.equal(mock.calls[0].body.data[0].event_name, eventName);
  assert.equal(mock.calls[0].body.data[0].user_data.em, undefined);
});
test('public events reject Lead and unknown properties', async () => {
  const api = createTrackingApi({ env: ENV, fetcher: () => assert.fail('No provider request') });
  assert.equal((await invoke(api.events, event({ event_name: 'Lead' }))).status, 400);
  assert.equal((await invoke(api.events, event({ email: 'seller@example.test' }))).status, 400);
  assert.equal((await invoke(api.events, event({ event_time: NOW }))).status, 400);
});
test('marketing refusal sends nothing even when provider credentials are absent', async () => {
  const api = createTrackingApi({ env: {}, fetcher: () => assert.fail('No provider request') });
  const result = await invoke(api.events, event({ consent: { analytics: true, marketing: false } }));
  assert.equal(result.status, 202); assert.equal(result.body.sent, false);
});
test('missing credentials never claim that a server event was sent', async () => {
  const api = createTrackingApi({ env: {}, fetcher: () => assert.fail('No provider request') });
  const result = await invoke(api.events, event());
  assert.equal(result.status, 503); assert.equal(result.body.code, 'TRACKING_NOT_CONFIGURED');
});
test('only POST JSON from allowed origin is accepted', async () => {
  const api = createTrackingApi({ env: ENV, fetcher: () => assert.fail('No provider request') });
  assert.equal((await invoke(api.events, event(), { method: 'GET' })).status, 405);
  assert.equal((await invoke(api.events, event(), { headers: { origin: 'https://untrusted.example.test' } })).status, 403);
  assert.equal((await invoke(api.events, event(), { headers: { 'content-type': 'text/plain' } })).status, 415);
  assert.equal((await invoke(api.events, '{')).status, 400);
  assert.equal((await invoke(api.events, event(), { headers: { 'content-length': '16385' } })).status, 413);
  assert.equal((await invoke(api.events, 'x'.repeat(16385))).status, 413);
});
test('arbitrary source domains, private paths and malformed cookie identifiers are rejected', async () => {
  const api = createTrackingApi({ env: ENV, fetcher: () => assert.fail('No provider request') });
  assert.equal((await invoke(api.events, event({ event_source_url: 'https://untrusted.example.test/' }))).status, 400);
  assert.equal((await invoke(api.events, event({ event_source_url: ORIGIN + '/private' }))).status, 400);
  assert.equal((await invoke(api.events, event({ fbp: 'email@example.test' }))).status, 400);
});
test('forwarded IP is trusted only in the Vercel runtime', async () => {
  for (const vercel of [false, true]) {
    const mock = mockFetch([{ events_received: 1 }]);
    const api = createTrackingApi({ env: { ...ENV, ...(vercel ? { VERCEL: '1' } : {}) }, fetcher: mock.fetcher });
    await invoke(api.events, event(), { headers: { 'x-forwarded-for': '198.51.100.4' } });
    assert.equal(mock.calls[0].body.data[0].user_data.client_ip_address, vercel ? '198.51.100.4' : '192.0.2.1');
  }
});
test('unacknowledged provider events or network errors do not return success or raw provider errors', async () => {
  for (const providerResult of [{ events_received: 0 }, { status: 400, json: { error: 'private provider details' } }, new Error('secret mocked request')]) {
    const mock = mockFetch([providerResult]);
    const api = createTrackingApi({ env: ENV, fetcher: mock.fetcher });
    const result = await invoke(api.events, event());
    assert.equal(result.status, 502); assert.equal(result.body.ok, false);
    assert.equal(JSON.stringify(result.body).includes('private'), false);
    assert.equal(JSON.stringify(result.body).includes('secret'), false);
  }
});
test('events have a bounded per-instance rate limit', async () => {
  const mock = mockFetch(Array.from({ length: 40 }, () => ({ events_received: 1 })));
  const api = createTrackingApi({ env: ENV, fetcher: mock.fetcher, now: () => NOW });
  for (let i = 0; i < 40; i++) assert.equal((await invoke(api.events, event())).status, 200);
  const limited = await invoke(api.events, event());
  assert.equal(limited.status, 429); assert.equal(limited.headers['Retry-After'], '60');
});
test('lead registration fails closed when private persistence adapter is not configured', async () => {
  const api = createTrackingApi({ env: ENV, fetcher: () => assert.fail('No provider request') });
  const result = await invoke(api.leads, lead());
  assert.equal(result.status, 503); assert.equal(result.body.saved, false);
});
test('Lead is sent only after persistence acknowledges the exact UUID, and contact identifiers are hashed', async () => {
  const mock = mockFetch([{ ok: true, saved: true, lead_id: ID, event_id: ID }, { events_received: 1 }]);
  const api = createTrackingApi({ env: LEAD_ENV, fetcher: mock.fetcher, now: () => NOW });
  const result = await invoke(api.leads, lead());
  assert.equal(result.status, 200); assert.equal(result.body.saved, true); assert.equal(result.body.tracking.server, 'sent');
  assert.equal(mock.calls[0].url, WEBHOOK); assert.equal(mock.calls[1].body.data[0].event_name, 'Lead');
  assert.equal(mock.calls[0].body.lead.event_id, mock.calls[1].body.data[0].event_id);
  const identifiers = mock.calls[1].body.data[0].user_data;
  assert.deepEqual(identifiers.em, [digest('seller@example.test')]);
  assert.deepEqual(identifiers.ph, [digest('5511999999999')]);
  assert.equal(JSON.stringify(mock.calls[1].body).includes('Seller de teste'), false);
  assert.equal(JSON.stringify(mock.calls[1].body).includes('Seller@Example.test'), false);
  assert.equal(JSON.stringify(result.body).includes(LEAD_ENV.MARGEX_LEADS_WEBHOOK_SECRET), false);
});
test('false persistence receipt cannot trigger either success or Lead', async () => {
  for (const receipt of [{ ok: true, saved: false }, { ok: true, saved: true, lead_id: 'different', event_id: ID }]) {
    const mock = mockFetch([receipt]); const api = createTrackingApi({ env: LEAD_ENV, fetcher: mock.fetcher });
    const result = await invoke(api.leads, lead());
    assert.equal(result.status, 502); assert.equal(result.body.saved, false); assert.equal(mock.calls.length, 1);
  }
});
test('marketing refusal does not prevent a real registration but prevents its Meta event', async () => {
  const mock = mockFetch([{ ok: true, saved: true, lead_id: ID, event_id: ID }]);
  const api = createTrackingApi({ env: LEAD_ENV, fetcher: mock.fetcher });
  const result = await invoke(api.leads, lead({ consent: { analytics: false, marketing: false } }));
  assert.equal(result.status, 200); assert.equal(result.body.saved, true); assert.equal(result.body.tracking.server, 'skipped');
  assert.equal(mock.calls.length, 1);
});
test('Meta failure after saving does not tell the visitor that registration failed', async () => {
  const mock = mockFetch([{ ok: true, saved: true, lead_id: ID, event_id: ID }, new Error('mock Meta timeout')]);
  const api = createTrackingApi({ env: LEAD_ENV, fetcher: mock.fetcher });
  const result = await invoke(api.leads, lead());
  assert.equal(result.status, 200); assert.equal(result.body.saved, true); assert.equal(result.body.tracking.server, 'failed');
});
test('duplicate registration receipt does not send another server Lead', async () => {
  const mock = mockFetch([{ ok: true, saved: true, duplicate: true, lead_id: ID, event_id: ID }]);
  const api = createTrackingApi({ env: LEAD_ENV, fetcher: mock.fetcher });
  const result = await invoke(api.leads, lead());
  assert.equal(result.body.duplicate, true); assert.equal(result.body.tracking.server, 'duplicate'); assert.equal(mock.calls.length, 1);
});
test('invalid or incomplete contact details cannot enter the persistence provider', async () => {
  const api = createTrackingApi({ env: LEAD_ENV, fetcher: () => assert.fail('No provider request') });
  for (const invalid of [{ email: 'invalid' }, { name: 'A' }, { phone: '123' }, { unexpected: 'no' }]) {
    assert.equal((await invoke(api.leads, lead(invalid))).status, 400);
  }
});
