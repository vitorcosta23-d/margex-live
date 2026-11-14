# Publicação MargeX

## Estado

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
