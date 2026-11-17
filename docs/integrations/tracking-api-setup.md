# Tracking API — setup de 17/11/2026

O Pixel público é `1768495497553870`. A API usa Graph v26.0 (versão publicada em 29/07/2026), com opção de atualização pela variável `META_GRAPH_API_VERSION`. Nada neste documento contém credenciais reais.

## Eventos e confirmação

- `POST /api/events`: permite somente PageView, ViewContent e WhatsAppGroupClick. Requer `consent.marketing=true` para compartilhar com a Meta. O mesmo UUID recebido em `event_id` deve ser o `eventID` do Pixel.
- `POST /api/leads`: valida os contatos e só confirma `saved:true` após resposta real do relay da planilha. O evento Lead do servidor ocorre depois dessa confirmação e somente com marketing autorizado. O browser usa o `event_id` da resposta; não deve disparar Lead durante a prévia nem por botão/abertura do formulário.
- O endpoint público de eventos recusa Lead. Cadastro sem permissão de marketing pode ser salvo, mas não é enviado à Meta.
- Um clique no grupo não comprova ingresso no WhatsApp. As respostas de qualificação, se ainda não coletadas, permanecem vazias; a planilha mostra esses registros como incompletos, sem inventar respostas para pontuar.

## Variáveis privadas no Vercel

Configure em Settings → Environment Variables, ambiente Production, sem inserir no código público:

| Nome | Uso |
| --- | --- |
| `META_CAPI_ACCESS_TOKEN` | Token de servidor gerado no Gerenciador de Eventos Meta |
| `META_PIXEL_ID` | ID público acima; pode ser omitido pois há padrão no servidor |
| `META_GRAPH_API_VERSION` | `v26.0`, atualizável após conferir a versão na Meta |
| `META_TEST_EVENT_CODE` | Opcional, somente durante validação deliberada em Test Events; remover no tráfego real |
| `MARGEX_LEADS_WEBHOOK_URL` | URL `/exec` do Web App Apps Script |
| `MARGEX_LEADS_WEBHOOK_SECRET` | Segredo aleatório de pelo menos 32 caracteres, igual nas Script Properties |
| `TRACKING_ALLOWED_ORIGINS` | Opcional: origens HTTPS adicionais exatas, separadas por vírgula |

Não entregar o token ou o segredo no chat. O navegador recebe apenas IDs públicos, nunca essas variáveis. Variáveis alteradas exigem nova implantação Vercel.

## Conectar a planilha existente

1. Na planilha `dados margex`, abrir Extensões → Apps Script. Copiar o conteúdo de `margex-leads-apps-script.gs` para o editor.
2. Em Project Settings → Script Properties, criar `MARGEX_SPREADSHEET_ID` com o ID da planilha existente e `MARGEX_LEADS_WEBHOOK_SECRET` com um segredo forte gerado fora dos arquivos rastreados.
3. Implantar como Web App, executar como proprietário da planilha e permitir acesso à chamada de servidor. Embora a URL aceite chamadas públicas, o código exige o segredo compartilhado antes de acessar a planilha.
4. Configurar URL `/exec` e o mesmo segredo nas variáveis privadas Vercel acima. A URL é usada apenas pelo servidor; não é colocada no formulário.
5. Testar uma inscrição real autorizada: resposta JSON `ok:true,saved:true`, registro em Leads e ID na coluna S. K:R não devem ser alteradas. Só depois definir `submissionEndpoint:'/api/leads'` e retirar o modo prévia do formulário.

O script adiciona as colunas S (ID), T (consentimento informado) e U (atribuição completa de origem/UTMs) quando necessário e usa LockService para impedir gravações concorrentes do mesmo UUID. Não sobrescreve colunas privadas com cabeçalhos diferentes dos esperados. Mantém até 9.999 registros de entrada. Dados são enviados como texto para impedir injeção de fórmulas. Identificadores fbp/fbc só são preservados com permissão de marketing; os contatos não são enviados ao GA4.

## Contrato de inscrição

