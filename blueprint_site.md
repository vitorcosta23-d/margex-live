# MargeX Live — blueprint aprovado pelo briefing

## Revisão 2.6 — inscrição real habilitada

Em 17/11/2026, após autorização do usuário, o root verificou cadastro técnico persistido no Apps Script e retry idempotente do mesmo UUID. Relay/chave privados configurados fora do código público. Esta revisão habilita formIsPreview:false com endpoint local /api/leads e substitui o estado de prévia das revisões anteriores. Mantêm-se três campos de contato; perguntas de perfil aguardam validação do Andrey. Sucesso, acesso ao grupo e Lead continuam condicionados ao ack de persistência saved:true/event_id correspondente, nunca ao preenchimento isolado. Atualizar somente informações visíveis de prévia/inscrições pendentes, sem mudar layout, conteúdo aprovado ou rastreamento. Publicação e cadastro real de QA pós-deploy pelo root/DevOps; não registrar deploy antes de READY.

## Revisão 2.5 — rastreamento confirmado de visitas e inscrição

Pedido direto de 16/11/2026: um único Meta Pixel 1768495497553870, container GTM-MW8RFWV5, PageView/ViewContent, Lead como conversão principal somente após formulário válido concluído e persistência confirmada; WhatsAppGroupClick separado no clique real do grupo. GA4 exige tag/ID de medição verificado; GTM não equivale a GA4 configurado. Deduplicação browser/servidor por mesmo nome/event_id. Nenhum token, credencial ou dado de contato em dataLayer/URLs de analytics. CSP permite apenas origens necessárias por diretiva. Esta revisão autoriza tracking externo e hooks de integração, substituindo a restrição antiga de não analytics externo, sem retirar a prévia até envio real verificado. Contador, quatro depoimentos e visuais/cálculos preservados. Contratos de backend e consentimento serão registrados após coordenação do root; não inventar status de integração, link do grupo ou inscrição bem-sucedida.

## Revisão 2.4 — data confirmada e contagem regressiva

Pedido direto de 16/11/2026: acrescentar no topo um contador para a live de segunda-feira, 23/11/2026, às 20h, como esquenta Black do Mercado Livre. Horário de Brasília conforme o contexto do usuário; instante único `2026-11-23T20:00:00-03:00`.

Faixa antes do header, no fluxo da página, sem sobrepor conteúdo. Verde-noite/verde/branco e fontes locais existentes. Título “Esquenta Black Mercado Livre”, data estática legível sem JavaScript e unidades dias/horas/minutos/segundos com largura estável. Contador usa o instante absoluto, atualiza sem animação e sem anunciar segundos ao leitor de tela. No início, encerra em zero e informa “Chegou o horário da live”, sem afirmar transmissão ativa nem inventar acesso.

Substituir as referências visíveis a data/horário em definição na hero, FAQ e fechamento; duração/plataforma/gravação continuam pendentes. Rota direta também mostra data confirmada. Preservar headline, ordem, quatro depoimentos e ativos, animações, catálogo/cálculos e formulário em prévia. Sem integração, novas dependências ou publicação pelo developer. Backup externo antes de editar; QA visual e publicação pelo root/DevOps.

## Revisão 2.3 — quarto depoimento e nomes nos cartões

Pedido direto de16/11/2026: editar o quarto vídeo enviado, colocá-lo no site e retirar “Prova1/2/3” e demais títulos numerados. Esta revisão prevalece sobre a identificação anterior. Um único #cases com quatro players independentes; nome da pessoa em h3 acessível também ao player, empresa como apoio e resumo individual abaixo. Preservar os três resumos atuais e seus ativos. Quarto resumo/identificação somente após confirmação fundamentada na transcrição; não solicitar mídia inexistente enquanto aguarda.

Grade desktop2×2 para manter tamanho e legibilidade dos vídeos9:16, uma coluna abaixo900px. HTML5 controls/playsinline/preload=none/poster/object-fitcontain e pausa dos demais players preservados. Finais04 em assets/provas/depoimento-04.mp4 e.jpg, allowlist estrita de oito finais no build/servidor/upload. Sem originais/intermediários/transcrições na publicação. Sem novas dependências ou mudanças emform/config/pricing/catalog. Backup externo antes da edição; QA e publicação pelo root.

## Revisão2.2 — três vídeos reais como prova social

Pedido explícito15/11/2026: legendar/melhorar áudio de3vídeos fornecidos e colocá-los no projeto. Developer web integra apenas os finais processados pelo root/mediaagent; não altera conteúdo audiovisual.

