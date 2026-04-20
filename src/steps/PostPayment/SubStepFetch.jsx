import { JsonDisplay } from '../../components/ui/JsonDisplay.jsx';
import { Annotation } from '../../components/ui/Annotation.jsx';
import { useAdminCall } from '../../hooks/useAdminCall.js';

export function SubStepFetch({ paymentId, secretKey }) {
  const { call, output, loading } = useAdminCall(secretKey);

  async function handleFetch() {
    if (!paymentId) return;
    await call(`/payments/${encodeURIComponent(paymentId)}`, { method: 'GET' });
  }

  return (
    <div className="sub-step">
      <h3 className="sub-step-title">Fetch Payment</h3>
      <Annotation>
        <code>GET /v1/payments/{'{id}'}</code> — retrieves the full payment object
        by ID. Use this to verify status, amount, and source details after a payment completes.
      </Annotation>

      <div className="field">
        <label htmlFor="fetch-pid">Payment ID</label>
        <input
          id="fetch-pid"
          type="text"
          value={paymentId ?? ''}
          readOnly
        />
      </div>

      <button
        type="button"
        className="btn primary"
        onClick={handleFetch}
        disabled={!paymentId || !secretKey || loading}
      >
        {loading ? 'Fetching…' : 'Fetch Payment'}
      </button>

      {output && <JsonDisplay data={output} label="API Response" />}
    </div>
  );
}
