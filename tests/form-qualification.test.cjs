'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const configSource = fs.readFileSync(path.join(root, 'config.js'), 'utf8');
const formSource = fs.readFileSync(path.join(root, 'form.js'), 'utf8');
const uuid = '11111111-1111-4111-8111-111111111111';

class Element {
  constructor(tag = 'div') { this.tagName = tag; this.children = []; this.events = {}; this.attributes = {}; this.dataset = {}; this.style = {}; this.hidden = false; this.disabled = false; this.checked = false; this.value = ''; this.textContent = ''; }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.children = [...children]; }
  insertBefore(child) { this.children.push(child); }
  setAttribute(name, value) { this.attributes[name] = value; }
  removeAttribute(name) { delete this.attributes[name]; }
  addEventListener(name, callback) { (this.events[name] ||= []).push(callback); }
  focus() { this.focused = true; }
  getAnimations() { return []; }
  descendants() { return this.children.flatMap(child => [child, ...child.descendants()]); }
  querySelector(selector) {
    if (this.special?.[selector]) return this.special[selector];
    const nodes = this.descendants();
    if (selector === 'input:checked') return nodes.find(node => node.tagName === 'input' && node.checked) || null;
    if (selector === 'input') return nodes.find(node => node.tagName === 'input') || null;
    return null;
  }
  querySelectorAll(selector) { return selector === 'p' ? this.paragraphs || [] : []; }
  async emit(name) { for (const callback of this.events[name] || []) await callback({ preventDefault() {}, target: this }); }
}

function fixture(options = {}) {
  const selectors = ['form','#form-input','#form-choices','#form-error','.form-progress','#form-back','#form-next','#form-result','#form-review','.form-preview-note','#form-title','#form-label','#form-hint','.question-number','#form-step-counter','.form-question'];
  const nodes = Object.fromEntries(selectors.map(selector => [selector, new Element()]));
  nodes['#form-input'].tagName = 'input';
  const optionRoot = new Element();
  nodes['#form-choices'].special = { '.form-choice-options': optionRoot, legend: new Element('legend') };
  nodes['#form-choices'].children = [optionRoot];
  nodes['.form-progress'].special = { span: new Element('span') };
  const result = nodes['#form-result'];
  result.special = { h2: new Element('h2') };
  result.paragraphs = [new Element('p'), new Element('p')];
  result.hidden = true;
  const mount = new Element();
  mount.querySelector = selector => nodes[selector];
  const document = {
    getElementById: id => id === 'signup-mount' ? mount : null,
    createElement: tag => new Element(tag), querySelectorAll: () => [],
    body: { classList: { add() {}, remove() {} } }
  };
  const events = [];
  const requests = [];
  const tracking = {
    context: () => ({ form_id: 'margex_live_signup', origin: 'direct_form', event_source_url: 'https://margex-live.vercel.app/formulario.html', consent: { analytics: true, marketing: true } }),
    eventId: () => uuid,
    formStarted: () => events.push({ type: 'open' }),
    formStepCompleted: (step, total) => events.push({ type: 'step', step, total }),
    confirmLead: acknowledgement => events.push({ type: 'lead', event_id: acknowledgement.event_id }),
    groupUrl: value => value
  };
  const draftCalls = [];
  const window = { MARGEX_TRACKING: tracking, matchMedia: () => ({ matches: true }), MARGEX_SIGNUP_DRAFT: options.draft ? { read: () => options.draft, write: value => { draftCalls.push({ type: 'write', value }); return true; }, clear: () => draftCalls.push({ type: 'clear' }) } : undefined };
  const sandbox = { window, document, URL, Set, location: new URL('https://margex-live.vercel.app/formulario.html'), requestAnimationFrame: callback => callback(),
    fetch: async (url, init) => {
      const payload = JSON.parse(init.body);
      requests.push({ url, payload });
      if (options.failFirst && requests.length === 1) return { ok: false, json: async () => ({ ok: false }) };
      return { ok: true, json: async () => ({ ok: true, saved: options.unsaved ? false : true, lead_id: 'mock_lead', event_id: options.wrongId ? '22222222-2222-4222-8222-222222222222' : payload.event_id }) };
    }
  };
  vm.runInNewContext(configSource, sandbox);
  if (options.preview) window.MARGEX_CONFIG = { ...window.MARGEX_CONFIG, formIsPreview: true };
  vm.runInNewContext(formSource, sandbox);
  const radios = () => optionRoot.descendants().filter(node => node.tagName === 'input');
  async function select(value) {
    const control = radios().find(node => node.value === value);
    assert.ok(control, `Canonical option must exist: ${value}`);
    radios().forEach(node => { node.checked = node === control; });
    await nodes['#form-choices'].emit('change');
  }
  async function answer(value) {
    if (nodes['#form-input'].hidden) await select(value);
    else { nodes['#form-input'].value = value; await nodes['#form-input'].emit('input'); }
    await nodes.form.emit('submit');
  }
  async function contacts() { for (const value of ['Seller QA', 'qa@example.com', '(11) 99999-9999']) await answer(value); }
  return { nodes, window, events, requests, radios, answer, contacts, select, draftCalls, editContacts: () => mount.children.find(node => node.id === 'form-contact-summary').children.find(node => node.id === 'form-edit-contacts').emit('click'), submit: () => nodes.form.emit('submit'), back: () => nodes['#form-back'].emit('click'), group: () => result.children.find(node => node.id === 'signup-group-link') };
}

