import { useState } from 'react';
import { StepCard } from '../components/ui/StepCard.jsx';
import { Annotation } from '../components/ui/Annotation.jsx';
import { PaymentFormMount } from '../components/forms/PaymentFormMount.jsx';
import { JsonDisplay } from '../components/ui/JsonDisplay.jsx';
import { AmountField } from '../components/forms/AmountField.jsx';
import { CopyableValue } from '../components/ui/CopyableValue.jsx';
import { useAdminCall } from '../hooks/useAdminCall.js';
import { MOYASAR_API } from '../utils/constants.js';
import styles from './Step05SaveCardToken.module.css';

export function Step05SaveCardToken({ config, updateConfig, secretKey, result, setResult, onComplete }) {
  // Phase 1: save card
  const [localAmount, setLocalAmount] = useState(config.amount ?? 10000);
  const [payment, setPayment] = useState(null);
  const [error1, setError1] = useState(null);
  const [formKey, setFormKey] = useState(0);

  // Phase 2: token pay
  const [tokenAmount, setTokenAmount] = useState(config.amount ?? 10000);
  const [tokenPayDesc, setTokenPayDesc] = useState('Token payment from wizard');
  const [use3ds, setUse3ds] = useState(true);
  const { call: tokenCall, output: tokenOutput, loading: tokenLoading } = useAdminCall(secretKey);

  const savedToken = payment?.source?.token ?? result?.tok ?? null;

  const localCfg = {
    ...config,
    amount: localAmount,
    methods: ['creditcard'],
    manual: false,
    save_card: true,
  };

  function handleCompleted(p) {
    setPayment(p);
    setError1(null);
    setResult(p);
    onComplete();
  }

  function reInit() {
    updateConfig({ amount: localAmount });
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
        source: {
          type: 'token',
          token: savedToken,
          '3ds': use3ds,
          manual: false,
        },
        metadata: config.metadata ?? {},
      },
    });
  }

  return (
    <StepCard
      stepNum={5}
      title="Save Card + Token Pay"
      concept="save_card: true instructs MPF to tokenize the card after a successful payment. Moyasar returns a token in payment.source.token. You can reuse this token for future charges without the customer re-entering their card."
    >
      {/* Phase 1 */}
      <div className={styles.phase}>
        <div className={styles.phaseLabel}>Phase 1</div>
        <h3 className={styles.phaseTitle}>Save Card on Payment</h3>
        <Annotation>
          <code>save_card: true</code> in both <code>Moyasar.init()</code> and the{' '}
          <code>credit_card</code> block. After payment, check{' '}
          <code>payment.source.token</code> — that is the card token for future use.
        </Annotation>

        <AmountField value={localAmount} onChange={setLocalAmount} id="sc-amount" />

        <div className="row" style={{ marginTop: 8 }}>
          <button type="button" className="btn primary" onClick={reInit}>
            {formKey === 0 ? 'Load Payment Form' : 'Re-init Form'}
          </button>
        </div>

        <PaymentFormMount
          key={formKey}
          cfg={localCfg}
          onCompleted={handleCompleted}
          onFailure={setError1}
          formKey={String(formKey)}
        />

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

      {/* Phase 2 */}
      {savedToken && (
        <div className={styles.phase}>
          <div className={styles.phaseLabel}>Phase 2</div>
          <h3 className={styles.phaseTitle}>Token Pay (Recurring Charge)</h3>
          <Annotation>
            <code>POST /v1/payments</code> with <code>source.type: "token"</code> and the
            saved token. This charges the card without the customer being present.
            Set <code>3ds: true</code> to trigger a 3DS challenge (recommended).
          </Annotation>

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
            <input
              type="checkbox"
              checked={use3ds}
              onChange={(e) => setUse3ds(e.target.checked)}
            />
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
            {tokenLoading ? 'Processing…' : 'Charge Using Token'}
          </button>

          {!secretKey && (
            <div className="hint">Secret key required for token payments.</div>
          )}

          {tokenOutput && <JsonDisplay data={tokenOutput} label="Token payment response" />}
        </div>
      )}

      {(payment || savedToken) && (
        <button type="button" className="btn primary" onClick={onComplete}>
          Continue to Samsung Pay
        </button>
      )}
    </StepCard>
  );
}
