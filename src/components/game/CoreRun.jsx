import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { H, MECHANICS, PHYS, ROUNDS, SAVE_KEY, STEP, W, coresTaken, makeWorld, roundBonus, stepWorld, tierOf, timeLeft } from './engine.js';
import { drawWorld } from './render.js';

/* ─────────────────────────────────────────────────────────────
   CODE FRONTIER: CORE RUN — a 30‑round campaign.

   Each round: collect the required data cores and reach the exit
   before the timer runs out. Every five rounds adds a mechanic.
   States: menu → intro → playing ⇄ paused → cleared | failed → …
   → complete. Progress (highest round cleared, best score and the
   running campaign score) is saved in localStorage.
   Keys: ←/→ or A/D move · Space/↑/W jump · P/Esc pause ·
         R restart round · Enter confirms the current card.
   ───────────────────────────────────────────────────────────── */

const readSave = () => {
  try {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
    // progress = rounds cleared in the current campaign; highest = best ever
    return { progress: Math.min(ROUNDS, s.progress || 0), highest: Math.min(ROUNDS, s.highest || 0), best: s.best || 0, runScore: s.runScore || 0 };
  } catch {
    return { progress: 0, highest: 0, best: 0, runScore: 0 };
  }
};
const writeSave = (s) => {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(s));
  } catch {
    /* storage unavailable */
  }
};
const pad2 = (n) => String(n).padStart(2, '0');
const clock = (s) => `${Math.floor(s / 60)}:${pad2(Math.floor(s % 60))}`;

