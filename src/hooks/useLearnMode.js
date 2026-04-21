import { useState, useCallback } from 'react';
import { stepModeKey } from '../utils/constants.js';

export function useLearnMode(stepIndex) {
  const key = stepModeKey(stepIndex);
  const [mode, setModeState] = useState(() => localStorage.getItem(key) ?? 'learn');

  const setMode = useCallback((m) => {
    setModeState(m);
    localStorage.setItem(key, m);
  }, [key]);

  return { mode, setMode };
}
