'use strict';
(() => {
  const form = document.getElementById('quick-signup-form');
  if (!form) return;
  const email = document.getElementById('quick-email');
  const phone = document.getElementById('quick-phone');
  const emailError = document.getElementById('quick-email-error');
  const phoneError = document.getElementById('quick-phone-error');
  const error = document.getElementById('quick-error');
  const submit = form.querySelector('button[type="submit"]');
  const draft = window.MARGEX_SIGNUP_DRAFT;
  const saved = draft?.read();
  if (saved) { email.value = saved.email; phone.value = saved.phone; }
  let leaving = false;
  window.addEventListener('pageshow', event => {
    leaving = false;
    submit.disabled = false;
    submit.innerHTML = 'Continuar inscrição <span aria-hidden="true">↗</span>';
    const restoreContacts = () => {
      const restored = draft?.read();
      if (restored) { email.value = restored.email; phone.value = restored.phone; }
      else if (event.persisted || window.history.state?.margexQuickHandoff === true) { email.value = ''; phone.value = ''; }
    };
    restoreContacts();
    // History can restore form values after pageshow, including a non-BFCache load.
    window.requestAnimationFrame(restoreContacts);
  });
  [email, phone].forEach(control => control.addEventListener('input', () => {
    window.MARGEX_TRACKING?.formStarted();
    control.removeAttribute('aria-invalid');
    (control === email ? emailError : phoneError).textContent = '';
    error.textContent = '';
  }));
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (leaving) return;
    window.MARGEX_TRACKING?.formStarted();
    const emailValue = email.value.trim();
    const phoneValue = phone.value.trim();
    const digits = phoneValue.replace(/\D/g, '');
    emailError.textContent = !emailValue ? 'Informe seu e-mail.' : emailValue.length > 254 || /[\u0000-\u001f\u007f]/.test(emailValue) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue) ? 'Confira seu e-mail. Exemplo: voce@exemplo.com.' : '';
    phoneError.textContent = !phoneValue ? 'Informe seu WhatsApp com DDD.' : phoneValue.length > 24 || !/^[+\d\s().-]+$/.test(phoneValue) || digits.length < 10 || digits.length > 13 ? 'Informe um WhatsApp válido com DDD.' : '';
    if (emailError.textContent || phoneError.textContent) {
      const invalid = emailError.textContent ? email : phone;
      if (emailError.textContent) email.setAttribute('aria-invalid', 'true');
      if (phoneError.textContent) phone.setAttribute('aria-invalid', 'true');
      invalid.focus();
      return;
    }
    const context = window.MARGEX_TRACKING?.context() || {};
    const campaign = Object.fromEntries(['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].map(name => [name, context[name] || '']));
    if (!draft?.write({ email: emailValue, phone: phoneValue, campaign })) {
      error.textContent = 'Seu navegador não permitiu manter os contatos para a próxima tela. Use o link do formulário completo abaixo.';
      return;
    }
    leaving = true;
    try {
      const previous = window.history.state && typeof window.history.state === 'object' ? window.history.state : {};
      window.history.replaceState({ ...previous, margexQuickHandoff: true }, '');
    } catch { /* A history marker is optional; it never contains contact data. */ }
    submit.disabled = true;
    submit.textContent = 'Continuando…';
    window.location.assign('/formulario.html');
  });
})();