export default function CoreRun() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const world = useRef(null);
  const keys = useRef({ left: false, right: false, jump: false });
  const statusRef = useRef('menu');
  const inView = useRef(false);
  const viewW = useRef(W);
  const [status, setStatus] = useState('menu'); // menu | intro | playing | paused | cleared | failed | complete
  const [save, setSave] = useState(readSave);
  const [round, setRound] = useState(() => Math.min(ROUNDS, readSave().progress + 1));
  const [runScore, setRunScore] = useState(() => readSave().runScore);
  const [hud, setHud] = useState({ score: 0, cores: 0, required: 0, lives: 3, time: 0 });
  const [result, setResult] = useState(null);

  const go = useCallback((s) => {
    statusRef.current = s;
    setStatus(s);
  }, []);

  const load = useCallback((r) => {
    world.current = makeWorld(r);
    world.current.viewW = viewW.current;
    keys.current = { left: false, right: false, jump: false };
    setRound(r);
    setHud({ score: 0, cores: 0, required: world.current.required, lives: 3, time: world.current.timeLimit });
  }, []);

  if (!world.current) {
    world.current = makeWorld(round);
  }

  const toIntro = useCallback(
    (r) => {
      load(r);
      setResult(null);
      go('intro');
    },
    [go, load],
  );

  const play = useCallback(() => {
    go('playing');
    requestAnimationFrame(() => canvasRef.current?.focus({ preventScroll: true }));
  }, [go]);

  const newCampaign = useCallback(() => {
    setRunScore(0);
    const s = { ...readSave(), runScore: 0, progress: 0 };
    writeSave(s);
    setSave(s);
    toIntro(1);
  }, [toIntro]);

  const endRound = useCallback(
    (outcome) => {
      const w = world.current;
      if (outcome === 'cleared') {
        const bonus = roundBonus(w);
        const gained = w.score + bonus;
        const total = runScore + gained;
        const prev = readSave();
        const done = w.round >= ROUNDS;
        const s = { progress: done ? 0 : w.round, highest: Math.max(prev.highest, w.round), best: Math.max(prev.best, total), runScore: done ? 0 : total };
        writeSave(s);
        setSave(s);
        setRunScore(total);
        setResult({ outcome, cores: coresTaken(w), of: w.cores.length, timeLeft: Math.round(timeLeft(w)), lives: w.lives, bonus, gained, total, record: total > prev.best });
        go(w.round >= ROUNDS ? 'complete' : 'cleared');
      } else {
        setResult({ outcome, cores: coresTaken(w), required: w.required });
        go('failed');
      }
    },
    [go, runScore],
  );

  /* ───── input ───── */
  useEffect(() => {
    const map = (k) => (k === 'arrowleft' || k === 'a' ? 'left' : k === 'arrowright' || k === 'd' ? 'right' : k === ' ' || k === 'arrowup' || k === 'w' ? 'jump' : null);
    const down = (e) => {
      if (!inView.current) return;
      const t = e.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      const s = statusRef.current;
      const k = e.key.toLowerCase();
      if (k === 'enter' && t?.tagName !== 'BUTTON' && t?.tagName !== 'A') {
        if (s === 'intro') play();
        else if (s === 'cleared') toIntro(world.current.round + 1);
        else if (s === 'failed') toIntro(world.current.round);
        else if (s === 'paused') go('playing');
        else return;
        e.preventDefault();
        return;
      }
      if (s !== 'playing' && s !== 'paused') return;
      if (k === 'p' || k === 'escape') {
        go(s === 'playing' ? 'paused' : 'playing');
        e.preventDefault();
        return;
      }
      if (k === 'r') {
        toIntro(world.current.round);
        e.preventDefault();
        return;
      }
      const a = map(k);
      if (!a || s !== 'playing') return;
      e.preventDefault();
      if (a === 'jump' && !keys.current.jump) world.current.p.buffer = PHYS.buffer;
      keys.current[a] = true;
    };
    const up = (e) => {
      const a = map(e.key.toLowerCase());
      if (a) keys.current[a] = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [go, play, toIntro]);

  // auto‑pause when scrolled away or the tab is hidden
  useEffect(() => {
    const pause = () => statusRef.current === 'playing' && go('paused');
    const io = new IntersectionObserver(
      ([e]) => {
        inView.current = e.isIntersecting;
        if (!e.isIntersecting) pause();
      },
      { threshold: 0.35 },
    );
    io.observe(wrapRef.current);
    const vis = () => document.hidden && pause();
    document.addEventListener('visibilitychange', vis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', vis);
    };
  }, [go]);

  const draw = useCallback(() => {
    const c = canvasRef.current;
    if (c && world.current) drawWorld(c.getContext('2d'), world.current, c.width);
  }, []);

  // canvas sizing — phones get a narrower, taller view so the action stays large
  useEffect(() => {
    const canvas = canvasRef.current;
    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const vw = window.innerWidth < 700 ? 560 : W;
      viewW.current = vw;
      world.current.viewW = vw;
      canvas.width = vw * dpr;
      canvas.height = H * dpr;
      canvas.style.aspectRatio = `${vw} / ${H}`;
      draw();
    };
    fit();
    window.addEventListener('resize', fit);
    document.fonts?.ready.then(draw);
    return () => window.removeEventListener('resize', fit);
  }, [draw]);

  /* ───── loop ───── */
  useEffect(() => {
    if (status !== 'playing') {
      draw();
      return undefined;
    }
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    let hudT = 0;
    const loop = (now) => {
      acc += Math.min(100, now - last);
      last = now;
      let outcome = null;
      while (acc >= STEP && !outcome) {
        outcome = stepWorld(world.current, keys.current);
        acc -= STEP;
      }
      draw();
      if (now - hudT > 100 || outcome) {
        hudT = now;
        const w = world.current;
        setHud({ score: w.score, cores: coresTaken(w), required: w.required, lives: Math.max(0, w.lives), time: timeLeft(w) });
      }
      if (outcome) {
        endRound(outcome);
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [status, draw, endRound]);

  /* ───── touch pad ───── */
  const hold = (a, on) => (e) => {
    e.preventDefault();
    if (statusRef.current !== 'playing') return;
    if (a === 'jump' && on && !keys.current.jump) world.current.p.buffer = PHYS.buffer;
    keys.current[a] = on;
  };
  const pad = (a, label, glyph) => (
    <button
      type="button"
      className={`corerun__pad corerun__pad--${a}`}
      aria-label={label}
      onPointerDown={hold(a, true)}
      onPointerUp={hold(a, false)}
      onPointerLeave={hold(a, false)}
      onPointerCancel={hold(a, false)}
      onContextMenu={(e) => e.preventDefault()}
    >
      {glyph}
    </button>
  );

  const w = world.current;
  const tier = tierOf(round);
  const mech = MECHANICS[tier - 1];
  const newMechanic = (round - 1) % 5 === 0;
  const live = status === 'playing' || status === 'paused';
  const lowTime = live && hud.time < 10;
  const cleared = status === 'complete' ? ROUNDS : save.progress;

  return (
    <div className="corerun" ref={wrapRef}>
      <div className="corerun__hud" aria-live="off">
        <span>
          <small>Round</small>
          {pad2(round)} / {ROUNDS}
        </span>
        <span className={lowTime ? 'is-low' : ''}>
          <small>Time</small>
          {clock(live ? hud.time : w.timeLimit)}
        </span>
        <span className={hud.cores >= hud.required && live ? 'is-met' : ''}>
          <small>Cores</small>
          {hud.cores}/{w.required}
        </span>
        <span className="corerun__lives" aria-label={`${hud.lives} lives`}>
          <small>Lives</small>
          {Array.from({ length: 3 }, (_, i) => (
            <i key={i} className={i < hud.lives ? 'on' : ''} />
          ))}
        </span>
        <span>
          <small>Score</small>
          {String(runScore + (live ? hud.score : 0)).padStart(6, '0')}
        </span>
        <span>
          <small>Best</small>
          {String(save.best).padStart(6, '0')}
        </span>
        <span className="corerun__progress" aria-label={`Campaign progress: ${cleared} of ${ROUNDS} rounds cleared. Highest ever: round ${save.highest}.`}>
          <small>
            Campaign {cleared}/{ROUNDS} · best R{pad2(save.highest)}
          </small>
          <b>
            <i style={{ width: `${(cleared / ROUNDS) * 100}%` }} />
          </b>
        </span>
        <span className="corerun__actions">
          <button type="button" onClick={() => go(status === 'playing' ? 'paused' : 'playing')} disabled={!live}>
            {status === 'paused' ? 'Resume' : 'Pause'}
          </button>
          <button type="button" onClick={() => toIntro(round)} disabled={!live}>
            Restart
          </button>
        </span>
      </div>

      <div className="corerun__screen">
        <canvas
          ref={canvasRef}
          className="corerun__canvas"
          tabIndex={0}
          role="img"
          aria-label={`Core Run, round ${round} of ${ROUNDS}. Arrow keys or A and D to move, Space to jump, P to pause.`}
        />
        <AnimatePresence mode="wait">
          {status !== 'playing' && (
            <motion.div key={status} className="corerun__overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
              <motion.div className="corerun__card" initial={{ y: 14, scale: 0.97 }} animate={{ y: 0, scale: 1 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                {status === 'menu' && (
                  <>
                    <p className="corerun__kicker">Bonus level · Code Frontier</p>
                    <h3>Core Run campaign</h3>
                    <p>30 short rounds. Collect the required data cores and reach the exit before time runs out. Every five rounds adds something new.</p>
                    <ul className="corerun__rules">
                      <li>
                        <b>Move</b> ← → or A / D
                      </li>
                      <li>
                        <b>Jump</b> Space, ↑ or W (hold to jump higher)
                      </li>
                      <li>
                        <b>Pause</b> P or Esc · <b>Retry</b> R
                      </li>
                    </ul>
                    <div className="corerun__row">
                      {save.progress > 0 && (
                        <button type="button" className="corerun__start" onClick={() => toIntro(save.progress + 1)}>
                          Continue · Round {pad2(save.progress + 1)}
                        </button>
                      )}
                      <button type="button" className={save.progress > 0 ? 'corerun__ghost' : 'corerun__start'} onClick={newCampaign}>
                        {save.progress > 0 ? 'New campaign' : 'Start campaign'}
                      </button>
                    </div>
                  </>
                )}

                {status === 'intro' && (
                  <>
                    <p className="corerun__kicker">
                      Round {pad2(round)} / {ROUNDS} · {newMechanic ? 'New mechanic' : `Zone ${tier}`}
                    </p>
                    <h3>{mech.name}</h3>
                    <p>{mech.note}</p>
                    <dl className="corerun__result">
                      <div>
                        <dt>Cores needed</dt>
                        <dd>{w.required}</dd>
                      </div>
                      <div>
                        <dt>Time</dt>
                        <dd>{clock(w.timeLimit)}</dd>
                      </div>
                      <div>
                        <dt>Lives</dt>
                        <dd>3</dd>
                      </div>
                    </dl>
                    <button type="button" className="corerun__start" onClick={play}>
                      Start round
                    </button>
                  </>
                )}

                {status === 'paused' && (
                  <>
                    <p className="corerun__kicker">Paused · Round {pad2(round)}</p>
                    <h3>Take a breather</h3>
                    <div className="corerun__row">
                      <button type="button" className="corerun__start" onClick={() => go('playing')}>
                        Resume
                      </button>
                      <button type="button" className="corerun__ghost" onClick={() => toIntro(round)}>
                        Restart round
                      </button>
                    </div>
                  </>
                )}

                {status === 'failed' && result && (
                  <>
                    <p className="corerun__kicker">Round {pad2(round)} failed</p>
                    <h3>{result.outcome === 'time' ? 'Out of time' : 'Out of lives'}</h3>
                    <p>
                      {result.outcome === 'time'
                        ? `You had ${result.cores} of ${result.required} cores. Grab the cores on the main path first, then head for the exit.`
                        : 'Watch the red markers and land on drones from above. The round restarts from the beginning.'}
                    </p>
                    <div className="corerun__row">
                      <button type="button" className="corerun__start" onClick={() => toIntro(round)}>
                        Retry round
                      </button>
                      <button type="button" className="corerun__ghost" onClick={() => go('menu')}>
                        Campaign menu
                      </button>
                    </div>
                  </>
                )}

                {status === 'cleared' && result && (
                  <>
                    <p className="corerun__kicker">Round {pad2(round)} complete</p>
                    <h3>Cores secured</h3>
                    <dl className="corerun__result">
                      <div>
                        <dt>Cores</dt>
                        <dd>
                          {result.cores}/{result.of}
                        </dd>
                      </div>
                      <div>
                        <dt>Time left</dt>
                        <dd>{result.timeLeft}s</dd>
                      </div>
                      <div>
                        <dt>Bonus</dt>
                        <dd>+{result.bonus}</dd>
                      </div>
                      <div>
                        <dt>Total</dt>
                        <dd>{result.total}</dd>
                      </div>
                    </dl>
                    {tierOf(round + 1) !== tier && <p className="corerun__next">Next: {MECHANICS[tierOf(round + 1) - 1].name}</p>}
                    <button type="button" className="corerun__start" onClick={() => toIntro(round + 1)}>
                      Next round
                    </button>
                  </>
                )}

                {status === 'complete' && result && (
                  <>
                    <p className="corerun__kicker">All 30 rounds cleared</p>
                    <h3>Campaign complete</h3>
                    <p>The Field Engineer reached the extraction tower. Every core is home.</p>
                    <dl className="corerun__result">
                      <div>
                        <dt>Final score</dt>
                        <dd>{result.total}</dd>
                      </div>
                      <div>
                        <dt>Best</dt>
                        <dd>{save.best}</dd>
                      </div>
                    </dl>
                    {result.record && <p className="corerun__best">New best score!</p>}
                    <button type="button" className="corerun__start" onClick={newCampaign}>
                      Play again
                    </button>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="corerun__touch" aria-label="Touch controls">
        <div>
          {pad('left', 'Move left', '◀')}
          {pad('right', 'Move right', '▶')}
        </div>
        {pad('jump', 'Jump', 'JUMP')}
      </div>
    </div>
  );
}
