import { useEffect, useRef } from 'react';
import { useMode } from '../../context/ModeContext.jsx';
import useActiveSection from '../../hooks/useActiveSection.js';
import WorldLayers from './WorldLayers.jsx';

/**
 * Full‑page living background. One low‑opacity particle field whose
 * behaviour eases between "moods" depending on the section in view:
 *   home     → calm flowing currents
 *   skills   → richer neural links that appear, shift and fade
 *   projects → structured, axis‑aligned system paths
 *   journey  → particles travelling down progressive lanes
 *   contact  → signals gently converging on one point
 * Plus a slowly drifting blueprint grid and a few morphing organic shapes.
 * Muted colours only; static frame with reduced motion; pauses when hidden.
 */
const SECTIONS = ['home', 'about', 'skills', 'projects', 'certificates', 'journey', 'arcade', 'contact'];
const MOODS = { home: 'flow', skills: 'neural', projects: 'system', journey: 'timeline', contact: 'converge' };

export default function Backdrop() {
  const { mode, reduceMotion } = useMode();
  const active = useActiveSection(SECTIONS);
  const canvasRef = useRef(null);
  const moodRef = useRef('flow');

  moodRef.current = MOODS[active] ?? 'drift';

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const retro = mode === 'retro';
    const tones = retro ? ['239,228,204', '201,164,92', '168,71,58', '125,148,112'] : ['181,189,201', '167,185,163', '184,155,104', '216,197,157'];
    let w = 0;
    let h = 0;
    let raf = 0;
    let pts = [];
    let lanes = [];

    const seed = () => {
      const n = Math.min(retro ? 34 : 56, Math.round((w * h) / 30000));
      pts = Array.from({ length: n }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: 0,
        vy: 0,
        r: 0.7 + Math.random() * 1.3,
        axis: Math.random() < 0.5 ? 'x' : 'y',
        dir: Math.random() < 0.5 ? -1 : 1,
        lane: i % 5,
        phase: Math.random() * Math.PI * 2,
        t: tones[i % 13 === 0 ? 3 : i % 3],
      }));
      lanes = Array.from({ length: 5 }, (_, i) => w * (0.14 + i * 0.18));
    };
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const target = (p, time) => {
      switch (moodRef.current) {
        case 'flow':
          return [0.16 + 0.08 * Math.sin(p.y / 170 + time / 4200 + p.phase), 0.06 * Math.cos(p.x / 210 + time / 5200)];
        case 'neural':
          return [0.1 * Math.cos(time / 6000 + p.phase), 0.1 * Math.sin(time / 7000 + p.phase * 1.3)];
        case 'system':
          return p.axis === 'x' ? [0.28 * p.dir, 0] : [0, 0.28 * p.dir];
        case 'timeline':
          return [(lanes[p.lane] - p.x) * 0.004, 0.22];
        case 'converge': {
          const cx = w / 2;
          const cy = h * 0.62;
          const d = Math.hypot(cx - p.x, cy - p.y) || 1;
          return [((cx - p.x) / d) * 0.24, ((cy - p.y) / d) * 0.24];
        }
        default:
          return [0.06 * Math.cos(p.phase + time / 8000), 0.06 * Math.sin(p.phase + time / 9000)];
      }
    };

    const frame = (time = 0) => {
      const mood = moodRef.current;
      ctx.clearRect(0, 0, w, h);
      const linkDist = mood === 'neural' ? 150 : mood === 'system' ? 130 : 110;
      const linkAlpha = mood === 'neural' ? 0.12 : 0.07;

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        if (!reduceMotion) {
          const [tx, ty] = target(p, time);
          p.vx += (tx - p.vx) * 0.02;
          p.vy += (ty - p.vy) * 0.02;
          p.x += p.vx;
          p.y += p.vy;
          if (mood === 'converge' && Math.hypot(w / 2 - p.x, h * 0.62 - p.y) < 24) {
            const edge = Math.random() * 4;
            p.x = edge < 1 ? 0 : edge < 2 ? w : Math.random() * w;
            p.y = edge < 2 ? Math.random() * h : edge < 3 ? 0 : h;
          }
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;
          if (p.y < -10) p.y = h + 10;
          if (p.y > h + 10) p.y = -10;
        }
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const dx = q.x - p.x;
          const dy = q.y - p.y;
          const d = Math.hypot(dx, dy);
          if (d > linkDist) continue;
          // links breathe in and out so connections appear, shift and fade
          const breathe = 0.5 + 0.5 * Math.sin(time / 2600 + (i * 7 + j * 3) * 0.37);
          const a = (1 - d / linkDist) * linkAlpha * breathe;
          if (a < 0.006) continue;
          ctx.strokeStyle = `rgba(${retro ? '201,164,92' : '167,185,163'},${a})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          if (mood === 'system') ctx.lineTo(q.x, p.y), ctx.lineTo(q.x, q.y);
          else ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
        ctx.fillStyle = `rgba(${p.t},${retro ? 0.35 : 0.42})`;
        if (retro) ctx.fillRect(Math.round(p.x), Math.round(p.y), 2, 2);
        else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (mood === 'converge') {
        ctx.strokeStyle = `rgba(${retro ? '201,164,92' : '216,197,157'},0.12)`;
        ctx.beginPath();
        ctx.arc(w / 2, h * 0.62, 26 + 4 * Math.sin(time / 1400), 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    const loop = (t) => {
      frame(t);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      if (reduceMotion) frame(0);
      else raf = requestAnimationFrame(loop);
    };
    const onVis = () => (document.hidden ? cancelAnimationFrame(raf) : start());

    resize();
    start();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [mode, reduceMotion]);

  return (
    <div className="backdrop" aria-hidden="true">
      <WorldLayers />
      <div className="backdrop__glow" />
      <canvas ref={canvasRef} className="backdrop__canvas" />
      <div className="backdrop__grain" />
      <div className="backdrop__vignette" />
    </div>
  );
}
