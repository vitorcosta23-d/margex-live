'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const source = fs.readFileSync(path.join(__dirname, '..', 'analytics.js'), 'utf8');

function fixture(options = {}) {
  const scripts = [];
  const connections = [];
  const requests = [];
  const listeners = {};
  const panelInputs = { analytics: { checked: false, focus() {} }, marketing: { checked: false, focus() {} } };
  const layers = { summary: { hidden: false }, details: { hidden: true } };
  const elements = [];
  const classList = { add() {}, remove() {}, toggle() {} };
  const footer = { append() {} };
  const maskedForm = { attributes: {}, setAttribute(name, value) { this.attributes[name] = value; } };
  const document = {
    readyState: 'complete', cookie: '_fbp=fb.1.1000000000000.123456; _fbc=fb.1.1000000000000.testclick',
    scripts,
    head: { append(element) { (element.tagName === 'link' ? connections : scripts).push(element); } },
    body: { append() {}, classList },
    getElementById(id) { return id === 'signup-mount' ? maskedForm : scripts.concat(connections).find(element => element.id === id) || null; },
    querySelector() { return footer; },
    addEventListener(name, callback) { listeners[name] = callback; },
    createElement(tagName) {
      const element = { tagName, hidden: false, dataset: {}, events: {}, setAttribute() {}, addEventListener(name, callback) { this.events[name] = callback; }, focus() {},
        querySelector(selector) {
          if (selector.includes('data-consent-layer')) return selector.includes('summary') ? layers.summary : layers.details;
          return selector.includes('marketing') ? panelInputs.marketing : panelInputs.analytics;
        }
      };
      elements.push(element);
      return element;
    }
  };
  const storage = initial => {
    const values = new Map(Object.entries(initial || {}));
    return { getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
  };
  const location = new URL(options.url || 'https://margex-live.vercel.app/');
  const window = {
    crypto, dataLayer: [], sessionStorage: storage(), localStorage: storage(options.stored),
    MARGEX_CONFIG: { formIsPreview: options.preview !== false, tracking: {
      metaPixelId: '1768495497553870', gtmContainerId: 'GTM-MW8RFWV5', ga4MeasurementId: 'G-V4815EHTWE',
      clarityProjectId: options.clarity === false ? undefined : 'zf7ftfroh7',
      serverEventsEnabled: options.server === true, serverEventsEndpoint: '/api/events'
    } }
  };
  if (options.blockedStorage) for (const name of ['localStorage', 'sessionStorage']) Object.defineProperty(window, name, { get() { throw new Error('Storage unavailable'); } });
  vm.runInNewContext(source, { window, document, location, URL, URLSearchParams, Uint8Array, Set,
    fetch(url, init) { requests.push({ url, init }); return Promise.resolve({ ok: true }); }
  });
  const panel = elements.find(element => element.tagName === 'section');
  return { window, scripts, connections, maskedForm, requests, listeners, tracking: window.MARGEX_TRACKING, panel, layers, panelInputs,
    consentAction(action) { panel.events.click({ target: { closest() { return { dataset: { consent: action } }; } } }); },
    meta: () => Array.from(window.fbq?.queue || [], args => Array.from(args)),
    ga: () => window.dataLayer.filter(item => item[0] === 'event').map(item => Array.from(item)),
    clarity: () => Array.from(window.clarity?.q || [], args => Array.from(args))
  };
}
const ack = () => ({ ok: true, saved: true, lead_id: 'lead_mock', event_id: crypto.randomUUID() });

test('default denies all storage and does not load providers or send server requests', () => {
  const f = fixture();
  assert.equal(f.scripts.length, 0);
  assert.equal(f.requests.length, 0);
  assert.equal(f.ga().length, 0);
  const command = Array.from(f.window.dataLayer[0]);
  assert.equal(command[0], 'consent');
  assert.equal(command[1], 'default');
  assert.equal(command[2].analytics_storage, 'denied');
  assert.equal(command[2].ad_storage, 'denied');
});

test('analytics-only consent loads one GTM container and no Meta, with no duplicate GA4 page_view', () => {
  const f = fixture();
  f.tracking.setConsent({ analytics: true, marketing: false });
  f.tracking.setConsent({ analytics: true, marketing: false });
  assert.equal(f.scripts.length, 2);
  assert.equal(f.scripts[0].src, 'https://www.googletagmanager.com/gtm.js?id=GTM-MW8RFWV5');
  assert.equal(f.meta().length, 0);
  assert.equal(f.ga().filter(item => item[1] === 'view_content').length, 1);
  assert.equal(f.ga().filter(item => item[1] === 'page_view').length, 0);
  assert.equal(f.requests.length, 0);
});

test('marketing-only consent loads one pixel and sends one PageView and one workshop ViewContent', () => {
  const f = fixture({ server: true });
  f.tracking.setConsent({ analytics: false, marketing: true });
  f.tracking.setConsent({ analytics: false, marketing: true });
  assert.equal(f.scripts.length, 1);
  assert.match(f.scripts[0].src, /^https:\/\/connect\.facebook\.net\//);
  const events = f.meta().filter(item => item[0] === 'track');
  assert.deepEqual(events.map(item => item[1]), ['PageView', 'ViewContent']);
  assert.equal(events[1][2].content_name, 'MargeX live');
  assert.equal(Object.hasOwn(events[1][2], 'value'), false);
  assert.equal(Object.hasOwn(events[1][2], 'currency'), false);
  assert.equal(f.requests.length, 2);
  const payload = JSON.parse(f.requests[1].init.body);
  assert.equal(payload.event_id, events[1][3].eventID);
  assert.equal(payload.event_name, 'ViewContent');
  assert.equal(payload.consent.marketing, true);
});

test('direct form receives PageView without pretending that workshop content was viewed', () => {
  const f = fixture({ url: 'https://margex-live.vercel.app/formulario.html' });
  f.tracking.setConsent({ analytics: true, marketing: true });
  assert.deepEqual(f.meta().filter(item => item[0] === 'track').map(item => item[1]), ['PageView']);
  assert.equal(f.ga().filter(item => item[1] === 'view_content').length, 0);
  assert.equal(f.tracking.context().origin, 'direct_form');
});

test('preview and unsaved/error acknowledgements never emit Lead or generate_lead', () => {
  const f = fixture();
  f.tracking.setConsent({ analytics: true, marketing: true });
  assert.equal(f.tracking.confirmLead(ack()), false);
  assert.equal(f.meta().filter(item => item[1] === 'Lead').length, 0);
  assert.equal(f.ga().filter(item => item[1] === 'generate_lead').length, 0);
  const real = fixture({ preview: false });
  real.tracking.setConsent({ analytics: true, marketing: true });
  for (const invalid of [{}, { ...ack(), saved: false }, { ...ack(), ok: false }, { ...ack(), event_id: 'invalid' }]) assert.equal(real.tracking.confirmLead(invalid), false);
  assert.equal(real.meta().filter(item => item[1] === 'Lead').length, 0);
});

test('saved acknowledgement emits one deduplicated browser Lead and no public CAPI Lead', () => {
  const f = fixture({ preview: false, server: true });
  f.tracking.setConsent({ analytics: true, marketing: true });
  const saved = ack();
  assert.equal(f.tracking.confirmLead(saved), true);
  assert.equal(f.tracking.confirmLead(saved), false);
  const events = f.meta().filter(item => item[1] === 'Lead');
  assert.equal(events.length, 1);
  assert.equal(events[0][3].eventID, saved.event_id);
  const google = f.ga().filter(item => item[1] === 'generate_lead');
  assert.equal(google.length, 1);
  assert.equal(google[0][2].event_id, saved.event_id);
  assert.equal(f.requests.filter(item => JSON.parse(item.init.body).event_name === 'Lead').length, 0);
});

test('group click is a custom event and does not count another Lead or expose the invite URL', () => {
  const f = fixture({ server: true });
  f.tracking.setConsent({ analytics: true, marketing: true });
  const link = { href: 'https://chat.whatsapp.com/InviteExample', closest() { return this; } };
  f.listeners.click({ target: link });
  const event = f.meta().find(item => item[1] === 'WhatsAppGroupClick');
  assert.equal(event[0], 'trackCustom');
  assert.equal(f.meta().some(item => item[1] === 'Lead'), false);
  const serialized = JSON.stringify(f.window.dataLayer) + JSON.stringify(f.requests);
  assert.equal(serialized.includes('InviteExample'), false);
  assert.equal(f.ga().filter(item => item[1] === 'whatsapp_group_click').length, 1);
});

test('contact-looking campaign values are not stored or emitted and no raw URL reaches the server', () => {
  const f = fixture({ server: true, url: 'https://margex-live.vercel.app/?utm_source=meta&utm_campaign=person%40example.com&email=person%40example.com#person' });
  f.tracking.setConsent({ analytics: true, marketing: true });
  f.tracking.formStarted();
  f.tracking.formStepCompleted(1, 3);
  const data = f.tracking.context();
  assert.equal(data.utm_source, 'meta');
  assert.equal(data.utm_campaign, '');
  assert.equal(data.event_source_url, 'https://margex-live.vercel.app/');
  const recorded = JSON.stringify(f.window.dataLayer) + JSON.stringify(f.requests);
  assert.equal(recorded.includes('person@example.com'), false);
  assert.equal(recorded.includes('person%40example.com'), false);
  assert.equal(recorded.includes('?email='), false);
  assert.equal(f.ga().filter(item => item[1] === 'form_start').length, 0);
  assert.equal(f.ga().filter(item => item[1] === 'form_open').length, 1);
});

test('revoking optional measurement blocks new custom events and public server calls', () => {
  const f = fixture({ server: true });
  f.tracking.setConsent({ analytics: true, marketing: true });
  f.tracking.setConsent({ analytics: false, marketing: false });
  const events = f.ga().length;
  const requests = f.requests.length;
  f.tracking.formStarted();
  f.tracking.formStepCompleted(1, 3);
  f.listeners.click({ target: { href: 'https://chat.whatsapp.com/InviteExample', closest() { return this; } } });
  assert.equal(f.ga().length, events);
  assert.equal(f.requests.length, requests);
});

test('blocked storage does not break the consent controls or tracking API', () => {
  const f = fixture({ blockedStorage: true });
  assert.equal(f.scripts.length, 0);
  assert.doesNotThrow(() => f.tracking.setConsent({ analytics: true, marketing: true }));
  assert.equal(f.scripts.length, 3);
});

test('a real incoming fbclid supplies CAPI matching without exposing it to GA4 events', () => {
  const f = fixture({ server: true, url: 'https://margex-live.vercel.app/?fbclid=IncomingClick_ABC-123' });
  assert.equal(f.tracking.context().fbc, undefined);
  f.tracking.setConsent({ analytics: true, marketing: true });
  assert.match(f.tracking.context().fbc, /^fb\.1\.\d{13}\.IncomingClick_ABC-123$/);
  assert.equal(JSON.parse(f.requests[0].init.body).fbc, f.tracking.context().fbc);
  assert.equal(JSON.stringify(f.window.dataLayer).includes('IncomingClick_ABC-123'), false);
});

test('the first cookies layer accepts both categories with one clear action', () => {
  const f = fixture();
  assert.match(f.panel.innerHTML, />Cookies</);
  assert.match(f.panel.innerHTML, /data-consent="all">Aceitar cookies/);
  assert.match(f.panel.innerHTML, /data-consent="none">Recusar não essenciais/);
  assert.equal(f.layers.details.hidden, true);
  f.consentAction('all');
  assert.equal(f.tracking.getConsent().analytics, true);
  assert.equal(f.tracking.getConsent().marketing, true);
  assert.equal(f.scripts.length, 3);
  assert.equal(f.panel.hidden, true);
});

test('preferences require a second deliberate choice and selected categories remain granular', () => {
  const f = fixture();
  f.consentAction('preferences');
  assert.equal(f.layers.summary.hidden, true);
  assert.equal(f.layers.details.hidden, false);
  assert.equal(f.scripts.length, 0);
  assert.equal(f.tracking.getConsent().marketing, false);
  f.panelInputs.analytics.checked = true;
  f.consentAction('selected');
  assert.equal(f.tracking.getConsent().analytics, true);
  assert.equal(f.tracking.getConsent().marketing, false);
  assert.equal(f.scripts.length, 2);
});

test('an older recorded refusal is preserved when the simpler cookies UI is deployed', () => {
  const f = fixture({ stored: { margex_tracking_consent_v1: JSON.stringify({ version: 1, analytics: false, marketing: false }) } });
  assert.equal(f.panel.hidden, true);
  assert.equal(f.scripts.length, 0);
  assert.equal(f.tracking.getConsent().analytics, false);
  assert.equal(f.tracking.getConsent().marketing, false);
});

test('Clarity waits for analytics consent, masks the form and never enables Microsoft Ads storage', () => {
  const f = fixture();
  assert.equal(f.clarity().length, 0); assert.equal(f.connections.length, 0);
  f.tracking.setConsent({ analytics: false, marketing: true });
  assert.equal(f.scripts.some(script => /clarity\.ms/.test(script.src)), false);
  f.tracking.setConsent({ analytics: true, marketing: true });
  f.tracking.setConsent({ analytics: true, marketing: true });
  const tags = f.scripts.filter(script => script.src === 'https://www.clarity.ms/tag/zf7ftfroh7');
  assert.equal(tags.length, 1); assert.equal(tags[0].async, true); assert.equal(tags[0].fetchPriority, 'low');
  assert.equal(f.maskedForm.attributes['data-clarity-mask'], 'true');
  const commands = f.clarity();
  assert.ok(commands.some(command => command[0] === 'consentv2' && command[1].analytics_Storage === 'granted'));
  assert.ok(commands.filter(command => command[0] === 'consentv2').every(command => command[1].ad_Storage === 'denied'));
  assert.equal(commands.some(command => command[0] === 'identify'), false);
  assert.match(f.panel.innerHTML, /Google Analytics e Microsoft Clarity/);
});
test('SDK preconnects and async tags are consent gated, unique and low priority', () => {
  const f = fixture();
  assert.equal(f.connections.length, 0);
  f.consentAction('all'); f.consentAction('all');
  assert.equal(f.connections.length, 3);
  assert.equal(new Set(f.connections.map(link => link.href)).size, 3);
  assert.ok(f.connections.every(link => link.rel === 'preconnect' && link.crossOrigin === 'anonymous'));
  assert.ok(f.scripts.every(script => script.async === true && script.fetchPriority === 'low'));
  assert.equal(f.scripts.length, 3);
});
test('Clarity is stopped on revocation and restarts without reloading another tag', () => {
  const f = fixture();
  f.tracking.setConsent({ analytics: true, marketing: false });
  f.tracking.setConsent({ analytics: false, marketing: false });
  const denied = f.clarity().find(command => command[0] === 'consentv2' && command[1].analytics_Storage === 'denied');
  assert.ok(denied); assert.equal(denied[1].ad_Storage, 'denied');
  assert.equal(f.clarity().filter(command => command[0] === 'stop').length, 1);
  f.tracking.setConsent({ analytics: true, marketing: false });
  assert.equal(f.clarity().filter(command => command[0] === 'start').length, 1);
  assert.equal(f.scripts.filter(script => /clarity\.ms/.test(script.src)).length, 1);
});
test('explicit contact and secret URL parameters prevent loading the session recorder', () => {
  for (const query of ['email=seller%40example.test', 'phone=11999999999', 'token=test-placeholder', 'utm_campaign=seller%40example.test']) {
    const f = fixture({ url: 'https://margex-live.vercel.app/?' + query });
    f.tracking.setConsent({ analytics: true, marketing: false });
    assert.equal(f.scripts.some(script => /clarity\.ms/.test(script.src)), false);
    assert.equal(f.scripts.filter(script => /googletagmanager/.test(script.src)).length, 1);
  }
});
test('optional Clarity failure does not prevent confirmation of a saved registration', () => {
  const f = fixture({ preview: false });
  f.tracking.setConsent({ analytics: true, marketing: true });
  f.window.clarity = () => { throw new Error('mock recorder unavailable'); };
  assert.doesNotThrow(() => f.tracking.setConsent({ analytics: false, marketing: true }));
  assert.doesNotThrow(() => f.tracking.setConsent({ analytics: true, marketing: true }));
  assert.equal(f.tracking.confirmLead(ack()), true);
  assert.equal(f.meta().filter(command => command[1] === 'Lead').length, 1);
});
