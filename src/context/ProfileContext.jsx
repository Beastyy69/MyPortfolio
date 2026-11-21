import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const ProfileContext = createContext(null);

/**
 * Open/close state for the profile panel. Remembers where it was opened
 * from (for the reveal origin) and which photo opened it (`photoId`), so the
 * photo can morph into the panel with a shared Framer Motion layoutId.
 */
export function ProfileProvider({ children }) {
  const [state, setState] = useState(null); // { x, y, photoId }
  const opener = useRef(null);

  const open = useCallback((e, photoId = null) => {
    const el = e?.currentTarget;
    opener.current = el ?? document.activeElement;
    const r = el?.getBoundingClientRect?.();
    setState({
      x: r ? r.left + r.width / 2 : window.innerWidth / 2,
      y: r ? r.top + r.height / 2 : window.innerHeight / 2,
      photoId,
    });
  }, []);

  const close = useCallback(() => {
    setState(null);
    requestAnimationFrame(() => opener.current?.focus?.({ preventScroll: true }));
  }, []);

  const value = useMemo(() => ({ origin: state, photoId: state?.photoId ?? null, isOpen: !!state, open, close }), [state, open, close]);
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export const useProfile = () => useContext(ProfileContext);
