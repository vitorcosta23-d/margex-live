'use strict';
(() => {
  const config = window.MARGEX_CONFIG;
  const mount = document.getElementById('signup-mount');
  if (!mount || !config) return;
  const dialog = document.getElementById('signup-dialog');
  const fields = config.fields;
  const answers = Object.create(null);
  let index = 0;
  let returnFocus = null;
  let isSubmitting = false;
  let done = false;
  let started = false;
  let submissionEventId = null;
  const completedSteps = new Set();
  const tracking = window.MARGEX_TRACKING;
  const isPreview = config.formIsPreview !== false || !config.submissionEndpoint;

  mount.innerHTML = `<div class="form-topline"><span class="eyebrow">LIVE GRATUITA</span>${dialog ? '<button class="icon-button form-close" type="button" aria-label="Fechar formulário">×</button>' : '<a href="/" class="form-home" aria-label="Voltar à página da live">↗</a>'}</div><div class="form-progress-meta"><span id="form-step-counter"></span><span>INSCRIÇÃO</span></div><div class="form-progress" role="progressbar" aria-label="Progresso do formulário" aria-valuemin="0" aria-valuemax="${fields.length}" aria-valuenow="0"><span></span></div><form id="signup-form" novalidate><div class="form-question"><span class="question-number" aria-hidden="true"></span><h2 id="form-title"></h2><p id="form-hint" class="form-hint"></p><label class="sr-only" id="form-label" for="form-input"></label><input id="form-input" name="name" required aria-describedby="form-hint form-error"><p id="form-error" class="form-error" aria-live="polite"></p></div><div class="form-actions"><button class="button button-back" id="form-back" type="button">← Voltar</button><button class="button button-primary" id="form-next" type="submit">Continuar <span aria-hidden="true">→</span></button></div><p class="form-preview-note">Prévia do formulário. Perguntas finais em definição.<br>Nenhum dado será enviado nesta etapa.</p></form><div id="form-result" class="form-result" hidden tabindex="-1"><span class="result-symbol" aria-hidden="true">✓</span><h2>Prévia concluída.</h2><p>A inscrição será liberada após a conexão com a planilha.</p><p class="form-hint">Seus dados não foram enviados. O convite para o grupo ficará disponível quando as inscrições forem liberadas.</p><button type="button" class="button button-quiet" id="form-review">Revisar respostas <span aria-hidden="true">↗</span></button></div>`;
  const form = mount.querySelector('form');
  const input = mount.querySelector('#form-input');
  const error = mount.querySelector('#form-error');
  const progress = mount.querySelector('.form-progress');
  const back = mount.querySelector('#form-back');
  const next = mount.querySelector('#form-next');
  const result = mount.querySelector('#form-result');
  const groupLink = document.createElement('a');
  groupLink.className = 'button button-primary';
  groupLink.id = 'signup-group-link';
  groupLink.dataset.whatsappGroup = '';
  groupLink.target = '_blank';
  groupLink.rel = 'noopener noreferrer';
  groupLink.textContent = 'Entrar no grupo do WhatsApp ↗';
  groupLink.hidden = true;
  result.insertBefore(groupLink, mount.querySelector('#form-review'));
  if (!isPreview) {
    mount.querySelector('.form-preview-note').textContent = 'Confira seus dados antes de concluir a inscrição.';
  }

  function render(focus = true) {
    done = false;
    form.hidden = false;
    result.hidden = true;
    const field = fields[index];
    mount.querySelector('#form-title').textContent = field.label;
    mount.querySelector('#form-label').textContent = field.label;
    mount.querySelector('#form-hint').textContent = field.hint;
    mount.querySelector('.question-number').textContent = String(index + 1).padStart(2, '0');
    mount.querySelector('#form-step-counter').textContent = `Pergunta ${index + 1} de ${fields.length}`;
    input.type = field.type;
    input.name = field.name;
    input.autocomplete = field.autocomplete;
    input.placeholder = field.placeholder;
    input.maxLength = field.maxLength;
    input.inputMode = field.type === 'tel' ? 'tel' : field.type === 'email' ? 'email' : 'text';
    input.value = answers[field.name] || '';
    input.removeAttribute('aria-invalid');
    error.textContent = '';
    back.hidden = index === 0;
    next.innerHTML = index === fields.length - 1 ? `${isPreview ? 'Concluir prévia' : 'Concluir inscrição'} <span aria-hidden="true">↗</span>` : 'Continuar <span aria-hidden="true">→</span>';
    progress.setAttribute('aria-valuenow', String(index));
    progress.querySelector('span').style.width = `${(index / fields.length) * 100}%`;
    const question = mount.querySelector('.form-question');
    if (focus && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && typeof question.animate === 'function') {
      question.getAnimations().forEach(animation => animation.cancel());
      question.animate([{ opacity: 0.4, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 220, easing: 'cubic-bezier(.22,1,.36,1)' });
    }
    if (focus) requestAnimationFrame(() => input.focus({ preventScroll: true }));
  }
  function validationMessage() {
    const value = input.value.trim();
    const field = fields[index];
    if (!value) return 'Preencha este campo para continuar.';
    if (field.name === 'name' && value.length < 2) return 'Informe seu nome com pelo menos duas letras.';
    if (field.type === 'email' && (!input.validity.valid || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))) return 'Confira seu e-mail. Exemplo: voce@exemplo.com.';
    if (field.type === 'tel') {
      const digits = value.replace(/\D/g, '');
      if (!/^[+\d\s().-]+$/.test(value) || digits.length < 10 || digits.length > 13) return 'Informe um WhatsApp válido com DDD.';
    }
    return '';
  }
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    const message = validationMessage();
    if (message) { error.textContent = message; input.setAttribute('aria-invalid', 'true'); input.focus(); return; }
    answers[fields[index].name] = input.value.trim();
    if (!started) { started = true; tracking?.formStarted(); }
    if (!completedSteps.has(index)) {
      completedSteps.add(index);
      tracking?.formStepCompleted(index + 1, fields.length);
    }
    if (index < fields.length - 1) { index++; render(); return; }
    isSubmitting = true;
    if (!isPreview) {
      try {
        const endpoint = new URL(config.submissionEndpoint, location.origin);
        if (endpoint.origin !== location.origin || endpoint.pathname !== '/api/leads') throw new Error('Endpoint de inscrição indisponível.');
        submissionEventId = submissionEventId || tracking?.eventId();
        if (!submissionEventId) throw new Error('Identificador de inscrição indisponível.');
        const context = tracking.context();
        const payload = {
          name: answers.name, email: answers.email, phone: answers.phone,
          event_id: submissionEventId, form_id: context.form_id, origin: context.origin,
          event_source_url: context.event_source_url, consent: context.consent,
          utm: Object.fromEntries(['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].filter(key => context[key]).map(key => [key, context[key]]))
        };
        if (context.fbp) payload.fbp = context.fbp;
        if (context.fbc) payload.fbc = context.fbc;
        next.disabled = true;
        next.textContent = 'Enviando…';
        const response = await fetch(endpoint.href, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const acknowledgement = await response.json();
        if (!response.ok || acknowledgement?.ok !== true || acknowledgement.saved !== true || acknowledgement.event_id !== submissionEventId || typeof acknowledgement.lead_id !== 'string' || !/^[A-Za-z0-9_-]{1,128}$/.test(acknowledgement.lead_id)) throw new Error('A inscrição não foi confirmada.');
        // Only the persistence acknowledgement can cause the main conversion.
        tracking.confirmLead(acknowledgement);
        result.querySelector('h2').textContent = 'Inscrição confirmada.';
        mount.querySelector('#form-review').hidden = true;
        const paragraphs = result.querySelectorAll('p');
        paragraphs[0].textContent = 'Seu cadastro foi salvo.';
        const href = tracking.groupUrl(config.whatsappGroupUrl);
        paragraphs[1].textContent = href ? 'Entre no grupo para acompanhar os avisos da live.' : 'As informações de acesso serão disponibilizadas pela organização.';
        groupLink.hidden = !href;
        if (href) groupLink.href = href;
      } catch {
        error.textContent = 'Não foi possível confirmar sua inscrição. Seus dados continuam preenchidos. Tente novamente.';
        isSubmitting = false;
        next.disabled = false;
        next.innerHTML = 'Tentar novamente <span aria-hidden="true">↗</span>';
        input.focus({ preventScroll: true });
        return;
      }
    }
    form.hidden = true;
    result.hidden = false;
    done = true;
    progress.setAttribute('aria-valuenow', String(fields.length));
    progress.querySelector('span').style.width = '100%';
    mount.querySelector('#form-step-counter').textContent = isPreview ? 'Prévia finalizada' : 'Inscrição concluída';
    result.focus({ preventScroll: true });
    isSubmitting = false;
    next.disabled = false;
  });
  input.addEventListener('input', () => { if (!started) { started = true; tracking?.formStarted(); } answers[fields[index].name] = input.value; error.textContent = ''; input.removeAttribute('aria-invalid'); });
  back.addEventListener('click', () => { answers[fields[index].name] = input.value; if (index > 0) { index--; render(); } });
  mount.querySelector('#form-review').addEventListener('click', () => { index = 0; render(); });

  function close() { if (dialog?.open) { if (!done) answers[fields[index].name] = input.value; dialog.close(); document.body.classList.remove('form-is-open'); returnFocus?.focus({ preventScroll: true }); } }
  if (dialog) {
    mount.querySelector('.form-close').addEventListener('click', close);
    dialog.addEventListener('cancel', (event) => { event.preventDefault(); close(); });
    dialog.addEventListener('click', (event) => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close(); } });
    dialog.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab') return;
      const focusable = Array.from(dialog.querySelectorAll('button, a[href], input, [tabindex="0"]')).filter(el => !el.disabled && el.getClientRects().length > 0);
      const first = focusable[0]; const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    document.querySelectorAll('[data-open-form]').forEach(button => button.addEventListener('click', () => {
      if (!started) { started = true; tracking?.formStarted(); }
      returnFocus = button;
      dialog.showModal();
      document.body.classList.add('form-is-open');
      if (done) result.focus(); else render();
    }));
  }
  render(!dialog);
})();
