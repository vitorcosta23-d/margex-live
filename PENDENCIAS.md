# MargeX — Pendências

Atualizado em 13/11/2026. Base atual: revisão 1.5, com demonstração por rolagem. As versões anteriores não representam aprovação estética.

## Decisões já confirmadas

- Prioridade: página da live gratuita, formulário em etapas e variante curta. A página apenas com formulário também existe.
- A live de R$ 9,90 terá o mesmo conteúdo; checkout e página paga ainda precisam ser construídos.
- Catálogo: cards com foto em cima, quatro colunas no notebook e grade 2×2 no celular/tablet.
- Movimento guiado pela rolagem, reversível, sem autoplay ou timer de seis segundos.
- Sua oferta inicia por último; o MargeX analisa preço/margem e as condições do exemplo aparecem antes da subida ao topo.
- O usuário afirma que a ferramenta realiza essas ações via API. A prévia não conecta uma conta nem executa alterações reais.
- Manter o rótulo Valores de exemplo. Não usar o rótulo rejeitado simulação ilustrativa.
- Exemplo final: preço R$ 159,28; lucro por venda R$ 15,93; margem 10,0%; desconto 16,1%. Custos e taxas demonstrativos documentados no README e em pricing.js.
- R$ 17 milhões/mês aparece somente no professor/autoridade, como receita nas operações em que Andrey atua. Não atribuir a faturamento pessoal, ao MargeX ou aos participantes. Não usar R$ 200 milhões/ano.
- Não criar depoimentos ou cases enquanto os materiais reais não chegarem.

## Evento e conteúdo

- [ ] Nome definitivo da live.
- [ ] Data, horário, duração e plataforma da transmissão.
- [ ] Programa detalhado e materiais entregues.
- [ ] Definir se haverá gravação ou outros complementos.
- [ ] Revisar a redação final com Andrey.

## Professor e materiais

- [ ] Foto original em alta resolução. A foto atual vem da própria página Ecommerplace.
- [ ] Gravação/capturas reais do MargeX para futuras demonstrações.
- [ ] Arquivos originais de marca, caso substituam as imagens extraídas do manual.
- [ ] Cases, depoimentos e resultados autorizados para divulgação.
- [ ] Validar com Andrey a base e os parâmetros demonstrativos de precificação.

## Formulário e qualificação

- [ ] Definir perguntas e alternativas com o usuário.
- [ ] Definir critérios de qualificação a partir do perfil real de cliente.
- [ ] Aprovar os campos finais; nome/e-mail/WhatsApp são provisórios para demonstrar a experiência.
- [ ] Definir responsável pela captação e texto/URL de privacidade antes da coleta real.

## Integrações

- [ ] Confirmar criação e acesso à planilha de destino.
- [ ] Implementar backend seguro para receber e gravar no Google Planilhas.
- [ ] Validar entradas, limitar uso e confirmar gravação de forma verificável.
- [ ] Tratar erros, duplicidade e novas tentativas sem apagar respostas.
- [ ] Definir colunas e regras de classificação.
- [ ] Receber link do grupo de WhatsApp.
- [ ] Liberar convite para o grupo somente após confirmação real do cadastro.

O formulário atual não envia dados, mesmo com um endpoint preenchido no config.js. A integração precisa de implementação própria. Não há persistência de dados pessoais em localStorage, cookies ou arquivos; apenas rascunho em memória. O final é declarado como prévia, sem inscrição confirmada.

## QA e publicação

- [ ] Concluir QA visual/funcional de 320/390/768/1440, incluindo 390×667, teclado, resize, scroll reversível e reduced motion.
- [ ] Entregar gravações reais desktop/mobile para avaliação.
- [ ] Registrar avaliação estética da prévia.
- [ ] Publicar GitHub/Vercel pelo fluxo DevOps autorizado e verificar SHA/READY/HTTP.
- [ ] Comparar versões completa e curta; não há experimento A/B implementado.
- [ ] Construir página paga e definir checkout/confirmação.
- [ ] Conectar e verificar Planilhas/WhatsApp ponta a ponta.

A publicação foi autorizada pelo usuário e reiterada em 13/11/2026. O estado real da publicação deve ser obtido no relatório de entrega DevOps; esta lista não afirma que ela já ocorreu.
