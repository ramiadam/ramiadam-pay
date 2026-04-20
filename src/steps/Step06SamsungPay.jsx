import { useState } from 'react';
import { StepCard } from '../components/ui/StepCard.jsx';
import { Annotation } from '../components/ui/Annotation.jsx';
import { PaymentFormMount } from '../components/forms/PaymentFormMount.jsx';
import { PostPaymentActions } from './PostPayment/PostPaymentActions.jsx';
import { JsonDisplay } from '../components/ui/JsonDisplay.jsx';
import { AmountField } from '../components/forms/AmountField.jsx';
import styles from './Step06SamsungPay.module.css';

export function Step06SamsungPay({ config, updateConfig, secretKey, setResult, onComplete }) {
  const [localAmount, setLocalAmount] = useState(config.amount ?? 10000);
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState(null);
  const [formKey, setFormKey] = useState(0);

  const localCfg = {
    ...config,
    amount: localAmount,
    methods: ['samsungpay'],
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

  return (
    <StepCard
      stepNum={6}
      title="Samsung Pay"
      concept="Samsung Pay is available on Samsung devices with the Samsung Pay app installed. MPF handles the Samsung Pay button rendering and payment sheet automatically when methods includes 'samsungpay'."
    >
      <Annotation>
        <code>methods: ['samsungpay']</code> enables Samsung Pay. The MPF will show the
        Samsung Pay button when the browser and device support it. Samsung Pay requires a
        Samsung device with Samsung Pay configured.
      </Annotation>

      <AmountField value={localAmount} onChange={setLocalAmount} id="sp-amount" />

      <div className="row">
        <button type="button" className="btn primary" onClick={reInit}>
          {formKey === 0 ? 'Load Payment Form' : 'Re-init Form'}
        </button>
        <button type="button" className="btn" onClick={onComplete}>
          Skip (Samsung Pay unavailable)
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
          <button type="button" className="btn primary" onClick={onComplete}>
            Continue to STC Pay
          </button>
        </>
      )}
    </StepCard>
  );
}
