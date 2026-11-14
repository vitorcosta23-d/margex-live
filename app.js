'use strict';
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const short = new URLSearchParams(window.location.search).get('versao') === 'curta';
  document.body.classList.toggle('short-version', short);
  document.querySelectorAll('.brand img').forEach(img => {
    img.addEventListener('error', () => { img.hidden = true; if (img.nextElementSibling) img.nextElementSibling.hidden = false; }, { once: true });
  });

  // Only editorial elements: never the catalog's pinned board, cards or ancestors.
  const motionSelectors = [
    '.hero h1', '.hero-description', '.hero-audience', '.hero-portrait', '.portrait-caption', '.portrait-authority',
    '.chapter-copy > .eyebrow', '.chapter-copy > h2', '.chapter-copy > p', '.cost-scene',
    '.impact-heading > .eyebrow', '.impact-heading > h2', '.impact-heading > p', '.impact-node', '.impact-after',
    '.promise-heading > .eyebrow', '.promise-heading > h2', '.promise-heading > p',
    '.promise-deliverables > article', '.promise-footer > p', '.promise-footer > .button',
    '.solution-band > span', '.catalog-intro .eyebrow', '.catalog-intro h2', '.catalog-intro > p', '.example-label', '.scroll-instruction',
    '#calculation-mount', '.demo-takeaway', '.audience-heading > .eyebrow', '.audience-heading > h2', '.audience-heading > p', '.audience-scenarios > article',
    '.learning-heading > .eyebrow', '.learning-heading > h2', '.learning-heading > p',
    '.lesson-copy > .lesson-number', '.lesson-copy > h3', '.lesson-copy > p',
    '.calculation-scene', '.offer-scene', '.rules-scene', '.learning-footer',
    '.teacher-photo > img', '.teacher-photo > figcaption', '.teacher-copy > .eyebrow', '.teacher-copy > h2', '.teacher-description', '.teacher-authority',
    '.teacher-perspective', '.teacher-facts > span', '.faq-heading > .eyebrow', '.faq-heading > h2', '.faq-heading > p', '.faq-prompt', '.faq-list > details',
    '.closing-copy > .eyebrow', '.closing-copy > h2', '.closing-copy > p', '.closing-copy > .button',
    '.closing-meta', '.signup-route > .route-title', '.signup-route li', '.route-preview',
    '.site-footer > .brand', '.site-footer > span', '.site-footer > .review-panel'
  ];
  const targets = Array.from(document.querySelectorAll(motionSelectors.join(',')));
  const scenes = Array.from(document.querySelectorAll('[data-scene]'));
  // Wrap text nodes only: existing emphasis, line breaks and whitespace stay intact.
  // Spans remain regular readable text, with no duplicate aria-label or hidden copy.
  targets.filter(element => element.matches('h1,h2,h3')).forEach(heading => {
    const walker=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT);
    const textNodes=[];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach(node => {
      const fragment=document.createDocumentFragment();
      node.textContent.split(/(\s+)/u).forEach(token => {
        if (!token) return;
        if (/^\s+$/u.test(token)) fragment.append(document.createTextNode(token));
        else {
          const word=document.createElement('span');
          word.className='motion-word'; word.textContent=token;
          fragment.append(word);
        }
      });
      node.replaceWith(fragment);
    });
    heading.dataset.motionKind='words';
  });
  targets.filter(element => element.matches('.hero-portrait,.teacher-photo > img')).forEach(image => { image.dataset.motionKind='photo'; });

  const animations = new Map();
  const sceneAnimations = new Map();
  const easing = 'cubic-bezier(.22,1,.36,1)';
  let observer = null;
  let sceneObserver = null;
  targets.forEach(element => { element.dataset.motionState = 'pending'; });
  scenes.forEach(scene => { scene.dataset.sceneState = 'pending'; });

  function finishMotion(element) {
    observer?.unobserve(element);
    (animations.get(element) || []).forEach(animation => animation.cancel());
    animations.delete(element);
    element.dataset.motionState = 'done';
  }
  function finishScene(scene) {
    sceneObserver?.unobserve(scene);
    (sceneAnimations.get(scene) || []).forEach(animation => animation.cancel());
    sceneAnimations.delete(scene);
    scene.dataset.sceneState = 'done';
  }
  function enterMotion(element, index) {
    if (element.dataset.motionState !== 'pending') return;
    observer?.unobserve(element);
    if (reduced.matches || typeof element.animate !== 'function' || element.contains(document.activeElement)) { finishMotion(element); return; }
    const mobile = window.matchMedia('(max-width: 899px)').matches;
    try {
      element.dataset.motionState = 'running';
      const running=[];
      if (element.dataset.motionKind === 'words') {
        const words=Array.from(element.querySelectorAll('.motion-word'));
        words.forEach((word,wordIndex) => {
          running.push(word.animate([
            { opacity:0, transform:`translateY(${mobile ? 14 : 20}px)` },
            { opacity:1, transform:'translateY(0)' }
          ], { duration:mobile ? 420 : 480,delay:Math.min(wordIndex*(mobile ? 30 : 38),mobile ? 180 : 228),easing,fill:'backwards' }));
        });
      } else if (element.dataset.motionKind === 'photo') {
        running.push(element.animate([
          { opacity:0,transform:'translateY(24px) scale(1.025)' },
          { opacity:1,transform:'translateY(0) scale(1)' }
        ], { duration:560,delay:60,easing,fill:'backwards' }));
      } else {
        running.push(element.animate([
          { opacity:.12,transform:`translateY(${mobile ? 10 : 16}px)` },
          { opacity:1,transform:'translateY(0)' }
        ], { duration:mobile ? 400 : 460,delay:Math.min(index*(mobile ? 25 : 35),mobile ? 75 : 105),easing,fill:'backwards' }));
      }
      animations.set(element,running);
      Promise.allSettled(running.map(animation => animation.finished)).then(() => {
        if (element.dataset.motionState === 'running') finishMotion(element);
      });
    } catch { finishMotion(element); }
  }
  function enterScene(scene) {
    if (scene.dataset.sceneState !== 'pending') return;
    sceneObserver?.unobserve(scene);
    if (reduced.matches || typeof scene.animate !== 'function') { finishScene(scene); return; }
    scene.dataset.sceneState = 'running';
    const running = [];
    try {
      const attention = scene.querySelectorAll('.cost-row > b, .node-mark, .calculation-item.result, .offer-factors > div, .rule-node');
      attention.forEach((element,index) => {
        const animation = element.animate([
          { opacity: .45, transform:'translateY(3px)' },
          { opacity: 1, transform:'translateY(0)', offset:.65 },
          { opacity: 1, transform:'translateY(0)' }
        ], { duration:650,delay:index*110,easing,fill:'backwards' });
        running.push(animation);
      });
      sceneAnimations.set(scene,running);
      if (!running.length) { finishScene(scene); return; }
      Promise.allSettled(running.map(animation => animation.finished)).then(() => {
        if (scene.dataset.sceneState === 'running') finishScene(scene);
      });
    } catch { sceneAnimations.set(scene,running); finishScene(scene); }
  }
  function revealTarget(target) {
    if (!(target instanceof Element)) return;
    targets.forEach(element => { if (element === target || element.contains(target) || target.contains(element)) finishMotion(element); });
    scenes.forEach(scene => { if (scene === target || scene.contains(target) || target.contains(scene)) finishScene(scene); });
  }
  function revealHash() {
    if (!window.location.hash) return;
    try { revealTarget(document.getElementById(decodeURIComponent(window.location.hash.slice(1)))); } catch { /* Preserve native navigation. */ }
  }
  if (!reduced.matches && 'IntersectionObserver' in window) {
    try {
      observer = new IntersectionObserver(entries => {
        const entering = entries.filter(entry => entry.isIntersecting);
        entering.sort((a,b) => targets.indexOf(a.target) - targets.indexOf(b.target));
        entering.forEach((entry,index) => enterMotion(entry.target,index));
        entries.forEach(entry => { if (!entry.isIntersecting && entry.boundingClientRect.bottom < 0) finishMotion(entry.target); });
      }, { threshold:.06,rootMargin:'0px 0px -20px 0px' });
      targets.forEach(element => observer.observe(element));
      sceneObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) enterScene(entry.target);
          else if (entry.boundingClientRect.bottom < 0) finishScene(entry.target);
        });
      }, { threshold:.2,rootMargin:'0px 0px -20px 0px' });
      scenes.forEach(scene => sceneObserver.observe(scene));
    } catch { targets.forEach(finishMotion); scenes.forEach(finishScene); }
  } else { targets.forEach(finishMotion); scenes.forEach(finishScene); }
  document.addEventListener('focusin',event => revealTarget(event.target));
  document.addEventListener('click',event => {
    const anchor = event.target.closest?.('a[href^="#"]');
    if (!anchor) return;
    try { revealTarget(document.getElementById(decodeURIComponent(anchor.hash.slice(1)))); } catch { /* Native hash behavior remains available. */ }
  });
  window.addEventListener('hashchange',revealHash);
  revealHash();
  reduced.addEventListener('change',() => {
    if (!reduced.matches) return;
    observer?.disconnect(); sceneObserver?.disconnect();
    targets.forEach(finishMotion); scenes.forEach(finishScene);
  });

  // Scroll-linked illustration only. Catalog has its own independent engine.
  // Read all rectangles first, then write visual progress in one animation frame.
  const chapters = Array.from(document.querySelectorAll('.chapter, .closing-section'));
  const scenePaths = new Map(scenes.map(scene => [scene,Array.from(scene.querySelectorAll('.trace')).map(path => ({ path,length:path.getTotalLength() }))]));
  let scrollFrame = 0;
  const clamp = value => Math.max(0,Math.min(1,value));
  function staticScrollScenes() {
    if (scrollFrame) cancelAnimationFrame(scrollFrame);
    scrollFrame = 0;
    chapters.forEach(chapter => chapter.style.setProperty('--chapter-progress','1'));
    scenes.forEach(scene => {
      scene.style.setProperty('--scene-progress','1');
      scene.dataset.scrollProgress = '1.000';
      (scenePaths.get(scene) || []).forEach(({path}) => { path.style.strokeDasharray='none';path.style.strokeDashoffset='0'; });
      scene.querySelectorAll('.impact-node,.rule-node').forEach(node => { node.dataset.scrollActive='false'; });
    });
  }
  function updateScrollScenes() {
    scrollFrame = 0;
    if (reduced.matches) return;
    const height = window.innerHeight;
    const chapterReads = chapters.map(chapter => ({chapter,rect:chapter.getBoundingClientRect()}));
    const sceneReads = scenes.map(scene => ({scene,rect:scene.getBoundingClientRect()}));
    chapterReads.forEach(({chapter,rect}) => {
      const progress = clamp((height*.92-rect.top)/(height*.7));
      chapter.style.setProperty('--chapter-progress',progress.toFixed(4));
    });
    sceneReads.forEach(({scene,rect}) => {
      const progress = clamp((height*.88-rect.top)/(height*.55+rect.height*.55));
      scene.style.setProperty('--scene-progress',progress.toFixed(4));
      scene.dataset.scrollProgress=progress.toFixed(3);
      (scenePaths.get(scene) || []).forEach(({path,length}) => {
        path.style.strokeDasharray=`${length} ${length}`;
        path.style.strokeDashoffset=String(length*(1-progress));
      });
      const nodes=Array.from(scene.querySelectorAll('.impact-node,.rule-node'));
      const active=Math.min(nodes.length-1,Math.floor(progress*nodes.length));
      nodes.forEach((node,index) => { node.dataset.scrollActive=String(index===active); });
    });
  }
  function queueScrollSceneUpdate() {
    if (!reduced.matches && !scrollFrame) scrollFrame=requestAnimationFrame(updateScrollScenes);
  }
  window.addEventListener('scroll',queueScrollSceneUpdate,{passive:true});
  window.addEventListener('resize',queueScrollSceneUpdate,{passive:true});
  window.addEventListener('load',queueScrollSceneUpdate,{once:true});
  reduced.addEventListener('change',() => { if (reduced.matches) staticScrollScenes(); else queueScrollSceneUpdate(); });
  if (reduced.matches) staticScrollScenes(); else queueScrollSceneUpdate();

  // Avoid duplicate mobile calls to action only while the final button is visible.
  const mobileCta = document.querySelector('.mobile-cta');
  const closingCta = document.querySelector('#inscricao .closing-copy > .button');
  if (mobileCta && closingCta && 'IntersectionObserver' in window) {
    try {
      const ctaObserver = new IntersectionObserver(entries => {
        mobileCta.hidden = entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= .5);
      }, { threshold:[0,.5,1] });
      ctaObserver.observe(closingCta);
    } catch { mobileCta.hidden = false; }
  }

  document.querySelectorAll('.faq-list details').forEach(details => {
    const summary = details.querySelector('summary');
    const content = details.querySelector('.faq-answer');
    let animation = null;
    let intendedOpen = details.open;
    summary.addEventListener('click', event => {
      if (reduced.matches || typeof details.animate !== 'function') return;
      event.preventDefault();
      intendedOpen = !intendedOpen;
      const startHeight = details.getBoundingClientRect().height;
      if (animation) animation.cancel();
      details.open = true;
      const endHeight = intendedOpen ? summary.getBoundingClientRect().height + content.getBoundingClientRect().height : summary.getBoundingClientRect().height;
      details.style.overflow = 'hidden';
      animation = details.animate([{ height: startHeight + 'px' }, { height: endHeight + 'px' }], { duration: 280, easing: 'cubic-bezier(.22,1,.36,1)' });
      animation.onfinish = () => { details.open = intendedOpen; details.style.removeProperty('overflow'); animation = null; };
    });
    details.addEventListener('toggle', () => { if (!animation) intendedOpen = details.open; });
    reduced.addEventListener('change', () => {
      if (!reduced.matches || !animation) return;
      animation.cancel(); animation = null;
      details.open = intendedOpen;
      details.style.removeProperty('overflow');
    });
  });
})();
