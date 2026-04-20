import styles from './StepCard.module.css';

export function StepCard({ stepNum, title, concept, children }) {
  return (
    <div className={styles.stepCard}>
      <div className={styles.header}>
        {stepNum != null && (
          <div className={styles.stepNum}>Step {stepNum}</div>
        )}
        <h2 className={styles.title}>{title}</h2>
        {concept && <p className={styles.concept}>{concept}</p>}
      </div>
      <div className={styles.divider} aria-hidden="true" />
      <div className={styles.body}>{children}</div>
    </div>
  );
}
