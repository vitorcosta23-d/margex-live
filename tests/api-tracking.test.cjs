'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const { createTrackingApi, qualificationChoices } = require('../server/tracking.cjs');

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
    return { ok: next.status === undefined || next.status < 400, status: next.status || 200, json: async () => next.json || next };
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
for (const eventName of ['ViewContent', 'WhatsAppGroupClick', 'FormOpen']) test(eventName + ' is accepted without personal data', async () => {
  const mock = mockFetch([{ events_received: 1 }]);
  const api = createTrackingApi({ env: ENV, fetcher: mock.fetcher });
  assert.equal((await invoke(api.events, event({ event_name: eventName }))).status, 200);
  assert.equal(mock.calls[0].body.data[0].event_name, eventName);
  assert.equal(mock.calls[0].body.data[0].user_data.em, undefined);
});
test('FormOpen on the quick signup page preserves the browser UUID and strips query data', async () => {
  const mock = mockFetch([{ events_received: 1 }]);
  const api = createTrackingApi({ env: ENV, fetcher: mock.fetcher, now: () => NOW });
  const result = await invoke(api.events, event({
    event_name: 'FormOpen', event_source_url: ORIGIN + '/inscricao.html?email=not-forwarded@example.test#private',
    consent: { analytics: false, marketing: true }
  }));
  assert.equal(result.status, 200); assert.equal(result.body.event_id, ID);
  assert.equal(mock.calls.length, 1);
  const sent = mock.calls[0].body.data[0];
  assert.equal(sent.event_name, 'FormOpen'); assert.equal(sent.event_id, ID);
  assert.equal(sent.action_source, 'website'); assert.equal(sent.event_source_url, ORIGIN + '/inscricao.html');
  assert.equal(sent.user_data.em, undefined); assert.equal(sent.user_data.ph, undefined);
  assert.equal(JSON.stringify(sent).includes('not-forwarded'), false);
});

