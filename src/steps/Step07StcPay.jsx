// src/steps/Step07StcPay.jsx
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
import styles from './Step07StcPay.module.css';

const DEFAULT_METADATA = { order_id: 'ord_006', scenario: 'stc-pay' };

const STC_CODE = `Moyasar.init({
  element: '#moyasar-form',
  publishable_api_key: 'pk_test_...',
  amount: 10000,
  currency: 'SAR',
  methods: ['stcpay'],
});
// MPF renders a phone number field (05xxxxxxxx format)
// Customer confirms the charge in their STC Pay app via OTP
// Saudi Arabia only`;

export function Step07StcPay({ config, updateConfig, secretKey, setResult, isLive, onComplete }) {
  const { mode, setMode } = useLearnMode(7);
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
    methods: ['stcpay'],
    manual: false,
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
    <StepCard stepNum={7} title="STC Pay" mode={mode} onModeChange={setMode}>
      {isLearn && (
        <div className={styles.conceptBox}>
          <div className={styles.conceptTitle}>What is this?</div>
          <p className={styles.conceptText}>
            STC Pay is Saudi Arabia&apos;s most popular mobile wallet. MPF shows a phone number
            field — the customer enters their STC Pay number (05xxxxxxxx) and confirms the
            charge in the STC Pay app via OTP. No card number needed.
          </p>
        </div>
      )}

      <AmountField value={localAmount} onChange={setLocalAmount} id="stc-amount" />
      <MetadataFields value={localMetadata} onChange={setLocalMetadata} />

      {isLearn && (
        <Annotation>
          <code>methods: ['stcpay']</code> renders the STC Pay form. The customer needs an
          active STC Pay account linked to their Saudi mobile number.
        </Annotation>
      )}

      {isLearn && <CodeSnippet label="What runs under the hood" code={STC_CODE} />}

      <div className="row">
        <button type="button" className="btn primary" onClick={loadForm}>
          {formMounted
            ? 'Re-init Form'
            : isLive
              ? 'I understand — Load Live Form'
              : 'Load Payment Form'}
        </button>
        <button type="button" className="btn" onClick={onComplete}>
          Skip
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
            Continue to Done
          </button>
        </>
      )}
    </StepCard>
  );
}
