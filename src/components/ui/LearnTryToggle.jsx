import styles from './LearnTryToggle.module.css';

export function LearnTryToggle({ mode, onChange }) {
  return (
    <div className={styles.pill} role="group" aria-label="View mode">
      <button
        type="button"
        className={`${styles.option} ${mode === 'learn' ? styles.active : ''}`}
        onClick={() => onChange('learn')}
        aria-pressed={mode === 'learn'}
      >
        Learn
      </button>
      <button
        type="button"
        className={`${styles.option} ${mode === 'try' ? styles.active : ''}`}
        onClick={() => onChange('try')}
        aria-pressed={mode === 'try'}
      >
        Try
      </button>
    </div>
  );
}
