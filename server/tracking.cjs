'use strict';
const { createHash, randomBytes } = require('node:crypto');
const { isIP } = require('node:net');
const { z } = require('zod');

const PIXEL_ID = '1768495497553870';
const FORM_ID = 'margex_live_signup';
const MAX_BODY_BYTES = 16384;
const PAGE_PATHS = new Set(['/', '/index.html', '/formulario.html']);
const consentSchema = z.object({ analytics: z.boolean(), marketing: z.boolean() }).strict();
// Versioned labels match the existing Sheet Regras. Weight edits remain in Sheets.
const qualificationChoices = Object.freeze({
  channel: Object.freeze(['Mercado Livre, com ou sem Shopee', 'Shopee, sem vender no Mercado Livre', 'Somente outros canais', 'Ainda não vendo']),
  ad_count: Object.freeze(['Nenhum', 'De 1 a 50', 'De 51 a 200', 'De 201 a 500', '501 ou mais', 'Não sei informar']),
  pricing_process: Object.freeze(['Manualmente, direto nos anúncios, sem planilha', 'Com planilha e alterações manuais nos anúncios', 'Uma ferramenta já atualiza os preços automaticamente', 'Não sei dizer como isso é feito']),
  main_problem: Object.freeze(['Vendo, mas não sei com segurança qual margem sobra', 'Falta tempo para revisar custos, preços e promoções', 'Perco ofertas e não sei até onde posso ajustar o preço', 'Já controlo esses processos e quero aperfeiçoá-los'])
});
const cookieSchema = z.string().max(512).regex(/^fb\.\d\.\d{10,16}\.[A-Za-z0-9._-]+$/);
const baseShape = {
  event_id: z.string().uuid(),
  event_source_url: z.string().url().max(512),
  origin: z.enum(['sales_page', 'direct_form']),
  form_id: z.literal(FORM_ID).optional(),
  consent: consentSchema,
  fbp: cookieSchema.optional(),
  fbc: cookieSchema.optional()
};
const eventSchema = z.object({
  ...baseShape,
  event_name: z.enum(['PageView', 'ViewContent', 'WhatsAppGroupClick'])
}).strict();
const safeText = (max) => z.string().trim().min(1).max(max).refine(value => !/[\u0000-\u001f\u007f]/u.test(value));
const leadSchema = z.object({
  ...baseShape,
  form_id: z.literal(FORM_ID),
  form_version: z.literal('2.7').optional(),
  name: safeText(100).min(2),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(24).regex(/^[+\d\s().-]+$/).refine(value => /^\d{10,13}$/.test(value.replace(/\D/g, ''))),
  utm: z.object({
    utm_source: safeText(150).optional(), utm_medium: safeText(150).optional(),
    utm_campaign: safeText(150).optional(), utm_content: safeText(150).optional(), utm_term: safeText(150).optional()
  }).strict().optional(),
  qualification: z.object({
    channel: safeText(150).optional(), ad_count: safeText(150).optional(),
    pricing_process: safeText(200).optional(), main_problem: safeText(200).optional()
  }).strict().optional()
}).strict().superRefine((data, context) => {
  if (data.form_version !== '2.7') return;
  const answers = data.qualification || {};
  const requireChoice = key => {
    if (!qualificationChoices[key].includes(answers[key])) context.addIssue({ code: 'custom', path: ['qualification', key], message: 'Selecione uma opção válida.' });
  };
  // Even optional hidden answers, when present, must be canonical labels.
  for (const key of Object.keys(answers)) if (!qualificationChoices[key]?.includes(answers[key])) context.addIssue({ code: 'custom', path: ['qualification', key], message: 'Opção inválida.' });
  requireChoice('channel');
  if (!qualificationChoices.channel.slice(0, 2).includes(answers.channel)) return;
  requireChoice('ad_count');
  if (answers.ad_count === 'Nenhum') return;
  requireChoice('pricing_process');
  requireChoice('main_problem');
});