test('FormOpen respects marketing refusal and cannot accept contact properties', async () => {
  const api = createTrackingApi({ env: {}, fetcher: () => assert.fail('No provider request') });
  const refused = await invoke(api.events, event({ event_name: 'FormOpen', consent: { analytics: true, marketing: false } }));
  assert.equal(refused.status, 202); assert.equal(refused.body.sent, false);
  assert.equal((await invoke(api.events, event({ event_name: 'FormOpen', email: 'seller@example.test' }))).status, 400);
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
  assert.equal((await invoke(api.events, event({ event_name: 'FormOpen', event_source_url: ORIGIN + '/inscricao.html/private' }))).status, 400);
  assert.equal((await invoke(api.events, event({ event_name: 'FormOpen', event_source_url: ORIGIN + '/inscricao.js' }))).status, 400);
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

function version27(overrides = {}) {
  return lead({ form_version: '2.7', qualification: {
    channel: qualificationChoices.channel[0], ad_count: qualificationChoices.ad_count[2],
    pricing_process: qualificationChoices.pricing_process[1], main_problem: qualificationChoices.main_problem[0]
  }, consent: { analytics: false, marketing: false }, ...overrides });
}
test('version 2.7 requires every applicable canonical qualification before persistence', async () => {
  const complete = version27();
  const badCases = [
    { ...complete, qualification: undefined },
    { ...complete, qualification: { channel: qualificationChoices.channel[0] } },
    { ...complete, qualification: { ...complete.qualification, ad_count: 'unknown_internal_id' } },
    { ...complete, qualification: { ...complete.qualification, pricing_process: undefined } },
    { ...complete, qualification: { ...complete.qualification, main_problem: '' } },
    { ...complete, qualification: { ...complete.qualification, extra: 'not allowed' } },
    { ...complete, form_version: '2.8' }
  ];
  const invalidLogs = [];
  const api = createTrackingApi({ env: LEAD_ENV, fetcher: () => assert.fail('Incomplete qualification cannot be persisted'), logger: entry => invalidLogs.push(entry) });
  for (const payload of badCases) assert.equal((await invoke(api.leads, payload)).status, 400);
  assert.equal(invalidLogs.length, badCases.length);
  assert.ok(invalidLogs.every(entry => entry.saved === false && entry.capi_status === 'not_attempted' && entry.error_code === 'INVALID_PAYLOAD'));
});
test('complete version 2.7 reaches the relay with all four exact labels', async () => {
  const mock = mockFetch([{ ok: true, saved: true, lead_id: ID, event_id: ID }]);
  const api = createTrackingApi({ env: LEAD_ENV, fetcher: mock.fetcher });
  const payload = version27(); const result = await invoke(api.leads, payload);
  assert.equal(result.status, 200); assert.equal(result.body.saved, true);
  assert.deepEqual(mock.calls[0].body.lead.qualification, payload.qualification);
  assert.equal(mock.calls[0].body.lead.attribution.form_version, '2.7');
});
test('educational channels need only channel, while no active listings needs channel and count', async () => {
  for (const channel of qualificationChoices.channel.slice(2)) {
    const mock = mockFetch([{ ok: true, saved: true, lead_id: ID, event_id: ID }]);
    const api = createTrackingApi({ env: LEAD_ENV, fetcher: mock.fetcher });
    assert.equal((await invoke(api.leads, version27({ qualification: { channel } }))).status, 200);
  }
  const mock = mockFetch([{ ok: true, saved: true, lead_id: ID, event_id: ID }]);
  const api = createTrackingApi({ env: LEAD_ENV, fetcher: mock.fetcher });
  assert.equal((await invoke(api.leads, version27({ qualification: { channel: qualificationChoices.channel[0], ad_count: 'Nenhum' } }))).status, 200);
});
test('unknown listing count still requires pricing process and main problem', async () => {
  const noFollowup = version27({ qualification: { channel: qualificationChoices.channel[0], ad_count: 'Não sei informar' } });
  const api = createTrackingApi({ env: LEAD_ENV, fetcher: () => assert.fail('No persistence before all applicable questions') });
  assert.equal((await invoke(api.leads, noFollowup)).status, 400);
  const mock = mockFetch([{ ok: true, saved: true, lead_id: ID, event_id: ID }]);
  const completeApi = createTrackingApi({ env: LEAD_ENV, fetcher: mock.fetcher });
  const payload = version27(); payload.qualification.ad_count = 'Não sei informar';
  assert.equal((await invoke(completeApi.leads, payload)).status, 200);
});
test('a legacy open-tab contact-only registration remains compatible', async () => {
  const mock = mockFetch([{ ok: true, saved: true, lead_id: ID, event_id: ID }]);
  const api = createTrackingApi({ env: LEAD_ENV, fetcher: mock.fetcher });
  const result = await invoke(api.leads, lead({ consent: { analytics: false, marketing: false } }));
  assert.equal(result.status, 200); assert.equal(result.body.saved, true);
});
test('server receipts whitelist UUID, consent and status without personal data or hashes', async () => {
  const logs = [];
  const mock = mockFetch([{ ok: true, saved: true, lead_id: ID, event_id: ID }, { events_received: 1 }]);
  const api = createTrackingApi({ env: { ...LEAD_ENV, VERCEL: '1' }, fetcher: mock.fetcher, now: () => NOW, logger: entry => logs.push(entry) });
  const payload = version27({ consent: { analytics: true, marketing: true } });
  const result = await invoke(api.leads, payload);
  assert.equal(result.body.tracking.server, 'sent'); assert.equal(logs.length, 1);
  assert.deepEqual(logs[0], {
    type: 'margex_lead_receipt', received_at: new Date(NOW).toISOString(), event_id: ID,
    form_version: '2.7', consent_analytics: true, consent_marketing: true,
    saved: true, duplicate: false, capi_status: 'sent', http_status: 200, error_code: null
  });
  const serialized = JSON.stringify(logs);
  for (const privateValue of [payload.name, payload.email, payload.phone, digest(payload.email.toLowerCase()), LEAD_ENV.META_CAPI_ACCESS_TOKEN, LEAD_ENV.MARGEX_LEADS_WEBHOOK_SECRET]) assert.equal(serialized.includes(privateValue), false);
  assert.equal(serialized.includes(ORIGIN), false); assert.equal(serialized.includes('client_ip'), false);
});
test('a rejected Meta event produces numeric diagnostics in the private receipt, not provider text', async () => {
  const logs = [];
  const mock = mockFetch([{ ok: true, saved: true, lead_id: ID, event_id: ID }, { status: 400, json: { error: { code: 190, error_subcode: 463, message: 'DO_NOT_LOG_PROVIDER_TEXT', fbtrace_id: 'DO_NOT_LOG_TRACE' } } }]);
  const api = createTrackingApi({ env: LEAD_ENV, fetcher: mock.fetcher, logger: entry => logs.push(entry) });
  const result = await invoke(api.leads, version27({ consent: { analytics: true, marketing: true } }));
  assert.equal(result.status, 200); assert.equal(result.body.saved, true); assert.equal(result.body.tracking.server, 'failed');
  assert.equal(logs[0].upstream_http_status, 400); assert.equal(logs[0].meta_error_code, 190); assert.equal(logs[0].meta_error_subcode, 463);
  assert.equal(logs[0].error_code, 'UPSTREAM_REJECTED');
  assert.equal(JSON.stringify(logs).includes('DO_NOT_LOG'), false); assert.equal(JSON.stringify(result.body).includes('190'), false);
});
test('persistence failure and rejected marketing each leave an accurate receipt', async () => {
  const failedLogs = [];
  const failed = mockFetch([{ status: 503, json: { code: 'PRIVATE_RELAY_FAILURE' } }]);
  const api = createTrackingApi({ env: LEAD_ENV, fetcher: failed.fetcher, logger: entry => failedLogs.push(entry) });
  assert.equal((await invoke(api.leads, version27())).status, 502);
  assert.equal(failedLogs[0].saved, false); assert.equal(failedLogs[0].capi_status, 'not_attempted');
  const deniedLogs = []; const saved = mockFetch([{ ok: true, saved: true, lead_id: ID, event_id: ID }]);
  const deniedApi = createTrackingApi({ env: LEAD_ENV, fetcher: saved.fetcher, logger: entry => deniedLogs.push(entry) });
  assert.equal((await invoke(deniedApi.leads, version27())).status, 200);
  assert.equal(deniedLogs[0].saved, true); assert.equal(deniedLogs[0].capi_status, 'skipped'); assert.equal(deniedLogs[0].consent_marketing, false);
});
test('receipt logger failure never undoes a successfully saved registration', async () => {
  const mock = mockFetch([{ ok: true, saved: true, lead_id: ID, event_id: ID }]);
  const api = createTrackingApi({ env: LEAD_ENV, fetcher: mock.fetcher, logger: () => { throw new Error('mock logging failure'); } });
  const result = await invoke(api.leads, version27());
  assert.equal(result.status, 200); assert.equal(result.body.saved, true);
});
