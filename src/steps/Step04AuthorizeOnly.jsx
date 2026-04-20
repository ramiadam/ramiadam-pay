import { useState } from 'react';
import { StepCard } from '../components/ui/StepCard.jsx';
import { Annotation } from '../components/ui/Annotation.jsx';
import { PaymentFormMount } from '../components/forms/PaymentFormMount.jsx';
import { PostPaymentActions } from './PostPayment/PostPaymentActions.jsx';
import { JsonDisplay } from '../components/ui/JsonDisplay.jsx';
import { AmountField } from '../components/forms/AmountField.jsx';
import styles from './Step04AuthorizeOnly.module.css';

export function Step04AuthorizeOnly({ config, updateConfig, secretKey, setResult, onComplete }) {
  const [localAmount, setLocalAmount] = useState(config.amount ?? 10000);
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState(null);
  const [formKey, setFormKey] = useState(0);

  // manual: true is the defining feature of this step
  const localCfg = {
    ...config,
    amount: localAmount,
    methods: ['creditcard'],
    manual: true,
    save_card: false,
  };

  function handleCompleted(p) {
    setPayment(p);
    setError(null);
    setResult(p);
    onComplete();
  }

  function reInit() {
    updateConfig({ amount: localAmount });
    setFormKey((k) => k + 1);
    setPayment(null);
    setError(null);
  }

  return (
    <StepCard
      stepNum={4}
      title="Authorize Only (Manual Capture)"
      concept="Setting manual: true creates an authorization hold without charging the card. The funds are reserved. You then call POST /payments/{id}/capture to collect the money — or POST /payments/{id}/void to release the hold."
    >
      <Annotation>
        <code>manual: true</code> in <code>Moyasar.init()</code> and in the{' '}
        <code>credit_card</code> block enables the authorize-only flow. The payment status
        will be <code>authorized</code>, not <code>paid</code>. Use the Capture tab below
        to complete the charge, or Void to cancel it.
      </Annotation>

      <div className={styles.authBadge}>
        <span>manual: true</span>
      </div>

      <AmountField value={localAmount} onChange={setLocalAmount} id="auth-amount" />

      <div className="row">
        <button type="button" className="btn primary" onClick={reInit}>
          {formKey === 0 ? 'Load Payment Form' : 'Re-init Form'}
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
          <JsonDisplay data={payment} label="Authorization result (status should be 'authorized')" />
          <PostPaymentActions
            paymentId={payment.id}
            token={payment?.source?.token}
            amount={payment.amount ?? localAmount}
            secretKey={secretKey}
            showCapture
          />
          <button type="button" className="btn primary" onClick={onComplete}>
            Continue to Save Card
          </button>
        </>
      )}
    </StepCard>
  );
}
