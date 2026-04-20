import { useRef, useEffect, useId } from 'react';
import styles from './PaymentFormMount.module.css';
import { buildMoyasarConfig } from '../../utils/moyasarHelpers.js';
import { isLiveKey } from '../../utils/keyValidation.js';
import { LiveKeyWarning } from '../ui/LiveKeyWarning.jsx';

/**
 * Mounts a Moyasar Payment Form.
 *
 * To force a full remount when config changes, change the `formKey` prop.
 * This is done at call sites using a numeric key that increments on re-init.
 *
 * @param {Object}   cfg          - Internal config shape
 * @param {Function} onCompleted  - Called with payment object on success
 * @param {Function} onFailure    - Called with error on failure
 * @param {string}   formKey      - Changing this forces a full DOM remount
 */
export function PaymentFormMount({ cfg, onCompleted, onFailure, formKey = '0' }) {
  const mountRef = useRef(null);
  // Unique stable ID for the mount element — won't clash with other instances
  const instanceId = useId().replace(/:/g, '');
  const elementId = `moyasar-form-${instanceId}`;

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    if (!window.Moyasar) {
      if (onFailure) onFailure({ error: 'Moyasar not loaded. Check CDN / network / content blockers.' });
      return;
    }

    if (!cfg.publishable_key || !cfg.publishable_key.startsWith('pk_')) {
      return; // Render guard is handled below — don't call Moyasar.init
    }

    if (isLiveKey(cfg.publishable_key)) {
      return; // LiveKeyWarning renders below
    }

    if (!cfg.methods?.length) return;

    const callbackUrl = new URL('/thanks.html', window.location.href).toString();

    // Build the config using our helper — pass the specific element selector
    const moyasarCfg = {
      ...buildMoyasarConfig(cfg, callbackUrl),
      element: el,
    };

    try {
      Moyasar.init(moyasarCfg);

      if (typeof Moyasar.on === 'function') {
        Moyasar.on('completed', (payment) => {
          onCompleted?.(payment);
        });
        Moyasar.on('failure', (error) => {
          onFailure?.(error);
        });
      }
    } catch (e) {
      if (onFailure) {
        onFailure({ error: `Moyasar.init error: ${e?.message ?? String(e)}` });
      }
    }

    // No cleanup needed — we force remount via `key` prop at call sites
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formKey]); // Only re-run when formKey changes (i.e., full remount)

  if (!window.Moyasar) {
    return (
      <div className={styles.wrap}>
        <p className={`${styles.status} ${styles.error}`}>
          Moyasar not loaded. Check your network connection or content blockers.
        </p>
      </div>
    );
  }

  if (isLiveKey(cfg.publishable_key)) {
    return <LiveKeyWarning context="Payment form initialization" />;
  }

  if (!cfg.publishable_key || !cfg.publishable_key.startsWith('pk_')) {
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
