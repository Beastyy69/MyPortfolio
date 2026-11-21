/**
 * About section: portrait (editorial photo in AI, character‑select screen in
 * Game), a short statement, three story chapters, roles and counting stats.
 * Content comes from src/data/profile.js.
 */
import { motion } from 'framer-motion';
import { useMode } from '../../context/ModeContext.jsx';
import { profile } from '../../data/profile.js';
import Chapter from '../ui/Chapter.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import SplitReveal from '../ui/SplitReveal.jsx';
import Reveal from '../ui/Reveal.jsx';
import Icon from '../ui/Icon.jsx';
import Counter from '../ui/Counter.jsx';
import Button from '../ui/Button.jsx';
import ModelArchitect from '../visuals/ModelArchitect.jsx';
import CharacterSelect from '../visuals/CharacterSelect.jsx';

function RolesAI() {
  return (
    <ul className="roles">
      {profile.roles.map((r, i) => (
        <motion.li
          key={r.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.6 }}
        >
          <span className="roles__idx">0{i + 1}</span>
          <span className="roles__label">{r.label}</span>
          <span className="roles__icon">
            <Icon name={r.icon} size={20} />
          </span>
        </motion.li>
      ))}
    </ul>
  );
}

function RolesRetro() {
  return (
    <div className="charsel">
      <p className="charsel__title">CHARACTER SELECT · HYBRID CLASS</p>
      <ul>
        {profile.roles.map((r) => (
          <li key={r.id}>
            <span className="charsel__key">{r.stat}</span>
            <span className="charsel__label">{r.label}</span>
            <span className="charsel__meter" role="img" aria-label={`${r.label}: ${r.value} of 100`}>
              {Array.from({ length: 10 }, (_, i) => (
                <motion.i
                  key={i}
                  initial={{ opacity: 0.12, scaleY: 0.4 }}
                  whileInView={i < Math.round(r.value / 10) ? { opacity: 1, scaleY: 1 } : { opacity: 0.12, scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * i }}
                />
              ))}
            </span>
            <span className="charsel__val">{r.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function About() {
  const { isRetro } = useMode();
  return (
    <Chapter id="about" ghost="About" retroGhost="PROFILE" className="about" labelledBy="about-title">
      <div className="container">
        <SectionHeading id="about-title" index="01" eyebrow="About me" retroEyebrow="PLAYER PROFILE" title="Engineer by craft, gamer by heart." retroTitle="Player profile" />

        <div className="about__grid">
          <div className="about__visual">
            {isRetro ? <CharacterSelect /> : <ModelArchitect />}
          </div>

          <div className="about__body">
            <SplitReveal
              as="p"
              className="about__statement"
              stagger={0.03}
              text={
                isRetro
                  ? 'A backend engineer who levels up with every bug fixed — and still plays for the high score.'
                  : 'I build intelligent systems — and the Python backends that bring them to life.'
              }
            />

            <ol className="story">
              {profile.story.map((s, i) => (
                <Reveal as="li" key={s.title} delay={i * 0.1} className="story__item">
                  <span className="story__num">{isRetro ? `0${i + 1}` : `0${i + 1} —`}</span>
                  <h3>{isRetro ? s.retroTitle : s.title}</h3>
                  <p>{s.text}</p>
                </Reveal>
              ))}
            </ol>

            {isRetro ? <RolesRetro /> : <RolesAI />}

            <div className="about__stats">
              {profile.stats.map((s, i) => (
                <Reveal key={s.label} delay={i * 0.06} className="about__stat">
                  <strong>
                    <Counter value={s.value} suffix={s.suffix} />
                  </strong>
                  <span>{isRetro ? s.retro : s.label}</span>
                </Reveal>
              ))}
            </div>

            <Reveal className="about__actions">
              <Button href={profile.resume} variant="ghost" iconLeft="download" download cursor="Save">
                {isRetro ? 'Download save file (CV)' : 'Download résumé'}
              </Button>
            </Reveal>
          </div>
        </div>
      </div>
    </Chapter>
  );
}
