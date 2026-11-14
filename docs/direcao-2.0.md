# MargeX Live — direção2.0 implementada para avaliação

Data:14/11/2026. Status: implementação autorizada e prévia disponível para QA. A validação estética continua com o usuário.

## Decisões confirmadas

Usuário respondeu40perguntas e confirmou paleta MargeX verde-noite/verde/branco, retirando grandes fundos verde-claros. Confirmou R$17milhões/mês com o contexto anterior. Preferência posterior: número moderado abaixo do retrato na abertura, separado da promessa; professor contextualiza a experiência em texto, sem repetir um número gigante.

Mobile é a prioridade, com desktop completo. Preservar a força da hero, foto real dominante, títulos grandes, respiro e blocos abertos. Abaixo dela o pedido foi por um redesenho de composição e narrativa, não somente uma troca de cor.

## Cinco recomendações aplicadas

1. Estender a força da abertura ao restante da página: superfícies escuras contínuas, tipografia local e contraste legível.
2. Mostrar consequência antes da solução: novo capítulo conectando venda, margem, caixa e reposição, além de tempo e oportunidades como possibilidades operacionais.
3. Explicar com imagens e movimento: diagramas HTML/SVG originais, traços ligados à rolagem e etapas destacadas. O catálogo com produto real continua sendo a demonstração central.
4. Dar forma própria a cada capítulo: entregas abertas, dois momentos de público, conteúdo narrativo, experiência real, FAQ numerado e convite final com roteiro de participação.
5. Falar como Andrey: primeira pessoa, direta e didática, para quem começou a vender e quem já tem operação, sem promessas de faturamento/ranking/tempo não comprovadas.

## Conceito

A operação muda. A decisão precisa acompanhar.
A energia vem da composição, contraste e transformações explicativas. Não há partículas, luzes em excesso, parallax forte ou loops decorativos.

Verde-noite é a base; superfícies de apoio continuam escuras. Branco claro fica nos textos e nos cards localizados do catálogo. Verde de marca destaca decisões, conexões e CTAs.
Princípio: hierarquia por contraste e destaque seletivo, sem colocar todos os elementos na mesma intensidade.

Sora expressa títulos, Figtree sustenta leitura e JetBrains Mono serve aos dados/rótulos, todas locais.
Títulos com quebras intencionais; corpo mobile16–18px; apoio sem usar texto essencial em tamanho minúsculo.
Princípio: fluência e agrupamento. Espaço separa capítulos; proximidade mantém texto e visual da mesma ideia conectados.

## Wireflow realizado

| Ordem | Função | Composição |
| --- | --- | --- |
| Abertura | Interesse e proposta imediata | Headline preservada, fala de Andrey, foto recortada real e CTA.17M contextual abaixo da imagem. |
| Problema | Reconhecer o cálculo que ficou parado | Texto forte e visual comparando preço fixo com mudanças de produto/frete/taxas/promoções. |
| Impacto | Mostrar possíveis consequências | Fluxo venda→margem→caixa→reposição e ponte sobre tempo/oportunidades. Sem números de perdas inventados. |
| Promessa | Explicitar aprendizado | Quatro entregas editoriais abertas e próximo passo claro. |
| Solução | Mostrar a relação dos ajustes | Faixa de benefícios e catálogo original com cards/produto real, matemática e rolagem preservados. |
| Público | Reconhecer momentos de operação | Começando a estruturar e já operando com mix/anúncios. Sem corte de faturamento. |
| Conteúdo | Entender o que acompanhar | Três capítulos narrativos com conta, condições da oferta e regras. Substituem as tabs rejeitadas. |
| Experiência | Dar contexto à condução | Retrato real, atuação desde2018, fundador Ecommerplace e autoridade contextualizada em texto. |
| FAQ | Resolver incertezas | Perguntas numeradas grandes e respostas com contraste alto; sem grandes painéis claros. |
| Inscrição | Concluir a história | Convite forte, CTA, roteiro e aviso honesto de prévia sem envio. |

A faixa de benefícios introduz a solução após problema/impacto/promessa. Não há alternância de grandes fundos menta.
O roteiro permanece inteiro na variante curta: evitar remover a lógica central enquanto o novo fluxo é avaliado.

