import styles from './ProgressBar.module.css';
import { WIZARD_STEPS } from '../../utils/constants.js';

export function ProgressBar({ currentStep, completedSteps, canGoTo, onGoTo }) {
  return (
    <nav className={styles.progressBar} aria-label="Wizard progress">
      <ol className={styles.steps}>
        {WIZARD_STEPS.map((step, i) => {
          const isDone = completedSteps.has(i) && i !== currentStep;
          const isCurrent = i === currentStep;
          const isClickable = canGoTo(i) && i !== currentStep;
          const isLast = i === WIZARD_STEPS.length - 1;

          return (
            <li key={step.id} className={styles.stepItem}>
              <button
                className={[
                  styles.stepBtn,
                  isCurrent ? styles.current : '',
                  isDone ? styles.done : '',
                  isClickable ? styles.clickable : '',
                ].join(' ')}
                onClick={() => isClickable && onGoTo(i)}
                disabled={!isClickable && !isCurrent}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`Step ${i}: ${step.label}${isDone ? ' (completed)' : isCurrent ? ' (current)' : ''}`}
                type="button"
              >
                <span className={styles.dot} aria-hidden="true">
                  {isDone ? '✓' : i}
                </span>
                <span>{step.label}</span>
              </button>
              {!isLast && (
                <span
                  className={`${styles.connector} ${isDone ? styles.done : ''}`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
