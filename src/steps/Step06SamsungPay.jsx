// src/steps/Step06SamsungPay.jsx
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
import styles from './Step06SamsungPay.module.css';

const DEFAULT_METADATA = { order_id: 'ord_005', scenario: 'samsung-pay' };

const SAMSUNG_CODE = `Moyasar.init({
  element: '#moyasar-form',
  publishable_api_key: 'pk_test_...',
  amount: 10000,
  currency: 'SAR',
  methods: ['samsungpay'],
  samsungpay: {
    country: 'SA',
    label: 'My Store',
  },
});
// Requires a Samsung device with Samsung Pay app installed`;

export function Step06SamsungPay({ config, updateConfig, secretKey, setResult, isLive, onComplete }) {
  const { mode, setMode } = useLearnMode(6);
  const isLearn = mode === 'learn';

  const [localAmount, setLocalAmount] = useState(config.amount ?? 10000);
  const [localMetadata, setLocalMetadata] = useState(config.metadata ?? DEFAULT_METADATA);
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState(null);
  const [formMounted, setFormMounted] = useState(true);
  const [formKey, setFormKey] = useState(1);

  const localCfg = {
    ...config,
    amount: localAmount,
    metadata: localMetadata,
    methods: ['samsungpay'],
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
    <StepCard stepNum={6} title="Samsung Pay" mode={mode} onModeChange={setMode}>
      {isLearn && (
        <div className={styles.conceptBox}>
          <div className={styles.conceptTitle}>What is this?</div>
          <p className={styles.conceptText}>
            Samsung Pay is available on Samsung Android devices with the Samsung Pay app
            installed. MPF renders the Samsung Pay button automatically when detected.
            Configuration is minimal — country and merchant label.
          </p>
        </div>
      )}

      <AmountField value={localAmount} onChange={setLocalAmount} id="sp-amount" />
      <MetadataFields value={localMetadata} onChange={setLocalMetadata} />

      {isLearn && (
        <Annotation>
          <code>methods: ['samsungpay']</code> enables Samsung Pay. MPF checks availability
          automatically and shows the button only when supported.
        </Annotation>
      )}

      {isLearn && <CodeSnippet label="What runs under the hood" code={SAMSUNG_CODE} />}

      <div className="row">
        <button type="button" className="btn primary" onClick={loadForm}>
          {formMounted
            ? 'Re-init Form'
            : isLive
              ? 'I understand — Load Live Form'
              : 'Load Payment Form'}
        </button>
        <button type="button" className="btn" onClick={onComplete}>
          Skip (Samsung Pay unavailable)
        </button>
      </div>

      {formMounted && (
        <PaymentFormMount
          key={formKey}
          cfg={localCfg}
          onCompleted={handleCompleted}
          onFailure={(e) => setError(e)}
          formKey={String(formKey)}
          stepIndex={6}
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
            Continue to STC Pay
          </button>
        </>
      )}
    </StepCard>
  );
}
