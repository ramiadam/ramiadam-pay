import { useState } from 'react';
import { StepCard } from '../components/ui/StepCard.jsx';
import { Annotation } from '../components/ui/Annotation.jsx';
import { PaymentFormMount } from '../components/forms/PaymentFormMount.jsx';
import { PostPaymentActions } from './PostPayment/PostPaymentActions.jsx';
import { JsonDisplay } from '../components/ui/JsonDisplay.jsx';
import { AmountField } from '../components/forms/AmountField.jsx';
import styles from './Step07StcPay.module.css';

export function Step07StcPay({ config, updateConfig, secretKey, setResult, onComplete }) {
  const [localAmount, setLocalAmount] = useState(config.amount ?? 10000);
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [done, setDone] = useState(false);

  const localCfg = {
    ...config,
    amount: localAmount,
    methods: ['stcpay'],
    manual: false,
    save_card: false,
  };

  function handleCompleted(p) {
    setPayment(p);
    setError(null);
    setResult(p);
    onComplete();
  }

  function reInit() {
    setFormKey((k) => k + 1);
    setPayment(null);
    setError(null);
  }

  if (done) {
    return (
      <StepCard stepNum={7} title="Tutorial Complete!">
        <div className={styles.complete}>
          <div className={styles.completeIcon} aria-hidden="true">✓</div>
          <h3 className={styles.completeTitle}>You have completed the Moyasar Wizard</h3>
          <p className={styles.completeSub}>
            You have exercised card payments, Apple Pay, authorize-only capture,
            card tokenization, token pay, Samsung Pay, and STC Pay. You are ready
            to build your Moyasar integration.
          </p>
          <a
            href="https://docs.moyasar.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn primary"
          >
            Read Moyasar Docs
          </a>
        </div>
      </StepCard>
    );
  }

  return (
    <StepCard
      stepNum={7}
      title="STC Pay"
      concept="STC Pay is a popular Saudi digital wallet. MPF shows the STC Pay button and collects the customer's phone number (05xxxxxxxx format). The customer confirms in their STC Pay app."
    >
      <Annotation>
        <code>methods: ['stcpay']</code> enables STC Pay. The MPF renders a phone number
        field and an STC Pay button. The customer receives an OTP in their STC Pay app.
        STC Pay is specific to Saudi Arabia.
      </Annotation>

      <AmountField value={localAmount} onChange={setLocalAmount} id="stc-amount" />

      <div className="row">
        <button type="button" className="btn primary" onClick={reInit}>
          {formKey === 0 ? 'Load Payment Form' : 'Re-init Form'}
        </button>
        <button type="button" className="btn" onClick={() => setDone(true)}>
          Skip
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
            amount={payment.amount ?? localAmount}
            secretKey={secretKey}
          />
          <button type="button" className="btn primary" onClick={() => setDone(true)}>
            Finish Tutorial
          </button>
        </>
      )}
    </StepCard>
  );
}
