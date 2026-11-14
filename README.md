# MargeX — Live gratuita

Página estática em HTML, CSS e JavaScript, sem dependências. A versão atual usa uma demonstração guiada pela rolagem; não há reprodução automática.

## Prévia local

No executor integrado, dentro desta pasta:

```powershell
node server.cjs
```

O servidor atende apenas em 127.0.0.1:4318. PORT permite outra porta.

- Completa: http://127.0.0.1:4318/
- Curta: http://127.0.0.1:4318/?versao=curta
- Formulário direto: http://127.0.0.1:4318/formulario.html

## Arquivos principais

- index.html: página, catálogo com fotos reais, autoridade do professor e formulário.
- styles.css: identidade da marca, capítulos e demonstração responsiva consolidada.
- app.js: entradas, ilustrações ligadas à rolagem nativa e FAQ.
- pricing.js: dataset em centavos e funções puras, disponíveis no navegador ou por require no Node.
- catalog.js: progresso por rolagem, preço, condições, margem e trajetória dos cards.
- form.js: componente compartilhado pelo modal e pela página direta.
- config.js: configuração pública e campos provisórios. Nunca inserir segredos.
- server.cjs: servidor estático local com allowlist de arquivos públicos.
- build.cjs e vercel.json: preparação da publicação, sob responsabilidade do fluxo DevOps.
- PENDENCIAS.md: conteúdo, materiais e integrações ainda em aberto.

## Entradas atuais — revisão2.1

Títulos principais aparecem por palavras com sequência curta; os nós de texto são envolvidos emspans sem alterarEM/BR/espaços, conteúdo ou leitura semântica. Fotografias têm entrada própria de560ms com deslocamento e escala mínima, semfiltros/blur. Alvos de seção foram separados para evitar animação dupla de pai/filho. CTA continua imediato.

Baseline legível semJS/observer e cancelamento inicial/runtime em movimento reduzido. Foco/âncoras finalizam a sequência. Exemplos conservam a camada scroll-linked reversível2.0 e catálogo independente, sem alteração de core/valores/form. PublicaçãoVercel é etapaDevOps posterior aoQA; developer não publicou.

## Página atual — redesign2.0

A prévia2.0 foi autorizada após o alinhamento de40perguntas e confirmação de paleta verde-noite/verde/branco. Redesenha os capítulos abaixo da abertura: problema visual, impacto na operação, promessa, benefícios+catálogo, público, conteúdo narrativo, experiência de Andrey,FAQ e inscrição. Sem grandes superfícies verde-claras; tipografia local com espaço e contraste. Não representa aprovação estética do usuário.

Conteúdo em primeira pessoa de Andrey, com revisão contínua de custos/preços, concorrência e promoções. Público inclui quem começou a vender e quem já opera, sem faixa de faturamento.17M contextualizado abaixo do retrato na hero como receita nas operações em que atua; professor explica em texto. Foto real recortada em assets/andrey-recorte-v2.png, origem documentada pelo root.

As tabs foram substituídas por3capítulos narrativos.5cenasHTML/SVG explicam custo/preço, impacto, conta, condições da oferta e regras. Traços, divisores e etapas acompanham a rolagem nativa de forma reversível com um RAF editorial, leituras em lote e escritas depois. Entradas e atenção breve complementam. Sem loop/hijack/dependências; movimento reduzido inicial/runtime fixa diagramas completos e cancelaRAF. Baseline editorial legível semJS/observer. O catálogo tem motor separado, preservado.

index/styles/app e documentação atualizados. Form/config/pricing/catalog core não alterados. Formulário continua prévia sem envio. Data/horário/plataforma/gravação/programa/materiais/cases/integrações permanecem pendentes. Backup anterior em Documents/Codex/2026-11-14/margex-live-backup-antes-2.0. Não houve push/deploy nesta rodada pelo developer.

## Demonstração atual — revisão 1.5 preservada

O produto é a caixa Tramontina Master escolhida pelo usuário, com imagens reais. Todos os preços, descontos, custos e condições, inclusive os concorrentes, são valores de exemplo identificados na tela.

O exemplo usa preço de referência de R$ 189,90, custo do produto de R$ 100,00, fixo/frete de R$ 9,90 e taxas agregadas de 21% (15% de comissão + 6% de tributos como parâmetros demonstrativos). As taxas são arredondadas ao centavo.

| Estado | Preço | Taxas | Lucro por venda | Margem |
| --- | --- | --- | --- | --- |
| Inicial | R$ 189,90 | R$ 39,88 | R$ 40,12 | 21,1% |
| Final | R$ 159,28 | R$ 33,45 | R$ 15,93 | 10,0% |

Desconto final: 16,1%. Lucro = preço − produto − fixo − taxas. Margem = lucro ÷ preço. A queda do preço reduz o lucro por unidade; a demonstração não representa uma conta conectada nem uma alteração real via API.

A rolagem controla os estados, inclusive ao voltar:

- 0–12%: leitura das ofertas; sua oferta começa em quarto.
- 12–30%: análise de custos e margem.
- 30–58%: ajuste de preço e desconto.
- 45–65%: entrada das condições FULL e frete grátis do exemplo.
- 65–85%: sua oferta sobe para primeiro.
- 85–100%: resultado com margem de 10%.

Notebook usa quatro cards lado a lado; celular/tablet usa grade 2×2 e trajetória própria por coordenadas X/Y. O quadro fica sticky somente quando cabe na altura útil. Telas menores têm fluxo natural; movimento reduzido mostra o resultado final, sem trecho vazio. Os botões Rever análise e Ver resultado são ações explícitas de navegação.

Para QA, catalog-panel expõe dataset.progress/mode e catalog-scroll expõe dataset.start/range/boardHeight. Não existem hooks que forcem um resultado durante gravações; os vídeos devem registrar a navegação real.

## Professor e provas

R$17milhões/mês nas operações em que Andrey atua, conforme informação fornecida e reconfirmada pelo usuário. Legenda moderada abaixo do retrato na hero, separada doH1/promessa, e contexto em texto no professor. Não é faturamento pessoal nem resultado atribuído ao MargeX. Não usarR$200milhões/ano. Cases e depoimentos continuam pendentes e não foram fabricados.

## Estado da inscrição

Nome, e-mail e WhatsApp são campos provisórios. A qualificação final será definida com o usuário. O formulário não envia dados, não confirma inscrição e não armazena dados pessoais permanentemente; o rascunho existe somente em memória durante a página aberta.

Adicionar um endpoint a config.js não ativa envios nesta versão. A integração exige implementação e validação ponta a ponta. Não colocar credenciais do Google no frontend. O servidor local usa connect-src 'none', a revisar quando houver backend real.

## Verificação e entrega

```powershell
node --check app.js
node --check catalog.js
node --check pricing.js
node --check form.js
node --check config.js
node --check server.cjs
```

Sintaxe verificada pelo developer em 13/11/2026. O root validou a matemática em 101 estados e conduz a QA visual, teclado, rolagem, resize e reduced motion em 320/390/768/1440, incluindo altura de 667px.

GitHub e Vercel estão autorizados como entrega final. A publicação e a confirmação de SHA/READY/HTTP pertencem ao fluxo DevOps; este documento não comprova que já ocorreu. Gravações desktop/mobile e avaliação da prévia são conduzidas pelo root antes da liberação.
