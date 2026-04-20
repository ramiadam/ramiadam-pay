import { useState, useCallback } from 'react';
import { MOYASAR_API } from '../utils/constants.js';
import { isLiveKey } from '../utils/keyValidation.js';

/**
 * Authenticated Moyasar admin API wrapper.
 * Refuses calls if the secret key is a live key.
 *
 * @param {string} secretKey — from useSecretKey
 */
export function useAdminCall(secretKey) {
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  const call = useCallback(async (path, options = {}) => {
    const { method = 'GET', body = null } = options;

    if (!secretKey) {
      setOutput({ error: 'Enter your secret key first.' });
      return null;
    }

    if (isLiveKey(secretKey)) {
      setOutput({ error: 'Live keys are not allowed in this test bench. Use sk_test_... keys only.' });
      return null;
    }

    setLoading(true);
    setOutput(null);

    try {
      const res = await fetch(MOYASAR_API + path, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa(secretKey + ':'),
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const text = await res.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch {
        json = { raw: text };
      }

      setOutput(json);
      return json;
    } catch (e) {
      const err = { error: 'Network error: ' + (e?.message ?? String(e)) };
      setOutput(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [secretKey]);

  return { call, output, loading, setOutput };
}
