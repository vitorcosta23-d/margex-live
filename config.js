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
    clarityProjectId: 'zf7ftfroh7',
    // Token CAPI configurado somente no servidor; nunca incluir seu valor neste arquivo.
    serverEventsEnabled: true,
    serverEventsEndpoint: '/api/events'
  }),
  fields: Object.freeze([
    { name: 'name', label: 'Como podemos chamar você?', type: 'text', autocomplete: 'given-name', placeholder: 'Seu nome', hint: 'Use o nome pelo qual prefere ser chamado.', maxLength: 100 },
    { name: 'email', label: 'Qual é o seu e-mail?', type: 'email', autocomplete: 'email', placeholder: 'voce@exemplo.com', hint: 'Confira se o endereço está escrito corretamente.', maxLength: 254 },
    { name: 'phone', label: 'Qual é o seu WhatsApp?', type: 'tel', autocomplete: 'tel', placeholder: '(11) 99999-9999', hint: 'Inclua o DDD do seu número.', maxLength: 24 },
    { name: 'channel', qualificationKey: 'channel', label: 'Hoje, onde você vende produtos físicos?', type: 'radio', hint: 'Escolha a opção que representa sua operação hoje.', options: Object.freeze(['Mercado Livre, com ou sem Shopee', 'Shopee, sem vender no Mercado Livre', 'Somente outros canais', 'Ainda não vendo']) },
    { name: 'ad_count', qualificationKey: 'ad_count', label: 'Quantos anúncios ativos você tem, somando Mercado Livre e Shopee?', type: 'radio', hint: 'Considere anúncios ativos, não unidades vendidas.', options: Object.freeze(['Nenhum', 'De 1 a 50', 'De 51 a 200', 'De 201 a 500', '501 ou mais', 'Não sei informar']) },
    { name: 'pricing_process', qualificationKey: 'pricing_process', label: 'Como os preços são atualizados na sua operação?', type: 'radio', hint: 'Escolha o processo principal.', options: Object.freeze(['Manualmente, direto nos anúncios, sem planilha', 'Com planilha e alterações manuais nos anúncios', 'Uma ferramenta já atualiza os preços automaticamente', 'Não sei dizer como isso é feito']) },
    { name: 'main_problem', qualificationKey: 'main_problem', label: 'Qual situação mais descreve sua operação hoje?', type: 'radio', hint: 'Escolha a principal.', options: Object.freeze(['Vendo, mas não sei com segurança qual margem sobra', 'Falta tempo para revisar custos, preços e promoções', 'Perco ofertas e não sei até onde posso ajustar o preço', 'Já controlo esses processos e quero aperfeiçoá-los']) }
  ])
});
