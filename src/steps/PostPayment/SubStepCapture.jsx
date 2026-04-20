import { useState } from 'react';
import { JsonDisplay } from '../../components/ui/JsonDisplay.jsx';
import { Annotation } from '../../components/ui/Annotation.jsx';
import { useAdminCall } from '../../hooks/useAdminCall.js';

export function SubStepCapture({ paymentId, defaultAmount = 10000, secretKey }) {
  const [amount, setAmount] = useState(defaultAmount);
  const { call, output, loading } = useAdminCall(secretKey);

  async function handleCapture() {
    if (!paymentId) return;
    await call(`/payments/${encodeURIComponent(paymentId)}/capture`, {
      method: 'POST',
      body: { amount },
    });
  }

  return (
    <div className="sub-step">
      <h3 className="sub-step-title">Capture Authorization</h3>
      <Annotation>
        <code>POST /v1/payments/{'{id}'}/capture</code> — captures a previously
        authorized payment. You can capture the full amount or a partial amount (in halalas).
        This is the second step in the authorize-only flow.
      </Annotation>

      <div className="row">
        <div className="field" style={{ flex: 1 }}>
          <label htmlFor="capture-pid">Payment ID</label>
          <input id="capture-pid" type="text" value={paymentId ?? ''} readOnly />
        </div>
        <div className="field" style={{ flex: 1 }}>
          <label htmlFor="capture-amount">Amount (halalas)</label>
          <input
            id="capture-amount"
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
        onClick={handleCapture}
        disabled={!paymentId || !secretKey || loading}
      >
        {loading ? 'Processing…' : 'Capture Payment'}
      </button>

      {output && <JsonDisplay data={output} label="API Response" />}
    </div>
  );
}
