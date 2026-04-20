import { useState } from 'react';
import { StepCard } from '../components/ui/StepCard.jsx';
import { Annotation } from '../components/ui/Annotation.jsx';
import { PaymentFormMount } from '../components/forms/PaymentFormMount.jsx';
import { PostPaymentActions } from './PostPayment/PostPaymentActions.jsx';
import { AmountField } from '../components/forms/AmountField.jsx';
import { JsonDisplay } from '../components/ui/JsonDisplay.jsx';
import { TEST_CARDS } from '../utils/constants.js';
import styles from './Step02CardPayment.module.css';

export function Step02CardPayment({ config, updateConfig, secretKey, setResult, result, onComplete }) {
  const [localAmount, setLocalAmount] = useState(config.amount ?? 10000);
  const [localDesc, setLocalDesc] = useState(config.description ?? 'Test card payment');
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState(null);
  const [formKey, setFormKey] = useState(0);

  const localCfg = {
    ...config,
    amount: localAmount,
    description: localDesc,
    methods: ['creditcard'],
    manual: false,
    save_card: false,
  };

  function handleCompleted(p) {
    setPayment(p);
    setError(null);
    setResult(p);
    onComplete();
  }

  function handleFailure(e) {
    setError(e);
  }

  function reInit() {
    updateConfig({ amount: localAmount, description: localDesc });
    setFormKey((k) => k + 1);
    setPayment(null);
    setError(null);
  }

  return (
    <StepCard
      stepNum={2}
      title="Card Payment"
      concept="The Moyasar Payment Form (MPF) handles card input, 3DS, and submission entirely client-side. You initialize it with your publishable key, amount, and config — it fires on_completed or on_failure callbacks."
    >
      <Annotation>
        <code>methods: ['creditcard']</code> renders only the card form.{' '}
        <code>amount</code> is in halalas (smallest unit) — 10000 = 100.00 SAR.
        Use the test cards below; real cards will be declined in test mode.
      </Annotation>

      <div className={styles.testCards}>
        <div className={styles.testCardsTitle}>Test cards (use in test mode only)</div>
        <table className={styles.testCardTable}>
          <thead>
            <tr>
              <th>Network</th>
              <th>Card Number</th>
              <th>Expiry</th>
              <th>CVC</th>
              <th>Outcome</th>
            </tr>
          </thead>
          <tbody>
            {TEST_CARDS.map((card) => (
              <tr key={card.number}>
                <td>{card.network}</td>
                <td>{card.number}</td>
                <td>12/25</td>
                <td>100</td>
                <td><span className={styles.outcome}>{card.outcome}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AmountField
        value={localAmount}
        onChange={setLocalAmount}
        id="card-amount"
      />

      <div className="field">
        <label htmlFor="card-desc">Description</label>
        <input
          id="card-desc"
          type="text"
          value={localDesc}
          onChange={(e) => setLocalDesc(e.target.value)}
          placeholder="Test card payment"
        />
      </div>

      <div className="row">
        <button type="button" className="btn primary" onClick={reInit}>
          {formKey === 0 ? 'Load Payment Form' : 'Re-init Form'}
        </button>
      </div>

      <PaymentFormMount
        key={formKey}
        cfg={localCfg}
        onCompleted={handleCompleted}
        onFailure={handleFailure}
        formKey={String(formKey)}
      />

      {error && (
        <JsonDisplay data={error} label="Payment failure" />
      )}

      {payment && (
        <>
          <JsonDisplay data={payment} label="Payment completed (on_completed callback)" />
          <PostPaymentActions
            paymentId={payment.id}
            token={payment?.source?.token}
            amount={payment.amount ?? localAmount}
            secretKey={secretKey}
          />
          <button type="button" className="btn primary" onClick={onComplete}>
            Continue to Apple Pay
          </button>
        </>
      )}
    </StepCard>
  );
}