Seção #cases após professor e antesFAQ, escura e alinhada2.1. Três playersHTML5 controls/playsinline/preload=none com poster; desktop3colunas e mobile1coluna. Títulos confirmados pelo usuário: Prova 1/2/3. Nomes/empresas autorizados e resumos individuais de1frase fundamentados na transcrição e fornecidos pelo root, em paráfrase. Um único contêiner#cases com3players separados. Sem número/claim inventado. Proporção ajustada à fonte comobject-fitcontain. Semautoplay, música ou loader dos vídeos na abertura; reprodução deum pausa osoutros.

Em15/11 os6finais foram recebidos, revisados pelo root e verificados (45.416.274bytes). Seção ready/visível, sources/posters noHTML após conferência. Finais públicos assets/provas/depoimento-01.mp4 e.jpg até03. Originais/transcrições/logs não entram noartefato público.

Build com lista estrita de seis finais, subpasta segura e verificaçãoSHA256. Servidor local permitevideo/mp4, pedidos singlebyteRanges206/HEAD e416. Vercelignore expõe sóseisnomes. Semdependências/push/deploy neste trabalho web; publicação coordenada pelo root após revisão dosvídeos.


## Revisão2.1 — entrada de fotografia e palavras

Pedido explícito: reforçar entrada de elementos/foto/textos aparecendo e exemplos se movendo com a rolagem; atualização Vercel seguirá pelo DevOps apósQA. Implementação local desta story não publica.

Títulos principais aparecem por palavras em sequência curta, preservandoEM/BR/texto/espaços e leitura semântica. Fotografias têm entrada própria com deslocamento vertical e escala mínima, sem filtros oublur, duração560ms. Evitar animação dupla em pais/filhos. CTA da hero fica imediatamente disponível. Conteúdo sempre legível semJS/observer; reducedmotion inicial/runtime e foco/hash revelam tudo.

Preservar camada scroll-linked reversível deSVG/etapas/divisores e catálogo; sem alterar números/cálculo/core/form/config/ordem/texto/brand/17M. Sem novas dependências. Backup externo pré2.1. QA pelo root, publicação separada.


## Revisão2.0 — redesign autorizado após alinhamento

Esta seção prevalece sobre as revisões visuais anteriores fora dos mecanismos e dados do catálogo. Usuário respondeu40perguntas, rejeitou a composição póshero e confirmou agora: preservar paleta MargeX verde-noite/verde/branco, retirar grandes fundos verde-claros e manter R$17milhões/mês no contexto atual de autoridade. Autorizou executar sem nova confirmação.

### Direção confirmada

Mobile primeiro e desktop completo. Escura, tecnológica e comercial; títulos fortes e grandes, espaço entre ideias, blocos abertos detalhados sem caixas genéricas. Hero atual é a referência positiva: preservar headlinebase e foto real dominante/natural. Sora/Figtree/JetBrains locais. Abaixo da hero redesenhar composição e narrativa, não somente trocar cores.

Ordem: abertura → problema → impacto na operação → promessa/benefícios → faixa de benefícios e catálogo como solução → para quem é → conteúdo da live → experiência de Andrey → FAQ → inscrição. Público inclui quem começou a vender/estruturar a operação e quem já opera; não prometer curso de abrir conta/primeira venda. Voz em primeira pessoa de Andrey, provocação forte e didática.

Problema: precificar uma vez não acompanha fornecedor/frete/concorrência/promoções. Impactos possíveis em caixa, estoque, descontos, tempo e oportunidades; sem valores de perda ou diagnóstico universal. Promessa educacional: saber o que revisar, analisar ofertas/promoções e entender limites/regras. Live prática/estratégica com MargeX em uso, não configuração individual da conta do participante.

### Composição e motion

Criar ilustrações autorais HTML/SVG explicativas: preço parado e variáveis; cadeia venda/margem/caixa/reposição; critério da revisão. Transformações pequenas relacionadas ao scroll nativo, traçosSVG/dashoffset e divisores por progresso reversível, destaque de nós impacto/regras e atenção breve uma vez. Um RAF atende scroll/resize/load com leituras antes das escritas; sem loop decorativo ou hijack. Entradas discretas complementam, não substituem explicação. Reduced motion inicial/runtime e noJS mostram conteúdo estático completo. Não transformar sticky/cards/ancestrais do catálogo.

Catálogo mantém produto real/cards/IDs/math/timeline/corecatalog1.5. Apenas sua composição editorial e fundo externo passam a escuros. Não garantir topo ou tempo de resultado. Valores de exemplo, margem e lucro por unidade corretamente contextualizados.

Substituir tabs de conteúdo rejeitadas por capítulos narrativos claros e acessíveis. FAQ nova composição editorial com perguntas numeradas, contraste alto, áreas grandes. Inscrição final forte e detalhada com próximo passo claro e aviso de prévia honesto. Form/config/pricing não alterados; assinatura/teste/assessoria não inclusos.Preferência posterior do usuário:17M em legenda moderada abaixo do retrato na hero, receita nas operações em que atua, separado da promessa; professor contextualiza em texto sem número gigante duplicado. Sem sellersmaisvendem/top1garantido/30s/semana→5min/churn/zero prejuízo.

