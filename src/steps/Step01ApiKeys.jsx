import { useState } from 'react';
import { StepCard } from '../components/ui/StepCard.jsx';
import { Annotation } from '../components/ui/Annotation.jsx';
import { LiveKeyWarning } from '../components/ui/LiveKeyWarning.jsx';
import { isLiveKey, isValidPublishableKey, isValidSecretKey, redactKey } from '../utils/keyValidation.js';
import styles from './Step01ApiKeys.module.css';

export function Step01ApiKeys({ config, updateConfig, secretKey, setSecretKey, onComplete }) {
  const [pkInput, setPkInput] = useState(config.publishable_key ?? '');
  const [skInput, setSkInput] = useState(secretKey ?? '');
  const [submitted, setSubmitted] = useState(false);

  const pkLive = isLiveKey(pkInput);
  const skLive = isLiveKey(skInput);
  const pkValid = isValidPublishableKey(pkInput);
  const skValid = isValidSecretKey(skInput);

  function handleSave() {
    setSubmitted(true);
    if (!pkValid) return;
    updateConfig({ publishable_key: pkInput.trim() });
    setSecretKey(skInput.trim());
    onComplete();
  }

  function pkStatus() {
    if (!pkInput) return null;
    if (pkLive) return <span className={styles.warn}>Live key — real payments will be charged</span>;
    if (pkValid) return <span className={styles.ok}>Valid test key</span>;
    return <span className={styles.warn}>Should start with pk_test_... or pk_live_...</span>;
  }

  function skStatus() {
    if (!skInput) return null;
    if (skLive) return <span className={styles.warn}>Live key — real operations will execute</span>;
    if (skValid) return <span className={styles.ok}>Valid test key ({redactKey(skInput)})</span>;
    return <span className={styles.warn}>Should start with sk_test_... or sk_live_...</span>;
  }

  return (
    <StepCard
      stepNum={1}
      title="API Keys"
      concept="Every Moyasar integration needs a publishable key for client-side payment forms and a secret key for server-side admin operations. In this test bench, both stay in your browser — the publishable key in localStorage, the secret key in sessionStorage (cleared when you close the tab)."
    >
      <Annotation>
        Get your keys from the{' '}
        <strong>Moyasar Dashboard → Developers → API Keys</strong>. Use{' '}
        <code>pk_test_...</code> / <code>sk_test_...</code> for testing, or live keys to run
        real transactions. The secret key is optional but required for Fetch, Refund, Capture and Void.
      </Annotation>

      {(pkLive || skLive) && <LiveKeyWarning context="Payment form and admin operations" />}

      <div className="field">
        <label htmlFor="pk-input">Publishable Key <span aria-hidden="true">*</span></label>
        <input
          id="pk-input"
          type="text"
          placeholder="pk_test_xxx"
          value={pkInput}
          onChange={(e) => setPkInput(e.target.value.trim())}
          aria-describedby="pk-hint"
          autoComplete="off"
          spellCheck="false"
        />
        <div id="pk-hint" className={styles.keyHint}>
          <div className={styles.keyStatus}>{pkStatus()}</div>
          Stored in localStorage. Visible in the browser — that is expected for publishable keys.
        </div>
      </div>

      {submitted && !pkValid && !pkLive && (
        <div className="hint" style={{ color: '#fca5a5' }}>
          A valid publishable key is required to continue.
        </div>
      )}

      <div className="field">
        <label htmlFor="sk-input">Secret Key <span className="hint">(optional)</span></label>
        <input
          id="sk-input"
          type="password"
          placeholder="sk_test_xxx"
          value={skInput}
          onChange={(e) => setSkInput(e.target.value.trim())}
          aria-describedby="sk-hint"
          autoComplete="off"
        />
        <div id="sk-hint" className={styles.keyHint}>
          <div className={styles.keyStatus}>{skStatus()}</div>
          Stored in sessionStorage — cleared when you close this tab. Never saved permanently.
        </div>
      </div>

      <button
        type="button"
        className="btn primary"
        onClick={handleSave}
      >
        {pkLive || skLive ? 'Continue with Live Keys' : 'Save Keys and Continue'}
      </button>
    </StepCard>
  );
}
