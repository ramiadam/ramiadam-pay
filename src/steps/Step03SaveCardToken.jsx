// src/steps/Step03SaveCardToken.jsx
import { useState, useEffect } from 'react';
import { StepCard } from '../components/ui/StepCard.jsx';
import { Annotation } from '../components/ui/Annotation.jsx';
import { PaymentFormMount } from '../components/forms/PaymentFormMount.jsx';
import { JsonDisplay } from '../components/ui/JsonDisplay.jsx';
import { AmountField } from '../components/forms/AmountField.jsx';
import { MetadataFields } from '../components/forms/MetadataFields.jsx';
import { CopyableValue } from '../components/ui/CopyableValue.jsx';
import { CodeSnippet } from '../components/ui/CodeSnippet.jsx';
import { useAdminCall } from '../hooks/useAdminCall.js';
import { useLearnMode } from '../hooks/useLearnMode.js';
import { MOYASAR_API } from '../utils/constants.js';
import styles from './Step03SaveCardToken.module.css';

const DEFAULT_METADATA = { order_id: 'ord_002', scenario: 'save-card' };

const PHASE1_CODE = `Moyasar.init({
  element: '#moyasar-form',
  publishable_api_key: 'pk_test_...',
  amount: 10000,
  currency: 'SAR',
  description: 'Save card payment',
  methods: ['creditcard'],
  credit_card: { save_card: true },
});
// After payment: payment.source.token → save this for recurring charges`;

const PHASE2_CODE = `// POST https://api.moyasar.com/v1/payments
// Authorization: Basic btoa('sk_test_...:')
{
  "amount": 10000,
  "currency": "SAR",
  "description": "Recurring charge",
  "callback_url": "https://your-site.com/thanks",
  "source": {
    "type": "token",
    "token": "<saved-token>",
    "3ds": true
  }
}`;

