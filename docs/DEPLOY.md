# Release2.10 — formulário sequencial

QA2.10LIBERADO/DOCSREADY. Perguntas voltam a aparecer uma por vez,comVoltar/avançar,respostas preservadas,quatroqualificaçõescanônicas e ackdeduplicado. Clarity/contador/WebPs/IDs/CSP/envpreservados. Nenhuma mudança no backend.

60/60Node,9testesformulário,build36/sintaxe/diffPASS;scan86semsegredos/IDs/âncoras. Seiscasosbrowser320/390/1440modal/direto aprovados;LeadhookzeroantesACK/umapósmock,nenhumLeadreal. OitoativosMP4/JPG+doisWebPSHAiguais2.9nopreflight. Verificaçãopública seráfocada emform.js+smokefrontend/privados/API,semrebaixaríntegra dosvídeosinalterados.

---

# Release2.9 — publicado e verificado (inclui formulário2.8)

**PUBLICADO E VERIFICADO:** https://margex-live.vercel.app . Sourcecommit `a58a1c041dca26365d5370a1a1db8de89d00bd52`, remoto confirmado. Deployment `dpl_8GvRRh9WzbFgizCTeZuSPcv61S7W` READYproduction; URLimutável https://margex-live-ie77tkf1u-vitor-costa.vercel.app . Não houve release2.8 separada.

Formulário completo com perguntas simultâneas e umsubmit, qualificações/skips/ackpreservados; contador BlackFriday com dígitos ascendentes e movimento reduzido; imagens WebPresponsivas com carregamento adiado abaixo da dobra. Meta/GTM/GA4/consentimento/IDs/oito ativos preservados. Clarity zf7ftfroh7 instalado sujeitoàlimitação abaixo.

58/58Node,build36arquivos,43fontes59.866.077bytes,scan85semsegredos. Oito casosbrowserlocaldireto/modal320/390/768/1440 e contador normal/reduced/zeroPASS. NenhumLeadfictício novo enviado. Verifier22hashesfrontend/ativosHTTP200(incluindo540/1080WebP),4Ranges206,16privados404/API405AllowPOST/CSP/nosniffPASS; oitoMP4/JPGpreservados. Relatórioqa-output/release-verification-2.9-2026-11-17.json.

QAonline2.9PASS pelo root em390/1440: hero540WebP, sete campos simultâneos no modal/direto, oito dígitos do contador com data2026-11-23T20:00-03:00, semoverflow/erros e zeroMP4automático. Clarity:tagúnica/masktrue/consentanalytics-only;bootstrapMicrosoft204semcorpo também na produção. Instalação verificada; SDKdownstream/coleta/painel não comprovados. Não declararClarityativo nemprometergravações.

---

# Release2.7 — publicado e verificado

**PUBLICADO E VERIFICADO:** https://margex-live.vercel.app . Sourcecommit `b57c05e7094780f7e0f47df764e214a1b14a048e`, remoto confirmado. Deployment `dpl_EpRdkAp1166EoCevArJuCiMykD1e` READYproduction; URLimutável https://margex-live-42ljhdiby-vitor-costa.vercel.app .

Verifier20hashesHTTP200/4Ranges206/16privados404/API405AllowPOST,config7campos/versão2.7PASS. Relatórioqa-output/release-verification-2.7-2026-11-17.json.

QAonline2.7PASS: página390seteetapas/qualificação4canônicaform_version2.7 e formulárioeducativo320quatroetapas/apenascanal retornamHTTP200savedtrue/IDigual/grupo. Retryativoduplicatetrue,consentfalse/zeroprovedores/semMetaLeadfictício,semPIIdataLayer/overflow/pageerrors. LogsVercelprivadosconfirmam3recibosúnicos(ativo, retry, educativo):type=margex_lead_receipt/form_version2.7/savedtrue/http200/capi_statusskipped/consentfalse;retryduplicate true. Somente campospermitidos consultados,semPII/segredos.

