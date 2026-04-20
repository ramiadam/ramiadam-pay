import { JsonDisplay } from '../../components/ui/JsonDisplay.jsx';
import { Annotation } from '../../components/ui/Annotation.jsx';
import { useAdminCall } from '../../hooks/useAdminCall.js';

export function SubStepVoid({ paymentId, secretKey }) {
  const { call, output, loading } = useAdminCall(secretKey);

  async function handleVoid() {
    if (!paymentId) return;
    await call(`/payments/${encodeURIComponent(paymentId)}/void`, {
      method: 'POST',
      body: {},
    });
  }

  return (
    <div className="sub-step">
      <h3 className="sub-step-title">Void Authorization</h3>
      <Annotation>
        <code>POST /v1/payments/{'{id}'}/void</code> — cancels an authorization that
        has not yet been captured. Only applicable to payments created with{' '}
        <code>manual: true</code>. Once a payment is captured it cannot be voided —
        use refund instead.
      </Annotation>

      <div className="field">
        <label htmlFor="void-pid">Payment ID</label>
        <input id="void-pid" type="text" value={paymentId ?? ''} readOnly />
      </div>

      <button
        type="button"
        className="btn primary"
        onClick={handleVoid}
        disabled={!paymentId || !secretKey || loading}
      >
        {loading ? 'Processing…' : 'Void Authorization'}
      </button>

      {output && <JsonDisplay data={output} label="API Response" />}
    </div>
  );
}
