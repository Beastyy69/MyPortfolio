import { motion } from 'framer-motion';
import { useMode } from '../../context/ModeContext.jsx';
import SplitReveal from './SplitReveal.jsx';

/** Editorial section title with masked word reveal; re‑skins per mode. */
export default function SectionHeading({ index, eyebrow, title, retroTitle, retroEyebrow, intro, retroIntro, id, align = 'left' }) {
  const { isRetro, mode } = useMode();
  return (
    <header className={`section-heading section-heading--${align}`} key={mode}>
      <motion.p
        className="section-heading__eyebrow"
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {isRetro ? (
          <>
            <span className="pixel-tag">LV {String(Number(index) + 1).padStart(2, '0')}</span> {retroEyebrow ?? eyebrow}
          </>
        ) : (
          <>
            <span className="section-heading__index">({index})</span>
            <span className="section-heading__line" aria-hidden="true" />
            {eyebrow}
          </>
        )}
      </motion.p>
      <h2 className="section-heading__title" id={id}>
        <SplitReveal text={isRetro ? retroTitle ?? title : title} />
      </h2>
      {(intro || retroIntro) && (
        <motion.p
          className="section-heading__intro"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          {isRetro ? retroIntro ?? intro : intro}
        </motion.p>
      )}
    </header>
  );
}