test('active operations must complete all four canonical qualifications before a single saved Lead', async () => {
  const f = fixture();
  assert.equal(f.window.MARGEX_CONFIG.fields.length, 7);
  await f.contacts();
  assert.equal(f.nodes['#form-step-counter'].textContent, 'Pergunta 4 de 7');
  await f.answer('Mercado Livre, com ou sem Shopee');
  await f.answer('De 201 a 500');
  await f.answer('Com planilha e alterações manuais nos anúncios');
  assert.equal(f.requests.length, 0);
  await f.submit();
  assert.equal(f.requests.length, 0);
  assert.equal(f.nodes['#form-error'].textContent, 'Escolha uma opção para continuar.');
  await f.answer('Falta tempo para revisar custos, preços e promoções');
  assert.equal(f.requests.length, 1);
  assert.equal(f.requests[0].payload.form_version, '2.7');
  assert.deepEqual(f.requests[0].payload.qualification, { channel: 'Mercado Livre, com ou sem Shopee', ad_count: 'De 201 a 500', pricing_process: 'Com planilha e alterações manuais nos anúncios', main_problem: 'Falta tempo para revisar custos, preços e promoções' });
  assert.equal(f.events.filter(event => event.type === 'lead').length, 1);
  assert.equal(f.group().hidden, false);
  assert.equal(f.nodes['#form-step-counter'].textContent, 'Inscrição concluída');
  assert.equal(JSON.stringify(f.events).includes('planilha'), false);
  assert.equal(JSON.stringify(f.events).includes('qa@example.com'), false);
});

test('educational channels complete four applicable steps and omit all skipped operation answers', async () => {
  for (const channel of ['Ainda não vendo', 'Somente outros canais']) {
    const f = fixture();
    await f.contacts();
    await f.select(channel);
    assert.equal(f.nodes['#form-step-counter'].textContent, 'Pergunta 4 de 4');
    assert.match(f.nodes['#form-next'].innerHTML, /Concluir inscrição/);
    await f.submit();
    assert.deepEqual(f.requests[0].payload.qualification, { channel });
    assert.equal(f.events.filter(event => event.type === 'lead').length, 1);
  }
});

test('a compatible seller without active listings completes five steps without forced pricing answers', async () => {
  const f = fixture();
  await f.contacts();
  await f.answer('Shopee, sem vender no Mercado Livre');
  await f.select('Nenhum');
  assert.equal(f.nodes['#form-step-counter'].textContent, 'Pergunta 5 de 5');
  await f.submit();
  assert.deepEqual(f.requests[0].payload.qualification, { channel: 'Shopee, sem vender no Mercado Livre', ad_count: 'Nenhum' });
});

test('back preserves radio selection, while changing to an educational channel discards obsolete answers', async () => {
  const f = fixture();
  await f.contacts();
  await f.answer('Mercado Livre, com ou sem Shopee');
  await f.answer('501 ou mais');
  await f.back();
  assert.equal(f.radios().find(node => node.checked).value, '501 ou mais');
  await f.back();
  assert.equal(f.radios().find(node => node.checked).value, 'Mercado Livre, com ou sem Shopee');
  await f.answer('Ainda não vendo');
  assert.deepEqual(f.requests[0].payload.qualification, { channel: 'Ainda não vendo' });
});

test('unknown listing quantity still asks both remaining applicable questions', async () => {
  const f = fixture();
  await f.contacts();
  await f.answer('Mercado Livre, com ou sem Shopee');
  await f.answer('Não sei informar');
  assert.equal(f.nodes['#form-step-counter'].textContent, 'Pergunta 6 de 7');
  assert.equal(f.requests.length, 0);
  await f.answer('Não sei dizer como isso é feito');
  assert.equal(f.nodes['#form-step-counter'].textContent, 'Pergunta 7 de 7');
  await f.answer('Vendo, mas não sei com segurança qual margem sobra');
  assert.equal(f.requests[0].payload.qualification.ad_count, 'Não sei informar');
  assert.equal(f.requests[0].payload.qualification.pricing_process, 'Não sei dizer como isso é feito');
});

