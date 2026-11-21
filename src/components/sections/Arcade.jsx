import Chapter from '../ui/Chapter.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import CoreRun from '../game/CoreRun.jsx';
import SafeBoundary from '../ui/SafeBoundary.jsx';

/** Game Mode only: the bonus level — Code Frontier: Core Run. */
export default function Arcade() {
  return (
    <Chapter id="arcade" ghost="CORE RUN" retroGhost="CORE RUN" className="arcade" labelledBy="arcade-title">
      <div className="container">
        <SectionHeading
          id="arcade-title"
          index="06"
          eyebrow="Bonus level"
          retroEyebrow="BONUS LEVEL"
          title="Code Frontier: Core Run"
          retroTitle="Core Run"
          retroIntro="An original 30‑round campaign built for this site. Each round has a timer and a data‑core target; every five rounds adds a new hazard, up to the final extraction. Keyboard or touch, and your progress is saved."
          align="center"
        />
        <div className="terminal">
          <div className="terminal__bar" aria-hidden="true">
            <span>FIELD TERMINAL · CF‑07</span>
            <span className="terminal__leds">
              <i />
              <i />
              <i />
            </span>
          </div>
          <SafeBoundary>
            <CoreRun />
          </SafeBoundary>
        </div>
      </div>
    </Chapter>
  );
}
