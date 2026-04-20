const ALL_NETWORKS = ['mada', 'visa', 'mastercard', 'amex'];

export function NetworksSelector({ value, onChange }) {
  function toggle(network) {
    if (value.includes(network)) {
      onChange(value.filter((n) => n !== network));
    } else {
      onChange([...value, network]);
    }
  }

  return (
    <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
      <legend className="label">Supported Networks</legend>
      <div className="row" style={{ marginTop: 8 }}>
        {ALL_NETWORKS.map((net) => (
          <label key={net} className="toggle">
            <input
              type="checkbox"
              checked={value.includes(net)}
              onChange={() => toggle(net)}
            />
            <div>
              <strong>{net}</strong>
            </div>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
