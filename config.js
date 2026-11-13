'use strict';
window.MARGEX_CONFIG = Object.freeze({
  // Somente configuração pública. Nunca inserir tokens, credenciais ou IDs sensíveis.
  // Conexão real pendente: manter vazio até definir backend, privacidade e contrato de resposta.
  submissionEndpoint: '',
  whatsappGroupUrl: '',
  privacyUrl: '',
  formIsPreview: true,
  fields: Object.freeze([
    { name: 'name', label: 'Como podemos chamar você?', type: 'text', autocomplete: 'given-name', placeholder: 'Seu nome', hint: 'Use o nome pelo qual prefere ser chamado.', maxLength: 100 },
    { name: 'email', label: 'Qual é o seu e-mail?', type: 'email', autocomplete: 'email', placeholder: 'voce@exemplo.com', hint: 'Confira se o endereço está escrito corretamente.', maxLength: 254 },
    { name: 'phone', label: 'Qual é o seu WhatsApp?', type: 'tel', autocomplete: 'tel', placeholder: '(11) 99999-9999', hint: 'Inclua o DDD do seu número.', maxLength: 24 }
  ])
});