### Limites e entrega

Sem dependências, servidor extra, push ou deploy. Preservar docs/DEPLOY dirty, histórias anteriores e ativos reais. Backup externo pré2.0. Blueprint e story antes da implementação. QA funcional/visual pelo root; aprovação técnica não equivale a aprovação estética do usuário. Data/horário/plataforma/gravação/materiais/cases e integrações seguem pendentes.


## Revisão 1.8 — promessa da live e público do MargeX

Pedido do usuário: “queria uma parte da promessa da live o que vai entregar e com base no conteúdo que ele mandou colocar comunicação puxado pra quem é o margex”. Preservar as revisões1.5–1.7. Acrescentar uma seção editorial própria entre problema e demonstração, presente nas versões completa e curta.

- Promessa educacional: sair sabendo o que revisar antes de mudar o preço. Custos atualizados, limites de margem e condições da oferta orientam os ajustes; não prometer resultado financeiro ou posição no catálogo.
- Quatro entregas: conferir margem considerando produto/comissão/frete/impostos; avaliar concorrência além do menor preço com Full/prazo; analisar promoções e rebates explicados como incentivos de comissão; entender regras/limites do MargeX para revisão de muitos anúncios. Não inclui configuração individual de conta, materiais, suporte ou gravação.
- Hero preserva headline. Descrição conecta explicitamente revisão ao longo do mês; público: seller de produtos físicos no Mercado Livre, muitos anúncios/revisão frequente. Seção público aproxima comunicação do uso do MargeX: cálculo inicial insuficiente, planilhas/médias e promoções. Sem faturamento mínimo ou expansão da aula para Shopee.
- Layout preserva a marca: superfície verde-noite,4entregas em grade editorial2x2/uma coluna mobile, linhas sutis, CTA que usa o formulário existente. Programa detalhado continua em definição. Novos alvos de motion explícitos sem pai/filho duplicado; catálogo sticky e ancestrais intactos.
- Fonte: respostas escritas e proposta consolidadas no vault em14/11/2026. Áudios não transcritos não usados; nenhum churn, promessa de lucro/zero prejuízo ou oferta de plano acrescentado. Nenhum envio, publicação ou instalação.


## Revisão 1.7 — movimentos nos contêineres da página

Pedido direto do usuário: “coloca tbm animações em cada contener”. Acrescentar uma camada de entrada consistente nos capítulos existentes, preservando conteúdo1.6 e narrativa visual1.5. Esta revisão só altera motion em app.js/styles.css; não redesenha a página nem modifica catálogo, cálculos, formulário ou integrações.

- Entradas progressivas via Web Animations API: opacity e translateY16px/440ms desktop;8px/380ms mobile. Stagger55ms limitado165ms desktop e35ms limitado105ms mobile, uma vez ao entrar. Sem loops, parallax, escala, blur ou bibliotecas.
- Cobrir hero texto/foto, faixa de resultados, problema, introdução/apoios do catálogo, público, aprendizado/tabs, critérios/passos, professor/autoridade/timeline, dúvidas, fechamento e rodapé. Evitar alvos pai e filho duplicados.
- NUNCA aplicar transform/opacity de entrada ao catalog-scroll/catalog-sticky/catalog-panel/cards ou ancestrais desses elementos. Manter rolagem, estado e identidade da demonstração intactos.
- Estado data-motion-state pending/running/done para inspeção. Pending tem visibilidade normal: falha ou ausência do observer/JS não esconde conteúdo. Navegação por foco/hash revela alvos imediatamente; CTA da hero continua disponível desde o início.
- Reduced motion inicial ou alterado durante uso cancela animações de entrada/tabs/FAQ e mantém estados legíveis. Hover com lift2px/ícone apenas em ponteiro preciso, sem fingir que conteúdo informativo é clicável.
- Nenhum helper, instalação, publicação ou integração nesta rodada. Backup externo em Documents/Codex/2026-11-14/margex-live-backup-antes-1.7.


## Revisão 1.6 — conteúdo atualizado com o contexto MargeX de 14/11/2026

Prioridade desta revisão: incorporar os dados fornecidos pelo responsável ao projeto existente, preservando as decisões visuais e funcionais da revisão 1.5. Origem: usuário pediu “com todos os dados ... melhorar a página de vendas” e “deixa completo a página pra eu ver como é”. Nenhum redesign ou publicação nesta rodada.

