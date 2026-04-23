import styles from './LiveKeyWarning.module.css';

export function LiveKeyWarning() {
  return (
    <div className={styles.banner} role="alert">
      <span className={styles.icon} aria-hidden="true">!</span>
      <div>
        <strong>Live key detected.</strong> Real payments will be charged and real operations
        will execute. Switch to <code>pk_test_...</code> / <code>sk_test_...</code> for safe testing.
      </div>
    </div>
  );
}