export function Step03SaveCardToken({ config, updateConfig, secretKey, result, setResult, isLive, onComplete }) {
  const { mode, setMode } = useLearnMode(3);
  const isLearn = mode === 'learn';

  const [localAmount, setLocalAmount] = useState(config.amount ?? 10000);
  const [localMetadata, setLocalMetadata] = useState(config.metadata ?? DEFAULT_METADATA);
  const [payment, setPayment] = useState(null);
  const [error1, setError1] = useState(null);
  const [formMounted, setFormMounted] = useState(false);
  const [formKey, setFormKey] = useState(1);

  const [tokenAmount, setTokenAmount] = useState(config.amount ?? 10000);
  const [tokenPayDesc, setTokenPayDesc] = useState('Token payment from wizard');
  const [use3ds, setUse3ds] = useState(true);
  const { call: tokenCall, output: tokenOutput, loading: tokenLoading } = useAdminCall(secretKey);

  // After a 3DS redirect we have result.pid but no token — fetch the full payment to hydrate it
  useEffect(() => {
    if (!result?.pid || result?.tok || !secretKey) return;
    fetch(`${MOYASAR_API}/payments/${result.pid}`, {
      headers: { Authorization: `Basic ${btoa(secretKey + ':')}` },
    })
      .then((r) => r.json())
      .then((p) => { if (p?.source?.token) setResult(p); })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const savedToken = payment?.source?.token ?? result?.tok ?? null;

  const localCfg = {
    ...config,
    amount: localAmount,
    metadata: localMetadata,
    methods: ['creditcard'],
    manual: false,
    save_card: true,
  };

  function handleCompleted(p) {
    setPayment(p);
    setError1(null);
    setResult(p);
  }

  function loadForm() {
    updateConfig({ amount: localAmount, metadata: localMetadata });
    setFormMounted(true);
    setFormKey((k) => k + 1);
    setPayment(null);
    setError1(null);
  }

  async function handleTokenPay() {
    if (!savedToken) return;
    const callbackUrl = new URL('/thanks.html', window.location.href).toString();
    await tokenCall('/payments', {
      method: 'POST',
      body: {
        amount: tokenAmount,
        currency: config.currency ?? 'SAR',
        description: tokenPayDesc,
        callback_url: callbackUrl,
        source: { type: 'token', token: savedToken, '3ds': use3ds, manual: false },
        metadata: localMetadata,
      },
    });
  }

  return (
    <StepCard stepNum={3} title="Save Card + Token Pay" mode={mode} onModeChange={setMode}>
      {isLearn && (
        <div className={styles.conceptBox}>
          <div className={styles.conceptTitle}>What is this?</div>
          <p className={styles.conceptText}>
            <code>save_card: true</code> instructs MPF to tokenize the card after a successful
            payment. Moyasar returns a token in <code>payment.source.token</code>. Reuse it for
            future charges without the customer re-entering their card — subscriptions and
            repeat purchases.
          </p>
        </div>
      )}

      <div className={styles.phase}>
        <div className={styles.phaseLabel}>Phase 1 — Save Card on Payment</div>

        {isLearn && (
          <Annotation>
            Set <code>save_card: true</code> inside the <code>credit_card</code> config block.
            After payment succeeds, <code>payment.source.token</code> holds the card token.
          </Annotation>
        )}

        <AmountField value={localAmount} onChange={setLocalAmount} id="sc-amount" />
        <MetadataFields value={localMetadata} onChange={setLocalMetadata} />

        <div className="row" style={{ marginTop: 8 }}>
          <button type="button" className="btn primary" onClick={loadForm}>
            {formMounted
              ? 'Re-init Form'
              : isLive
                ? 'I understand — Load Live Form'
                : 'Load Payment Form'}
          </button>
        </div>

        {formMounted && (
          <PaymentFormMount
            key={formKey}
            cfg={localCfg}
            onCompleted={handleCompleted}
            onFailure={setError1}
            formKey={String(formKey)}
            stepIndex={3}
          />
        )}

        {isLearn && <CodeSnippet label="Phase 1 — init config" code={PHASE1_CODE} />}

        {error1 && <JsonDisplay data={error1} label="Payment failure" />}

        {payment && (
          <>
            <JsonDisplay data={payment} label="Payment completed" />
            {savedToken && (
              <div>
                <div className="label" style={{ marginBottom: 6 }}>Saved token</div>
                <div className={styles.tokenChip}>
                  <CopyableValue value={savedToken} label="token" />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {savedToken && (
        <div className={styles.phase}>
          <div className={styles.phaseLabel}>Phase 2 — Token Pay (Recurring Charge)</div>

          {isLearn && (
            <Annotation>
              <code>POST /v1/payments</code> with <code>source.type: "token"</code> and the
              saved token. Charges the card without the customer being present. Set{' '}
              <code>3ds: true</code> to trigger a 3DS challenge (recommended for compliance).
            </Annotation>
          )}

          {isLearn && <CodeSnippet label="Phase 2 — token pay request body" code={PHASE2_CODE} />}

          <AmountField value={tokenAmount} onChange={setTokenAmount} id="tok-amount" />

          <div className="field">
            <label htmlFor="tok-desc">Description</label>
            <input
              id="tok-desc"
              type="text"
              value={tokenPayDesc}
              onChange={(e) => setTokenPayDesc(e.target.value)}
            />
          </div>

          <label className="toggle" style={{ maxWidth: 320 }}>
            <input type="checkbox" checked={use3ds} onChange={(e) => setUse3ds(e.target.checked)} />
            <div>
              <strong>3DS: true</strong>
              <br />
              <span className="hint">Trigger 3D Secure challenge</span>
            </div>
          </label>

          <div className="field">
            <label>Token</label>
            <input type="text" value={savedToken} readOnly />
          </div>

          <button
            type="button"
            className="btn primary"
            onClick={handleTokenPay}
            disabled={tokenLoading || !secretKey}
          >
            {tokenLoading ? 'Processing\u2026' : 'Charge Using Token'}
          </button>

          {!secretKey && <div className="hint">Secret key required for token payments.</div>}

          {tokenOutput && <JsonDisplay data={tokenOutput} label="Token payment response" />}
        </div>
      )}

      {(payment || savedToken) && (
        <button type="button" className="btn primary" onClick={onComplete}>
          Continue to Authorize + Capture
        </button>
      )}
    </StepCard>
  );
}