- Problema central: revisão contínua, não apenas cálculo inicial. Produto/fornecedor, comissão, frete e impostos precisam estar atualizados; promoções e incentivos de comissão precisam caber nos limites da operação.
- Público: vendedores de produtos físicos no Mercado Livre com muitos anúncios, revisão manual/planilhas, médias antigas ou comparação com concorrentes. Sem corte arbitrário de faturamento.
- Três tabs preservadas e aprofundadas: custos atualizados; concorrentes/promoções; regras e revisão. Bloco de conexão reúne custos → limites de margem → oferta → revisão, com Full/frete/prazo como fatores além do menor preço. Bloco visível nas variantes completa e curta.
- FAQ distingue aula gratuita, assinatura e assessoria separadas. Não prometer gravação, diagnóstico individual incluso ou resultado financeiro. Data, horário, duração, plataforma e programa detalhado continuam pendentes.
- Preservar identidade, fotos, fontes locais, narrativa visual e exemplos do catálogo da 1.5. Sem alteração em catalog.js, pricing.js, app.js, formulário ou integrações. R$17milhões/mês permanece contextualizado somente na autoridade; preços do catálogo continuam exemplos e gratuidade da live permanece aprovada.
- Não usar churn3%, garantia de margem/prejuízo zero, lucro líquido, resultado causal ou biografia sem respaldo. Áudios ainda não transcritos não são fonte desta revisão.


## Revisão1.5 — alinhamento respondido pelo usuário

Esta seção prevalece sobre as versões anteriores. Usuário respondeu as9perguntas e autorizou execução: abertura comheadline+fotoAndrey; faturamento somenteR$17milhões/mês na região de autoridade/professor/provas; catálogo real comdesconto,FULL,fretegrátis; suaoferta começa última; MargeXanalisa margem/precificação/aplicacondições e oferta vai ao topo com10%demargem. Afirmou que a ferramenta realiza essas ações viaAPI. Movimento guiado pela ROLAGEM, não timer6s. Melhorar acabamento geral sem acrescentar explicações excessivas. Pediu gravação da prévia para avaliar antes da publicação jáautorizada.

### Narrativa do catálogo e dados
- Preservar cardsfotoemcima e percursos distintos:4colunasnotebook;2x2celular. Comparação de ofertas reconhecívelMercadoLivre, coresbranco/preçoescuro/descontoverde/FULL/fretegrátis, tipografiaMargeX.
- Concorrentes têm combinações variadas de desconto/FULL/fretegrátis; própriaoferta inicia4ª sem essas condições. Desconto,incentivos e posição aparecem progressivamente como açõesvisuaisdoMargeX. Não afirmar que a conta da prévia estáconectada ou que houvealteração real emum seller.
- Sequência deprogress0→1:0–.12leituraofertas; .12–.30análisecustos/margem; .30–.58ajustepreço+desconto; .45–.65condiçõesFULL/fretegrátis; .65–.85reposiciona4→1; .85–1sustentamargem10% e conclusão. Continuidades/saídas/expansões suaves; voltar arolagem reconstrói osestados anteriores.
- Todos números continuam VALORESDEEXEMPLO, inclusiveconcorrentes. Preçoreferênciainicial18990centavos; final15928; custo10000+fixo990+taxas2100bps, lucrofinal1593 e margemaprx10.001%=10.0%visível. Descontofinal16.1%. Não apresentar como preço atual ou margem real do produto. Atualizarpricing.js/HTML/docs/testes coerentemente.
- Margem visível no própriocard e resumo de análise. FULL/fretegrátis são estadosdoexemplo, não mudanças de API executadas duranteaprévia.

### Implementação por rolagem
- Seção comcontainersticky nativo dentrodeumtrecho de rolagem; sem hijacking, sem bloquear gestos ou atalhos. Oprogresso deriva daposição nessa seção, não deelapsedtime.
- Desktopboard<=alturaútil900px; mobileboard compacto2x2 comprodutos/preço/desconto/FULL/frete/margemlegíveis, paraacompanharoprópriocard sem rolar para painel separado. Cortar microtexto redundante, mantercontexto.
- Mediralturaboard e espaçoútil no resize, ajustarsticky/trecho; emtelasbaixasonde não caiba, não esconderresultado/controles. Fallback progresscontínuo natural sempinning se necessário. Observar320/390/768/1440 e390x667.
- Resize mantém relação deprogresso/estados e recalcula XY. owncardmobile pode seguirBezier; vizinhos cedemposição fluidamente. Conectoracompanhaidentidade.
- Controles adequados arolagem: 'Rever análise'/'Ver resultado' podem navegar até início/fim poraçãoexplícita, respeitando reducedmotion. Não mostrar botão'pausar'autoplay se não existirautoplay; pode haver 'Fixar análise' claroseforimplementado, sem travar página.
- Reducedmotion mostraresultadofinal completo e eliminatrechosvaziosderolagem. SemJS manterconteúdoscompreensíveis.

