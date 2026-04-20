import { useState, useCallback } from 'react';
import { K, DEFAULT_CONFIG } from '../utils/constants.js';
import { safeJsonParse } from '../utils/moyasarHelpers.js';

function loadConfig() {
  const saved = safeJsonParse(localStorage.getItem(K.cfg), null);
  if (!saved) return { ...DEFAULT_CONFIG };
  // Deep merge to ensure all keys exist
  return {
    ...DEFAULT_CONFIG,
    ...saved,
    apple_pay: { ...DEFAULT_CONFIG.apple_pay, ...(saved.apple_pay ?? {}) },
  };
}

function saveConfig(cfg) {
  localStorage.setItem(K.cfg, JSON.stringify(cfg));
}

/**
 * Config persisted in localStorage under moyasar_ui_cfg_v1.
 */
export function useConfig() {
  const [config, setConfigState] = useState(loadConfig);

  const setConfig = useCallback((updater) => {
    setConfigState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveConfig(next);
      return next;
    });
  }, []);

  const updateConfig = useCallback((partial) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  }, [setConfig]);

  return { config, setConfig, updateConfig };
}
