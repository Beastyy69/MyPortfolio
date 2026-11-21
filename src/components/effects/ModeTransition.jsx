import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMode } from '../../context/ModeContext.jsx';

/* ─────────────────────────────────────────────────────────────
   World change — a full-screen tile takeover (~1.3 s, timed by
   ModeContext). The page swaps while the tiles fully cover it, so the
   visitor stays at the same section and scroll position.

   AI → Game  the interface dims; neural nodes detach from their lines
              and multiply into large square tiles that arrange into a
              diamond-ring pattern (burgundy, mustard, sage, lavender,
              parchment, charcoal). "GAME WORLD UNLOCKED". The bottom rows
              turn to terrain, a row becomes platforms, flags go up, then
              the tiles flip away in a wave onto Game Mode.
   Game → AI  terrain breaks into tile fragments that rise and settle
              into a clean, structured ink grid ("SYSTEM WORLD RESTORED");
              the tiles then shrink into connected neural nodes and the
              AI/ML environment resolves underneath.
   Reduced motion: a short colour crossfade.
   ───────────────────────────────────────────────────────────── */

const ease = [0.65, 0, 0.35, 1];
const out = [0.22, 1, 0.36, 1];

const GAME = ['#5e2430', '#c79a3e', '#e6d7b4', '#8a9a78', '#3a2a20', '#9c4a3c', '#1d1a19', '#8e86a3']; // lavender only reaches the outer ring
const TERRAIN = ['#5d6b3f', '#4b5734', '#7a5a3a', '#6b4b30'];
const INKS = ['#0c1018', '#121824', '#151c29'];

function useGrid() {
  return useMemo(() => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const cols = W < 640 ? 6 : W < 1100 ? 9 : 12;
    const size = Math.ceil(W / cols);
    const rows = Math.ceil(H / size);
    const cx = (cols - 1) / 2;
    const cy = (rows - 1) / 2;
    // the neural network the tiles are born from / shrink back into
    const nodes = Array.from({ length: 14 }, (_, i) => {
      const a = i * 2.39996;
      const r = 0.18 + 0.32 * Math.sqrt(((i * 7) % 13) / 12);
      return [W / 2 + Math.cos(a) * W * r, H / 2 + Math.sin(a) * H * r * 1.1];
    });
    const links = [];
    nodes.forEach((n, i) => {
      nodes
        .map((m, j) => [j, Math.hypot(m[0] - n[0], m[1] - n[1])])
        .filter(([j]) => j > i)
        .sort((a, b) => a[1] - b[1])
        .slice(0, 2)
        .forEach(([j]) => links.push([i, j]));
    });
    const tiles = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * size;
        const y = r * size;
        const mx = x + size / 2;
        const my = y + size / 2;
        let best = 0;
        let bd = Infinity;
        nodes.forEach(([nx, ny], i) => {
          const d = Math.hypot(nx - mx, ny - my);
          if (d < bd) {
            bd = d;
            best = i;
          }
        });
        const ring = Math.round(Math.abs(c - cx) + Math.abs(r - cy));
        tiles.push({
          key: `${r}-${c}`,
          r,
          c,
          x,
          y,
          dx: nodes[best][0] - mx,
          dy: nodes[best][1] - my,
          dist: Math.hypot(c - cx, r - cy) / Math.hypot(cx, cy),
          game: GAME[ring % GAME.length],
          ink: INKS[(r * 2 + c) % 3],
          accent: c % 4 === 1 && r % 3 === 1,
        });
      }
    }
    return { W, H, cols, rows, size, nodes, links, tiles };
  }, []);
}

function Network({ g, show }) {
  const leaving = show === 'in';
  return (
    <svg className="ws__net" viewBox={`0 0 ${g.W} ${g.H}`} aria-hidden="true">
      {g.links.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={g.nodes[a][0]}
          y1={g.nodes[a][1]}
          x2={g.nodes[b][0]}
          y2={g.nodes[b][1]}
          className="ws__netline"
          initial={{ pathLength: leaving ? 1 : 0, opacity: leaving ? 1 : 0 }}
          animate={
            leaving
              ? { pathLength: 0, opacity: 0, transition: { duration: 0.28, delay: 0.08 + (i % 5) * 0.02, ease } }
              : { pathLength: 1, opacity: [0, 1, 0], transition: { duration: 0.62, times: [0, 0.4, 1], delay: 0.08 + (i % 5) * 0.02, ease } }
          }
        />
      ))}
      {g.nodes.map(([x, y], i) => (
        <motion.circle
          key={`n${i}`}
          cx={x}
          cy={y}
          r="5"
          className="ws__netnode"
          initial={{ opacity: leaving ? 1 : 0 }}
          animate={leaving ? { opacity: [1, 1, 0], transition: { duration: 0.32, times: [0, 0.6, 1] } } : { opacity: [0, 1, 1, 0], transition: { duration: 0.62, times: [0, 0.3, 0.7, 1] } }}
        />
      ))}
    </svg>
  );
}

