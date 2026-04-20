import { useState } from 'react';

export function useLearnMode(stepIndex) {
  const key = `rtb_step_${stepIndex}_mode`;
  const [mode, setModeState] = useState(() => localStorage.getItem(key) ?? 'learn');

  function setMode(m) {
    setModeState(m);
    localStorage.setItem(key, m);
  }

  return { mode, setMode };
}