### Página e autoridade
- Aberturatemheadline+fotorealAndrey com entrada coordenada e CTAimediatodisponível. Não colocar faturamentonahero.
- Manterfunilaprovado, conteúdo maisespecífico jáescrito, tabsexplicativas/formulário. Polir escala, fotos, espaçamento, capítulos e transições; evitarenchercomefeitos.
- Professor/autoridade: atua2018, fundadorEcommerplace, dadofornecidoR$17milhões/mês nasoperaçõesemqueatua; não declarar como faturamentopessoal ouresultadoMarGeX. Reunirprova/regiãodecases no mesmo capítulo; sem inventardepoimentos oucaseaindanãorecebido. Nãoexibir200milhões/ano.
- Programa,data,horário,casestextuais,materiaisoriginais,qualificação/planilha/grupo continuam pendentes. Nãoinventar. Formulárioprévia semenvio.
- Gravar navegando a página real emnotebook ecelular, incluindohero/catálogo porrolagem/autoridade. Vídeos locais paraavaliação antesdopush/deploy; não usar montagem fingindo uma gravação real.

## Revisão1.4 — formato dos cards e adaptações confirmadas

Usuário esclareceu que deseja comparação de ofertas do catálogo e está falando do FORMATO dos quadrados, escolhendo explicitamente "Cards com foto em cima". Pediu animação própria para celular e notebook, e autorizou ao final subir no GitHub e Vercel.

- Substituir linhas horizontais por cards de produto semelhantes à vitrine do Mercado Livre: foto real no alto, nome abaixo, preço em destaque e desconto ao lado/abaixo. Fundo branco, bordas leves, raio8px; não são blocos abstratos ou uma tabela.
- Notebook>=900px:4cards lado a lado, com foto120–150px; oferta começa4ª àdireita e vai1ª àesquerda. As concorrentes cedem uma posição com movimento contínuo.
- Celular/tablet<900px:grade2x2, fotos80–112px; oferta começa embaixoàdireita e vai acimaàesquerda, demais cards reorganizam para posições2–4 sem saltos. Calcular coordenadasdeorigem/destino e interpolarX/Y por cartão; não aplicar floor de uma posiçãofracionária que salte nas quebrasdelinha. Manter identidade/preço/desconto/margem do mesmo card.
- Mudança de viewport preserva estado/timeline e recalcula coordenadas. Não duplicar animações correndo fora de sincronia por dispositivo. Os percursos diferentes atendem à adaptação solicitada.
- Dados/contexto do produto e rótulo "Valores de exemplo" presentes. Sua oferta contém uma margem compacta visível e correta durante todo ajuste/movimento. Sem preços reais inventados.
- Painel MargeX vira faixa de análise clara integrada ABAIXO ou ACIMA da grade, sem sidebar financeiro escuro dominante. Monograma original pode ficar em pequena cápsula verde-noite para contraste, e relação com oferta por destaque/conector discreto. Base de cálculo emdetails.
- Duração6s continua: leitura0–.7,análise.7–1.3,ajuste1.3–2.9,movimento2.9–3.6,final3.6–6. Movimento suave/contínuo; pausar/repetir/reducedmotion continuam sincronizados.
- Todos os demais conteúdos, formulário e movimentos explicativos da1.3 preservados. Esta revisão altera principalmente composição/traçado da demonstração.
- Publicação autorizada emGitHub+Vercel no final, apósQA. Novo repo privado e novo projeto, contasverificadas; não sobrescrever outrosprojetos. @devops prepara buildestático público isolado semdocs/logs/segredos/desenhos; branch/PR respeitados, sempushdireto main. Formulário continua declarado como prévia enquantointegração estiverpendente.

## Revisão1.3 — roteiro desenhado, autorizado para execução

### Ajuste solicitado durante a prévia1.3
Usuário pediu animação "mais fluida rápida e com o mesmo estilo de análise do Mercado Livre". Reduzir sequência de12s para aproximadamente6s:0–0.7reconhecer oferta;0.7–1.3análise;1.3–2.9ajuste de valores;2.9–3.6subida contínua em700ms;3.6–6resultado legível. Mesma timeline para números/linha/conector. Sem pausas artificiais entre estados, sembounce. A aparência da comparação deve se aproximar da interface de ofertas do Mercado Livre, em vez de painel financeiro genérico. Pergunta sobre tela exata (catálogo vsanálise preços) está pendente no momento deste registro.
No celular, manter margem compacta visível DENTRO da sua oferta durante o movimento; painel lateral empilhado não pode ser a única fonte da margem. Rótulo de valores de exemplo e cálculo coerente continuam obrigatórios. Estes ajustes preservam o escopo validado da story1.3.

Prioridade sobre as revisões anteriores. O usuário autorizou "pode ir fazendo" após salvar o roteiro em docs/roteiro-proxima-versao-2026-11-12.md. A versão1.2 não foi aprovada esteticamente. Refazer acabamento da página inteira e narrativa visual, não apenas acrescentar movimentos.