class ApiError extends Error {
  constructor(status, code, diagnostics = {}) { super(code); this.status = status; this.code = code; this.diagnostics = diagnostics; }
}
function sha256(value) { return createHash('sha256').update(value).digest('hex'); }
function header(req, name) { const value = req.headers?.[name.toLowerCase()]; return typeof value === 'string' ? value : ''; }
function configuredOrigins(env) {
  const values = ['https://margex-live.vercel.app'];
  if (env.NODE_ENV !== 'production' && env.VERCEL !== '1') values.push('http://127.0.0.1:4318', 'http://localhost:4318');
  if (env.VERCEL_URL && /^[a-z0-9.-]+\.vercel\.app$/i.test(env.VERCEL_URL)) values.push('https://' + env.VERCEL_URL);
  if (env.TRACKING_ALLOWED_ORIGINS) values.push(...env.TRACKING_ALLOWED_ORIGINS.split(',').map(value => value.trim()));
  return new Set(values.filter(value => { try { const url = new URL(value); return url.origin === value && ['https:', 'http:'].includes(url.protocol); } catch { return false; } }));
}
function requestContext(req, env) {
  const origin = header(req, 'origin');
  if (!configuredOrigins(env).has(origin)) throw new ApiError(403, 'ORIGIN_NOT_ALLOWED');
  const userAgent = header(req, 'user-agent').slice(0, 512);
  if (!userAgent) throw new ApiError(400, 'USER_AGENT_REQUIRED');
  const forwarded = env.VERCEL === '1' ? (header(req, 'x-vercel-forwarded-for') || header(req, 'x-forwarded-for')).split(',')[0].trim() : '';
  const candidate = forwarded || req.socket?.remoteAddress || '';
  return { origin, userAgent, ip: isIP(candidate) ? candidate : undefined };
}
function sourceUrl(input, requestOrigin) {
  const url = new URL(input);
  if (url.origin !== requestOrigin || !PAGE_PATHS.has(url.pathname)) throw new ApiError(400, 'INVALID_SOURCE_URL');
  return url.origin + url.pathname;
}
async function parseBody(req, schema) {
  if (!/^application\/json(?:\s*;|$)/i.test(header(req, 'content-type'))) throw new ApiError(415, 'JSON_REQUIRED');
  const declaredLength = Number(header(req, 'content-length'));
  if (declaredLength > MAX_BODY_BYTES) throw new ApiError(413, 'BODY_TOO_LARGE');
  let body = req.body;
  if (body === undefined) {
    const chunks = []; let bytes = 0;
    for await (const chunk of req) {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      bytes += buffer.length;
      if (bytes > MAX_BODY_BYTES) throw new ApiError(413, 'BODY_TOO_LARGE');
      chunks.push(buffer);
    }
    body = Buffer.concat(chunks).toString('utf8');
  }
  if (Buffer.isBuffer(body)) body = body.toString('utf8');
  if (typeof body === 'string') {
    if (Buffer.byteLength(body) > MAX_BODY_BYTES) throw new ApiError(413, 'BODY_TOO_LARGE');
    try { body = JSON.parse(body); } catch { throw new ApiError(400, 'INVALID_JSON'); }
  } else if (Buffer.byteLength(JSON.stringify(body ?? null)) > MAX_BODY_BYTES) throw new ApiError(413, 'BODY_TOO_LARGE');
  const parsed = schema.safeParse(body);
  if (!parsed.success) throw new ApiError(400, 'INVALID_PAYLOAD');
  return parsed.data;
}
function createRateLimiter(now) {
  const salt = randomBytes(32).toString('hex');
  const windows = new Map();
  return (kind, context) => {
    const timestamp = now();
    for (const [key, item] of windows) if (item.expires <= timestamp) windows.delete(key);
    const key = sha256(kind + ':' + (context.ip || context.userAgent) + ':' + salt);
    const current = windows.get(key) || { count: 0, expires: timestamp + 60000 };
    current.count++;
    if (current.count > (kind === 'lead' ? 10 : 40)) throw new ApiError(429, 'RATE_LIMITED');
    if (windows.size >= 5000 && !windows.has(key)) throw new ApiError(429, 'RATE_LIMITED');
    windows.set(key, current);
  };
}
function sendJson(res, status, body, requestOrigin) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Vary', 'Origin');
  if (requestOrigin) res.setHeader('Access-Control-Allow-Origin', requestOrigin);
  if (status === 429) res.setHeader('Retry-After', '60');
  res.statusCode = status;
  res.end(JSON.stringify(body));
}
function metaConfiguration(env) {
  const pixelId = env.META_PIXEL_ID || PIXEL_ID;
  const version = env.META_GRAPH_API_VERSION || 'v26.0';
  const token = env.META_CAPI_ACCESS_TOKEN;
  if (!/^\d{5,25}$/.test(pixelId) || !/^v\d{2}\.\d$/.test(version) || !token || token.length < 20 || /\s/.test(token)) throw new ApiError(503, 'TRACKING_NOT_CONFIGURED');
  return { pixelId, version, token };
}
async function fetchJson(fetcher, url, options, timeout) {
  let response;
  try { response = await fetcher(url, { ...options, signal: AbortSignal.timeout(timeout) }); }
  catch { throw new ApiError(502, 'UPSTREAM_UNAVAILABLE'); }
  if (!response.ok) {
    const diagnostics = {};
    if (Number.isInteger(response.status)) diagnostics.upstream_http_status = response.status;
    try {
      const rejected = await response.json();
      if (Number.isInteger(rejected?.error?.code)) diagnostics.meta_error_code = rejected.error.code;
      if (Number.isInteger(rejected?.error?.error_subcode)) diagnostics.meta_error_subcode = rejected.error.error_subcode;
    } catch { /* Provider messages, bodies and identifiers must never enter logs. */ }
    throw new ApiError(502, 'UPSTREAM_REJECTED', diagnostics);
  }
  try { return await response.json(); } catch { throw new ApiError(502, 'INVALID_UPSTREAM_RESPONSE'); }
}
function createTrackingApi({ env = process.env, fetcher = globalThis.fetch, now = Date.now, logger } = {}) {
  const limit = createRateLimiter(now);
  const receiptLogger = typeof logger === 'function' ? logger : env.VERCEL === '1' ? entry => console.info(JSON.stringify(entry)) : null;
  function logLeadReceipt(data, saved, capiStatus, status, error) {
    if (!receiptLogger) return;
    const entry = {
      type: 'margex_lead_receipt', received_at: new Date(now()).toISOString(),
      event_id: data?.event_id || null, form_version: data ? data.form_version || 'legacy' : 'unknown',
      consent_analytics: data?.consent.analytics ?? null, consent_marketing: data?.consent.marketing ?? null,
      saved: saved?.saved === true, duplicate: saved?.duplicate === true,
      capi_status: capiStatus, http_status: status,
      error_code: error ? error instanceof ApiError ? error.code : 'INTERNAL_ERROR' : null
    };
    if (error instanceof ApiError) for (const key of ['upstream_http_status', 'meta_error_code', 'meta_error_subcode']) {
      if (Number.isInteger(error.diagnostics[key])) entry[key] = error.diagnostics[key];
    }
    try { receiptLogger(entry); } catch { /* Observability must not undo a saved registration. */ }
  }
  async function sendMeta(data, context, contacts) {
    const config = metaConfiguration(env);
    const userData = { client_user_agent: context.userAgent };
    if (context.ip) userData.client_ip_address = context.ip;
    if (data.fbp) userData.fbp = data.fbp;
    if (data.fbc) userData.fbc = data.fbc;
    if (contacts) {
      userData.em = [sha256(contacts.email.trim().toLowerCase())];
      const digits = contacts.phone.replace(/\D/g, '');
      userData.ph = [sha256(digits.length <= 11 ? '55' + digits : digits)];
      userData.external_id = [sha256(data.event_id)];
    }
    const event = {
      event_name: data.event_name, event_id: data.event_id,
      event_time: Math.floor(now() / 1000), action_source: 'website',
      event_source_url: sourceUrl(data.event_source_url, context.origin), user_data: userData,
      custom_data: { origin: data.origin, form_id: FORM_ID }
    };
    const payload = { data: [event] };
    if (env.META_TEST_EVENT_CODE) payload.test_event_code = env.META_TEST_EVENT_CODE;
    const response = await fetchJson(fetcher, `https://graph.facebook.com/${config.version}/${config.pixelId}/events`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + config.token }, body: JSON.stringify(payload)
    }, 5000);
    if (response.events_received !== 1) throw new ApiError(502, 'EVENT_NOT_ACKNOWLEDGED');
    return { sent: true };
  }
  async function persistLead(data) {
    const secret = env.MARGEX_LEADS_WEBHOOK_SECRET;
    let url;
    try { url = new URL(env.MARGEX_LEADS_WEBHOOK_URL); } catch { throw new ApiError(503, 'REGISTRATION_NOT_CONFIGURED'); }
    if (url.protocol !== 'https:' || url.hostname !== 'script.google.com' || !/^\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url.pathname) || url.search || !secret || secret.length < 32) throw new ApiError(503, 'REGISTRATION_NOT_CONFIGURED');
    const saved = await fetchJson(fetcher, url.href, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, action: 'save_lead', lead: {
        lead_id: data.event_id, event_id: data.event_id, name: data.name, email: data.email,
        phone: data.phone, origin: data.origin, utm: data.utm || {}, qualification: data.qualification || {}, consent: data.consent,
        attribution: { event_source_url: data.event_source_url, form_id: FORM_ID, form_version: data.form_version || 'legacy',
          ...(data.consent.marketing && data.fbp ? { fbp: data.fbp } : {}),
          ...(data.consent.marketing && data.fbc ? { fbc: data.fbc } : {}) }
      } })
    }, 15000);
    if (saved.ok !== true || saved.saved !== true || saved.lead_id !== data.event_id || saved.event_id !== data.event_id) throw new ApiError(502, 'LEAD_NOT_SAVED');
    return { ok: true, saved: true, lead_id: saved.lead_id, event_id: saved.event_id, duplicate: saved.duplicate === true };
  }
  async function events(req, res) {
    let context;
    try {
      if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); throw new ApiError(405, 'METHOD_NOT_ALLOWED'); }
      context = requestContext(req, env); limit('event', context);
      const data = await parseBody(req, eventSchema);
      sourceUrl(data.event_source_url, context.origin);
      if (!data.consent.marketing) return sendJson(res, 202, { ok: true, sent: false, reason: 'CONSENT_NOT_GRANTED' }, context.origin);
      await sendMeta(data, context);
      sendJson(res, 200, { ok: true, sent: true, event_id: data.event_id }, context.origin);
    } catch (error) { sendJson(res, error instanceof ApiError ? error.status : 500, { ok: false, code: error instanceof ApiError ? error.code : 'INTERNAL_ERROR' }, context?.origin); }
  }
  async function leads(req, res) {
    let context;
    let data;
    let saved;
    try {
      if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); throw new ApiError(405, 'METHOD_NOT_ALLOWED'); }
      context = requestContext(req, env); limit('lead', context);
      data = await parseBody(req, leadSchema);
      data.event_source_url = sourceUrl(data.event_source_url, context.origin);
      saved = await persistLead(data);
      let serverTracking = data.consent.marketing ? 'not_configured' : 'skipped';
      let trackingError;
      if (data.consent.marketing && !saved.duplicate) {
        try { await sendMeta({ ...data, event_name: 'Lead' }, context, data); serverTracking = 'sent'; }
        catch (error) { serverTracking = error instanceof ApiError && error.status === 503 ? 'not_configured' : 'failed'; trackingError = error; }
      } else if (saved.duplicate && data.consent.marketing) serverTracking = 'duplicate';
      logLeadReceipt(data, saved, serverTracking, 200, trackingError);
      sendJson(res, 200, { ok: true, saved: true, lead_id: saved.lead_id, event_id: saved.event_id, duplicate: saved.duplicate, tracking: { server: serverTracking } }, context.origin);
    } catch (error) {
      const status = error instanceof ApiError ? error.status : 500;
      logLeadReceipt(data, saved, 'not_attempted', status, error);
      sendJson(res, status, { ok: false, saved: false, code: error instanceof ApiError ? error.code : 'INTERNAL_ERROR' }, context?.origin);
    }
  }
  return { events, leads };
}
module.exports = { createTrackingApi, eventSchema, leadSchema, qualificationChoices };
