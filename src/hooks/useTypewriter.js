import { useEffect, useState } from 'react';

/**
 * Types an array of lines one character at a time, then loops.
 * Returns the lines typed so far. Static (all lines) when `disabled`.
 */
export default function useTypewriter(lines, { speed = 28, pause = 2600, disabled = false } = {}) {
  const [state, setState] = useState({ line: 0, char: 0 });

  useEffect(() => {
    if (disabled) return undefined;
    const { line, char } = state;
    let delay = speed;
    let next;
    if (line >= lines.length) {
      delay = pause;
      next = { line: 0, char: 0 };
    } else if (char < lines[line].length) {
      next = { line, char: char + 1 };
    } else {
      delay = 380;
      next = { line: line + 1, char: 0 };
    }
    const id = setTimeout(() => setState(next), delay);
    return () => clearTimeout(id);
  }, [state, lines, speed, pause, disabled]);

  if (disabled) return lines;
  return lines.slice(0, state.line + 1).map((l, i) => (i < state.line ? l : l.slice(0, state.char)));
}