## Cenas e motion

| Cena | Explicação | Movimento |
| --- | --- | --- |
| Preço fixo | Custos e condições mudam após a primeira conta. | Traços de cada variável acompanham a posição da cena na viewport. |
| Impacto | Venda não explica sozinha o que retorna ao caixa e estoque. | Linha de relação e destaque sequencial dos nós. |
| Conta | Preço menos custos/taxas chega ao resultado da venda. | Linha da conta desenhada; resultado destacado. Não confundir valor com percentual de margem. |
| Oferta | Preço, prazo e frete compõem o contexto. | Ramos SVG convergem para uma decisão com contexto. |
| Regras | Atualizar→limitar→avaliar→revisar. | Etapa ativa acompanha a rolagem. |
| Catálogo | Ajuste de exemplo altera desconto, margem e posição. | Motor original guiado pela rolagem, sem alteração de core. |

Um requestAnimationFrame atende os movimentos editoriais ligados à rolagem. Retângulos são lidos em lote e estilos escritos depois. Não há loop RAF permanente: o frame é agendado por scroll/resize/load.
Divisores de capítulo desenham com scaleX no pseudo-elemento, sem transformar o capítulo ou ancestrais do sticky.
Traços SVG usam dashoffset conforme progresso; não recebem uma segunda animação WAAPI concorrente.
Atenção curta uma vez e entradas discretas complementam o movimento, sem substituir a explicação.

Reduced motion inicial/runtime cancela animações e RAF e apresenta diagramas completos. SemJS, texto/diagramas editoriais permanecem estáticos e legíveis; a interação do catálogo e o formulário dependem deJS.
Foco/âncoras revelam o conteúdo imediatamente; nenhum CTA exige assistir à animação. Scroll nativo, sem hijack, sem autoplay de ranking e sem loops decorativos.
Princípio: continuidade sem perda de controle. O visitante conserva navegação e leitura enquanto o movimento esclarece relações.

## Foto e autoridade

Asset `assets/andrey-recorte-v2.png`, criado a partir da foto real pelo root e documentado em `docs/foto-recortada-v2.md` e `assets/SOURCES.md`. Original preservado. Sem fundo amarelo, moldura brilhante ou pessoa fictícia.

R$17milhões/mês é receita nas operações em que Andrey atua, conforme informação confirmada pelo usuário. Não é faturamento pessoal ou resultado do MargeX. O número fica na legenda da foto da hero; no professor, entra em contexto de experiência. Não aparece como promessa noH1.

## Voz e limites

“Eu vou te mostrar o que revisar” descreve uma aula. “Vou colocar sua operação no topo” seria outra promessa e não foi usada.
Não afirmar que todos os maiores sellers usam, que há primeiro lugar garantido,30segundos ou uma semana reduzida a5minutos. Não anunciar churn, lucro líquido ou prejuízo zero.
Não criar depoimentos, casos, ganhos ou perdas fictícios. Diagrama de impacto representa possibilidades, não diagnóstico universal.

Quem começou a vender e quem já opera são contextos operacionais, não personas demográficas inventadas. A aula segue no Mercado Livre e não vira formação genérica sobre abertura de conta/primeira venda.
Testar MargeX e buscar ajuda são possíveis próximos passos, separados da inscrição. Assinatura e assessoria não estão incluídas na aula.

## Ainda pendente

Data, horário, duração, plataforma, gravação, materiais, programa final, cases autorizados e integrações reais. Formulário permanece demonstrativo; não envia/guarda dados permanentemente nem confirma inscrição.
A nova aparência é uma prévia para avaliação humana; QA técnico não comprova aprovação estética.

## Avaliação

Conferir composição mobile/desktop, leitura da história, legibilidade, CTA, formulário, catálogo reversível, diagramas com movimento normal/reduzido e falhas semJS/observer.
Como hipóteses futuras: avanço entre capítulos, abertura do formulário por público adequado, presença na aula e interesse em teste/ajuda. Nenhuma projeção de melhoria ou experimento foi implementado.

Não houve instalação, servidor extra, push, deploy ou integração executada pelo developer nesta revisão. Backup pré2.0 fora do repositório. Core catálogo,pricing,form,config e docs/DEPLOY preservados.
