/**
 * Dynamic metadata key/value pairs. Defaults to 2 rows, add/remove supported.
 */
export function MetadataFields({ value, onChange }) {
  const entries = Object.entries(value ?? {});

  function updateKey(i, newKey) {
    const next = [...entries];
    const [, val] = next[i];
    next[i] = [newKey, val];
    onChange(Object.fromEntries(next.filter(([k]) => k)));
  }

  function updateVal(i, newVal) {
    const next = [...entries];
    const [key] = next[i];
    next[i] = [key, newVal];
    onChange(Object.fromEntries(next.filter(([k]) => k)));
  }

  function addRow() {
    onChange({ ...value, '': '' });
  }

  function removeRow(i) {
    const next = entries.filter((_, idx) => idx !== i);
    onChange(Object.fromEntries(next));
  }

  return (
    <div>
      <div className="label" style={{ marginBottom: 8 }}>Metadata</div>
      {entries.map(([k, v], i) => (
        <div key={i} className="row" style={{ marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            <label htmlFor={`md-key-${i}`} className="hint">Key</label>
            <input
              id={`md-key-${i}`}
              type="text"
              value={k}
              placeholder="key"
              onChange={(e) => updateKey(i, e.target.value)}
            />
          </div>
          <div style={{ flex: 2 }}>
            <label htmlFor={`md-val-${i}`} className="hint">Value</label>
            <input
              id={`md-val-${i}`}
              type="text"
              value={v}
              placeholder="value"
              onChange={(e) => updateVal(i, e.target.value)}
            />
          </div>
          <button
            type="button"
            className="btn"
            onClick={() => removeRow(i)}
            aria-label={`Remove metadata row ${i + 1}`}
            style={{ marginTop: 18 }}
          >
            ×
          </button>
        </div>
      ))}
      <button type="button" className="btn" onClick={addRow} style={{ fontSize: 12 }}>
        + Add metadata
      </button>
    </div>
  );
}
