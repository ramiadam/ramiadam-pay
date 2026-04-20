import { useState } from 'react';
import { SubStepFetch } from './SubStepFetch.jsx';
import { SubStepRefund } from './SubStepRefund.jsx';
import { SubStepVoid } from './SubStepVoid.jsx';
import { SubStepCapture } from './SubStepCapture.jsx';
import { CopyableValue } from '../../components/ui/CopyableValue.jsx';

const TABS = ['Fetch', 'Refund', 'Void', 'Capture'];

/**
 * Post-payment tutorial panel.
 * showCapture — only show Capture tab on the Authorize Only step.
 */
export function PostPaymentActions({
  paymentId,
  token,
  amount,
  secretKey,
  showCapture = false,
}) {
  const [activeTab, setActiveTab] = useState('Fetch');
  const visibleTabs = showCapture ? TABS : TABS.filter((t) => t !== 'Capture');

  const noSecretKey = !secretKey;

  return (
    <div className="post-payment">
      <div className="post-payment-header">
        <div className="post-payment-ids">
          <div className="post-payment-id-row">
            <span className="label">Payment ID</span>
            <CopyableValue value={paymentId} label="payment ID" />
          </div>
          {token && (
            <div className="post-payment-id-row">
              <span className="label">Token</span>
              <CopyableValue value={token} label="token" />
            </div>
          )}
        </div>
      </div>

      {noSecretKey && (
        <div className="hint" style={{ marginBottom: 12 }}>
          Enter your secret key in Step 1 to enable admin actions below.
        </div>
      )}

      <div className="tab-bar" role="tablist" aria-label="Admin actions">
        {visibleTabs.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="tab-panel" role="tabpanel">
        {activeTab === 'Fetch' && (
          <SubStepFetch paymentId={paymentId} secretKey={secretKey} />
        )}
        {activeTab === 'Refund' && (
          <SubStepRefund paymentId={paymentId} defaultAmount={amount} secretKey={secretKey} />
        )}
        {activeTab === 'Void' && (
          <SubStepVoid paymentId={paymentId} secretKey={secretKey} />
        )}
        {activeTab === 'Capture' && showCapture && (
          <SubStepCapture paymentId={paymentId} defaultAmount={amount} secretKey={secretKey} />
        )}
      </div>
    </div>
  );
}
