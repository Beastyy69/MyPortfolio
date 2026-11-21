/**
 * Skills section.
 *   AI mode   → <NeuralUniverse />: the "My Skills" neural graph.
 *   Game mode → <AbilityMap />: Level 3 of Code Frontier, a campaign map of skill zones.
 * Blueprint and SkillBook below are earlier layouts kept for reference; they
 * are not rendered.
 */
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMode } from '../../context/ModeContext.jsx';
import { skillCategories, TIERS, tierOf } from '../../data/skills.js';
import Chapter from '../ui/Chapter.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import NeuralUniverse from '../visuals/NeuralUniverse.jsx';
import AbilityMap from '../game/AbilityMap.jsx';

const ease = [0.22, 1, 0.36, 1];
const byTier = (cat) => TIERS.map((t) => ({ tier: t, skills: cat.skills.filter((s) => tierOf(s.level).id === t.id) })).filter((g) => g.skills.length);

/* ───────── AI: capability blueprint ─────────
   Four editorial panels on a 12‑column grid. The first is the focal point
   (inverted ivory). Skills are grouped by tier in words, not percentages;
   hovering / focusing a skill reveals a one‑line description. */
function Blueprint() {
  return (
    <div className="bp">
      {skillCategories.map((cat, i) => (
        <motion.article
          key={cat.id}
          className={`bp__panel bp__panel--${i + 1}`}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, delay: i * 0.08, ease }}
        >
          <header className="bp__head">
            <span className="bp__idx">0{i + 1}</span>
            <span className="bp__cap">{cat.capability}</span>
          </header>
          <h3 className="bp__title">{cat.name}</h3>
          <p className="bp__summary">{cat.summary}</p>

          {byTier(cat).map(({ tier, skills }) => (
            <div key={tier.id} className="bp__tier">
              <p className="bp__tier-label">{tier.label}</p>
              <ul>
                {skills.map((s) => (
                  <li key={s.name} tabIndex={0} className="bp__skill">
                    <span className="bp__name">{s.name}</span>
                    <span className="bp__note">{s.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="bp__tier bp__tier--learning">
            <p className="bp__tier-label">Currently learning</p>
            <p className="bp__learning">{cat.learning.join(' · ')}</p>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

/* ───────── Game: the skill book ─────────
   A printed strategy‑guide spread: chapters on the left page, the selected
   chapter's loadout on the right. Ranks A/B/C replace numbers. */
function SkillBook() {
  const [ch, setCh] = useState(0);
  const cat = skillCategories[ch];
  const roman = ['I', 'II', 'III', 'IV', 'V', 'VI'];
  const go = (n) => setCh((n + skillCategories.length) % skillCategories.length);

  return (
    <div className="book">
      <nav className="book__left" aria-label="Skill chapters">
        <p className="book__kicker">Strategy guide · Skills</p>
        <ol role="tablist" aria-orientation="vertical">
          {skillCategories.map((c, i) => (
            <li key={c.id}>
              <button
                type="button"
                role="tab"
                aria-selected={ch === i}
                className={`book__chapter ${ch === i ? 'is-on' : ''}`}
                onClick={() => setCh(i)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') go(ch + 1);
                  if (e.key === 'ArrowUp') go(ch - 1);
                }}
              >
                <span className="book__roman">{roman[i]}</span>
                <span>
                  <strong>{c.name}</strong>
                  <small>{c.skills.length} items</small>
                </span>
              </button>
            </li>
          ))}
        </ol>
        <dl className="book__legend">
          {TIERS.map((t) => (
            <div key={t.id}>
              <dt>{t.rank}</dt>
              <dd>{t.label}</dd>
            </div>
          ))}
        </dl>
      </nav>

      <div className="book__right" role="tabpanel" aria-label={cat.name}>
        <AnimatePresence mode="wait">
          <motion.div key={cat.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3, ease }}>
            <p className="book__kicker">Chapter {roman[ch]} — Loadout</p>
            <h3 className="book__title">{cat.name}</h3>
            <p className="book__summary">{cat.summary}</p>
            <ul className="book__items">
              {cat.skills.map((s) => {
                const t = tierOf(s.level);
                return (
                  <li key={s.name} className="book__item">
                    <span className="book__glyph" aria-hidden="true">
                      {s.abbr}
                    </span>
                    <span className="book__body">
                      <strong>{s.name}</strong>
                      <small>{s.note}</small>
                    </span>
                    <span className={`book__rank book__rank--${t.id}`} title={t.label}>
                      <b>{t.rank}</b>
                      <i>{t.label}</i>
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="book__learning">
              <span>Next unlocks:</span> {cat.learning.join(', ')}
            </p>
            <div className="book__pager">
              <button type="button" onClick={() => go(ch - 1)}>
                ← Previous chapter
              </button>
              <span>
                {ch + 1} / {skillCategories.length}
              </span>
              <button type="button" onClick={() => go(ch + 1)}>
                Next chapter →
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Skills() {
  const { isRetro } = useMode();
  return (
    <Chapter id="skills" ghost="Universe" retroGhost="ABILITY MAP" className="skills" labelledBy="skills-title">
      <div className="container">
        <SectionHeading
          id="skills-title"
          index="02"
          eyebrow="Skills"
          retroEyebrow="ABILITY MAP"
          title="My Skills"
          retroTitle="Ability Map"
          intro="A connected ecosystem of AI, backend, web, data, and systems engineering tools."
          retroIntro="Six zones across Code Frontier. Pick a checkpoint to open its briefing: what each ability does, the tech around it, and where I have used it for real."
        />
        {isRetro ? <AbilityMap /> : <NeuralUniverse />}
      </div>
    </Chapter>
  );
}
