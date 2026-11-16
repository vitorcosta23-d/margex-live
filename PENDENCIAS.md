# MargeX — Pendências

Atualizado em16/11/2026. Redesign2.0 autorizado e implementado para avaliação; core da demonstração por rolagem1.5 preservado. QA técnico não representa aprovação estética.

## Decisões já confirmadas

- Prioridade: página da live gratuita, formulário em etapas e variante curta. A página apenas com formulário também existe.
- A live de R$ 9,90 terá o mesmo conteúdo; checkout e página paga ainda precisam ser construídos.
- Catálogo: cards com foto em cima, quatro colunas no notebook e grade 2×2 no celular/tablet.
- Movimento guiado pela rolagem, reversível, sem autoplay ou timer de seis segundos.
- Sua oferta inicia por último; o MargeX analisa preço/margem e as condições do exemplo aparecem antes da subida ao topo.
- O usuário afirma que a ferramenta realiza essas ações via API. A prévia não conecta uma conta nem executa alterações reais.
- Manter o rótulo Valores de exemplo. Não usar o rótulo rejeitado simulação ilustrativa.
- Exemplo final: preço R$ 159,28; lucro por venda R$ 15,93; margem 10,0%; desconto 16,1%. Custos e taxas demonstrativos documentados no README e em pricing.js.
- Preferência atual confirmada: R$17milhões/mês em legenda abaixo do retrato na hero, com contexto de receita nas operações em que atua, e contextualizado em texto no professor. Não atribuir ao faturamento pessoal, ao MargeX ou aos participantes. Não usarR$200milhões/ano.
- Quatro depoimentos reais recebidos e editados em15–16/11, apenas com legendas e tratamento de áudio. Mesmo contêiner, cada vídeo separado com nome em título, empresa e resumo próprio. Não inventar outros testemunhos ou resultados.

## Redesign2.0

- Paleta verde-noite/verde/branco confirmada; retiradas grandes superfícies verde-claras.
- Nova ordem com impacto na operação; composição póshero redesenhada, não somente recolorida.
- Voz1pessoa e público incluindo quem começou a vender e operações existentes.
- Conteúdo narrativo substitui tabs rejeitadas; FAQ e inscrição com nova hierarquia.
-5cenasHTML/SVG e scroll-linked editorial reversível; reduced/noJS estático legível.
- Foto real recortada aplicada, proveniência registrada pelo root. Catálogo/core/math/form/config preservados.
- [ ] Avaliação estética do usuário da nova direção2.0.

## Incorporado na revisão1.6

- Revisão contínua de custos e preços, além do cálculo inicial.
- Produto/fornecedor, comissão, frete, impostos, promoções e incentivos de comissão.
- Público por necessidade operacional: muitos anúncios, planilhas, médias e concorrência; sem faturamento mínimo presumido.
- Limites de margem e fatores Full/frete/prazo; sem transformar ferramenta em garantia de resultado.
- Aula gratuita separada de assinatura e assessoria; exemplos financeiros do catálogo e autoridade17M mantidos no contexto aprovado.
- Texto novo baseado nas respostas escritas e proposta já consolidadas; os áudios seguem pendentes de transcrição e não foram usados.
- Preservados catálogo, cálculos, rolagem, formulário, variantes e arquivos de integração. Nenhum push/deploy nesta revisão; docs/DEPLOY.md preexistente preservado.

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
- [x] Quatro depoimentos fornecidos/autorizados: Mara—Lyvan Home; Júnior—SóSom; Ana Paula—Distribuidora Rotamax; Milo—Magazine do EPI. Vídeos legendados/áudio tratado revisados pelo root e integrados com nomes nos títulos, sem numeração.
- [ ] Outros cases/resultados, se houver: receber materiais e autorização; não fabricar.
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
