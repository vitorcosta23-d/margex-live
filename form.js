'use strict';
(() => {
  const config = window.MARGEX_CONFIG;
  const mount = document.getElementById('signup-mount');
  if (!mount || !config) return;
  const dialog = document.getElementById('signup-dialog');
  const fields = config.fields;
  const answers = Object.create(null);
  const fieldViews = new Map();
  const educationalChannels = new Set(['Somente outros canais', 'Ainda não vendo']);
  const operationalChannels = new Set(['Mercado Livre, com ou sem Shopee', 'Shopee, sem vender no Mercado Livre']);
  let returnFocus = null;
  let isSubmitting = false;
  let done = false;
  let started = false;
  let submissionEventId = null;
  const completedFields = new Set();
  const tracking = window.MARGEX_TRACKING;
  const isPreview = config.formIsPreview !== false || !config.submissionEndpoint;

  mount.innerHTML = `<div class="form-topline"><span class="eyebrow">LIVE GRATUITA</span>${dialog ? '<button class="icon-button form-close" type="button" aria-label="Fechar formulário">×</button>' : '<a href="/" class="form-home" aria-label="Voltar à página da live">↗</a>'}</div><h2 id="form-title" class="form-all-title">Inscrição na live</h2><p class="form-all-intro">Preencha seus dados e conte como funciona sua operação.</p><form id="signup-form" class="form-all-fields" novalidate><div class="form-contact-fields" id="form-contact-fields"></div><div class="form-qualification-fields" id="form-qualification-fields"></div><p id="form-error" class="form-error" aria-live="polite"></p><div class="form-actions"><button class="button button-primary" id="form-next" type="submit">${isPreview ? 'Concluir prévia' : 'Concluir inscrição'} <span aria-hidden="true">↗</span></button></div><p class="form-preview-note"></p></form><div id="form-result" class="form-result" hidden tabindex="-1"><span class="result-symbol" aria-hidden="true">✓</span><h2>Prévia concluída.</h2><p>A inscrição será liberada após a conexão com a planilha.</p><p class="form-hint">Seus dados não foram enviados. O convite para o grupo ficará disponível quando as inscrições forem liberadas.</p><button type="button" class="button button-quiet" id="form-review">Revisar respostas <span aria-hidden="true">↗</span></button></div>`;
  const form = mount.querySelector('form');
  const error = mount.querySelector('#form-error');
  const submit = mount.querySelector('#form-next');
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
  mount.querySelector('.form-preview-note').textContent = isPreview ? 'Prévia do formulário. Nenhum dado será enviado nesta etapa.' : 'Confira seus dados antes de concluir a inscrição.';

  function applicable(field) {
    if (!field.qualificationKey || field.name === 'channel') return true;
    if (!operationalChannels.has(answers.channel)) return false;
    if (field.name === 'ad_count') return true;
    return Boolean(answers.ad_count) && answers.ad_count !== 'Nenhum';
  }
  function activeFields() { return fields.filter(applicable); }
  function fieldValue(field) {
    const view = fieldViews.get(field.name);
    return field.type === 'radio' ? view.controls.find(control => control.checked)?.value || '' : view.controls[0].value.trim();
  }
  function captureAnswers() { fields.forEach(field => { answers[field.name] = fieldValue(field); }); }
  function unavailableReason(field) {
    if (educationalChannels.has(answers.channel)) return 'Não se aplica ao seu canal atual. Esta resposta não será enviada e você pode participar da aula.';
    if (!answers.channel) return 'Escolha onde você vende para habilitar esta pergunta.';
    if (field.name !== 'ad_count' && answers.ad_count === 'Nenhum') return 'Não se aplica enquanto você não tem anúncios ativos. Esta resposta não será enviada.';
    return 'Informe a quantidade de anúncios para habilitar esta pergunta.';
  }
  function clearFieldError(field) {
    const view = fieldViews.get(field.name);
    view.error.textContent = '';
    view.container.removeAttribute('aria-invalid');
    view.controls.forEach(control => control.removeAttribute('aria-invalid'));
  }
  function updateApplicability() {
    fields.forEach(field => {
      const view = fieldViews.get(field.name);
      const enabled = applicable(field);
      view.container.dataset.applicable = String(enabled);
      view.note.textContent = enabled ? '' : unavailableReason(field);
      view.note.hidden = enabled;
      if (field.type === 'radio') {
        view.container.disabled = !enabled || isSubmitting;
        view.container.setAttribute('aria-required', String(enabled));
      }
      view.controls.forEach(control => { control.disabled = !enabled || isSubmitting; control.required = enabled; });
      if (!enabled) clearFieldError(field);
    });
  }
  function validationMessage(field, value) {
    if (!value) return field.type === 'radio' ? 'Escolha uma opção.' : 'Preencha este campo.';
    if (field.type === 'radio') return field.options.includes(value) ? '' : 'Escolha uma das opções disponíveis.';
    if (value.length > field.maxLength) return 'Confira o tamanho deste campo.';
    if (field.name === 'name' && value.length < 2) return 'Informe seu nome com pelo menos duas letras.';
    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Confira seu e-mail. Exemplo: voce@exemplo.com.';
    if (field.type === 'tel') {
      const digits = value.replace(/\D/g, '');
      if (!/^[+\d\s().-]+$/.test(value) || digits.length < 10 || digits.length > 13) return 'Informe um WhatsApp válido com DDD.';
    }
    return '';
  }
  function markStarted() { if (!started) { started = true; tracking?.formStarted(); } }
  function markCompleted(field) {
    if (!applicable(field) || completedFields.has(field.name) || validationMessage(field, answers[field.name] || '')) return;
    completedFields.add(field.name);
    tracking?.formStepCompleted(fields.indexOf(field) + 1, fields.length);
  }
  function showFieldError(field, message) {
    const view = fieldViews.get(field.name);
    view.error.textContent = message;
    view.container.setAttribute('aria-invalid', 'true');
    view.controls.forEach(control => control.setAttribute('aria-invalid', 'true'));
  }
  function focusField(field, scroll = false) {
    const view = fieldViews.get(field.name);
    const control = view.controls.find(item => item.checked) || view.controls[0];
    control?.focus({ preventScroll: true });
    if (scroll) view.container.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
  function setSubmitting(value) {
    isSubmitting = value;
    submit.disabled = value;
    form.setAttribute('aria-busy', String(value));
    updateApplicability();
  }

  fields.forEach(field => {
    const choice = field.type === 'radio';
    const container = document.createElement(choice ? 'fieldset' : 'div');
    container.className = choice ? 'form-field form-qualification-field' : 'form-field form-contact-field';
    container.id = `signup-field-${field.name}`;
    container.dataset.field = field.name;
    const title = document.createElement(choice ? 'legend' : 'label');
    title.className = 'form-field-label';
    title.id = `signup-label-${field.name}`;
    title.textContent = field.label;
    const hint = document.createElement('p');
    hint.className = 'form-hint';
    hint.id = `signup-hint-${field.name}`;
    hint.textContent = field.hint;
    const note = document.createElement('p');
    note.className = 'form-applicability-note';
    note.id = `signup-note-${field.name}`;
    note.hidden = true;
    const fieldError = document.createElement('p');
    fieldError.className = 'form-error';
    fieldError.id = `signup-error-${field.name}`;
    const controls = [];
    container.append(title, hint);
    if (choice) {
      container.setAttribute('role', 'radiogroup');
      container.setAttribute('aria-labelledby', title.id);
      container.setAttribute('aria-describedby', `${hint.id} ${note.id} ${fieldError.id}`);
      const options = document.createElement('div');
      options.className = 'form-choice-options';
      field.options.forEach((option, optionIndex) => {
        const label = document.createElement('label');
        label.className = 'form-choice';
        const control = document.createElement('input');
        control.type = 'radio';
        control.name = field.name;
        control.id = `signup-choice-${field.name}-${optionIndex}`;
        control.value = option;
        control.setAttribute('aria-describedby', `${hint.id} ${note.id} ${fieldError.id}`);
        const caption = document.createElement('span');
        caption.textContent = option;
        controls.push(control);
        label.append(control, caption);
        options.append(label);
      });
      container.append(options);
    } else {
      const control = document.createElement('input');
      control.type = field.type;
      control.name = field.name;
      control.id = `signup-input-${field.name}`;
      control.autocomplete = field.autocomplete;
      control.placeholder = field.placeholder;
      control.maxLength = field.maxLength;
      control.inputMode = field.type === 'tel' ? 'tel' : field.type === 'email' ? 'email' : 'text';
      control.setAttribute('aria-describedby', `${hint.id} ${fieldError.id}`);
      title.htmlFor = control.id;
      controls.push(control);
      container.append(control);
    }
    container.append(note, fieldError);
    fieldViews.set(field.name, { container, controls, error: fieldError, note });
    mount.querySelector(choice ? '#form-qualification-fields' : '#form-contact-fields').append(container);
    controls.forEach(control => {
      control.addEventListener(choice ? 'change' : 'input', () => {
        if (isSubmitting) return;
        markStarted();
        answers[field.name] = fieldValue(field);
        clearFieldError(field);
        error.textContent = '';
        updateApplicability();
        if (choice) markCompleted(field);
      });
      if (!choice) control.addEventListener('blur', () => {
        answers[field.name] = fieldValue(field);
        const message = validationMessage(field, answers[field.name]);
        if (answers[field.name] && message) showFieldError(field, message);
        else if (!message) markCompleted(field);
      });
    });
  });
  updateApplicability();

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (isSubmitting) return;
    captureAnswers();
    updateApplicability();
    const applicableFields = activeFields();
    let firstInvalid;
    fields.forEach(clearFieldError);
    applicableFields.forEach(field => {
      const message = validationMessage(field, answers[field.name] || '');
      if (message) { showFieldError(field, message); if (!firstInvalid) firstInvalid = field; }
    });
    if (firstInvalid) { error.textContent = 'Confira os campos destacados para concluir.'; focusField(firstInvalid, true); return; }
    error.textContent = '';
    markStarted();
    applicableFields.forEach(markCompleted);
    setSubmitting(true);
    if (!isPreview) {
      try {
        const endpoint = new URL(config.submissionEndpoint, location.origin);
        if (endpoint.origin !== location.origin || endpoint.pathname !== '/api/leads') throw new Error('Endpoint de inscrição indisponível.');
        submissionEventId = submissionEventId || tracking?.eventId();
        if (!submissionEventId) throw new Error('Identificador de inscrição indisponível.');
        const context = tracking.context();
        const qualification = Object.fromEntries(applicableFields.filter(field => field.qualificationKey).map(field => [field.qualificationKey, answers[field.name]]));
        const payload = {
          name: answers.name, email: answers.email, phone: answers.phone,
          form_version: '2.7', event_id: submissionEventId, form_id: context.form_id, origin: context.origin,
          event_source_url: context.event_source_url, consent: context.consent, qualification,
          utm: Object.fromEntries(['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].filter(key => context[key]).map(key => [key, context[key]]))
        };
        if (context.fbp) payload.fbp = context.fbp;
        if (context.fbc) payload.fbc = context.fbc;
        submit.textContent = 'Enviando…';
        const response = await fetch(endpoint.href, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const acknowledgement = await response.json();
        if (!response.ok || acknowledgement?.ok !== true || acknowledgement.saved !== true || acknowledgement.event_id !== submissionEventId || typeof acknowledgement.lead_id !== 'string' || !/^[A-Za-z0-9_-]{1,128}$/.test(acknowledgement.lead_id)) throw new Error('A inscrição não foi confirmada.');
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
        setSubmitting(false);
        error.textContent = 'Não foi possível confirmar sua inscrição. Seus dados continuam preenchidos. Tente novamente.';
        submit.innerHTML = 'Tentar novamente <span aria-hidden="true">↗</span>';
        submit.focus({ preventScroll: true });
        return;
      }
    }
    form.hidden = true;
    result.hidden = false;
    done = true;
    result.focus({ preventScroll: true });
    setSubmitting(false);
  });
  mount.querySelector('#form-review').addEventListener('click', () => { done = false; form.hidden = false; result.hidden = true; focusField(fields[0], true); });

  function close() { if (dialog?.open) { dialog.close(); document.body.classList.remove('form-is-open'); returnFocus?.focus({ preventScroll: true }); } }
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
      if (done) result.focus(); else focusField(fields[0]);
    }));
  }
})();