/* ── AI → Game ── */
function ToGame({ phase, g }) {
  const inPhase = phase === 'in';
  const terrainFrom = g.rows - 2;
  const platformRow = g.rows - 3;
  return (
    <>
      <motion.div className="ws__dim" initial={{ opacity: 0 }} animate={{ opacity: inPhase ? 1 : 0, transition: { duration: inPhase ? 0.2 : 0.3, ease } }} />
      {inPhase && <Network g={g} show="in" />}
      <div className="ws__tiles">
        {g.tiles.map((t) => {
          const terrain = t.r >= terrainFrom;
          const platform = t.r === platformRow && t.c % 3 !== 2;
          const flag = t.r === platformRow - 1 && t.c % 4 === 1;
          return (
            <motion.div
              key={t.key}
              className="ws__tile"
              style={{ left: t.x, top: t.y, width: g.size + 1, height: g.size + 1, transformOrigin: platform ? '50% 0%' : '50% 50%' }}
              initial={{ x: t.dx, y: t.dy, scale: 0.06, borderRadius: '50%', backgroundColor: '#f4f0e8', rotateX: 0, opacity: 1 }}
              animate={
                inPhase
                  ? {
                      x: 0,
                      y: 0,
                      scale: 1,
                      borderRadius: '2px',
                      backgroundColor: t.game,
                      transition: { duration: 0.42, delay: 0.16 + t.dist * 0.14 + (t.c % 2) * 0.02, ease: out },
                    }
                  : {
                      backgroundColor: terrain ? TERRAIN[(t.c + t.r) % 4] : platform ? '#7a5a3a' : t.game,
                      scaleY: platform ? 0.26 : 1,
                      rotateX: [0, 0, 92],
                      opacity: [1, 1, 0],
                      transition: {
                        duration: 0.5,
                        delay: ((g.rows - 1 - t.r) / g.rows) * 0.06 + (t.c / g.cols) * 0.12,
                        times: [0, 0.45, 1],
                        ease,
                        backgroundColor: { duration: 0.18 },
                        scaleY: { duration: 0.2, ease: out },
                      },
                    }
              }
            >
              {flag && !inPhase && (
                <motion.svg viewBox="0 0 40 40" className="ws__flag" initial={{ scaleY: 0 }} animate={{ scaleY: 1, transition: { duration: 0.18, ease: out } }}>
                  <path d="M12 38 V6" stroke="#1d1a19" strokeWidth="2.4" />
                  <path d="M12 6 L32 12 L12 18 Z" fill="#9c4a3c" stroke="#1d1a19" strokeWidth="1.6" />
                </motion.svg>
              )}
            </motion.div>
          );
        })}
      </div>
      <motion.div
        className="ws__plaque is-game"
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={inPhase ? { opacity: 1, scale: 1, y: 0, transition: { delay: 0.44, duration: 0.3, ease: out } } : { opacity: 0, y: -14, transition: { duration: 0.24, delay: 0.1, ease } }}
      >
        <strong>GAME WORLD UNLOCKED</strong>
        <span>CODE FRONTIER · PLAYER ACTIVE</span>
      </motion.div>
    </>
  );
}

/* ── Game → AI ── */
function ToAI({ phase, g }) {
  const inPhase = phase === 'in';
  return (
    <>
      <motion.div className="ws__dim is-warm" initial={{ opacity: 0 }} animate={{ opacity: inPhase ? 1 : 0, transition: { duration: inPhase ? 0.2 : 0.3, ease } }} />
      <div className="ws__tiles">
        {g.tiles.map((t) => (
          <motion.div
            key={t.key}
            className="ws__tile"
            style={{ left: t.x, top: t.y, width: g.size + 1, height: g.size + 1 }}
            initial={{ y: g.H - t.y + g.size * (0.5 + (t.c % 3) * 0.4), rotate: ((t.c * 7 + t.r * 3) % 9) - 4, scale: 0.9, borderRadius: '2px', backgroundColor: TERRAIN[(t.c + t.r) % 4] }}
            animate={
              inPhase
                ? {
                    y: 0,
                    rotate: 0,
                    scale: 1,
                    backgroundColor: [TERRAIN[(t.c + t.r) % 4], '#e6d7b4', t.accent ? '#1b2433' : t.ink],
                    transition: { duration: 0.5, delay: (t.r / g.rows) * 0.06 + ((t.c * 5) % 7) * 0.012, ease: out, backgroundColor: { duration: 0.5, times: [0, 0.45, 1] } },
                  }
                : {
                    x: t.dx,
                    y: t.dy,
                    scale: 0.05,
                    borderRadius: '50%',
                    backgroundColor: '#a7b9a3',
                    opacity: [1, 1, 0],
                    transition: { duration: 0.5, delay: t.dist * 0.1, ease, opacity: { duration: 0.5, times: [0, 0.75, 1] } },
                  }
            }
          >
            {t.accent && inPhase && <motion.i className="ws__dot" initial={{ scale: 0 }} animate={{ scale: 1, transition: { delay: 0.42, duration: 0.2 } }} />}
          </motion.div>
        ))}
      </div>
      {!inPhase && <Network g={g} show="out" />}
      <motion.div
        className="ws__plaque is-ai"
        initial={{ opacity: 0, y: 10 }}
        animate={inPhase ? { opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.3, ease: out } } : { opacity: 0, y: -12, transition: { duration: 0.22, ease } }}
      >
        <strong>SYSTEM WORLD RESTORED</strong>
        <span>AIML · NEURAL ENVIRONMENT</span>
      </motion.div>
    </>
  );
}

function Scene({ toGame, phase }) {
  const g = useGrid();
  return toGame ? <ToGame phase={phase} g={g} /> : <ToAI phase={phase} g={g} />;
}

export default function ModeTransition() {
  const { transition } = useMode();
  const toGame = transition?.to === 'retro';

  return (
    <AnimatePresence>
      {transition && (
        <motion.div
          key={`${transition.to}-${transition.quick ? 'q' : 's'}`}
          className="ws"
          initial={{ opacity: transition.quick ? 0 : 1 }}
          animate={transition.quick ? { opacity: transition.phase === 'in' ? 1 : 0, transition: { duration: transition.phase === 'in' ? 0.14 : 0.2 } } : { opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: transition.quick ? 0.05 : 0.12 } }}
          style={transition.quick ? { background: toGame ? '#3a2a20' : '#0c1018' } : undefined}
          aria-hidden="true"
        >
          {!transition.quick && <Scene toGame={toGame} phase={transition.phase} />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
