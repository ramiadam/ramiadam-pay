import styles from './StepCard.module.css';
import { LearnTryToggle } from './LearnTryToggle.jsx';

export function StepCard({ stepNum, title, concept, mode, onModeChange, children }) {
  const showToggle = mode != null && onModeChange != null;

  return (
    <div className={styles.stepCard}>
      <div className={styles.header}>
        <div className={styles.headerMeta}>
          {stepNum != null && (
            <div className={styles.stepNum}>Step {stepNum}</div>
          )}
          <h2 className={styles.title}>{title}</h2>
          {concept && <p className={styles.concept}>{concept}</p>}
        </div>
        {showToggle && (
          <LearnTryToggle mode={mode} onChange={onModeChange} />
        )}
      </div>
      <div className={styles.divider} aria-hidden="true" />
      <div className={styles.body}>{children}</div>
    </div>
  );
}