### Composição
- Evento editorial: hero verde-noite compacto, promessa forte em48–56px desktop, descrição18px, CTA56px. Retrato NATURAL com rosto íntegro, sem filtros/sobreposições. Sem recortes decorativos. Fonts/cores/logo originais preservados. Cabeçalho simples e navegação útil. Sem vazios excessivos nem cards repetidos em toda seção.
- A demonstração é a peça central, dentro de capítulo menta. Container até1120px, catálogo branco64% e painel MargeX36%, conectados visualmente. Fotos reais da caixa Tramontina fornecida, nome/catálogo. Painel lateral escuro com monograma ORIGINAL assets/margex-monogram.png extraído do manual, não redesenhar a logo. Margem e dinheiro com leitura clara. Nada inclinado.
- Quatro ofertas do MESMO produto: posição, foto64–80px, identificação, preço, desconto. Sua oferta começa por último. Concorrentes genéricos sem nomes de lojas inventados. Identificação Mercado Livre amarelo discreto somente no canal.
- Mobile catálogo acima e MX abaixo, conexão por destaque verde; campos e preços legíveis, sem overflow; controles44px. Não reduzir tudo a texto minúsculo.

### Dataset de exemplo, explicitamente identificado
Esta revisão permite valores FINANCEIROS DE EXEMPLO para demonstrar a análise; isso substitui a proibição de quaisquer preços da revisão1.2. Label discreta visível "Valores de exemplo", não usar o rótulo rejeitado "simulação ilustrativa". Não alegar que os valores são preços atuais, margens reais ou resultado de conta conectada.
- Produto Tramontina real, dados de precificação demonstrativos.
- Preço de referência189.90; sua oferta inicial189.90, desconto0%; final169.90, desconto calculado(189.90-preço)/189.90.
- Concorrentes fixos174.90/179.90/184.90, indicados no mesmo exemplo (não preços reais coletados).
- Custo do produto100.00; custo fixo/frete9.90; percentual agregado de taxas21% (15%comissão+6%tributos apenas como parâmetros de exemplo, não regras fiscais reais).
- Lucro por venda=preço*(1-0.21)-100-9.90. Margem=lucro/preço. Inicial40.12 e21.1%; final24.32 e14.3%. Arredondar apenas exibição. A margem DIMINUI e permanece positiva ao ajustar preço, não inventar aumento de lucro com preço menor.
- Mostrar base do cálculo em detalhes expansíveis no painel, termos compreensíveis, e nota de que os parâmetros finais serão validados com Andrey. Sem aconselhamento tributário.
- Dados declarativos em arquivo dedicado ou módulo puro e funções de cálculo testáveis. Não animar o termo indefinido "gamê".

### Timeline principal,11–12s
0–2s reconhecer catálogo/sua oferta em4º;2–4sMX destaca margem/custos com expansão suave;4–7s preço diminui e desconto aumenta progressivamente, margem atualiza coerentemente;7–9s oferta inteira vai4º→1º, concorrentes cedem espaço e conector acompanha;9–12s manter posição/margem positiva legível. Rótulos de etapa claros e descrição próxima ajudam a compreender. Pausa/replay sincronizam toda timeline, inclusive número/posição; reducedmotion mostra estado final completo. Iniciar quando20%visível, uma vez, pausar fora da aba; não sequestrar scroll. Nunca esconder dados essenciais até um vídeo acabar.

### Página completa e movimentos explicativos
Manter abertura, problema/impacto, demonstração, entregas, professor, provas pendentes ocultas, dúvidas, fechamento; acrescentar explicação para quem é a live e vínculo de cada conteúdo com situação real do seller. Textos diretos e contextualizados, sem inventar programa fechado/material/data/cases.
- Entradas: título/contexto/apoio sequenciados com CTA disponível. Seções com entrada curta e ritmo consistente.
- Saídas: crossfade entre estados explicativos e conteúdo de demonstração; não sumir textos de leitura quando se rola para trás.
- Containers: expansão da área de margem e movimentos da oferta contínuos, sem saltos de layout da página.
- Conteúdo da live: componente de3etapas selecionáveis (precificação/catálogo/decisão) com uma visualização e explicação correspondente. Funcional por clique e teclado, sem autoplay distraindo leitura. Transições suaves entre panes.
- Professor: foto natural, atuação desde2018, fundador Ecommerplace, demonstração em uso na live. Linha narrativa em3momentos usando somente fatos confirmados; não inventar datas/clientes/números/certificações. Entrada coordenada que explique por que a experiência se liga à aula.
- FAQ expansão animada de altura quando possível, com fallback acessível e reducedmotion. Não deslocar links ou ocultar conteúdo sem JS.
- Formulário existente preservado; só refinar transição de etapas, mantendo foco, progresso e teclado. Não enviar dados, não criar qualificação nem sucesso falso. Integrações ainda pendentes.
- Variantes completa/curta e formulário direto continuam disponíveis.

