'use strict';
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const short = new URLSearchParams(window.location.search).get('versao') === 'curta';
  document.body.classList.toggle('short-version', short);
  document.querySelectorAll('.brand img').forEach(img => {
    img.addEventListener('error', () => { img.hidden = true; if (img.nextElementSibling) img.nextElementSibling.hidden = false; }, { once: true });
  });
  if (!reduced.matches) {
    ['.hero h1','.hero-description','.hero-visual'].forEach((selector,index) => {
      const element = document.querySelector(selector);
      if (element && typeof element.animate === 'function') element.animate([{ opacity:0,transform:'translateY(12px)' },{ opacity:1,transform:'translateY(0)' }],{ duration:460,delay:index*60,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards' });
    });
  }

  const reveals = Array.from(document.querySelectorAll('.reveal'));
  if (!reduced.matches && 'IntersectionObserver' in window) {
    document.body.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
    }, { threshold: 0.08 });
    reveals.forEach(element => observer.observe(element));
  }
  reduced.addEventListener('change', () => { if (reduced.matches) reveals.forEach(element => element.classList.add('is-visible')); });

  const tabs = Array.from(document.querySelectorAll('.lesson-tab'));
  const panes = Array.from(document.querySelectorAll('.lesson-pane'));
  const paneContainer = document.querySelector('.lesson-panes');
  function selectTab(selected, focus = false) {
    const outgoing = panes.find(pane => !pane.hidden);
    const incoming = document.getElementById(selected.getAttribute('aria-controls'));
    if (!incoming) return;
    paneContainer?.querySelectorAll('.pane-outgoing').forEach(node => node.remove());
    if (outgoing && outgoing !== incoming && !reduced.matches && typeof outgoing.animate === 'function') {
      const ghost = outgoing.cloneNode(true);
      ghost.removeAttribute('id'); ghost.removeAttribute('role'); ghost.removeAttribute('aria-labelledby');
      ghost.setAttribute('aria-hidden', 'true'); ghost.setAttribute('inert', ''); ghost.removeAttribute('tabindex');
      ghost.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
      ghost.classList.add('pane-outgoing');
      paneContainer.appendChild(ghost);
      const fade = ghost.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, easing: 'ease-out' });
      fade.onfinish = () => ghost.remove();
    }
    tabs.forEach(tab => { const active = tab === selected; tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1; });
    panes.forEach(pane => { pane.hidden = pane !== incoming; });
    if (!reduced.matches && outgoing !== incoming && typeof incoming.animate === 'function') {
      incoming.getAnimations().forEach(animation => animation.cancel());
      incoming.animate([{ opacity: 0.2, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 280, easing: 'cubic-bezier(.22,1,.36,1)' });
    }
    if (focus) selected.focus({ preventScroll: true });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', event => {
      let destination = null;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') destination = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') destination = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') destination = 0;
      if (event.key === 'End') destination = tabs.length - 1;
      if (destination !== null) { event.preventDefault(); selectTab(tabs[destination], true); }
    });
  });

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
  });
})();
