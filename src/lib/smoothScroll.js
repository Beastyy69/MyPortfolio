import Lenis from 'lenis';

// Single Lenis instance shared by the whole app. Falls back to native
// scrolling when the user prefers reduced motion.
let lenis = null;

export const NAV_OFFSET = -72;

if (import.meta.env.DEV && typeof window !== 'undefined') {
  // handy for manual testing in the console
  window.__scrollToId = (id, offset = 0) => scrollToId(id, { immediate: true, offset: NAV_OFFSET + offset });
}

export function initSmoothScroll() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return () => {};

  document.documentElement.style.scrollBehavior = 'auto';
  lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
  let raf = requestAnimationFrame(function loop(time) {
    lenis?.raf(time);
    raf = requestAnimationFrame(loop);
  });
  return () => {
    cancelAnimationFrame(raf);
    lenis?.destroy();
    lenis = null;
  };
}

export function scrollToId(id, opts = {}) {
  const el = id === 'home' ? 0 : document.getElementById(id);
  if (el === null) return;
  if (lenis) {
    lenis.scrollTo(el, { offset: id === 'home' ? 0 : NAV_OFFSET, ...opts });
  } else {
    const y = el === 0 ? 0 : el.getBoundingClientRect().top + window.scrollY + NAV_OFFSET;
    window.scrollTo({ top: y, behavior: opts.immediate ? 'auto' : 'smooth' });
  }
}

export function scrollToY(y, immediate = true) {
  if (lenis) lenis.scrollTo(y, { immediate, force: true });
  else window.scrollTo({ top: y, behavior: 'auto' });
}

export function stopScroll() {
  lenis?.stop();
}
export function startScroll() {
  lenis?.start();
}

/** Intercept in‑page anchor clicks so they glide with Lenis and move focus. */
export function handleAnchorClicks() {
  const onClick = (e) => {
    const a = e.target.closest?.('a[href^="#"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
    const id = a.getAttribute('href').slice(1);
    if (!id || (id !== 'home' && !document.getElementById(id))) return;
    e.preventDefault();
    scrollToId(id);
    history.replaceState(null, '', `#${id}`);
    const target = document.getElementById(id);
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  };
  document.addEventListener('click', onClick);
  return () => document.removeEventListener('click', onClick);
}

/**
 * Captures where the reader is (which section + how far into it) so the
 * same spot can be restored after a mode switch changes layout heights.
 */
export function captureAnchor() {
  const probe = window.innerHeight * 0.4;
  const sections = [...document.querySelectorAll('main section[id]')];
  for (const s of sections) {
    const r = s.getBoundingClientRect();
    if (r.top <= probe && r.bottom > probe) {
      return { id: s.id, ratio: (probe - r.top) / r.height, prev: sections[sections.indexOf(s) - 1]?.id };
    }
  }
  return null;
}

export function restoreAnchor(anchor) {
  if (!anchor) return;
  let el = document.getElementById(anchor.id);
  let ratio = anchor.ratio;
  if (!el && anchor.prev) {
    el = document.getElementById(anchor.prev);
    ratio = 0.98;
  }
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY;
  scrollToY(Math.max(0, top + el.offsetHeight * ratio - window.innerHeight * 0.4));
}
