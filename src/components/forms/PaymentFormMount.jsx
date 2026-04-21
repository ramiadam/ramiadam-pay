import { useRef, useEffect, useId } from 'react';
import styles from './PaymentFormMount.module.css';
import { buildMoyasarConfig } from '../../utils/moyasarHelpers.js';
import { K } from '../../utils/constants.js';

export function PaymentFormMount({ cfg, onCompleted, onFailure, formKey = '0', stepIndex }) {
  const mountRef = useRef(null);
  const instanceId = useId().replace(/:/g, '');
  const elementId = `moyasar-form-${instanceId}`;

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    if (!window.Moyasar) {
      onFailure?.({ error: 'Moyasar not loaded. Check CDN / network / content blockers.' });
      return;
    }

    if (!cfg.publishable_key?.startsWith('pk_')) return;
    if (!cfg.methods?.length) return;

    let active = true;  // guard against stale listeners from prior mounts

    // Save the step index so thanks.html can redirect back here after a 3DS redirect
    if (stepIndex != null) localStorage.setItem(K.returnStep, String(stepIndex));

    const callbackUrl = new URL('/thanks.html', window.location.href).toString();
    const moyasarCfg = { ...buildMoyasarConfig(cfg, callbackUrl), element: el };

    try {
      Moyasar.init(moyasarCfg);
      if (typeof Moyasar.on === 'function') {
        Moyasar.on('completed', (payment) => { if (active) onCompleted?.(payment); });
        Moyasar.on('failure', (error) => { if (active) onFailure?.(error); });
      }
    } catch (e) {
      onFailure?.({ error: `Moyasar.init error: ${e?.message ?? String(e)}` });
    }

    // Force theme colors on MPF's plain-DOM inputs (name field).
    // CSS can't reliably beat MPF's own injected styles, so we set inline styles directly.
    const applyTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme') ?? 'dark';
      const color  = theme === 'dark' ? '#e6eaf0' : '#0b1220';
      const bg     = theme === 'dark' ? '#1e2130' : '#f7f9fc';
      el.querySelectorAll('input:not([type="hidden"]), select, textarea').forEach((input) => {
        input.style.setProperty('color', color, 'important');
        input.style.setProperty('-webkit-text-fill-color', color, 'important');
        input.style.setProperty('background-color', bg, 'important');
      });
    };
    // MPF renders synchronously but may paint on next tick
    applyTheme();
    const themeTimer = setTimeout(applyTheme, 50);

    return () => {
      active = false;
      clearTimeout(themeTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formKey]);

  if (!window.Moyasar) {
    return (
      <div className={styles.wrap}>
        <p className={`${styles.status} ${styles.error}`}>
          Moyasar not loaded. Check your network connection or content blockers.
        </p>
      </div>
    );
  }

  if (!cfg.publishable_key?.startsWith('pk_')) {
    return (
      <div className={styles.wrap}>
        <p className={styles.status}>
          Enter a publishable key (<code>pk_test_...</code>) to load the payment form.
        </p>
      </div>
    );
  }

  if (!cfg.methods?.length) {
    return (
      <div className={styles.wrap}>
        <p className={styles.status}>Select at least one payment method.</p>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div ref={mountRef} className={styles.mount} id={elementId} />
    </div>
  );
}
