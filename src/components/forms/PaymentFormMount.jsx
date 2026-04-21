import { useRef, useEffect, useId } from 'react';
import styles from './PaymentFormMount.module.css';
import { buildMoyasarConfig } from '../../utils/moyasarHelpers.js';

export function PaymentFormMount({ cfg, onCompleted, onFailure, formKey = '0' }) {
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

    return () => { active = false; };  // marks this mount's listeners as stale
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
