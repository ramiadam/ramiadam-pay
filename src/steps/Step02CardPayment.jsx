// src/steps/Step02CardPayment.jsx
import { useState } from 'react';
import { StepCard } from '../components/ui/StepCard.jsx';
import { Annotation } from '../components/ui/Annotation.jsx';
import { PaymentFormMount } from '../components/forms/PaymentFormMount.jsx';
import { PostPaymentActions } from './PostPayment/PostPaymentActions.jsx';
import { AmountField } from '../components/forms/AmountField.jsx';
import { MetadataFields } from '../components/forms/MetadataFields.jsx';
import { JsonDisplay } from '../components/ui/JsonDisplay.jsx';
import { TestCardTable } from '../components/ui/TestCardTable.jsx';
import { CodeSnippet } from '../components/ui/CodeSnippet.jsx';
import { useLearnMode } from '../hooks/useLearnMode.js';
import styles from './Step02CardPayment.module.css';

const DEFAULT_METADATA = { order_id: 'ord_001', scenario: 'card-payment' };

function buildCode(amount, description, metadata) {
  const hasMetadata = Object.keys(metadata).length > 0;
  const metaLines = hasMetadata
    ? `\n  metadata: ${JSON.stringify(metadata, null, 2).split('\n').join('\n  ')},`
    : '';
  return `Moyasar.init({
  element: '#moyasar-form',
  publishable_api_key: 'pk_test_...',
  amount: ${amount},
  currency: 'SAR',
  description: '${description.replace(/'/g, "\\'")}',
  methods: ['creditcard'],
  supported_networks: ['mada', 'visa', 'mastercard', 'amex'],${metaLines}
});
Moyasar.on('completed', (payment) => { /* handle success */ });
Moyasar.on('failure', (error) => { /* handle failure */ });`;
}

export function Step02CardPayment({ config, updateConfig, secretKey, result, setResult, isLive, onComplete }) {
  const { mode, setMode } = useLearnMode(2);
  const isLearn = mode === 'learn';

  const [localAmount, setLocalAmount] = useState(config.amount ?? 10000);
  const [localDesc, setLocalDesc] = useState(config.description ?? 'Test card payment');
  const [localMetadata, setLocalMetadata] = useState(config.metadata ?? DEFAULT_METADATA);
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState(null);
  const [formMounted, setFormMounted] = useState(false);
  const [formKey, setFormKey] = useState(1);

  const localCfg = {
    ...config,
    amount: localAmount,
    description: localDesc,
    metadata: localMetadata,
    methods: ['creditcard'],
    manual: false,
    save_card: false,
  };

  function handleCompleted(p) {
    setPayment(p);
    setError(null);
    setResult(p);
  }

  function loadForm() {
    updateConfig({ amount: localAmount, description: localDesc, metadata: localMetadata });
    setFormMounted(true);
    setFormKey((k) => k + 1);
    setPayment(null);
    setError(null);
  }

  return (
    <StepCard stepNum={2} title="Card Payment" mode={mode} onModeChange={setMode}>
      {isLearn && (
        <div className={styles.conceptBox}>
          <div className={styles.conceptTitle}>What is this?</div>
          <p className={styles.conceptText}>
            The Moyasar Payment Form (MPF) handles card input, 3DS authentication, and
            submission entirely client-side. You initialize it with your publishable key,
            amount, and config — it fires <code>Moyasar.on('completed')</code> /{' '}
            <code>Moyasar.on('failure')</code> callbacks when done.
          </p>
        </div>
      )}

      <AmountField value={localAmount} onChange={setLocalAmount} id="card-amount" />
      {isLearn && <div className="hint">Amount is in halalas — 10000 = 100.00 SAR.</div>}

      <div className="field">
        <label htmlFor="card-desc">Description</label>
        <input
          id="card-desc"
          type="text"
          value={localDesc}
          onChange={(e) => setLocalDesc(e.target.value)}
          placeholder="Test card payment"
        />
        {isLearn && <div className="hint">Shown on the payment receipt and in your Moyasar dashboard.</div>}
      </div>

      <MetadataFields value={localMetadata} onChange={setLocalMetadata} />
      {isLearn && (
        <Annotation>
          Metadata is a free-form key-value map on every payment. It appears verbatim in{' '}
          <code>GET /payments/{'{id}'}</code> and webhook events — useful for linking payments
          to your own order IDs or scenario labels.
        </Annotation>
      )}

      {isLearn && <TestCardTable />}

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
          stepIndex={2}
        />
      )}

      {isLearn && (
        <CodeSnippet
          label="What runs under the hood"
          code={buildCode(localAmount, localDesc, localMetadata)}
        />
      )}

      {error && <JsonDisplay data={error} label="Payment failure" />}

      {(payment?.id ?? result?.pid) && (
        <>
          {payment && (
            <JsonDisplay data={payment} label="Payment completed — Moyasar.on('completed') callback" />
          )}
          <PostPaymentActions
            paymentId={payment?.id ?? result?.pid}
            token={payment?.source?.token ?? result?.tok}
            amount={payment?.amount ?? localAmount}
            secretKey={secretKey}
          />
          {isLearn && (
            <Annotation>
              Use Fetch to re-read the payment from the API, Refund to return money to the
              customer, and Void to cancel an authorized-but-uncaptured payment.
            </Annotation>
          )}
          <button type="button" className="btn primary" onClick={onComplete}>
            Continue to Save Card &amp; Token
          </button>
        </>
      )}
    </StepCard>
  );
}
