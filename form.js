'use strict';
(() => {
  const config = window.MARGEX_CONFIG;
  const mount = document.getElementById('signup-mount');
  if (!mount || !config) return;
  const dialog = document.getElementById('signup-dialog');
  const fields = config.fields;
  const answers = Object.create(null);
  const draft = window.MARGEX_SIGNUP_DRAFT;
  const handoff = !dialog ? draft?.read() : null;
  if (handoff) { answers.email = handoff.email; answers.phone = handoff.phone; }
  let skipContactDetails = Boolean(handoff);
  let contactEditResume = null;
  const educationalChannels = new Set(['Somente outros canais', 'Ainda não vendo']);
  let index = 0;
  let returnFocus = null;
  let isSubmitting = false;
  let done = false;
  let submissionEventId = null;
  const completedSteps = new Set();
  const tracking = window.MARGEX_TRACKING;
  const isPreview = config.formIsPreview !== false || !config.submissionEndpoint;

  mount.innerHTML = `<div class="form-topline"><span class="eyebrow">LIVE GRATUITA</span>${dialog ? '<button class="icon-button form-close" type="button" aria-label="Fechar formulário">×</button>' : '<a href="/" class="form-home" aria-label="Voltar à página da live">↗</a>'}</div><div class="form-progress-meta"><span id="form-step-counter"></span><span>INSCRIÇÃO</span></div><div class="form-progress" role="progressbar" aria-label="Progresso do formulário" aria-valuemin="0" aria-valuemax="${fields.length}" aria-valuenow="0"><span></span></div><form id="signup-form" novalidate><div class="form-question"><span class="question-number" aria-hidden="true"></span><h2 id="form-title"></h2><p id="form-hint" class="form-hint"></p><label class="sr-only" id="form-label" for="form-input"></label><input id="form-input" name="name" required aria-describedby="form-hint form-error"><fieldset id="form-choices" class="form-choice-group" role="radiogroup" aria-labelledby="form-title" aria-describedby="form-hint form-error" aria-required="true" hidden><legend class="sr-only" id="form-choice-label"></legend><div class="form-choice-options"></div></fieldset><p id="form-error" class="form-error" aria-live="polite"></p></div><div class="form-actions"><button class="button button-back" id="form-back" type="button">← Voltar</button><button class="button button-primary" id="form-next" type="submit">Continuar <span aria-hidden="true">→</span></button></div><p class="form-preview-note"></p></form><div id="form-result" class="form-result" hidden tabindex="-1"><span class="result-symbol" aria-hidden="true">✓</span><h2>Prévia concluída.</h2><p>A inscrição será liberada após a conexão com a planilha.</p><p class="form-hint">Seus dados não foram enviados. O convite para o grupo ficará disponível quando as inscrições forem liberadas.</p><button type="button" class="button button-quiet" id="form-review">Revisar respostas <span aria-hidden="true">↗</span></button></div>`;
  const form = mount.querySelector('form');
  const input = mount.querySelector('#form-input');
  const choices = mount.querySelector('#form-choices');
  const choiceOptions = choices.querySelector('.form-choice-options');
  const error = mount.querySelector('#form-error');
  const progress = mount.querySelector('.form-progress');
  const back = mount.querySelector('#form-back');
  const next = mount.querySelector('#form-next');
  const result = mount.querySelector('#form-result');
  let contactSummary;
  let editContacts;
  if (handoff) {
    contactSummary = document.createElement('div');
    contactSummary.id = 'form-contact-summary';
    contactSummary.className = 'form-contact-summary';
    const message = document.createElement('p');
    message.textContent = 'Seu e-mail e WhatsApp já estão preenchidos. Agora, complete seu perfil.';
    editContacts = document.createElement('button');
    editContacts.type = 'button';
    editContacts.id = 'form-edit-contacts';
    editContacts.className = 'button button-quiet';
    editContacts.textContent = 'Alterar e-mail ou WhatsApp';
    contactSummary.append(message, editContacts);
    mount.insertBefore(contactSummary, progress);
    editContacts.addEventListener('click', () => {
      if (isSubmitting || contactEditResume) return;
      captureAnswer();
      contactEditResume = currentField().name;
      skipContactDetails = false;
      editContacts.disabled = true;
      index = activeFields().findIndex(field => field.name === 'email');
      markStarted();
      render();
    });
  }
  const groupLink = document.createElement('a');
  groupLink.className = 'button button-primary';
  groupLink.id = 'signup-group-link';
  groupLink.dataset.whatsappGroup = '';
  groupLink.target = '_blank';
  groupLink.rel = 'noopener noreferrer';
  groupLink.textContent = 'Entrar no grupo do WhatsApp ↗';
  groupLink.hidden = true;
  result.insertBefore(groupLink, mount.querySelector('#form-review'));
  mount.querySelector('.form-preview-note').textContent = isPreview ? 'Prévia do formulário. Nenhum dado será enviado nesta etapa.' : 'Confira seus dados antes de concluir a inscrição.';

  function allApplicableFields() {
    if (educationalChannels.has(answers.channel)) return fields.filter(field => !['ad_count', 'pricing_process', 'main_problem'].includes(field.name));
    if (answers.ad_count === 'Nenhum') return fields.filter(field => !['pricing_process', 'main_problem'].includes(field.name));
    return fields;
  }
  function activeFields() { return allApplicableFields().filter(field => !skipContactDetails || !['email', 'phone'].includes(field.name)); }
  function pruneSkippedAnswers() {
    const skipped = educationalChannels.has(answers.channel) ? ['ad_count', 'pricing_process', 'main_problem'] : answers.ad_count === 'Nenhum' ? ['pricing_process', 'main_problem'] : [];
    skipped.forEach(name => { delete answers[name]; completedSteps.delete(name); });
  }
  function currentField() { return activeFields()[index]; }
  function currentValue() { return currentField().type === 'radio' ? choices.querySelector('input:checked')?.value || '' : input.value.trim(); }
  function captureAnswer() { answers[currentField().name] = currentValue(); pruneSkippedAnswers(); }
  function focusControl() { (currentField().type === 'radio' ? choices.querySelector('input:checked') || choices.querySelector('input') : input)?.focus({ preventScroll: true }); }
  function updateProgress() {
    const total = activeFields().length;
    mount.querySelector('.question-number').textContent = String(index + 1).padStart(2, '0');
    mount.querySelector('#form-step-counter').textContent = `Pergunta ${index + 1} de ${total}`;
    back.hidden = index === 0;
    next.innerHTML = index === total - 1 ? `${isPreview ? 'Concluir prévia' : 'Concluir inscrição'} <span aria-hidden="true">↗</span>` : 'Continuar <span aria-hidden="true">→</span>';
    progress.setAttribute('aria-valuemax', String(total));
    progress.setAttribute('aria-valuenow', String(index));
    progress.querySelector('span').style.width = `${(index / total) * 100}%`;
  }
  function render(focus = true) {
    done = false;
    form.hidden = false;
    result.hidden = true;
    const field = currentField();
    const isChoice = field.type === 'radio';
    mount.querySelector('#form-title').textContent = field.label;
    mount.querySelector('#form-label').textContent = field.label;
    mount.querySelector('#form-hint').textContent = field.hint;
    input.hidden = isChoice;
    input.required = !isChoice;
    choices.hidden = !isChoice;
    input.removeAttribute('aria-invalid');
    choices.removeAttribute('aria-invalid');
    if (isChoice) {
      choices.querySelector('legend').textContent = field.label;
      choiceOptions.replaceChildren();
      field.options.forEach((option, optionIndex) => {
        const label = document.createElement('label');
        label.className = 'form-choice';
        const control = document.createElement('input');
        control.type = 'radio';
        control.name = field.name;
        control.id = `signup-choice-${field.name}-${optionIndex}`;
        control.value = option;
        control.required = true;
        control.checked = answers[field.name] === option;
        const caption = document.createElement('span');
        caption.textContent = option;
        label.append(control, caption);
        choiceOptions.append(label);
      });
    } else {
      input.type = field.type;
      input.name = field.name;
      input.autocomplete = field.autocomplete;
      input.placeholder = field.placeholder;
      input.maxLength = field.maxLength;
      input.inputMode = field.type === 'tel' ? 'tel' : field.type === 'email' ? 'email' : 'text';
      input.value = answers[field.name] || '';
    }
    error.textContent = '';
    updateProgress();
    const question = mount.querySelector('.form-question');
    if (focus && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && typeof question.animate === 'function') {
      question.getAnimations().forEach(animation => animation.cancel());
      question.animate([{ opacity: 0.4, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 220, easing: 'cubic-bezier(.22,1,.36,1)' });
    }
    if (focus) requestAnimationFrame(focusControl);
  }
  function validationMessage(field, value) {
    if (!value) return field.type === 'radio' ? 'Escolha uma opção para continuar.' : 'Preencha este campo para continuar.';
    if (field.type === 'radio') return field.options.includes(value) ? '' : 'Escolha uma das opções disponíveis.';
    if (value.length > field.maxLength) return 'Confira o tamanho deste campo.';
    if (field.name === 'name' && value.length < 2) return 'Informe seu nome com pelo menos duas letras.';
    if (field.type === 'email' && (/[\u0000-\u001f\u007f]/.test(value) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))) return 'Confira seu e-mail. Exemplo: voce@exemplo.com.';
    if (field.type === 'tel') {
      const digits = value.replace(/\D/g, '');
      if (!/^[+\d\s().-]+$/.test(value) || digits.length < 10 || digits.length > 13) return 'Informe um WhatsApp válido com DDD.';
    }
    return '';
  }
  function showError(message) {
    error.textContent = message;
    (currentField().type === 'radio' ? choices : input).setAttribute('aria-invalid', 'true');
    focusControl();
  }
  function markStarted() { tracking?.formStarted(); }
  function setSubmitting(value) {
    isSubmitting = value;
    next.disabled = value;
    back.disabled = value;
    input.disabled = value;
    choices.disabled = value;
    if (editContacts) editContacts.disabled = value || Boolean(contactEditResume);
    form.setAttribute('aria-busy', String(value));
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (isSubmitting) return;
    const field = currentField();
    const message = validationMessage(field, currentValue());
    if (message) { showError(message); return; }
    captureAnswer();
    markStarted();
    if (!completedSteps.has(field.name)) {
      completedSteps.add(field.name);
      tracking?.formStepCompleted(index + 1, activeFields().length);
    }
    if (contactEditResume && field.name === 'phone') {
      if (!draft?.write({ email: answers.email, phone: answers.phone, campaign: handoff.campaign })) draft?.clear();
      const resume = contactEditResume;
      contactEditResume = null;
      skipContactDetails = true;
      editContacts.disabled = false;
      index = Math.max(0, activeFields().findIndex(item => item.name === resume));
      render();
      return;
    }
    if (index < activeFields().length - 1) { index++; render(); return; }
    const invalidField = allApplicableFields().find(item => validationMessage(item, answers[item.name] || ''));
    if (invalidField) {
      if (['email', 'phone'].includes(invalidField.name)) skipContactDetails = false;
      index = activeFields().findIndex(item => item.name === invalidField.name);
      render(); showError(validationMessage(currentField(), answers[currentField().name] || '')); return;
    }
    setSubmitting(true);
    if (!isPreview) {
      try {
        const endpoint = new URL(config.submissionEndpoint, location.origin);
        if (endpoint.origin !== location.origin || endpoint.pathname !== '/api/leads') throw new Error('Endpoint de inscrição indisponível.');
        submissionEventId = submissionEventId || tracking?.eventId();
        if (!submissionEventId) throw new Error('Identificador de inscrição indisponível.');
        const context = tracking.context();
        const qualification = Object.fromEntries(activeFields().filter(item => item.qualificationKey).map(item => [item.qualificationKey, answers[item.name]]));
        const payload = {
          name: answers.name, email: answers.email, phone: answers.phone,
          form_version: '2.7', event_id: submissionEventId, form_id: context.form_id, origin: context.origin,
          event_source_url: context.event_source_url, consent: context.consent, qualification,
          utm: Object.fromEntries(['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].filter(key => context[key]).map(key => [key, context[key]]))
        };
        if (context.fbp) payload.fbp = context.fbp;
        if (context.fbc) payload.fbc = context.fbc;
        next.textContent = 'Enviando…';
        const response = await fetch(endpoint.href, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const acknowledgement = await response.json();
        if (!response.ok || acknowledgement?.ok !== true || acknowledgement.saved !== true || acknowledgement.event_id !== submissionEventId || typeof acknowledgement.lead_id !== 'string' || !/^[A-Za-z0-9_-]{1,128}$/.test(acknowledgement.lead_id)) throw new Error('A inscrição não foi confirmada.');
        tracking.confirmLead(acknowledgement);
        draft?.clear();
        if (contactSummary) contactSummary.hidden = true;
        result.querySelector('h2').textContent = 'Inscrição confirmada.';
        mount.querySelector('#form-review').hidden = true;
        const paragraphs = result.querySelectorAll('p');
        paragraphs[0].textContent = 'Seu cadastro foi salvo.';
        const href = tracking.groupUrl(config.whatsappGroupUrl);
        paragraphs[1].textContent = href ? 'Entre no grupo para acompanhar os avisos da live.' : 'As informações de acesso serão disponibilizadas pela organização.';
        groupLink.hidden = !href;
        if (href) groupLink.href = href;
      } catch {
        setSubmitting(false);
        error.textContent = 'Não foi possível confirmar sua inscrição. Seus dados continuam preenchidos. Tente novamente.';
        next.innerHTML = 'Tentar novamente <span aria-hidden="true">↗</span>';
        focusControl();
        return;
      }
    }
    form.hidden = true;
    result.hidden = false;
    done = true;
    progress.setAttribute('aria-valuenow', String(activeFields().length));
    progress.querySelector('span').style.width = '100%';
    mount.querySelector('#form-step-counter').textContent = isPreview ? 'Prévia finalizada' : 'Inscrição concluída';
    result.focus({ preventScroll: true });
    setSubmitting(false);
  });
  input.addEventListener('input', () => { markStarted(); answers[currentField().name] = input.value; error.textContent = ''; input.removeAttribute('aria-invalid'); });
  choices.addEventListener('change', () => { markStarted(); captureAnswer(); error.textContent = ''; choices.removeAttribute('aria-invalid'); updateProgress(); });
  back.addEventListener('click', () => { if (isSubmitting) return; captureAnswer(); if (index > 0) { index--; render(); } });
  mount.querySelector('#form-review').addEventListener('click', () => { index = 0; render(); });

  function close() { if (dialog?.open) { if (!done && !isSubmitting) captureAnswer(); dialog.close(); document.body.classList.remove('form-is-open'); returnFocus?.focus({ preventScroll: true }); } }
  if (dialog) {
    mount.querySelector('.form-close').addEventListener('click', close);
    dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
    dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close(); } });
    dialog.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const focusable = Array.from(dialog.querySelectorAll('button, a[href], input, [tabindex="0"]')).filter(element => !element.disabled && element.getClientRects().length > 0);
      const first = focusable[0]; const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    document.querySelectorAll('[data-open-form]').forEach(button => button.addEventListener('click', () => {
      markStarted();
      returnFocus = button;
      dialog.showModal();
      document.body.classList.add('form-is-open');
      if (done) result.focus(); else render();
    }));
  }
  render(!dialog);
})();
