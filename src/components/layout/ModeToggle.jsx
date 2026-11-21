import { LayoutGroup, motion } from 'framer-motion';
import { useMode } from '../../context/ModeContext.jsx';
import Icon from '../ui/Icon.jsx';

/** World switch between the two art directions. */
export default function ModeToggle({ compact = false }) {
  const { mode, switchMode, transition } = useMode();
  const isRetro = mode === 'retro';
  const thumb = <motion.span layoutId="mode-thumb" className="mode-toggle__thumb" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />;

  return (
    <LayoutGroup id={compact ? 'toggle-compact' : 'toggle-main'}>
      <button
        type="button"
        role="switch"
        aria-checked={isRetro}
        aria-label={`Game mode ${isRetro ? 'on' : 'off'}. Switch between AI/ML mode and Game mode`}
        className={`mode-toggle ${compact ? 'mode-toggle--compact' : ''}`}
        onClick={() => switchMode()}
        disabled={!!transition}
        data-cursor={isRetro ? 'AI/ML' : 'Play'}
      >
        <span className={`mode-toggle__opt ${!isRetro ? 'is-active' : ''}`}>
          {!isRetro && thumb}
          <Icon name="brain" size={15} />
          <span>{compact ? 'AI/ML' : 'AI/ML MODE'}</span>
        </span>
        <span className={`mode-toggle__opt ${isRetro ? 'is-active' : ''}`}>
          {isRetro && thumb}
          <Icon name="gamepad" size={15} />
          <span>{compact ? 'GAME' : 'GAME MODE'}</span>
        </span>
      </button>
    </LayoutGroup>
  );
}
