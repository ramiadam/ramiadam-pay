import { useState } from 'react';
import { JsonDisplay } from '../../components/ui/JsonDisplay.jsx';
import { Annotation } from '../../components/ui/Annotation.jsx';
import { useAdminCall } from '../../hooks/useAdminCall.js';

export function SubStepRefund({ paymentId, defaultAmount = 10000, secretKey }) {
  const [amount, setAmount] = useState(defaultAmount);
  const { call, output, loading } = useAdminCall(secretKey);

  async function handleRefund() {
    if (!paymentId) return;
    await call(`/payments/${encodeURIComponent(paymentId)}/refund`, {
      method: 'POST',
      body: { amount },
    });
  }

  return (
    <div className="sub-step">
      <h3 className="sub-step-title">Refund Payment</h3>
      <Annotation>
        <code>POST /v1/payments/{'{id}'}/refund</code> — creates a refund for the
        specified amount (in halalas). Partial refunds are supported. A captured payment can
        only be refunded; void is only for un-captured authorizations.
      </Annotation>

      <div className="row">
        <div className="field" style={{ flex: 1 }}>
          <label htmlFor="refund-pid">Payment ID</label>
          <input id="refund-pid" type="text" value={paymentId ?? ''} readOnly />
        </div>
        <div className="field" style={{ flex: 1 }}>
          <label htmlFor="refund-amount">Amount (halalas)</label>
          <input
            id="refund-amount"
            type="number"
            min="1"
            step="1"
            value={amount}
            onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value || '1', 10)))}
          />
          <div className="hint">{(amount / 100).toFixed(2)} SAR</div>
        </div>
      </div>

      <button
        type="button"
        className="btn primary"
        onClick={handleRefund}
        disabled={!paymentId || !secretKey || loading}
      >
        {loading ? 'Processing…' : 'Refund Payment'}
      </button>

      {output && <JsonDisplay data={output} label="API Response" />}
    </div>
  );
}
