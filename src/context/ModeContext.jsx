import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { captureAnchor, restoreAnchor, startScroll, stopScroll } from '../lib/smoothScroll.js';

const STORAGE_KEY = 'hs-mode';
const THEME_COLORS = { ai: '#0c1018', retro: '#1b1512' };

// Mode switch timings (ms). The DOM swap happens while the overlay fully
// covers the screen; scroll position is captured before and restored after.
// world change timings (ms) — the page swaps between "in" and "out", while the tiles cover it
export const TRANSITION_IN = { retro: 760, ai: 660 };
export const TRANSITION_OUT = { retro: 700, ai: 760 };
export const FADE_IN = 140;
export const FADE_OUT = 200;

const ModeContext = createContext(null);

// The portfolio always opens in AI/ML mode; Game mode is only ever entered
// deliberately, through the mode switch, after the site has loaded.
const readStoredMode = () => 'ai';

const nextFrame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

export function ModeProvider({ children }) {
  const [mode, setMode] = useState(readStoredMode);
  const [transition, setTransition] = useState(null); // { to, phase: 'in' | 'out' }
  const [booted, setBooted] = useState(false);
  const reduceMotion = useReducedMotion();
  const busy = useRef(false);

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[mode]);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* storage unavailable */
    }
  }, [mode]);

  const switchMode = useCallback(
    async (target) => {
      const to = target ?? (mode === 'ai' ? 'retro' : 'ai');
      if (to === mode || busy.current) return;
      busy.current = true;
      const anchor = captureAnchor();

      if (reduceMotion) {
        setTransition({ to, phase: 'in', quick: true });
        await new Promise((r) => setTimeout(r, FADE_IN));
        setMode(to);
        await nextFrame();
        restoreAnchor(anchor);
        setTransition({ to, phase: 'out', quick: true });
        await new Promise((r) => setTimeout(r, FADE_OUT));
        setTransition(null);
        busy.current = false;
        return;
      }

      stopScroll();
      setTransition({ to, phase: 'in' });
      await new Promise((r) => setTimeout(r, TRANSITION_IN[to]));
      setMode(to);
      await nextFrame();
      restoreAnchor(anchor);
      setTransition({ to, phase: 'out' });
      await new Promise((r) => setTimeout(r, TRANSITION_OUT[to]));
      setTransition(null);
      startScroll();
      busy.current = false;
    },
    [mode, reduceMotion],
  );

  // dev only: window.__holdTransition({ to: 'retro', phase: 'in' }) freezes the world-change scene for inspection
  useEffect(() => {
    if (!import.meta.env.DEV) return undefined;
    window.__holdTransition = setTransition;
    return () => delete window.__holdTransition;
  }, []);

  const value = useMemo(
    () => ({ mode, isRetro: mode === 'retro', switchMode, transition, booted, setBooted, reduceMotion: !!reduceMotion }),
    [mode, switchMode, transition, booted, reduceMotion],
  );

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useMode must be used inside <ModeProvider>');
  return ctx;
}
