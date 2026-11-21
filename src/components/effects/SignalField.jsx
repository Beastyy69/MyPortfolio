import { useEffect, useRef } from 'react';
import { useMode } from '../../context/ModeContext.jsx';

/**
 * Canvas of signals converging on a central receiver. Runs only while the
 * section is on screen; static frame for reduced motion.
 */
export default function SignalField() {
  const ref = useRef(null);
  const { isRetro, reduceMotion } = useMode();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let sources = [];
    let sig = [];
    const colors = isRetro ? ['#c9a45c', '#a8473a', '#7d9470', '#c08a4a'] : ['#8e9a89', '#b89b68', '#8e9a89'];

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(26, w / 50));
      sources = Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 + Math.random() * 0.2;
        const rr = Math.max(w, h) * (0.45 + Math.random() * 0.2);
        return { x: w / 2 + Math.cos(a) * rr, y: h * 0.55 + Math.sin(a) * rr * 0.6, c: colors[i % colors.length] };
      });
    };
    const target = () => ({ x: w / 2, y: h * 0.55 });

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      const t = target();
      for (const s of sources) {
        const g = ctx.createLinearGradient(s.x, s.y, t.x, t.y);
        g.addColorStop(0, 'rgba(0,0,0,0)');
        g.addColorStop(1, isRetro ? 'rgba(201, 164, 92,0.16)' : 'rgba(160, 165, 180,0.18)');
        ctx.strokeStyle = g;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        if (isRetro) ctx.lineTo(s.x, t.y), ctx.lineTo(t.x, t.y);
        else ctx.quadraticCurveTo((s.x + t.x) / 2, s.y, t.x, t.y);
        ctx.stroke();
      }
      if (Math.random() < 0.18) {
        const s = sources[(Math.random() * sources.length) | 0];
        sig.push({ s, p: 0, v: 0.004 + Math.random() * 0.006 });
      }
      for (const q of sig) {
        q.p += q.v;
        const e = q.p * q.p;
        let x;
        let y;
        if (isRetro) {
          const half = Math.abs(t.y - q.s.y) / (Math.abs(t.y - q.s.y) + Math.abs(t.x - q.s.x) || 1);
          if (e < half) {
            x = q.s.x;
            y = q.s.y + (t.y - q.s.y) * (e / half);
          } else {
            y = t.y;
            x = q.s.x + (t.x - q.s.x) * ((e - half) / (1 - half));
          }
          ctx.fillStyle = q.s.c;
          ctx.fillRect(Math.round(x) - 2, Math.round(y) - 2, 5, 5);
        } else {
          const cx = (q.s.x + t.x) / 2;
          const cy = q.s.y;
          x = (1 - e) * (1 - e) * q.s.x + 2 * (1 - e) * e * cx + e * e * t.x;
          y = (1 - e) * (1 - e) * q.s.y + 2 * (1 - e) * e * cy + e * e * t.y;
          ctx.fillStyle = q.s.c;
          ctx.shadowColor = q.s.c;
          ctx.shadowBlur = 0;
          ctx.beginPath();
          ctx.arc(x, y, 2.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
      sig = sig.filter((q) => q.p < 1);
    };
    const loop = () => {
      frame();
      if (running) raf = requestAnimationFrame(loop);
    };

    resize();
    frame();
    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting && !reduceMotion;
      cancelAnimationFrame(raf);
      if (running) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);
    window.addEventListener('resize', resize);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [isRetro, reduceMotion]);

  return <canvas ref={ref} className="signal-field" aria-hidden="true" />;
}