SheetQAeLimpezaPASS:ativo70bruto/100/A/Pronto/comRanking;educativoTrilhaEducativa/semnota/foraRanking comF:H vazios. Após limparsomenteA:J/S:Udos2testes,UUIDszeroregistros;leadREALlinha2Incomplete preservado,8fórmulasincluindoR2novo+headersintactos. Resumode3(1A/1Edu/1Incomplete)para1Incomplete. CausadoLeadantigocontinuanãoprovada;estaentregaconfirmaSDKapóssaved e observabilidade futura.

QA2.7LIBERADO. Formulário reúne3contatos+4perguntascanônicas da planilha,7etapas completas/4educativo/5semAnúncios,com form_version2.7 e validaçãoAPIcondicional; versõeslegadas semversion continuam aceitas. Cookiescomaceitar/recusar em1clique e preferênciasgranulares,semcarregarprovedoresantesconsentimento. SheetR2foicorrigida e13casosverificados,preservandoleadreal.

55/55Node,testesdiretos node --test tests/*.test.cjs,build34/sintaxe/diffPASS;scan81semsegredos,41fontes59.632.520bytes,oitoassets/CSP/IDs/contadorpreservados. Rootbrowserqualificação/cookies/SDKMeta+GooglePASS comtransportesdeLeadfictíciointerceptados; nenhumLeadnovoprodução. Relatórioqa-output/qualification-browser-2.7-2026-11-17.json.

A causa da ausência do Leadantigo não foi comprovada e o consentimento do usuário estavaativo. Foi confirmado o disparoSDKapós saved e adicionados recibos privadosUUID/consent/capi_status semPII, semalegarcorreçãodecausadesconhecida. Nenhumenvnovo; rootvalidarápósREADYcadastrosqualificaçãocomconsentfalse+cleanup.

---

# Release2.6 — publicado e verificado

**PUBLICADO E VERIFICADO:** https://margex-live.vercel.app . Sourcecommit `c3d7702d72bc527fec0e78d3f6d41bb297dbb6d6`, remoto confirmado. Deployment `dpl_3Kr2gVbJQsiRAKKpqUpF1LewKsYS`, READYproduction; URLimutável https://margex-live-4clk14aim-vitor-costa.vercel.app .

Verifier2.6PASS:20hashes públicos/source/dist, quatroRanges206,16privados404,APIevents/leads405AllowPOST. ConfigpúblicoformIsPreviewfalse e/api/leads conferido. Relatório qa-output/release-verification-2.6-2026-11-17.json. SemPOSTrealdeconversão ou cadastro peloDevOps.

QAonline2.6PASS pelo root: página390 e formulário direto320HTTP200/savedtrue/ackevent_id igual request; inscrição confirmada/grupo visível,origins sales_page/direct_form corretas. Inválidozeroenvio;retryduplicate true mesmoUUID;ackrepetidorejeitado, dataLayersemcontatos,nooverflow/zeroerros. Cadastrostécnicosconsentfalse:servertrackingskipped,semLead/Purchasefalso. Cliquegrupo validado apenas commocks/navpreventDefault:WhatsAppGroupClick e whatsapp_group_click uma vez/mesmoID,semacessargrupo real. Emvisitas reais separadas:antesconsentzeroprovedores;1Meta+1GTM;Pixel1PageView+1ViewContent,CAPIambosHTTP200senttrue/IDsiguais;GA4page_view+view_content G-V4815EHTWE ambosHTTP204;zerorequestfail/pageerrors,quatrovídeos. CleanupplanilhaPASS:apenasA2:J3 eS2:U3 dostesteslimpos,8fórmulasK2:R2 idênticas/cabeçalhosS:Uintactos,UUIDszeroregistros/Resumo0.

QA2.6LIBERADO após relay real/persistência/retry idempotente confirmados pelo root. Configuração pública ativaformIsPreviewfalse e submissionEndpoint/api/leads; texto de inscrição deixa de ser prévia. Mesmo Pixel/GTM/GA4/CSP/contador/oito ativos preservados. Credenciais e URLrelay permanecem privadas no servidor.

Testesdiretos node --test tests/analytics.test.cjs tests/api-tracking.test.cjs tests/apps-script-relay.test.cjs:34/34PASS. Build34arquivos, diffcheck/scan79semachados/gateativaPASS. Rootlocal: inválidozeroPOST;503semconfirmar/grupo, respostas mantidas;390semoverflow/quatroplayers/zeroerros. Relayreal9,51s+retry3,03s, registro técnico limpo preservandoK:R.

EnvsProductionEncrypted: MARGEX_LEADS_WEBHOOK_URL, MARGEX_LEADS_WEBHOOK_SECRET e META_CAPI_ACCESS_TOKEN, somente nomes. Root valida cadastro técnicoprodução comanalytics/marketingfalse e limpa teste apósREADY. Nenhum Lead/Purchase de teste enviado pelo DevOps.

---

# Release2.5 — publicado e verificado

**PUBLICADO E VERIFICADO:** https://margex-live.vercel.app . Sourcecommit `404dab94b200aa98fd5d545f969c50fd7400dcb1`, remoto confirmado. Deployment `dpl_EVENygeyCH8MdJzDcbKp9wNV3DZJ`, READYproduction, URLimutável https://margex-live-q2k9836tc-vitor-costa.vercel.app .

Verifier públicoPASS:20arquivosfrontend/ativosHTTP200 comhashsource/dist; quatroRanges206/MIMEvideo e CSP/nosniff.16privados404 incluindo helperbackend/package/lock/.env.local/.env.example/docsAppsScript. APIevents/leadsGET405/AllowPOST/JSON; eventocomconsentimentonegadoretorna202sentfalse, sem enviarMeta. Relatório qa-output/release-verification-2.5-2026-11-17.json.

QAonline2.5PASS pelo root: antes da escolha semMeta/GTM; marketing-only PixelPageView+ViewContent para1768495497553870, event_ids iguais em/api/events;390semoverflow, quatro vídeos/contador preservados, semrequestfalho/erro. CAPIPageViewreal reutilizandoevent_id retornouHTTP200oktrue/senttrue. GA4realproduction page_view+view_content paraG-V4815EHTWE ambosHTTP204, umGTM, marketingfalse/Metaausente. NenhumLead/Purchase real enviado. Relatório qa-output/tracking-online-2026-11-17.json. AtivaçãoLeadpermanecependenteURLAppsScript/exec.

QA2.5LIBERADO pelo root em17/11/2026. Consentimento controla Meta/GTM; GA4 pelo container existente, sem segunda base. Eventos browser/CAPI compartilham event_id; Lead depende de persistência confirmada, sem PII no dataLayer. Formulário continua prévia sem endpoint por falta da implantaçãoAppsScript/URL privada. NenhumLeadreal foi usado no QA.

Testes11frontend+23backend/relay PASS; root320/390/768/1440/consentimento/mocks/deduplicação/GA4real aprovados. Build34arquivos públicos,41fontes upload59.621.605bytes. APIevents/leads são funções separadas; server/tracking.cjs/package/lock somente fonte da função, sem acesso estático. Oito ativos preservados. Scan78arquivos sem achados. CodeRabbit indisponível conforme documentação anterior.

Production recebe somente nomesdocumentados: META_CAPI_ACCESS_TOKEN e MARGEX_LEADS_WEBHOOK_SECRET configurados privadamente pelo root; MARGEX_LEADS_WEBHOOK_URL pendente. Nenhuma credencial é incluída no frontend/repositório/relatórios. Relatóriofinal qa-output/release-verification-2.5-2026-11-17.json.

---

# Release2.4 — publicado e verificado

**PUBLICADO E VERIFICADO:** https://margex-live.vercel.app . Sourcecommit `7c100da8f0735c4c864482a4942a1e02c49c4f53` confirmado no remoto; deployment `dpl_Dtq3Y9sixHWebZTGQCUzUKdRa2Pv`, READYproduction. URLimutável https://margex-live-fmh1uwm7s-vitor-costa.vercel.app . Relatório qa-output/release-verification-2.4-2026-11-16.json PASS: frontend e oito ativos HTTP200/hashesdist+source, quatroRanges206, privados404 e CSP/nosniff preservados.

RootQAonlinePASS: alias com23NOV/segunda/20hBrasília/ISOT20-03; segundos59→58 em1,2s;390semoverflow, banner topo0 e cabeçalho apósbottom184,8 semsobreposição; quatro players preservados; formulário direto com mesma data/hora; zero pageerrors. Captura qa-output/countdown-online-2026-11-16.png.

QA2.4LIBERADO antes de publicação. Live confirmada segunda-feira23/11/2026 às20h Brasília, Esquenta Black Mercado Livre. Banner no topo e contador pelo instante2026-11-23T20:00:00-03:00; expiração emzero e data visível semJavaScript. Formulário direto mostra mesmo horário; permanece prévia sem envio, planilha ou backend conectados.

Root aprovou320/390/600/768/1440semoverflow, banner sem sobreposição, quatro players, modal e zero pageerrors. Contador antes/exato/depois e Asia/Tokyo aprovados. DevOpsbuild33arquivos, fonte35arquivos59.587.838bytes; oito ativos preservados, scan64arquivos/diffcheckPASS. CodeRabbit indisponível conforme skip_if_not_installed já documentado. Projeto e branch existentes preservados.

---

# Release2.3 em16/11/2026 — publicado e verificado

**PUBLICADO E VERIFICADO:** https://margex-live.vercel.app . Sourcecommit `c7156bc064605403aea73c93d9ff4bef25b31469`, confirmado no remoto. Deployment `dpl_3wNHRaDT75oC5MxH9e62VJiSxHJV`, READYproduction. URLimutável https://margex-live-18gzxxzty-vitor-costa.vercel.app .

Hashes públicos index/styles/app/catalog/pricing e oito ativos01–04 coincidem comdist e source; quatro MP4Range206/MIMEvideo/mp4 aprovados. CSPmedia-src self/nosniff conferidos. docs/server/.env/.git/config e intermediários01/04 retornam404. RootQAonline: quatro players/nomes/resumos, sem labels numerados/overflow390;04play+seek12s480×854 semerro, zero pageerrors. Relatório qa-output/release-verification-2026-11-16.json PASS. Formulário continua prévia sem envio.

QA2.3LIBERADO pelo root antes de commit/push/deploy. Projeto existente margex-live, contexto vitor-costa, branch dev/feat/margex-live. Quarto vídeo de Milo — Magazine do EPI,30,93s480×854, legendas e poster revisados. Cartões identificados por nome/empresa, sem rótulos Prova1/2/3. Quatro players separados; demais três vídeos preservados.

Gates: build33arquivos públicos; fonte35arquivos59.582.474bytes; oito ativos finais56.043.654bytes; maior arquivo28.649.689bytes. Sintaxe/diffcheck, scan63arquivos sem achados, IDs/âncoras íntegros e prévia sem envio preservada. Root:320/390/768/1440semoverflow, quatro reproduções semMediaError, pausa exclusiva, seek04, quatroRanges206, nenhum MP4antesplay, zero pageerrors. CodeRabbit SKIPPED conforme indisponibilidade documentada.

Limites conservadores: upload abaixo100.000.000bytes e arquivos abaixo50MiB. Pacote contém apenas finais01–04 MP4/JPG, assets permitidos e frontend; originais, transcrições, docs e credenciais excluídos. Relatório final: qa-output/release-verification-2026-11-16.json.

## Histórico2.2 confirmado em16/11

A publicação15/11 concluiu: source837d805f5fc4c63039f72229bc0292de630383db, deploymentdpl_CmGZfT1rCdBdVT3tmumzPKkSd8Xt READYproduction, URLimutável https://margex-live-888pujbjx-vitor-costa.vercel.app . SHA remoto e hashes públicos de index/styles/app e três MP4 reconferidos iguais ao relatório15Nov. Este registro supera a ausência da etapa2.2 no histórico anterior.

---

# Publicação MargeX

## Estado atual — atualização 2.1.1 em 14/11/2026

**PUBLICADO E VERIFICADO:** https://margex-live.vercel.app . Autorização explícita do usuário para publicar a atualização de entradas de foto/texto e exemplos acompanhando a rolagem. QA2.1 e QA2.1.1 liberados pelo root antes dos respectivos envios.

- Branch: `dev/feat/margex-live`, sem envio a `main`.
- Source commit final: `fd79c0f898a64631a49f6c7da3bcf3042fa0fc47`, confirmado no remoto.
- Deployment final: `dpl_8E6hDmj2N1FUsk9BeJfTXhPfHZLK`, estado `READY`, target `production`.
- URL imutável: https://margex-live-8k9x9luv4-vitor-costa.vercel.app .
- Relatório: `qa-output/release-verification-2026-11-14.json`.

A atualização reúne a direção escura2.0, narrativa/impacto operacional, FAQ e fechamento refeitos, foto recortada, entradas sequenciais de palavras e cenas ligadas à rolagem nativa. Autoridade17M permanece contextualizada às operações em que Andrey atua. O catálogo e seus cálculos foram preservados; valores e condições continuam identificados como exemplos.

A correção2.1.1 aguarda a foto carregar/decodificar antes de iniciar a entrada, para que uma conexão lenta não consuma a animação antes de o retrato aparecer. Root verificou atraso1600ms e cancelamento por movimento reduzido. Nenhum envio real de formulário foi habilitado.

### Gates desta atualização

- Sintaxe dos7scripts, build estático25arquivos e diffcheck aprovados.
- Matemática em101estados: final15928centavos, taxas3345 e resultado1593; margem10% no exemplo.
- Scan de53arquivos sem achados de segredos de alta confiança; IDs e âncoras íntegros.
- CodeRabbit: **SKIPPED**, não localizado no PATH/caminhos canônicos. `skip_if_not_installed: true` confirmado na configuração; nenhum review ou zeroissues foi inventado.
- QA do root:320/390x667/768/1440 sem overflow, texto/EM/quebras preservados, foto e palavras animando, exemplos reversíveis, catálogo0→1→0, FAQ/modal e movimento reduzido funcionais.

### Integridade pública final

Index, CSS, app, catálogo e cálculo responderam200 com hashes SHA-256 exatamente iguais à saída `dist/`. Foto recortada, fonte local, produto e formulário direto também retornaram200; `/docs/DEPLOY.md`, `/server.cjs`, `/.env` e `/.git/config` retornaram404. CSP e `nosniff` conferidos no relatório.

| Arquivo | SHA-256 público/dist |
| --- | --- |
| index.html | 0797544e45ffb703142db70b9b56376d16009a1a023b6bd909ca9479199126b8 |
| styles.css | a2a92d67ffcf224bebe6a8ed582ea417b3bf5fe3945b27a2e47dc848b3c2ad24 |
| app.js | 24b2c64e8a956ec275e0ee95449a8191554f30ff438e2923260efacbfed93d3e |
| catalog.js | c9cfd699ee46de86dcfb5d909ce193ba5a45cf480c39ce2f2e67a27f08f2f380 |
| pricing.js | e7a0e349cdbb7178cefd3dc849cf2e0beba7ecf85238d19e138d256b106a0353 |

Snapshot intermediário2.1: source `7c91b5bac11b50d444186da3a0cee1e88b3609b5`, deployment `dpl_eNzvh8Fo3qsVz6Xik1JKLdHrhZUF`. Foi substituído pela2.1.1 após o root detectar a entrada da foto concluindo antes do carregamento lento. O release final é o indicado acima.

O formulário continua como prévia sem gravação/inscrição confirmada. Programa, agenda, integração Planilhas/CRM e grupo continuam sujeitos às pendências do produto. Esta documentação não habilita serviços nem altera a aplicação publicada.

QA online do root no alias final: HTTP200, mobile390x667 sem overflow, H1 com sete palavras animadas e EM preservado, foto recortada correta, catálogo no resultado com margem10%, modal abre, formIsPreview=true e nenhum pageerror observado.

## Histórico da publicação de 13/11/2026

**PUBLICADO E VERIFICADO em2026-11-13:** https://margex-live.vercel.app . Repositório privado: https://github.com/vitorcosta23-d/margex-live . Pedido "finaliza agr", QA e vídeos concluídos antes da publicação. Os registros de HOLD abaixo são históricos e foram superados pela liberação final.

QA recebido: sem overflow320/390/390x667/768/1440; scroll reversível; estado final15928centavos, lucro1593centavos e margem10%; FULL/frete ativos; tabs, formulário e movimento reduzido aprovados. Nenhum envio real de dados habilitado.

### Retomada em 2026-11-13

O usuário pediu "finaliza agr". A preparação foi retomada; commit/push/deploy continuam aguardando o sinal operacional de QA e gravações prontos pelo responsável, sem nova reconfirmação conversacional do ato de publicar. Contas e ausência de colisão foram verificadas novamente em13/11. Build local reconstruído com24arquivos públicos; nenhuma operação remota executada até esse ponto.

**Histórico de12/11 — HOLD, já superado:** a preparação aguardou a prévia gravada e a liberação do responsável antes de executar as operações externas.

Até aquele registro de12/11, nenhuma mutação externa havia sido executada. As operações realizadas depois da liberação constam no resultado abaixo.

Revisão1.5 em desenvolvimento: animação controlada pelo scroll, FULL/frete/desconto, oferta final15928centavos e margem10%, com autoridade17milhões do professor conforme novo alinhamento. Esses detalhes não mudam a lista de arquivos públicos do build. Os scripts continuam com os mesmos nomes e as fotos/fontes atuais estão nos formatos permitidos. Não gerar ou publicar um artefato intermediário enquanto a implementação e a avaliação estiverem em andamento.

## Contas verificadas

- GitHub: `vitorcosta23-d`, confirmado pelo conector e pelo CLI autenticado fora do sandbox.
- Vercel: usuário CLI `jonot2035-9858`, contexto atual `vitor-costa`.
- Repositório alvo `vitorcosta23-d/margex-live`: não existia na consulta inicial.
- Projeto Vercel `margex-live`: não existia no contexto consultado.

Essas informações são verificações desta etapa, não garantias de disponibilidade futura. Nenhuma credencial deve ser escrita aqui.

## Build público

Executar `node build.cjs`. Sem instalação de dependências. A saída `dist/` contém apenas as páginas, CSS, JavaScript do navegador e imagens/fontes permitidas em `assets/`.

O build verifica hashes das cópias. Não apaga arquivos: se encontrar conteúdo inesperado em uma saída anterior, interrompe para evitar publicar arquivos fora da lista. Não seguir links simbólicos para fora do projeto.

Ficam fora da publicação: docs, desenho do caderno, manual PDF, notas do Obsidian, logs, `.git`, `.vercel`, arquivos de ambiente e o servidor local. O desenho pessoal em `docs/references/` também fica fora do repositório remoto.

## Release

### CodeRabbit e verificações disponíveis

O workflow real foi consultado em `.sinapse-ai/development/tasks/github-devops-pre-push-quality-gate.md`. A configuração canônica local `.sinapse-ai/core-config.yaml`, seção `coderabbit_integration.graceful_degradation`, define `skip_if_not_installed: true`; o checklist também exige a execução "if available". Nesta máquina, WSL não está instalado e o CLI CodeRabbit não foi localizado no PATH ou nos diretórios usuais. Não existe ferramenta conectada de CodeRabbit nesta sessão.

Resultado a registrar: **SKIPPED — indisponível, conforme configuração explícita**. Não houve review CodeRabbit e não se deve afirmar zero issues de um review não executado. Permanecem os checks efetivos de sintaxe, cálculo, build, revisão estática especializada, segurança e navegador. Nenhum arquivo protegido do framework foi alterado.

1. Encerrar as alterações e obter o QA técnico final.
2. Rodar sintaxe JavaScript, verificação dos cálculos e `node build.cjs`.
3. Revisar arquivos versionados e procurar segredos sem expor valores.
4. Criar o repositório privado novo, preservar a branch de trabalho e não enviar diretamente a uma `main` existente.
5. Enviar somente o estado aprovado. Confirmar SHA remoto.
6. Criar/vincular apenas o projeto Vercel novo no contexto `vitor-costa` e publicar.
7. Confirmar estado `READY`, HTTP200 e comparar SHA-256 público de index/CSS/catalog/pricing com a saída final local.

## Limites atuais do produto

A publicação será uma prévia da página. Formulário e classificação ainda são provisórios, sem envio de dados; Planilhas e grupo de WhatsApp aguardam conexão e confirmação real. Datas, programa detalhado, cases e materiais originais continuam pendentes. Publicação técnica não equivale a aprovação estética do usuário.

## Resultado da release

Preparação remota executada em2026-11-13 após liberação do QA:

- Repositório privado criado e verificado: https://github.com/vitorcosta23-d/margex-live .
- Branch de release: `dev/feat/margex-live`, sem envio a uma `main` existente.
- Projeto Vercel novo: `margex-live`, contexto `vitor-costa`.
- ID do projeto retornado pelo CLI: `prj_bGWwbGB5aNUQ94sMaQTKwIOjhXLA`.
- Commit inicial: `37bd9b284251f4f01bf6c8cfbb0eece0ed12fc4f`.
- Commit final de release e SHA remoto verificado: `370d9e66c122aecfdeca36628f6c9c131a38c462`.
- Deployment: `dpl_35KFz7L1e2Dm1aowHSC3HQDrb6KX`, estado `READY`, target `production`.
- URL estável: https://margex-live.vercel.app .
- URL imutável: https://margex-live-v0gt10ky9-vitor-costa.vercel.app .
- Relatório local: `qa-output/release-verification-2026-11-13.json`, conferido às16:52:07UTC.

O primeiro deployment falhou por ausência da pasta assets no upload. A correção foi somente de empacotamento: incluir explicitamente o diretório pai e os formatos dos arquivos em `.vercelignore`. A regra foi verificada antes do retry, que recebeu26arquivos de fonte, gerou24arquivos públicos e terminou `READY`. Não houve modificação do frontend entre o QA final e a release.

### Integridade pública

Os quatro arquivos responderam HTTP200 e seus hashes públicos coincidem com os respectivos arquivos finais de `dist/`:

| Arquivo | SHA-256 |
| --- | --- |
| index.html | c65a190896a1da5c1104abd314d79f7edb86ba1cf7cfab4917b5227a673e1cbc |
| styles.css | ba8c579b13384cb0e1df88a4bc70502a019f24d83503e9b5324fe8f3f70ba935 |
| catalog.js | c9cfd699ee46de86dcfb5d909ce193ba5a45cf480c39ce2f2e67a27f08f2f380 |
| pricing.js | e7a0e349cdbb7178cefd3dc849cf2e0beba7ecf85238d19e138d256b106a0353 |

Formulário direto e imagens do professor/produto: HTTP200. `/docs/DEPLOY.md`, `/server.cjs` e `/.env`: HTTP404. CSP e `nosniff` conferidos. Root também concluiu o QA do site online em desktop e390x667, com estado final15928/1593/10%, FULL e frete ativos, sem erros próprios.

Este registro foi atualizado localmente após a release. Não gerou novo deployment nem mudança de frontend.