JSON: `name`, `email`, `phone`, UUID `event_id`, `form_id:'margex_live_signup'`, `origin:'sales_page'|'direct_form'`, `event_source_url` com origem/caminho sem dados pessoais, `consent:{analytics:boolean,marketing:boolean}`. Opcionais: `fbp`, `fbc`, `utm:{utm_source,utm_medium,utm_campaign,utm_content,utm_term}` e `qualification:{channel,ad_count,pricing_process,main_problem}`.

Resposta de sucesso persistido: `{ok:true,saved:true,lead_id,event_id,duplicate,tracking:{server}}`. `tracking.server` pode ser sent, skipped, not_configured, failed ou duplicate; falha do rastreamento não desfaz cadastro já salvo. Erros de persistência nunca retornam sucesso nem autorizam Lead. Falta de configuração retorna 503. Erros não incluem contatos, tokens ou respostas brutas dos provedores.

### Formulário versão2.7

O novo cliente inclui `form_version:'2.7'`. Essa versão exige `qualification.channel` com texto canônico da aba Regras. Para Mercado Livre/Shopee exige também `ad_count`; quando for diferente de `Nenhum`, exige `pricing_process` e `main_problem`, inclusive se a quantidade de anúncios for desconhecida. Iniciantes/outros canais dispensam os campos de operação ativa. Campos enviados devem usar as opções exatas do contrato; respostas vazias são omitidas. O servidor valida esse contrato antes de acessar a planilha. A ausência de `form_version` é mantida para compatibilidade com abas antigas do formulário de três contatos.

### Recibos privados de rastreamento

No runtime Vercel, cada tentativa de cadastro produz log JSON `margex_lead_receipt`: UUID, versão, horário, consentimentos, saved/duplicate, estado CAPI e erro técnico seguro. Rejeições do provedor podem registrar somente status HTTP e code/subcode numéricos; nunca mensagens/corpos de resposta, contatos, hashes, cookies, tokens ou URLs. O logger é injetável em testes e não muda o resultado de uma inscrição se falhar. A retenção é a disponibilizada pelo provedor; não há nova coluna de recibo Meta ou atualização do Apps Script nesta etapa. A versão do formulário também acompanha a atribuição já armazenada na coluna U, aproveitando o contrato existente do relay.

Um recibo `sent` comprova o aceite técnico da chamada conforme resposta da API. Não comprova, por si, a contagem final ou atribuição no Gerenciador de Anúncios. Eventos normais não recebem o `test_event_code` local; verificar a visualização correta na Meta antes de concluir ausência de disparo.

## Limites e validação

POST/JSON, schema estrito Zod, corpo máximo 16 KiB, origem exata, URLs de conteúdo limitadas às páginas públicas conhecidas e timeouts. Limite por instância: 40 eventos/min e 10 inscrições/min por origem de rede. Esse limite reduz abuso em instâncias quentes, mas não é uma proteção distribuída; revisar limites/firewall no provedor antes de elevar volume. Não existem garantias de entrega nem fila persistente de retentativa CAPI nesta versão. Duplicatas de inscrição não reenviam o Lead servidor, evitando repetições silenciosas; um envio Meta que falhe depois da gravação precisa de acompanhamento.

O token nunca entra na URL de requisição Meta; usa Authorization no servidor. Eventos de navegação não contêm contatos. No Lead, email normalizado e telefone com código do país são SHA-256; o nome não é enviado. IP/UA são obtidos da requisição, com cabeçalhos de IP confiados somente no Vercel. Dados de marketing não são enviados sem escolha afirmativa.

QA automatizado usa provedores mockados, sem inscrições reais ou eventos Meta de teste. Testes locais não comprovam recebimento na conta Meta; essa confirmação exige Test Events após configurar as variáveis.

## Fontes oficiais consultadas

- [Deduplicação Meta](https://developers.facebook.com/documentation/ads-commerce/conversions-api/deduplicate-pixel-and-server-events).
- [Versões Graph API](https://developers.facebook.com/docs/graph-api/changelog/versions/).
- [Parâmetros CAPI](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/v25.0/).
