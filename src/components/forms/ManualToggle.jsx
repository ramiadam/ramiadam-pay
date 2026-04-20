export function ManualToggle({ value, onChange, id = 'manual' }) {
  return (
    <label className="toggle" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        checked={!!value}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div>
        <strong>Manual (authorize only)</strong>
        <br />
        <span className="hint">Authorize now, capture later</span>
      </div>
    </label>
  );
}