### Qualidade e entrega
Separar CSS legível por seções, JS de cálculo/timeline modular. Sem bibliotecas novas, sem build. Servidor allowlist deve incluir módulos novos públicos; CSP mantida sem serviços externos. Branch própria atual preservada, sem push/deploy.
Validar cálculo com checks significativos, browser320/390/768/1440, imagens/campos/preço/desconto/margem, timeline final e pause/replay/reducedmotion/viewport, tabs explicativas/FAQ/form/modal/página direta/curta. Atualizar pendências e relatório; estética continua sujeita à avaliação do usuário.

## Revisão visual 1.2 — prioridade sobre regras visuais anteriores

Usuário REJEITOU o estilo e a animação da versão 1: "muito feio e zoado", e exigiu animação de produtos do Mercado Livre. Esta revisão substitui a composição visual inicial e os blocos abstratos do catálogo.

- Produto escolhido pelo usuário: Caixa Para Ferramentas Tramontina Master Sanfonada 43800/005 Azul 5 Gavetas, catálogo MLB22367713, oferta MLB3897718148. Fonte https://www.mercadolivre.com.br/caixa-para-ferramentas-tramontina-master-sanfonada-43800005-azul-5-gavetas/p/MLB22367713 . Imagens reais locais assets/tramontina-caixa.webp e assets/tramontina-caixa-aberta.webp. Não usar mouse nem ilustrações de caixinhas.
- Hero simplificado: 58% texto /42% professor; título 48–54px desktop e 34–38px mobile; altura compacta sem vazios excessivos. Foto do Andrey NATURAL, sem filtro verde ou grayscale, sem painel cobrindo rosto, sem órbitas ou texto vertical decorativo. Retrato de 380–420px desktop e até300px mobile, enquadrado como imagem real em área própria; preservar asset e aguardar original sem fundo futuramente. Identificação abaixo.
- Animação em seção própria logo após o hero, visível parcialmente na primeira dobra desktop. Fundo menta #DCEDE3, texto floresta #122B21, painel branco, largura1040–1120px. Cabeçalho com faixa AMARELA discreta de identificação Mercado Livre (terceiro), palavra em texto sem inventar logo. Assinatura MargeX separada. NÃO inclinar painel, NÃO usar blur/perspectiva/overlap.
- Mostrar produto com foto grande e nome, depois quatro ofertas horizontais de80–88px desktop e imagem72–88px. Mesmo produto repetido para representar competição dentro do catálogo; etiquetas 'Oferta concorrente' e 'Sua oferta'. Não inventar nomes de lojas, preços, avaliações, números de vendas ou métricas financeiras. Não usar cópia de uma tela privada.
- Sequência 7–9s: produto contextualizado; sua oferta em4º; destaque análise de custos/margem/concorrência em faixa separada; então movimento FLIP/transform da oferta inteira4º→1º em600–800ms com as demais descendo. Legibilidade antes da velocidade. Manter posição final; replay/pausa e reduced-motion preservados. Não mostrar 'simulação ilustrativa', conforme correção explícita do usuário.
- Restante da página deve ser refinado junto: ritmo de superfícies escuras e menta, menos molduras e texto miúdo, hierarquia editorial, CTA verde; sem gradientes/luzes excessivos. Não mudar promessa/conteúdo aprovado ao refazer visual.
- Mobile: hero mais compacto, foto sem sobreposição, ofertas com foto56px e título em2linhas, painel sem overflow. Formulário e fluxos aprovados permanecem.
- Validar visual antes de entregar, inclusive 320/390/1440; o resultado técnico anterior não equivale a aprovação estética.

## Escopo
Construir localmente a página da live gratuita. Sem publicar, sem instalar dependências. HTML/CSS/JS vanilla modular, servidor estático Node sem dependências. Página principal em index.html, variante curta por ?versao=curta, /formulario.html para acesso direto ao mesmo componente de formulário. A variante paga permanece pendente e não faz parte da implementação atual.

## Direção visual
Industrial/utilitária refinada com hierarquia editorial, identidade Cofre do manual. Fundo #071711, superfície #0D2419, profundo #04110B, borda #1B3A2B, texto #EAF7EF, secundário #8CAE9B, sinal #16D289. Logo usa verde #1D9E75. Sora títulos, Figtree corpo, JetBrains Mono dados (fontes locais quando disponíveis; fallback legível). Não redesenhar logo: usar logo original extraída do manual em assets/margex-logo.png se disponível; texto alternativo neutro caso não esteja. Layout assimétrico com respiro, linhas finas, tipografia expressiva mas sóbria, sem encher página com cards genéricos.

