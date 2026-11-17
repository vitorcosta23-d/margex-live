'use strict';
window.MARGEX_CONFIG = Object.freeze({
  // Somente configuração pública. Nunca inserir tokens, credenciais ou IDs sensíveis.
  // Endpoint local: relay e credenciais de persistência pertencem somente ao servidor.
  submissionEndpoint: '/api/leads',
  whatsappGroupUrl: 'https://chat.whatsapp.com/L6za6ZsTwskIcGvqMf0G2I?s=sw&p=a&iam=2',
  privacyUrl: '',
  formIsPreview: false,
  tracking: Object.freeze({
    metaPixelId: '1768495497553870',
    gtmContainerId: 'GTM-MW8RFWV5',
    // Google tag já publicado neste container; não instalar uma segunda base gtag.js.
    ga4MeasurementId: 'G-V4815EHTWE',
    // Token CAPI configurado somente no servidor; nunca incluir seu valor neste arquivo.
    serverEventsEnabled: true,
    serverEventsEndpoint: '/api/events'
  }),
  fields: Object.freeze([
    { name: 'name', label: 'Como podemos chamar você?', type: 'text', autocomplete: 'given-name', placeholder: 'Seu nome', hint: 'Use o nome pelo qual prefere ser chamado.', maxLength: 100 },
    { name: 'email', label: 'Qual é o seu e-mail?', type: 'email', autocomplete: 'email', placeholder: 'voce@exemplo.com', hint: 'Confira se o endereço está escrito corretamente.', maxLength: 254 },
    { name: 'phone', label: 'Qual é o seu WhatsApp?', type: 'tel', autocomplete: 'tel', placeholder: '(11) 99999-9999', hint: 'Inclua o DDD do seu número.', maxLength: 24 }
  ])
});
