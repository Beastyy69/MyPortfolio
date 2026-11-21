import { useEffect, useRef, useState } from 'react';
import { useMode } from '../../context/ModeContext.jsx';

/**
 * Background music toggle (navbar).
 * Track: Juice WRLD & Cordae – "Doomsday" (Instrumental), served from
 * /public/audio. Browsers block autoplay with sound, so music starts only
 * when the visitor presses the button. Loops at a gentle volume; the small
 * equaliser bars move only while playing.
 */
const SRC = '/audio/doomsday-instrumental.mp3';

export default function MusicToggle() {
  const { isRetro } = useMode();
  const audio = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const a = new Audio(SRC);
    a.loop = true;
    a.volume = 0.35;
    a.preload = 'none';
    a.addEventListener('pause', () => setPlaying(false));
    a.addEventListener('play', () => setPlaying(true));
    audio.current = a;
    return () => {
      a.pause();
      audio.current = null;
    };
  }, []);

  const toggle = async () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) {
      try {
        await a.play();
      } catch {
        setPlaying(false);
      }
    } else a.pause();
  };

  return (
    <button
      type="button"
      className={`music ${playing ? 'is-on' : ''}`}
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? 'Pause music: Doomsday instrumental' : 'Play music: Doomsday instrumental'}
      title={playing ? 'Pause music' : 'Play music — Doomsday (Instrumental)'}
      data-cursor={playing ? 'Pause' : 'Play'}
    >
      <span className="music__bars" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="music__label">{isRetro ? (playing ? 'BGM ON' : 'BGM') : playing ? 'Music on' : 'Music'}</span>
    </button>
  );
}
