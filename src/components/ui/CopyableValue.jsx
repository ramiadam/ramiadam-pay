import { useState } from 'react';
import styles from './CopyableValue.module.css';

export function CopyableValue({ value, label }) {
  const [copied, setCopied] = useState(false);

  if (!value) return <span className={styles.wrap}>—</span>;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <span className={styles.wrap}>
      <span>{value}</span>
      <button
        className={styles.copyBtn}
        onClick={handleCopy}
        type="button"
        aria-label={`Copy ${label ?? 'value'}`}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </span>
  );
}