## Hero
Cabeçalho com logo, links para conteúdo/professor, CTA de inscrição. Hero em grid: à esquerda etiqueta LIVE GRATUITA / MERCADO LIVRE, título: 'Você vende. Mas sabe onde o seu lucro está ficando?' Destaque verde em lucro. Parágrafo: 'Aprenda com Andrey a analisar sua operação no Mercado Livre, precificar com mais clareza e disputar o catálogo com decisões baseadas em dados.' CTA 'Quero participar da live gratuita'. Microtexto 'Ao vivo, com o MargeX em ação.' Data e horário não definidos: discreto 'Data e horário em definição', sem data inventada.

À direita composição retrato real do Andrey se asset disponível + painel de análise do catálogo flutuando na frente/base. Nunca usar pessoa gerada ou banco como se fosse ele. Foto é provisória da própria página dele, substituir pelo arquivo enviado. Nome, 'Seu professor', 'No mercado desde 2018'. Se foto indisponível, reserva intencional e clara, sem avatar fake.

## Animação assinatura
Painel autoral estilizado de catálogo do Mercado Livre. Quatro posições, produto principal inicialmente em 4º e subindo a 1º após 'Analisando custos', 'Comparando concorrentes', 'Ajustando estratégia'. Animação de 7–9s coordenada com transform/opacity; produtos genéricos e dados numéricos omitidos ou neutros para não fingir métricas reais. Usuário confirmou que a função é real: NÃO exibir 'simulação ilustrativa'. Ainda assim não prometer liderança garantida nem conectar realmente contas/API. Resultado visual 'Mais clareza para disputar o catálogo' ou 'Análise concluída'. Botão pausa/retomar e repetir; reduced motion estático em estado final. Não reiniciar infinitamente de forma irritante: uma execução e replay. Mobile leve.

## Conteúdo
1. Hero.
2. Faixa sintética: 'Precificação com margem / Concorrência no radar / Decisões mais rápidas'.
3. Problema, layout editorial com 3 linhas enumeradas: preço sem custo completo; concorrência sem contexto; decisões tardias. Não afirmar que todo seller tem as três causas. Texto como questões reconhecíveis.
4. Abordagem/demonstração: 'Antes de mexer no preço, enxergue a operação.' painel autoral com custo → margem → concorrência → decisão, sem números inventados.
5. Entregas 'Uma live para olhar sua operação de outro jeito.' Três frentes aprovadas: entender precificação, analisar concorrência/catálogo, agir com dados. Não inventar programa fechado; espaço final 'Programação detalhada em definição'.
6. Professor: Andrey, atuação desde 2018, Ecommerplace. Não publicar números 17M/200M sem confirmar abrangência; manter no arquivo PENDENCIAS.md. Foto real. Texto de experiência só com fatos fornecidos.
7. Cases reservados em comentário/slot oculto (não expor depoimentos fictícios). Identificar no painel editorial que estão pendentes.
8. FAQ com 3 respostas confirmadas: gratuita, MargeX usado durante live, grupo de WhatsApp após inscrição (link pendente). Data/gravação/respostas desconhecidas não inventar.
9. Fechamento CTA e rodapé limpo. Sem CNPJ/links legais falsos. Privacidade ainda pendente em config/painel de preparação.

## Formulário
Dialog acessível via CTA, uma pergunta por vez, progresso, voltar/avançar, enter, escape, foco preso e restaurado, erros específicos, labels reais. Formulário inicial PROVISÓRIO apenas nome, email, WhatsApp: esses campos são proposta de UX, não qualificação aprovada. Config declarativa para campos, endpoints, grupo. Não adicionar faturamento/pontuação arbitrários. Área discreta 'Prévia do formulário. Perguntas finais em definição.' Sem gravar dados pessoais localStorage, sem analytics externo e sem enviar a qualquer serviço. Enquanto endpoint vazio, no final informar explicitamente 'Prévia concluída. A inscrição será liberada após a conexão com a planilha.' NÃO dizer inscrição confirmada e NÃO simular envio. Não limpar respostas na falha nem abrir WhatsApp antes de confirmação. Endpoint real futuro exige contrato JSON verificável de sucesso. Não implementar backend/Apps Script em produção nesta fase.

Botão móvel fixo 'Participar gratuitamente'; não sobrepor rodapé/dialog. Variante curta reduz explicações mas mantém hero, entregas, professor, FAQ e CTA. Ferramenta discreta de revisão no canto/rodapé com 'Versão completa / Versão curta' e pendências, sem frases técnicas no fluxo normal de aquisição além do estado de prévia necessário.

## Validação
Desktop 1440x900 e mobile 390x844 e 320px: sem overflow, CTAs e dialog utilizáveis, formulário com validação e teclado, redução de movimento, animação completa/replay, página direta e variante curta. node --check scripts, servidor HTTP 200, console sem erros próprios. Não instalar packages sem npm view e aprovação; não é necessário para este escopo.
