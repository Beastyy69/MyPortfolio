import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useMode } from '../../context/ModeContext.jsx';

/* ─────────────────────────────────────────────────────────────
   Custom cursor — fine pointers only (touch keeps the native one).
   AI mode:   ivory dot + soft slate ring that eases behind the pointer.
   Game mode: a small brass compass needle + a four‑corner selector.
   Over interactive things the ring grows and shows a short label.
   Labels come from [data-cursor-ai] / [data-cursor-retro] /
   [data-cursor], or from the context map below. With reduced motion
   the ring follows without lag or size animation.
   ───────────────────────────────────────────────────────────── */

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor], [data-cursor-ai], [data-cursor-retro], canvas[tabindex], .atl__hit';

// [selector, AI label, Game label]
const CONTEXT = [
  ['.corerun__canvas, .corerun__pad', 'Play', 'Play'],
  ['.atl__hit, .amap__cp', 'Explore', 'Enter Zone'],
  ['.cmap__stop, .cmap__viewport', 'Explore', 'Travel'],
  ['.wp', 'Explore', 'Travel'],
  ['.mplaque', 'View Project', 'Select'],
  ['.msel__view', 'View Project', 'Brief'],
  ['.case__media, .case__title', 'View Project', 'Open Mission'],
  ['.nu__node, .amap__abilities button', 'Inspect', 'Select'],
  ['.nu__cluster, .nu__focus button, .msel__token, .filters__btn', 'Explore', 'Select'],
  ['.dossier__btn, .case__actions a', 'Open', 'Open'],
];

function labelFor(target, retro) {
  const own = target.closest('[data-cursor-ai], [data-cursor-retro], [data-cursor]');
  if (own) {
    const v = own.getAttribute(retro ? 'data-cursor-retro' : 'data-cursor-ai') || own.getAttribute('data-cursor');
    if (v) return v;
  }
  for (const [sel, ai, game] of CONTEXT) if (target.closest(sel)) return retro ? game : ai;
  return '';
}

export default function Cursor() {
  const { reduceMotion, isRetro } = useMode();
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState({ hover: false, label: '', text: false, down: false, hidden: true, drag: false });
  const retroRef = useRef(isRetro);
  retroRef.current = isRetro;
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const spring = reduceMotion ? { stiffness: 2000, damping: 100, mass: 0.1 } : { stiffness: 260, damping: 28, mass: 0.6 };
  const rx = useSpring(x, spring);
  const ry = useSpring(y, spring);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    document.documentElement.classList.add('has-cursor');
    const move = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target;
      const el = t.closest?.(INTERACTIVE) || (t.closest && CONTEXT.some(([sel]) => t.closest(sel)));
      const text = !!t.closest?.('input, textarea, [contenteditable="true"]');
      const label = t.closest ? labelFor(t, retroRef.current) : '';
      const drag = !!t.closest?.('[data-drag]');
      setState((s) =>
        s.hover === !!el && s.label === label && s.text === text && s.drag === drag && !s.hidden ? s : { ...s, hover: !!el, label, text, drag, hidden: false },
      );
    };
    const down = () => setState((s) => ({ ...s, down: true }));
    const up = () => setState((s) => ({ ...s, down: false }));
    const leave = () => setState((s) => ({ ...s, hidden: true }));
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;
  const label = state.drag && !state.down ? state.label || 'Drag' : state.label;
  const size = label ? (isRetro ? 96 : 88) : state.hover ? 48 : 30;
  const cls = `cursor ${isRetro ? 'cursor--retro' : 'cursor--ai'} ${state.hidden || state.text ? 'is-hidden' : ''}`;

  return (
    <div className={cls} aria-hidden="true">
      <motion.div className="cursor__dot" style={{ x, y }} animate={{ scale: state.hover ? 0.6 : 1 }} transition={{ duration: reduceMotion ? 0 : 0.2 }}>
        {isRetro && (
          <svg viewBox="0 0 16 16">
            <path d="M8 1 L10.5 8 L8 15 L5.5 8 Z" fill="#efe4cc" stroke="#2a2119" strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M8 1 L10.5 8 L5.5 8 Z" fill="#a8473a" stroke="#2a2119" strokeWidth="1.2" strokeLinejoin="round" />
            <circle cx="8" cy="8" r="1.3" fill="#2a2119" />
          </svg>
        )}
      </motion.div>
      <motion.div
        className={`cursor__ring ${state.hover ? 'is-hover' : ''} ${label ? 'has-label' : ''}`}
        style={{ x: rx, y: ry }}
        animate={{ width: size, height: label && isRetro ? 40 : size, scale: state.down ? 0.88 : 1 }}
        transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 26 }}
      >
        {isRetro && (
          <>
            <i className="cursor__corner cursor__corner--tl" />
            <i className="cursor__corner cursor__corner--tr" />
            <i className="cursor__corner cursor__corner--bl" />
            <i className="cursor__corner cursor__corner--br" />
          </>
        )}
        {label && <span>{label}</span>}
      </motion.div>
    </div>
  );
}
