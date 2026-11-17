# MargeX — plano de rastreamento 2.5

Implementação iniciada em 16/11/2026 e concluída/testada em 17/11/2026. IDs públicos fornecidos/confirmados: Meta Pixel `1768495497553870`, GTM `GTM-MW8RFWV5`. A inspeção do container publicado pelo root identificou Google tag GA4 `G-V4815EHTWE`, sem base Meta no GTM. Não instalar uma segunda base gtag.js ou um segundo Pixel.

## Medições

| Ação real | Meta | GA4 | Condição |
| --- | --- | --- | --- |
| Carregar qualquer uma das duas rotas | PageView | page_view da base Google já existente | Consentimento da categoria; uma vez por carregamento |
| Abrir o conteúdo da página da live | ViewContent | view_content | Somente página de vendas; conteúdo workshop gratuito, sem valor/moeda/produto da demonstração |
| Abrir o formulário modal ou interagir no direto | — | form_open | Evento próprio para não duplicar form_start da medição avançada existente |
| Completar uma etapa válida | — | form_step_completed | Número da etapa, total e flag de prévia; sem resposta pessoal |
| Concluir 100% e receber confirmação de cadastro salvo | Lead | generate_lead | HTTP de sucesso e JSON ok:true, saved:true, lead_id e event_id válidos e correspondentes ao pedido |
| Clicar no botão real do grupo após inscrição salva | WhatsAppGroupClick (personalizado) | whatsapp_group_click | Mede clique, não ingresso no grupo; sem enviar a URL de convite aos provedores |

Nome, e-mail, telefone e respostas pessoais não entram em dataLayer ou propriedades dos eventos de analytics. Page/source URL do contrato API é origin+pathname, sem query/hash. Origem estável: sales_page ou direct_form. UTMs reconhecidas são preservadas como rótulos de campanha sanitizados no contexto de envio ao servidor, nunca por copiar toda a URL.

## Consentimento e carregamento

Revisão2.7: a primeira camada é Cookies, com Aceitar cookies (ambas as categorias), Recusar não essenciais (nenhuma) e Preferências. Categorias e Permitir selecionados ficam na segunda camada. Preferências salvas e recusas anteriores não são sobrescritas pelo novo desenho; o visitante pode reabrir no rodapé. Clicar em Preferências não concede medição por si só.

As categorias analytics e marketing começam recusadas. Nenhum script Meta/GTM é carregado até escolha do visitante. Controles permitem permitir selecionados, aceitar todos ou recusar opcionais. Preferência salva localmente pode ser reaberta no rodapé. Google Consent Mode recebe default denied antes do GTM e updates conforme a escolha. Marketing habilita Meta e CAPI; analytics habilita GTM e GA4. Não há pixel noscript/iframe incondicional burlando a escolha. A existência deste controle não é certificação de adequação legal nem substitui uma política de privacidade aprovada.

## Contratos e prevenção de conversão falsa

Atualização 2.6 de 17/11/2026: após autorização do usuário e teste real do root confirmando persistência e retry idempotente no relay privado, a configuração pública passou a formIsPreview:false e submissionEndpoint:'/api/leads'. Relay/chave ficam exclusivamente em variáveis privadas do servidor.

Correção 2.7 autorizada em 17/11/2026: as quatro perguntas de perfil confirmadas agora acompanham os três contatos na inscrição real, tanto modal quanto direta. São sete etapas para operações ativas, quatro para iniciante/outro canal e cinco para seller sem anúncio ativo; progresso e validação seguem apenas campos aplicáveis. Valores radio são exatamente os textos canônicos de Regras e do enum da API. Payload form_version:'2.7' envia qualification.channel/ad_count/pricing_process/main_problem, omitindo somente respostas puladas. API exige o conjunto canônico aplicável antes de persistir, sem quebrar abas antigas sem form_version. Respostas de qualificação não vão ao dataLayer/GA4 ou propriedades do Pixel. Ranking/status são calculados na planilha, não no frontend. Publicação e prova de recebimento final são verificadas pelo root/DevOps.

A lógica de prévia é preservada como fallback de configuração: quando formIsPreview:true ou endpoint vazio, concluir o formulário não envia contatos, não emite Lead/generate_lead e não libera o grupo. No modo real, o ack de cadastro salvo continua obrigatório; apenas preencher os campos não é conversão.

O fluxo preparado POST /api/leads usa name/email/phone, event_id UUIDv4, form_id margex_live_signup, origin, event_source_url, consent, UTMs e fbp/fbc opcionais. O servidor deve confirmar persistência antes de retornar `{ok:true,saved:true,lead_id,event_id}`. Erro, ack incompleto ou event_id divergente mantém respostas e permite retry com o mesmo identificador. Na confirmação, browser e helper privado CAPI usam o mesmo nome Lead/event_id; o browser não solicita Lead no endpoint público de eventos. Revisões/ack repetido não disparam novamente o mesmo event_id.

POST /api/events recebe somente PageView, ViewContent e WhatsAppGroupClick com event_id UUIDv4, origem, source URL, consent e cookies de correspondência opcionais. Apenas marketing permitido gera pedido. Secrets e hash de contato pertencem exclusivamente ao servidor. Status de integração CAPI depende da validação externa do token/evento pelo root; front não afirma recebimento apenas por fetch.

## Qualidade

Módulo analytics.js sem nova dependência frontend. Allowlist pública acrescenta somente esse JS; APIs/helpers e package ficam na fonte para Vercel Functions, fora de dist. CSP exata permite Meta/GTM/GA4 por diretiva, sem wildcard geral, unsafe-eval ou liberação de script inline. Build/sintaxe e onze testes Node/VM cobrem consentimento, rotas, duplicação, eventos de conteúdo, ack confirmado/prévia/erro, clique do grupo, privacidade de payload, revogação, armazenamento bloqueado e correspondência CAPI com fbclid real. Um fbclid de entrada válido permite fbc de primeira visita somente após consentimento de marketing; nenhum click id é inventado ou enviado nos eventos GA4. QA browser e validação de recebimento são feitos pelo root; não registrar teste mock como conversão real em produção.
