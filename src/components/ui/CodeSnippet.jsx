import { useState } from 'react';
import styles from './CodeSnippet.module.css';

export function CodeSnippet({ code, label }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable (non-HTTPS or blocked)
    }
  }

  return (
    <div className={styles.wrap}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.block}>
        <pre className={styles.pre}>{code}</pre>
        <button type="button" className={styles.copy} onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
