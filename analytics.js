'use strict';
(() => {
  const settings = window.MARGEX_CONFIG?.tracking;
  if (!settings || window.MARGEX_TRACKING) return;
  const origin = location.pathname === '/formulario.html' ? 'direct_form' : 'sales_page';
  const formId = 'margex_live_signup';
  const consentKey = 'margex_tracking_consent_v1';
  const attributionKey = 'margex_tracking_attribution_v1';
  const confirmedKey = 'margex_confirmed_event_ids_v1';
  const session = { metaLoaded: false, gtmLoaded: false, clarityLoaded: false, clarityStopped: false, pageViewed: false, contentViewed: false, gaContentViewed: false, gaFormOpened: false, metaFormOpened: false };
  let preferences = { analytics: false, marketing: false };
  let preferencesSaved = false;
  let panel;
  let preferencesButton;
  const confirmed = new Set();
  const validEventId = value => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

  function storage(name) {
    try { return window[name]; } catch { return null; }
  }

  function readStored(storage, key) {
    try { return JSON.parse(storage.getItem(key) || 'null'); } catch { return null; }
  }
  function saveStored(storage, key, value) {
    try { storage.setItem(key, JSON.stringify(value)); } catch { /* Storage can be unavailable. */ }
  }
  function eventId() {
    if (typeof window.crypto?.randomUUID === 'function') return window.crypto.randomUUID();
    const bytes = new Uint8Array(16);
    if (typeof window.crypto?.getRandomValues !== 'function') return null;
    window.crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 15) | 64;
    bytes[8] = (bytes[8] & 63) | 128;
    const hex = Array.from(bytes, value => value.toString(16).padStart(2, '0'));
    return `${hex.slice(0,4).join('')}-${hex.slice(4,6).join('')}-${hex.slice(6,8).join('')}-${hex.slice(8,10).join('')}-${hex.slice(10).join('')}`;
  }
  function campaignValue(value) {
    // Campaign labels only: do not pass URLs, contact details or free-form answers.
    if (typeof value !== 'string' || value.length > 120 || /@|https?:|\b\d{10,}\b/i.test(value)) return '';
    return /^[\p{L}\p{N} _.-]*$/u.test(value) ? value : '';
  }
  const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const params = new URLSearchParams(location.search);
  const clickedId = params.get('fbclid') || '';
  const clickedFbc = /^[A-Za-z0-9._-]{1,200}$/.test(clickedId) ? `fb.1.${Date.now()}.${clickedId}` : undefined;
  const handoffCampaign = location.pathname === '/formulario.html' ? window.MARGEX_SIGNUP_DRAFT?.read()?.campaign : null;
  const queryCampaign = Object.fromEntries(campaignKeys.map(key => [key, campaignValue(params.has(key) ? params.get(key) : handoffCampaign?.[key] || '')]));
  let attribution = { origin, ...queryCampaign };
  function captureAttribution() {
    const stored = readStored(storage('sessionStorage'), attributionKey);
    if (stored && ['sales_page', 'direct_form'].includes(stored.origin)) {
      attribution = { origin: stored.origin, ...Object.fromEntries(campaignKeys.map(key => [key, campaignValue(stored[key] || '')])) };
    } else {
      saveStored(storage('sessionStorage'), attributionKey, attribution);
    }
  }
  function cookie(name) {
    const value = document.cookie.split('; ').find(item => item.startsWith(`${name}=`))?.slice(name.length + 1);
    if (!value || value.length > 250 || !/^fb\.\d\.\d+\.[A-Za-z0-9._-]+$/.test(value)) return undefined;
    return value;
  }
  function context() {
    return {
      form_id: formId,
      origin,
      entry_origin: attribution.origin,
      ...Object.fromEntries(campaignKeys.map(key => [key, attribution[key] || ''])),
      event_source_url: location.origin + location.pathname,
      consent: { ...preferences },
      ...(preferences.marketing ? { fbp: cookie('_fbp'), fbc: clickedFbc || cookie('_fbc') } : {})
    };
  }
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });

  function ga4(name, properties = {}) {
    if (!preferences.analytics || !/^G-[A-Z0-9]+$/.test(settings.ga4MeasurementId || '')) return;
    window.gtag('event', name, { send_to: settings.ga4MeasurementId, origin, form_id: formId, ...properties });
  }
  function serverEvent(name, id) {
    if (!preferences.marketing || !settings.serverEventsEnabled || !validEventId(id)) return;
    let endpoint;
    try { endpoint = new URL(settings.serverEventsEndpoint, location.origin); } catch { return; }
    if (endpoint.origin !== location.origin || endpoint.pathname !== '/api/events') return;
    const data = context();
    const payload = { event_name: name, event_id: id, event_source_url: data.event_source_url, origin, consent: data.consent };
    if (data.fbp) payload.fbp = data.fbp;
    if (data.fbc) payload.fbc = data.fbc;
    fetch(endpoint.href, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), keepalive: true }).catch(() => {});
  }
  function meta(name, id, custom = false) {
    if (!preferences.marketing || !session.metaLoaded || !validEventId(id)) return;
    const properties = { content_name: 'MargeX live', content_category: 'workshop', origin, form_id: formId };
    window.fbq(custom ? 'trackCustom' : 'track', name, properties, { eventID: id });
    // Lead is forwarded by the private persistence handler, never this public endpoint.
    if (name !== 'Lead') serverEvent(name, id);
  }
  function loadScript(id, source) {
    if (document.getElementById(id) || Array.from(document.scripts || []).some(script => script.src === source)) return;
    // Optional SDKs use low priority; connections begin only after consent.
    const endpoint = new URL(source);
    const connectionId = `margex-sdk-connect-${endpoint.hostname.replace(/\./g, '-')}`;
    if (!document.getElementById(connectionId)) {
      const connection = document.createElement('link');
      connection.id = connectionId;
      connection.rel = 'preconnect';
      connection.href = endpoint.origin;
      connection.crossOrigin = 'anonymous';
      document.head.append(connection);
    }
    const script = document.createElement('script');
    script.id = id;
    script.async = true;
    script.fetchPriority = 'low';
    script.src = source;
    document.head.append(script);
  }
  function clarityPageSafe() {
    for (const [key, value] of params) {
      if (value && (/^(?:email|e-mail|phone|tel|telefone|whatsapp|name|nome|password|senha|token|access_token|secret)$/i.test(key) || /@/.test(value))) return false;
    }
    try { return !decodeURIComponent(location.hash || '').includes('@'); } catch { return false; }
  }
  function clarityCommand(...args) {
    try { window.clarity(...args); } catch { /* An optional recorder must not break signup or consent controls. */ }
  }
  function loadClarity() {
    if (!preferences.analytics || !/^[a-z0-9]{5,30}$/i.test(settings.clarityProjectId || '') || !clarityPageSafe()) return;
    // Mask the parent before loading; this also protects fields rendered later inside it.
    document.getElementById('signup-mount')?.setAttribute('data-clarity-mask', 'true');
    if (typeof window.clarity !== 'function') {
      const clarity = function() { (clarity.q = clarity.q || []).push(arguments); };
      window.clarity = clarity;
    }
    if (session.clarityStopped) { clarityCommand('start'); session.clarityStopped = false; }
    // The advertising choice names Meta. Do not also grant Microsoft Ads sharing.
    clarityCommand('consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' });
    if (!session.clarityLoaded) {
      session.clarityLoaded = true;
      loadScript('margex-microsoft-clarity', `https://www.clarity.ms/tag/${encodeURIComponent(settings.clarityProjectId)}`);
    }
  }
  function stopClarity() {
    if (!session.clarityLoaded || session.clarityStopped || typeof window.clarity !== 'function') return;
    clarityCommand('consentv2', { ad_Storage: 'denied', analytics_Storage: 'denied' });
    // ConsentV2 denied alone permits cookieless collection. Stop the loaded recorder too.
    clarityCommand('stop');
    session.clarityStopped = true;
  }
  function loadMeta() {
    if (session.metaLoaded || !preferences.marketing || !/^\d{5,30}$/.test(settings.metaPixelId || '')) return;
    const current = window.fbq;
    if (!current) {
      const fbq = function() { fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments); };
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = '2.0';
      fbq.queue = [];
      window.fbq = window._fbq = fbq;
    }
    window.fbq('set', 'autoConfig', false, settings.metaPixelId);
    window.fbq('init', settings.metaPixelId);
    window.fbq('consent', 'grant');
    session.metaLoaded = true;
    loadScript('margex-meta-pixel', 'https://connect.facebook.net/en_US/fbevents.js');
  }
  function loadGtm() {
    if (session.gtmLoaded || !preferences.analytics || !/^GTM-[A-Z0-9]+$/.test(settings.gtmContainerId || '')) return;
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    session.gtmLoaded = true;
    loadScript('margex-google-tag-manager', `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(settings.gtmContainerId)}`);
  }
  function trackPage() {
    if (preferences.marketing && session.metaLoaded && !session.pageViewed) {
      session.pageViewed = true;
      meta('PageView', eventId());
    }
    if (origin !== 'sales_page') return;
    if (preferences.marketing && session.metaLoaded && !session.contentViewed) {
      session.contentViewed = true;
      meta('ViewContent', eventId());
    }
    if (preferences.analytics && !session.gaContentViewed) {
      session.gaContentViewed = true;
      ga4('view_content', { content_id: 'margex_live_2026_11_23', content_type: 'workshop' });
    }
  }
  function applyConsent() {
    window.gtag('consent', 'update', {
      analytics_storage: preferences.analytics ? 'granted' : 'denied',
      ad_storage: preferences.marketing ? 'granted' : 'denied',
      ad_user_data: preferences.marketing ? 'granted' : 'denied',
      ad_personalization: preferences.marketing ? 'granted' : 'denied'
    });
    if (preferences.analytics) { captureAttribution(); loadGtm(); loadClarity(); }
    else stopClarity();
    if (preferences.marketing) { loadMeta(); }
    else if (window.fbq && session.metaLoaded) window.fbq('consent', 'revoke');
    if (preferences.marketing && session.metaLoaded) window.fbq('consent', 'grant');
    trackPage();
  }
  function setConsent(value) {
    preferences = { analytics: value?.analytics === true, marketing: value?.marketing === true };
    preferencesSaved = true;
    saveStored(storage('localStorage'), consentKey, { version: 1, ...preferences });
    if (!preferences.analytics) {
      try { window.sessionStorage.removeItem(attributionKey); } catch { /* Storage can be unavailable. */ }
      attribution = { origin, ...queryCampaign };
    }
    applyConsent();
    if (panel) { panel.hidden = true; document.body.classList.remove('tracking-consent-open'); }
    preferencesButton?.focus({ preventScroll: true });
  }
  function formStarted() {
    // The existing Google tag already emits enhanced-measurement form_start.
    // Eligibility is evaluated on each real interaction, never replayed on consent changes.
    if (preferences.analytics && !session.gaFormOpened) {
      ga4('form_open', { form_is_preview: window.MARGEX_CONFIG.formIsPreview === true });
      session.gaFormOpened = true;
    }
    if (preferences.marketing && session.metaLoaded && !session.metaFormOpened) {
      const id = eventId();
      if (validEventId(id)) { meta('FormOpen', id, true); session.metaFormOpened = true; }
    }
  }
  function formStepCompleted(step, total) {
    if (!Number.isInteger(step) || !Number.isInteger(total) || step < 1 || step > total || total > 50) return;
    ga4('form_step_completed', { step_number: step, step_count: total, form_is_preview: window.MARGEX_CONFIG.formIsPreview === true });
  }
  function confirmLead(acknowledgement) {
    if (window.MARGEX_CONFIG.formIsPreview !== false || acknowledgement?.ok !== true || acknowledgement.saved !== true || !validEventId(acknowledgement.event_id) || typeof acknowledgement.lead_id !== 'string' || !/^[A-Za-z0-9_-]{1,128}$/.test(acknowledgement.lead_id)) return false;
    const id = acknowledgement.event_id;
    if (confirmed.has(id)) return false;
    confirmed.add(id);
    if (preferences.analytics || preferences.marketing) saveStored(storage('sessionStorage'), confirmedKey, Array.from(confirmed).slice(-100));
    meta('Lead', id);
    ga4('generate_lead', { event_id: id, form_is_preview: false });
    return true;
  }
  function trackGroupClick() {
    const id = eventId();
    meta('WhatsAppGroupClick', id, true);
    ga4('whatsapp_group_click', { event_id: id, link_type: 'whatsapp_group' });
  }
  function groupUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && url.hostname === 'chat.whatsapp.com' && !url.username && !url.password && !url.port && /^\/[A-Za-z0-9_-]+\/?$/.test(url.pathname) ? url.href : '';
    } catch { return ''; }
  }
  function renderPreferences() {
    const stored = readStored(storage('localStorage'), consentKey);
    if (stored?.version === 1 && typeof stored.analytics === 'boolean' && typeof stored.marketing === 'boolean') {
      preferences = { analytics: stored.analytics, marketing: stored.marketing };
      preferencesSaved = true;
    }
    const ids = readStored(storage('sessionStorage'), confirmedKey);
    if (Array.isArray(ids)) ids.filter(validEventId).slice(-100).forEach(id => confirmed.add(id));
    panel = document.createElement('section');
    panel.className = 'tracking-consent';
    panel.setAttribute('aria-labelledby', 'tracking-consent-title');
    panel.hidden = preferencesSaved;
    panel.innerHTML = '<h2 id="tracking-consent-title">Cookies</h2><p>Usamos cookies opcionais para medir visitas e anúncios. Você escolhe se permite.</p><div data-consent-layer="summary"><div class="tracking-consent-actions"><button type="button" data-consent="all">Aceitar cookies</button><button type="button" data-consent="none">Recusar não essenciais</button><button type="button" data-consent="preferences">Preferências</button></div></div><div data-consent-layer="details" hidden><p>Escolha quais medições deseja permitir.</p><div class="tracking-consent-options"><label><input type="checkbox" name="analytics"> Medição de visitas · Google Analytics e Microsoft Clarity</label><label><input type="checkbox" name="marketing"> Medição de anúncios · Meta</label></div><div class="tracking-consent-actions"><button type="button" data-consent="selected">Permitir selecionados</button><button type="button" data-consent="summary">Voltar</button></div></div>';
    document.body.append(panel);
    function showLayer(layer, focus = true) {
      const details = layer === 'details';
      panel.querySelector('[data-consent-layer="summary"]').hidden = details;
      panel.querySelector('[data-consent-layer="details"]').hidden = !details;
      if (details) {
        panel.querySelector('[name="analytics"]').checked = preferences.analytics;
        panel.querySelector('[name="marketing"]').checked = preferences.marketing;
      }
      if (focus) panel.querySelector(details ? 'input' : '[data-consent="all"]').focus({ preventScroll: true });
    }
    preferencesButton = document.createElement('button');
    preferencesButton.type = 'button';
    preferencesButton.className = 'tracking-preferences-button';
    preferencesButton.textContent = 'Preferências de privacidade';
    preferencesButton.addEventListener('click', () => {
      panel.hidden = false;
      document.body.classList.add('tracking-consent-open');
      showLayer('details');
    });
    (document.querySelector('.site-footer') || document.querySelector('.direct-form-footer') || document.body).append(preferencesButton);
    panel.addEventListener('click', event => {
      const action = event.target.closest('[data-consent]')?.dataset.consent;
      if (!action) return;
      if (action === 'preferences') { showLayer('details'); return; }
      if (action === 'summary') { showLayer('summary'); return; }
      if (action === 'selected') setConsent({ analytics: panel.querySelector('[name="analytics"]').checked, marketing: panel.querySelector('[name="marketing"]').checked });
      else setConsent({ analytics: action === 'all', marketing: action === 'all' });
    });
    document.addEventListener('click', event => {
      const link = event.target.closest('a[data-whatsapp-group]');
      if (link && groupUrl(link.href)) trackGroupClick();
    });
    document.body.classList.toggle('tracking-consent-open', !preferencesSaved);
    window.dataLayer.push({ event: 'margex_page_loaded', origin, content_id: origin === 'sales_page' ? 'margex_live_2026_11_23' : 'margex_signup' });
    applyConsent();
  }
  window.MARGEX_TRACKING = Object.freeze({ context, eventId, formStarted, formStepCompleted, confirmLead, groupUrl, setConsent, getConsent: () => ({ ...preferences }) });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderPreferences, { once: true });
  else renderPreferences();
})();
