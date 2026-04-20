import { useRef, useEffect, useState } from 'react';
import styles from './JsonDisplay.module.css';

/**
 * Displays JSON safely using textContent — never innerHTML or dangerouslySetInnerHTML.
 */
export function JsonDisplay({ data, label }) {
  const preRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const text = data == null
    ? '—'
    : typeof data === 'string'
      ? data
      : JSON.stringify(data, null, 2);

  // Use textContent — never innerHTML
  useEffect(() => {
    if (preRef.current) {
      preRef.current.textContent = text;
    }
  }, [text]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard not available in some environments
    }
  }

  return (
    <div className={styles.wrap}>
      {label && <div className="label">{label}</div>}
      <pre ref={preRef} className={styles.pre} aria-label={label ?? 'JSON output'} />
      {data != null && (
        <button
          className={styles.copyBtn}
          onClick={handleCopy}
          type="button"
          aria-label="Copy to clipboard"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      )}
    </div>
  );
}
