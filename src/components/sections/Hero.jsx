/**
 * Hero section: greeting, name, role, tagline, "View Projects" and contact links.
 * The right side shows the intelligence portrait (AI) or cartridge cover (Game).
 * Game mode opens with the World Preview Strip under the navbar; AI mode keeps
 * the skills ticker below the hero.
 * Text and visual drift apart slightly as you scroll (parallax).
 */
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useMode } from '../../context/ModeContext.jsx';
import { profile } from '../../data/profile.js';
import Button from '../ui/Button.jsx';
import ModeSwap from '../ui/ModeSwap.jsx';
import SplitReveal from '../ui/SplitReveal.jsx';
import NeuralPortrait from '../visuals/NeuralPortrait.jsx';
import ArcadePortrait from '../visuals/ArcadePortrait.jsx';
import WorldPreview from '../game/WorldPreview.jsx';
import HeroLinks from '../ui/HeroLinks.jsx';
import SafeBoundary from '../ui/SafeBoundary.jsx';

const fade = (delay) => ({
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] } },
});

export default function Hero() {
  const { booted, isRetro, mode } = useMode();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const visualY = useTransform(scrollYProgress, [0, 1], ['0%', '-14%']);
  const visualScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const state = booted ? 'show' : 'hidden';

  return (
    <section id="home" className={`hero hero--${mode}`} ref={ref} aria-labelledby="hero-title">
      {isRetro && (
        <div className="container">
          <SafeBoundary>
            <WorldPreview />
          </SafeBoundary>
        </div>
      )}
      <div className="container hero__grid">
        <motion.div className="hero__copy" style={{ y: copyY, opacity: copyOpacity }} initial="hidden" animate={state} key={mode}>
          <motion.div variants={fade(0.05)}>
            {isRetro ? (
              <p className="hero__badge hero__badge--retro">
                <span className="pixel-tag">LV 01</span> START CAMP · CODE FRONTIER
              </p>
            ) : (
              <p className="hero__badge">
                <i className="status-dot" /> Available for new opportunities
              </p>
            )}
          </motion.div>

          <h1 id="hero-title" className="hero__title">
            <SplitReveal as="span" className="hero__hi" text="Hi, I’m" animate={booted} delay={0.1} />
            <SplitReveal as="span" className="hero__name" text={profile.name} animate={booted} delay={0.22} stagger={0.1} />
          </h1>

          <motion.p className="hero__role" variants={fade(0.45)}>
            {isRetro && <span className="hero__role-tag">CLASS</span>}
            {profile.role}
          </motion.p>
          <motion.p className="hero__tagline" variants={fade(0.55)}>
            {profile.tagline}
          </motion.p>

          <motion.div className="hero__cta" variants={fade(0.65)}>
            <Button href="#projects" icon="arrowRight" cursor={isRetro ? 'Go' : 'Explore'}>
              {isRetro ? 'View Missions' : 'View Projects'}
            </Button>
            <HeroLinks />
          </motion.div>
        </motion.div>

        <motion.div
          className="hero__visual"
          style={{ y: visualY, scale: visualScale }}
          initial={{ opacity: 0, clipPath: 'inset(12% 12% 12% 12% round 30px)' }}
          animate={booted ? { opacity: 1, clipPath: 'inset(-20% -20% -20% -20% round 0px)' } : {}}
          transition={{ duration: 1.3, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <ModeSwap ai={<NeuralPortrait />} retro={<ArcadePortrait />} />
        </motion.div>
      </div>

      <ModeSwap
        className="hero__bottom"
        ai={
          <div className="hero__ticker" aria-hidden="true">
            <div className="hero__ticker-track">
              {Array.from({ length: 2 }, (_, k) => (
                <span key={k}>
                  Machine Learning <i>/</i> Python Backends <i>/</i> FastAPI <i>/</i> Computer Vision <i>/</i> Data Pipelines <i>/</i> Model Serving <i>/</i>
                </span>
              ))}
            </div>
          </div>
        }
        retro={null}
      />
    </section>
  );
}
