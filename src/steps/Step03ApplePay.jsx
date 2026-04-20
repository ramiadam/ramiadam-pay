import { useState } from 'react';
import { StepCard } from '../components/ui/StepCard.jsx';
import { Annotation } from '../components/ui/Annotation.jsx';
import { Pill } from '../components/ui/Pill.jsx';
import { PaymentFormMount } from '../components/forms/PaymentFormMount.jsx';
import { PostPaymentActions } from './PostPayment/PostPaymentActions.jsx';
import { JsonDisplay } from '../components/ui/JsonDisplay.jsx';
import { AmountField } from '../components/forms/AmountField.jsx';
import { DEFAULT_VALIDATE_URL } from '../utils/constants.js';
import styles from './Step03ApplePay.module.css';

function checkApplePay() {
  const has = typeof window.ApplePaySession !== 'undefined';
  let canPay = false;
  if (has && typeof ApplePaySession.canMakePayments === 'function') {
    try { canPay = ApplePaySession.canMakePayments(); } catch { canPay = false; }
  }
  return { has, canPay };
}

export function Step03ApplePay({ config, updateConfig, secretKey, setResult, onComplete }) {
  const { has: hasSession, canPay } = checkApplePay();
  const applePayAvailable = hasSession && canPay;

  const [localAmount, setLocalAmount] = useState(config.amount ?? 10000);
  const [apLabel, setApLabel] = useState(config.apple_pay?.label ?? 'My Store');
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState(null);
  const [formKey, setFormKey] = useState(0);

  const localCfg = {
    ...config,
    amount: localAmount,
    methods: ['applepay'],
    manual: false,
    save_card: false,
    apple_pay: {
      country: 'SA',
      label: apLabel,
      validate_merchant_url: DEFAULT_VALIDATE_URL,
      manual: false,
      save_card: false,
    },
  };

  function handleCompleted(p) {
    setPayment(p);
    setError(null);
    setResult(p);
    onComplete();
  }

  function reInit() {
    updateConfig({ amount: localAmount, apple_pay: { ...config.apple_pay, label: apLabel } });
    setFormKey((k) => k + 1);
    setPayment(null);
    setError(null);
  }

  return (
    <StepCard
      stepNum={3}
      title="Apple Pay"
      concept="Apple Pay is available when the user is on a Safari browser on a device with a configured Apple Pay wallet. MPF shows the Apple Pay button automatically when available. You provide a country, label, and merchant validation URL."
    >
      <Annotation>
        <code>methods: ['applepay']</code> renders the Apple Pay button when available.
        The <code>validate_merchant_url</code> calls Moyasar's Apple Pay initiation endpoint.
        Apple Pay requires HTTPS in production.
      </Annotation>

      <div className={styles.availability}>
        <Pill variant={hasSession ? 'ok' : 'bad'}>
          ApplePaySession: {String(hasSession)}
        </Pill>
        <Pill variant={canPay ? 'ok' : 'bad'}>
          canMakePayments: {String(canPay)}
        </Pill>
      </div>

      {!applePayAvailable && (
        <div className={styles.skipNote}>
          Apple Pay is not available on this device or browser. You can still explore
          the config below and skip to the next step.
        </div>
      )}

      <AmountField value={localAmount} onChange={setLocalAmount} id="ap-amount" />

      <div className="field">
        <label htmlFor="ap-label">Apple Pay Label</label>
        <input
          id="ap-label"
          type="text"
          value={apLabel}
          onChange={(e) => setApLabel(e.target.value)}
          placeholder="My Store"
        />
        <div className="hint">Shown on the Apple Pay sheet next to the amount.</div>
      </div>

      <div className="field">
        <label>Merchant Validation URL</label>
        <input type="text" value={DEFAULT_VALIDATE_URL} readOnly />
        <div className="hint">Moyasar's Apple Pay initiation endpoint — fixed for test mode.</div>
      </div>

      <div className="row">
        <button type="button" className="btn primary" onClick={reInit}>
          {formKey === 0 ? 'Load Payment Form' : 'Re-init Form'}
        </button>
        <button type="button" className="btn" onClick={onComplete}>
          Skip (Apple Pay unavailable)
        </button>
      </div>

      <PaymentFormMount
        key={formKey}
        cfg={localCfg}
        onCompleted={handleCompleted}
        onFailure={setError}
        formKey={String(formKey)}
      />

      {error && <JsonDisplay data={error} label="Payment failure" />}

      {payment && (
        <>
          <JsonDisplay data={payment} label="Payment completed" />
          <PostPaymentActions
            paymentId={payment.id}
            token={payment?.source?.token}
            amount={payment.amount ?? localAmount}
            secretKey={secretKey}
          />
          <button type="button" className="btn primary" onClick={onComplete}>
            Continue to Authorize Only
          </button>
        </>
      )}
    </StepCard>
  );
}
