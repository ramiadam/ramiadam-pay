import { useState } from 'react';
import { StepCard } from '../components/ui/StepCard.jsx';
import { Annotation } from '../components/ui/Annotation.jsx';
import { PaymentFormMount } from '../components/forms/PaymentFormMount.jsx';
import { PostPaymentActions } from './PostPayment/PostPaymentActions.jsx';
import { JsonDisplay } from '../components/ui/JsonDisplay.jsx';
import { AmountField } from '../components/forms/AmountField.jsx';
import { MetadataFields } from '../components/forms/MetadataFields.jsx';
import { CodeSnippet } from '../components/ui/CodeSnippet.jsx';
import { useLearnMode } from '../hooks/useLearnMode.js';
import styles from './Step04AuthorizeOnly.module.css';

const DEFAULT_METADATA = { order_id: 'ord_003', scenario: 'authorize-capture' };

const AUTH_CODE = `Moyasar.init({
  element: '#moyasar-form',
  publishable_api_key: 'pk_test_...',
  amount: 10000,
  methods: ['creditcard'],
  credit_card: { manual: true },
});
// payment.status === 'authorized' — funds held, not charged
// Capture: POST https://api.moyasar.com/v1/payments/{id}/capture
// Void:    POST https://api.moyasar.com/v1/payments/{id}/void`;

export function Step04AuthorizeOnly({ config, updateConfig, secretKey, setResult, isLive, onComplete }) {
  const { mode, setMode } = useLearnMode(4);
  const isLearn = mode === 'learn';

  const [localAmount, setLocalAmount] = useState(config.amount ?? 10000);
  const [localMetadata, setLocalMetadata] = useState(config.metadata ?? DEFAULT_METADATA);
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState(null);
  const [formMounted, setFormMounted] = useState(false);
  const [formKey, setFormKey] = useState(1);

  const localCfg = {
    ...config,
    amount: localAmount,
    metadata: localMetadata,
    methods: ['creditcard'],
    manual: true,
    save_card: false,
  };

  function handleCompleted(p) {
    setPayment(p);
    setError(null);
    setResult(p);
  }

  function loadForm() {
    updateConfig({ amount: localAmount, metadata: localMetadata });
    setFormMounted(true);
    setFormKey((k) => k + 1);
    setPayment(null);
    setError(null);
  }

  return (
    <StepCard stepNum={4} title="Authorize + Capture" mode={mode} onModeChange={setMode}>
      {isLearn && (
        <div className={styles.conceptBox}>
          <div className={styles.conceptTitle}>What is this?</div>
          <p className={styles.conceptText}>
            <code>manual: true</code> creates an authorization hold — the funds are reserved
            on the card but not yet charged. You then call{' '}
            <code>POST /payments/{'{id}'}/capture</code> to collect the money, or{' '}
            <code>POST /payments/{'{id}'}/void</code> to release the hold without charging.
            Common for hotel pre-authorizations and delayed-fulfillment flows.
          </p>
        </div>
      )}

      <div className={styles.authBadge}>
        <span>manual: true</span>
      </div>

      <AmountField value={localAmount} onChange={setLocalAmount} id="auth-amount" />
      {isLearn && <div className="hint">Amount held on the card — not charged until captured.</div>}

      <MetadataFields value={localMetadata} onChange={setLocalMetadata} />

      {isLearn && (
        <Annotation>
          After a successful authorize, the payment status is <code>authorized</code> (not{' '}
          <code>paid</code>). Use the Capture tab below to complete the charge, or Void to
          release the hold.
        </Annotation>
      )}

      {isLearn && <CodeSnippet label="What runs under the hood" code={AUTH_CODE} />}

      <div className="row">
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
          onFailure={(e) => setError(e)}
          formKey={String(formKey)}
          stepIndex={4}
        />
      )}

      {error && <JsonDisplay data={error} label="Payment failure" />}

      {payment && (
        <>
          <JsonDisplay data={payment} label="Authorization result (status: 'authorized')" />
          <PostPaymentActions
            paymentId={payment.id}
            amount={payment.amount ?? localAmount}
            secretKey={secretKey}
            showCapture
          />
          {isLearn && (
            <Annotation>
              Capture collects the held amount (can be less than the authorized amount).
              Void releases the hold without any charge — the customer is never billed.
            </Annotation>
          )}
          <button type="button" className="btn primary" onClick={onComplete}>
            Continue to Apple Pay
          </button>
        </>
      )}
    </StepCard>
  );
}
