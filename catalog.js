'use strict';
(() => {
  const demo = document.getElementById('catalog-panel');
  const pricing = window.MargeXPricing;
  if (!demo || !pricing) return;
  const area = document.getElementById('catalog-scroll');
  const scope = demo.closest('.catalog-section') || demo;
  const list = demo.querySelector('.catalog-list');
  const rows = Array.from(demo.querySelectorAll('[data-catalog-row]'));
  const connector = demo.querySelector('.workspace-connector');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const { DATA, calculateOffer, priceAtProgress } = pricing;
  const moneyFormat = new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' });
  const percent = new Intl.NumberFormat('pt-BR', { style:'percent', minimumFractionDigits:1, maximumFractionDigits:1 });
  const money = cents => moneyFormat.format(cents / 100);
  const clamp = value => Math.max(0, Math.min(1, value));
  const ease = value => value * value * (3 - 2 * value);
  const segment = (value, from, to) => ease(clamp((value - from) / (to - from)));
  const numbers = {
    price:scope.querySelectorAll('[data-own-price]'), discount:scope.querySelectorAll('[data-own-discount]'),
    margin:scope.querySelectorAll('[data-own-margin]'), profit:scope.querySelectorAll('[data-own-profit]'),
    fees:scope.querySelectorAll('[data-own-fees]')
  };
  const status = document.getElementById('analysis-status');
  const checkpoints = Array.from(demo.querySelectorAll('[data-analysis-step]'));
  let progress = 0;
  let lastPrice = null;
  let lastStage = -1;
  let layout = null;
  let startY = 0;
  let range = 1;
  let pinned = false;
  let scrollFrame = null;
  let measureFrame = null;
  let preserveOnMeasure = false;
  let manualOverride = null;
  rows.slice(0,3).forEach((row,index) => {
    row.querySelector('[data-offer-price]').textContent = money(DATA.competitorsCents[index]);
    row.querySelector('[data-offer-discount]').textContent = `${percent.format((DATA.referencePriceCents - DATA.competitorsCents[index]) / DATA.referencePriceCents)} OFF`;
  });
  function updateNumbers(cents) {
    if (lastPrice === cents) return;
    lastPrice = cents;
    const offer = calculateOffer(cents);
    const values = { price:money(cents), discount:`${percent.format(offer.discountRate)} OFF`, margin:percent.format(offer.marginRate), profit:money(offer.profitCents), fees:money(offer.feesCents) };
    Object.entries(numbers).forEach(([key,nodes]) => nodes.forEach(node => { node.textContent = values[key]; }));
    Object.assign(demo.dataset, { priceCents:String(cents), profitCents:String(offer.profitCents), margin:String(offer.marginRate), discount:String(offer.discountRate) });
  }
  function slotCoordinates(slot) {
    return { x:(slot % layout.columns) * (layout.cardWidth + layout.gap), y:Math.floor(slot / layout.columns) * (layout.cardHeight + layout.gap) };
  }
  function render(value) {
    progress = clamp(value);
    const priceProgress = segment(progress,.30,.58);
    const move = segment(progress,.65,.85);
    updateNumbers(priceAtProgress(priceProgress));
    const logical = rows.map((_,index) => index === 3 ? 3 * (1 - move) : index + move);
    const ranking = logical.map((position,index) => ({ position,index })).sort((a,b) => a.position-b.position);
    if (layout) rows.forEach((row,index) => {
      const origin = slotCoordinates(index);
      const destination = slotCoordinates(index === 3 ? 0 : index + 1);
      let x = origin.x + (destination.x-origin.x) * move;
      let y = origin.y + (destination.y-origin.y) * move;
      if (layout.columns === 2 && index === 3) {
        const inverse = 1-move;
        x = inverse*inverse*origin.x + 2*inverse*move*origin.x + move*move*destination.x;
        y = inverse*inverse*origin.y + 2*inverse*move*destination.y + move*move*destination.y;
      } else if (layout.columns === 4) y -= Math.sin(move*Math.PI)*4;
      row.style.transform = `translate3d(${x.toFixed(3)}px,${y.toFixed(3)}px,0)`;
      row.dataset.x = x.toFixed(3); row.dataset.y = y.toFixed(3);
      row.querySelector('.rank').textContent = String(ranking.findIndex(item => item.index === index)+1).padStart(2,'0');
      if (index === 3 && connector) connector.style.transform = `translate3d(${(x+layout.cardWidth/2-10).toFixed(3)}px,${(y+layout.cardHeight-10).toFixed(3)}px,0)`;
    });
    const full = segment(progress,.45,.55);
    const free = segment(progress,.55,.65);
    [[demo.querySelector('[data-own-full]'),full],[demo.querySelector('[data-own-free]'),free]].forEach(([node,opacity]) => {
      node.style.opacity = opacity.toFixed(4);
      node.style.transform = `translateY(${(3*(1-opacity)).toFixed(2)}px)`;
      node.setAttribute('aria-hidden',String(opacity < .05));
    });
    numbers.discount.forEach(node => { node.style.opacity = segment(progress,.30,.36).toFixed(4); });
    const stage = progress < .12 ? 0 : progress < .30 ? 1 : progress < .65 ? 2 : progress < .85 ? 3 : 4;
    if (stage !== lastStage) {
      lastStage = stage;
      status.textContent = ['Sua oferta começa na última posição','MargeX analisa custos e margem','Preço e condições, com a margem à vista','Sua oferta avança no catálogo','Primeira posição · margem de 10% no exemplo'][stage];
      checkpoints.forEach((node,index) => { node.classList.toggle('is-active',index === Math.min(stage,3)); node.classList.toggle('is-done',index < stage); });
      demo.dataset.stage = String(stage);
      demo.classList.toggle('is-finished',stage === 4);
    }
    demo.dataset.progress = progress.toFixed(5);
    demo.dataset.full = String(full === 1); demo.dataset.freeShipping = String(free === 1);
    demo.style.setProperty('--timeline-progress',`${progress*100}%`);
  }

  function readScroll() {
    if (reduced.matches) render(1);
    else render(manualOverride === null ? (window.scrollY-startY)/range : manualOverride);
  }
  function scheduleScroll() {
    if (scrollFrame !== null) return;
    scrollFrame = requestAnimationFrame(() => { scrollFrame = null; readScroll(); });
  }
  function measure(preserve) {
    const oldProgress = progress;
    const oldRect = demo.getBoundingClientRect();
    const wasActive = oldProgress > 0 && oldProgress < 1 && oldRect.bottom > 0 && oldRect.top < window.innerHeight;
    const styles = getComputedStyle(list);
    const columns = window.matchMedia('(min-width:900px)').matches ? 4 : 2;
    const gap = parseFloat(styles.getPropertyValue('--cards-gap')) || 12;
    const cardHeight = parseFloat(styles.getPropertyValue('--card-height')) || 200;
    const cardWidth = (list.clientWidth-(columns-1)*gap)/columns;
    if (cardWidth <= 0) return;
    layout = { columns,gap,cardHeight,cardWidth };
    list.style.height = `${Math.ceil(rows.length/columns)*cardHeight+(Math.ceil(rows.length/columns)-1)*gap}px`;
    rows.forEach(row => { row.style.width = `${cardWidth}px`; row.style.height = `${cardHeight}px`; });
    demo.dataset.columns = String(columns);
    render(oldProgress);
    const mobile = window.matchMedia('(max-width:600px)').matches;
    const top = mobile ? 8 : 12;
    const available = window.innerHeight-top-(mobile ? 84 : 16);
    const boardHeight = Math.ceil(demo.getBoundingClientRect().height);
    pinned = !reduced.matches && boardHeight <= available;
    area.classList.toggle('is-pinned',pinned);
    area.classList.toggle('is-flow',!pinned);
    area.style.setProperty('--sticky-top',`${top}px`);
    const absoluteTop = area.getBoundingClientRect().top+window.scrollY;
    if (pinned) {
      range = Math.round(Math.max(850,Math.min(1400,window.innerHeight*1.35)));
      startY = absoluteTop-top;
      area.style.height = `${boardHeight+range}px`;
    } else {
      area.style.height = 'auto';
      startY = absoluteTop-window.innerHeight*.25;
      range = Math.max(1,boardHeight-window.innerHeight*.1);
    }
    area.dataset.start = startY.toFixed(3);
    area.dataset.range = range.toFixed(3);
    area.dataset.boardHeight = String(boardHeight);
    demo.dataset.mode = reduced.matches ? 'reduced' : pinned ? 'pinned' : 'flow';
    if (reduced.matches) { manualOverride = null; render(1); }
    else if (preserve && wasActive) {
      if (pinned) { manualOverride = null; window.scrollTo({ top:startY+oldProgress*range, behavior:'instant' }); }
      else manualOverride = oldProgress;
      render(oldProgress);
    } else readScroll();
  }
  function scheduleMeasure(preserve = false) {
    preserveOnMeasure = preserveOnMeasure || preserve;
    if (measureFrame !== null) return;
    measureFrame = requestAnimationFrame(() => {
      const preserveState = preserveOnMeasure;
      measureFrame = null; preserveOnMeasure = false; measure(preserveState);
    });
  }
  function navigateTo(value) {
    if (reduced.matches) {
      render(1); demo.scrollIntoView({ behavior:'auto',block:'start' }); return;
    }
    if (pinned) {
      manualOverride = null;
      window.scrollTo({ top:startY+range*value,behavior:'smooth' });
    } else {
      manualOverride = value;
      render(value);
      rows[3].scrollIntoView({ behavior:'smooth',block:'center' });
    }
  }
  document.getElementById('analysis-review').addEventListener('click',() => navigateTo(0));
  document.getElementById('analysis-result').addEventListener('click',() => navigateTo(1));
  const resumeScroll = () => { if (manualOverride !== null) { manualOverride = null; scheduleScroll(); } };
  window.addEventListener('wheel',resumeScroll,{ passive:true });
  window.addEventListener('touchstart',resumeScroll,{ passive:true });
  window.addEventListener('keydown',event => { if (['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key) && !['INPUT','TEXTAREA'].includes(event.target.tagName)) resumeScroll(); });
  window.addEventListener('scroll',scheduleScroll,{ passive:true });
  window.addEventListener('resize',() => scheduleMeasure(true));
  reduced.addEventListener('change',() => { manualOverride = null; scheduleMeasure(false); });
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(() => scheduleMeasure(false));
    observer.observe(list);
  }
  if (document.fonts?.ready) document.fonts.ready.then(() => scheduleMeasure(false));
  measure(false);
})();
