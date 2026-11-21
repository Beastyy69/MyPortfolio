import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const ToastContext = createContext(() => {});

/** Tiny toast system for achievement / easter‑egg feedback. */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const id = useRef(0);

  const push = useCallback((toast) => {
    const key = ++id.current;
    setToasts((t) => [...t.slice(-2), { ...toast, key }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.key !== key)), toast.duration ?? 3200);
  }, []);

  const value = useMemo(() => push, [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.key}
              layout
              className="toast"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            >
              <span>
                <strong>{t.title}</strong>
                {t.text && <small>{t.text}</small>}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
