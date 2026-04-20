import { useState, useCallback } from 'react';
import { SK_KEY } from '../utils/constants.js';
import { isLiveKey } from '../utils/keyValidation.js';

/**
 * Secret key stored in sessionStorage (tab-scoped, cleared on close).
 * Exposes isLive flag so callers can block admin operations.
 */
export function useSecretKey() {
  const [secretKey, setSecretKeyState] = useState(
    () => sessionStorage.getItem(SK_KEY) ?? ''
  );

  const setSecretKey = useCallback((val) => {
    const trimmed = (val ?? '').trim();
    if (trimmed) {
      sessionStorage.setItem(SK_KEY, trimmed);
    } else {
      sessionStorage.removeItem(SK_KEY);
    }
    setSecretKeyState(trimmed);
  }, []);

  return {
    secretKey,
    setSecretKey,
    isLive: isLiveKey(secretKey),
    hasKey: secretKey.length > 0,
  };
}
