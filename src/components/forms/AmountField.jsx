/**
 * Amount input in halalas with human-readable hint.
 * e.g. 10000 → "100.00 SAR"
 */
export function AmountField({ value, onChange, currency = 'SAR', id = 'amount' }) {
  const display = typeof value === 'number' ? (value / 100).toFixed(2) : '—';

  return (
    <div className="field">
      <label htmlFor={id}>Amount (halalas)</label>
      <input
        id={id}
        type="number"
        min="1"
        step="1"
        value={value ?? ''}
        onChange={(e) => onChange(Math.max(1, parseInt(e.target.value || '1', 10)))}
      />
      <div className="hint">{display} {currency} &nbsp;·&nbsp; 100 halalas = 1.00 {currency}</div>
    </div>
  );
}
