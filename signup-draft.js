'use strict';
(() => {
  const key = 'margex_signup_draft_v1';
  const ttl = 30 * 60 * 1000;
  const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  function campaignValue(value) {
    return typeof value === 'string' && value.length <= 120 && !/@|https?:|\b\d{10,}\b/i.test(value) && /^[\p{L}\p{N} _.-]*$/u.test(value) ? value : '';
  }
  function contacts(value) {
    if (!value || typeof value.email !== 'string' || typeof value.phone !== 'string') return null;
    const email = value.email.trim();
    const phone = value.phone.trim();
    const digits = phone.replace(/\D/g, '');
    if (email.length > 254 || /[\u0000-\u001f\u007f]/.test(email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.length > 24 || !/^[+\d\s().-]+$/.test(phone) || digits.length < 10 || digits.length > 13) return null;
    return { email, phone };
  }
  function clear() { try { window.sessionStorage.removeItem(key); } catch { /* Functional storage can be unavailable. */ } }
  function read() {
    let value;
    try { value = JSON.parse(window.sessionStorage.getItem(key) || 'null'); } catch { clear(); return null; }
    if (!value) return null;
    const valid = contacts(value);
    if (!valid || value.version !== 1 || value.source !== 'quick_signup' || !Number.isFinite(value.created_at) || Date.now() - value.created_at > ttl || value.created_at > Date.now() + 60000) { clear(); return null; }
    return { version: 1, source: 'quick_signup', created_at: value.created_at, ...valid, campaign: Object.fromEntries(campaignKeys.map(name => [name, campaignValue(value.campaign?.[name] || '')])) };
  }
  function write(value) {
    const valid = contacts(value);
    if (!valid) return false;
    const draft = { version: 1, source: 'quick_signup', created_at: Date.now(), ...valid, campaign: Object.fromEntries(campaignKeys.map(name => [name, campaignValue(value.campaign?.[name] || '')])) };
    try { window.sessionStorage.setItem(key, JSON.stringify(draft)); return true; } catch { return false; }
  }
  window.MARGEX_SIGNUP_DRAFT = Object.freeze({ read, write, clear });
})();
