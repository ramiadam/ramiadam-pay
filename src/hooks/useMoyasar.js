import { useState, useEffect } from 'react';

/**
 * Returns whether window.Moyasar is available.
 * Since the CDN script is synchronous in <head>, this should be true immediately,
 * but we guard defensively.
 */
export function useMoyasar() {
  const [ready, setReady] = useState(() => typeof window !== 'undefined' && !!window.Moyasar);

  useEffect(() => {
    if (window.Moyasar) {
      setReady(true);
      return;
    }
    // Fallback poll in case script somehow loads async
    const interval = setInterval(() => {
      if (window.Moyasar) {
        setReady(true);
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return ready;
}
