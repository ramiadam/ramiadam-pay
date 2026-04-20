import styles from './LiveKeyWarning.module.css';

export function LiveKeyWarning({ context = 'admin operations' }) {
  return (
    <div className={styles.banner} role="alert">
      <span className={styles.icon} aria-hidden="true">!</span>
      <div>
        <strong>Live key detected.</strong> This test bench is for test keys only
        (<code>pk_test_...</code> / <code>sk_test_...</code>). {context} are
        disabled. Remove the live key and enter a test key to continue.
      </div>
    </div>
  );
}
