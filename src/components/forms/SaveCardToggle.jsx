export function SaveCardToggle({ value, onChange, id = 'save-card' }) {
  return (
    <label className="toggle" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        checked={!!value}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div>
        <strong>Save card</strong>
        <br />
        <span className="hint">Tokenize the card for future payments</span>
      </div>
    </label>
  );
}
