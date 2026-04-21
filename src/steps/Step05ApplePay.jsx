// src/steps/Step05ApplePay.jsx
import { useState } from 'react';
import { StepCard } from '../components/ui/StepCard.jsx';
import { Annotation } from '../components/ui/Annotation.jsx';
import { Pill } from '../components/ui/Pill.jsx';
import { PaymentFormMount } from '../components/forms/PaymentFormMount.jsx';
import { PostPaymentActions } from './PostPayment/PostPaymentActions.jsx';
import { JsonDisplay } from '../components/ui/JsonDisplay.jsx';
import { AmountField } from '../components/forms/AmountField.jsx';
import { MetadataFields } from '../components/forms/MetadataFields.jsx';
import { CodeSnippet } from '../components/ui/CodeSnippet.jsx';
import { useLearnMode } from '../hooks/useLearnMode.js';
import { DEFAULT_VALIDATE_URL } from '../utils/constants.js';
import styles from './Step05ApplePay.module.css';

function checkApplePay() {
  const has = typeof window.ApplePaySession !== 'undefined';
  let canPay = false;
  if (has && typeof ApplePaySession.canMakePayments === 'function') {
    try { canPay = ApplePaySession.canMakePayments(); } catch { canPay = false; }
  }
  return { has, canPay };
}

const APPLE_CODE = `Moyasar.init({
  element: '#moyasar-form',
  publishable_api_key: 'pk_test_...',
  amount: 10000,
  currency: 'SAR',
  methods: ['applepay'],
  applepay: {
    country: 'SA',
    label: 'My Store',
    merchant_validation_url: 'https://api.moyasar.com/v1/applepay/initiate',
  },
});
// Requires HTTPS in production
// Requires Safari on Apple device with a configured wallet`;

const DEFAULT_METADATA = { order_id: 'ord_004', scenario: 'apple-pay' };

export function Step05ApplePay({ config, updateConfig, secretKey, setResult, isLive, onComplete }) {
  const { mode, setMode } = useLearnMode(5);
  const isLearn = mode === 'learn';

  const { has: hasSession, canPay } = checkApplePay();
  const applePayAvailable = hasSession && canPay;

  const [localAmount, setLocalAmount] = useState(config.amount ?? 10000);
  const [apLabel, setApLabel] = useState(config.apple_pay?.label ?? 'My Store');
  const [localMetadata, setLocalMetadata] = useState(config.metadata ?? DEFAULT_METADATA);
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState(null);
  const [formMounted, setFormMounted] = useState(false);
  const [formKey, setFormKey] = useState(1);

  const localCfg = {
    ...config,
    amount: localAmount,
    metadata: localMetadata,
    methods: ['applepay'],
    manual: false,
    save_card: false,
    apple_pay: {
      country: 'SA',
      label: apLabel,
      merchant_validation_url: DEFAULT_VALIDATE_URL,
      manual: false,
      save_card: false,
    },
  };

  function handleCompleted(p) {
    setPayment(p);
    setError(null);
    setResult(p);
  }

  function loadForm() {
    updateConfig({ amount: localAmount, apple_pay: { ...config.apple_pay, label: apLabel }, metadata: localMetadata });
    setFormMounted(true);
    setFormKey((k) => k + 1);
    setPayment(null);
    setError(null);
  }

  return (
    <StepCard stepNum={5} title="Apple Pay" mode={mode} onModeChange={setMode}>
      {isLearn && (
        <div className={styles.conceptBox}>
          <div className={styles.conceptTitle}>What is this?</div>
          <p className={styles.conceptText}>
            Apple Pay is available when the user is on Safari on a device with a configured
            Apple Pay wallet. MPF shows the Apple Pay button automatically when detected.
            You provide a country code, merchant label, and a merchant validation URL —
            Moyasar provides the endpoint for you.
          </p>
        </div>
      )}

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
          Apple Pay is not available on this device or browser. You can still explore the
          config below and skip to the next step.
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
        {isLearn && <div className="hint">Shown on the Apple Pay payment sheet next to the amount.</div>}
      </div>

      {isLearn && (
        <div className="field">
          <label>Merchant Validation URL</label>
          <input type="text" value={DEFAULT_VALIDATE_URL} readOnly />
          <div className="hint">Moyasar&apos;s Apple Pay initiation endpoint — fixed for both test and live.</div>
        </div>
      )}

      <MetadataFields value={localMetadata} onChange={setLocalMetadata} />

      {isLearn && <CodeSnippet label="What runs under the hood" code={APPLE_CODE} />}

      <div className="row">
        <button type="button" className="btn primary" onClick={loadForm}>
          {formMounted
            ? 'Re-init Form'
            : isLive
              ? 'I understand — Load Live Form'
              : 'Load Payment Form'}
        </button>
        <button type="button" className="btn" onClick={onComplete}>
          Skip (Apple Pay unavailable)
        </button>
      </div>

      {formMounted && (
        <PaymentFormMount
          key={formKey}
          cfg={localCfg}
          onCompleted={handleCompleted}
          onFailure={(e) => setError(e)}
          formKey={String(formKey)}
        />
      )}

      {error && <JsonDisplay data={error} label="Payment failure" />}

      {payment && (
        <>
          <JsonDisplay data={payment} label="Payment completed" />
          <PostPaymentActions
            paymentId={payment.id}
            amount={payment.amount ?? localAmount}
            secretKey={secretKey}
          />
          <button type="button" className="btn primary" onClick={onComplete}>
            Continue to Samsung Pay
          </button>
        </>
      )}
    </StepCard>
  );
}