test('persistence failure keeps applicable answers and the UUID for a retry, without premature Lead or group', async () => {
  const f = fixture({ failFirst: true });
  await f.contacts();
  await f.answer('Ainda não vendo');
  assert.equal(f.requests.length, 1);
  assert.equal(f.events.filter(event => event.type === 'lead').length, 0);
  assert.equal(f.group().hidden, true);
  assert.equal(f.radios().find(node => node.checked).value, 'Ainda não vendo');
  assert.match(f.nodes['#form-error'].textContent, /Tente novamente/);
  await f.submit();
  assert.equal(f.requests[0].payload.event_id, f.requests[1].payload.event_id);
  assert.equal(f.events.filter(event => event.type === 'lead').length, 1);
});

test('unsaved or mismatched receipts cannot unlock the group or emit a browser Lead', async () => {
  for (const options of [{ unsaved: true }, { wrongId: true }]) {
    const f = fixture(options);
    await f.contacts();
    await f.answer('Ainda não vendo');
    assert.equal(f.group().hidden, true);
    assert.equal(f.events.filter(event => event.type === 'lead').length, 0);
    assert.equal(f.nodes.form.hidden, false);
  }
});

test('the explicit preview fallback still completes without persistence or conversion', async () => {
  const f = fixture({ preview: true });
  await f.contacts();
  await f.answer('Ainda não vendo');
  assert.equal(f.requests.length, 0);
  assert.equal(f.events.filter(event => event.type === 'lead').length, 0);
  assert.equal(f.group().hidden, true);
  assert.equal(f.nodes['#form-step-counter'].textContent, 'Prévia finalizada');
});

test('frontend qualification values match the server canonical choices exactly', () => {
  const { qualificationChoices } = require('../server/tracking.cjs');
  const f = fixture();
  assert.deepEqual(Array.from(f.window.MARGEX_CONFIG.fields, field => field.name), ['name','email','phone','channel','ad_count','pricing_process','main_problem']);
  for (const field of f.window.MARGEX_CONFIG.fields.filter(item => item.qualificationKey)) assert.deepEqual(Array.from(field.options), qualificationChoices[field.qualificationKey]);
});

test('quick handoff skips contact questions but submits every validated contact and clears only after saved acknowledgement', async () => {
  const f = fixture({ draft: { email: 'handoff@example.invalid', phone: '11999999999', campaign: {} } });
  await f.answer('Seller QA');
  assert.equal(f.nodes['#form-step-counter'].textContent, 'Pergunta 2 de 5');
  assert.equal(f.requests.length, 0);
  await f.answer('Mercado Livre, com ou sem Shopee'); await f.answer('501 ou mais');
  await f.answer('Com planilha e alterações manuais nos anúncios');
  assert.equal(f.draftCalls.length, 0);
  await f.answer('Falta tempo para revisar custos, preços e promoções');
  assert.equal(f.requests.length, 1);
  assert.equal(f.requests[0].payload.email, 'handoff@example.invalid');
  assert.equal(f.requests[0].payload.phone, '11999999999');
  assert.equal(f.requests[0].payload.name, 'Seller QA');
  assert.equal(f.draftCalls.filter(call => call.type === 'clear').length, 1);
});

test('editing quick contacts returns to the previous profile question without losing its answer', async () => {
  const f = fixture({ draft: { email: 'handoff@example.invalid', phone: '11999999999', campaign: {} } });
  await f.answer('Seller QA'); await f.select('Mercado Livre, com ou sem Shopee');
  await f.editContacts();
  assert.equal(f.nodes['#form-input'].name, 'email');
  await f.answer('updated@example.invalid'); await f.answer('21999999999');
  assert.equal(f.radios().find(node => node.checked).value, 'Mercado Livre, com ou sem Shopee');
  assert.equal(f.requests.length, 0);
  await f.answer('Ainda não vendo');
  assert.equal(f.requests[0].payload.email, 'updated@example.invalid');
  assert.equal(f.requests[0].payload.phone, '21999999999');
  assert.equal(f.requests[0].payload.name, 'Seller QA');
});

test('a skipped contact is still revalidated before the final POST', async () => {
  const f = fixture({ draft: { email: 'bad\u0000@example.invalid', phone: '11999999999', campaign: {} } });
  await f.answer('Seller QA'); await f.answer('Ainda não vendo');
  assert.equal(f.requests.length, 0);
  assert.equal(f.nodes['#form-input'].name, 'email');
  assert.match(f.nodes['#form-error'].textContent, /Confira seu e-mail/);
});

test('failed handoff persistence preserves the draft and UUID until a successful retry', async () => {
  const f = fixture({ failFirst: true, draft: { email: 'handoff@example.invalid', phone: '11999999999', campaign: {} } });
  await f.answer('Seller QA'); await f.answer('Ainda não vendo');
  assert.equal(f.requests.length, 1); assert.equal(f.draftCalls.length, 0);
  await f.submit();
  assert.equal(f.requests[0].payload.event_id, f.requests[1].payload.event_id);
  assert.equal(f.draftCalls.filter(call => call.type === 'clear').length, 1);
});
