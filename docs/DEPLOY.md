# Release2.4 — contador e data da live

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
