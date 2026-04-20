import { useState, useCallback } from 'react';
import { K } from '../utils/constants.js';
import { safeJsonParse } from '../utils/moyasarHelpers.js';

function readFromStorage() {
  return {
    pid: localStorage.getItem(K.pid) ?? null,
    tok: localStorage.getItem(K.tok) ?? null,
    src: safeJsonParse(localStorage.getItem(K.src), null),
  };
}

/**
 * Tracks the last payment ID, token, and source.
 * Persisted in localStorage for reload survivability.
 */
export function usePaymentResult() {
  const [result, setResultState] = useState(readFromStorage);

  const setResult = useCallback((payment) => {
    const pid = payment?.id ?? null;
    const tok = payment?.source?.token ?? null;
    const src = payment?.source ?? null;

    if (pid) localStorage.setItem(K.pid, pid);
    if (tok) localStorage.setItem(K.tok, tok);
    else localStorage.removeItem(K.tok);
    localStorage.setItem(K.src, JSON.stringify(src));

    setResultState({ pid, tok, src });
  }, []);

  const clearResult = useCallback(() => {
    localStorage.removeItem(K.pid);
    localStorage.removeItem(K.tok);
    localStorage.removeItem(K.src);
    setResultState({ pid: null, tok: null, src: null });
  }, []);

  return { result, setResult, clearResult };
}
