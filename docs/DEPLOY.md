# Publicação MargeX

## Estado

**RELEASE LIBERADA em2026-11-13:** pedido "finaliza agr" e QA final do responsável concluídos. Vídeos de notebook e celular gerados antes da publicação. Executar agora o envio ao repositório privado e o deployment Vercel; os registros de HOLD abaixo são históricos e foram superados por esta liberação.

QA recebido: sem overflow320/390/390x667/768/1440; scroll reversível; estado final15928centavos, lucro1593centavos e margem10%; FULL/frete ativos; tabs, formulário e movimento reduzido aprovados. Nenhum envio real de dados habilitado.

### Retomada em 2026-11-13

O usuário pediu "finaliza agr". A preparação foi retomada; commit/push/deploy continuam aguardando o sinal operacional de QA e gravações prontos pelo responsável, sem nova reconfirmação conversacional do ato de publicar. Contas e ausência de colisão foram verificadas novamente em13/11. Build local reconstruído com24arquivos públicos; nenhuma operação remota executada até esse ponto.

**HOLD — aguardando avaliação das gravações pelo usuário.** Preparação local em 2026-11-12. A autorização para GitHub e Vercel permanece como objetivo final, mas o alinhamento posterior exige mostrar a prévia gravada antes de publicar. Não executar commit, push, criação de repositório/projeto ou deploy até liberação do responsável após essa avaliação.

Até esta atualização, nenhuma mutação externa foi executada: não há repositório/projeto criados, commit, push, PR ou deployment desta tarefa. Apenas consultas autenticadas e preparação local de build/config/documentação ocorreram.

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
- Commit, deployment, URL final e hashes: registrar após execução e verificação, sem antecipar resultado.
