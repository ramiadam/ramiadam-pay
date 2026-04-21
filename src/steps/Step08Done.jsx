import { StepCard } from '../components/ui/StepCard.jsx';
import styles from './Step08Done.module.css';

const SCENARIO_STEPS = [
  { index: 2, label: 'Card Payment' },
  { index: 3, label: 'Save Card & Token Pay' },
  { index: 4, label: 'Authorize + Capture' },
  { index: 5, label: 'Apple Pay' },
  { index: 6, label: 'Samsung Pay' },
  { index: 7, label: 'STC Pay' },
];

const DOC_LINKS = [
  { label: 'Card Payments', href: 'https://docs.moyasar.com/guides/card-payments' },
  { label: 'Apple Pay', href: 'https://docs.moyasar.com/guides/apple-pay' },
  { label: 'Samsung Pay', href: 'https://docs.moyasar.com/guides/samsung-pay' },
  { label: 'STC Pay', href: 'https://docs.moyasar.com/guides/stc-pay' },
  { label: 'Tokenization', href: 'https://docs.moyasar.com/guides/tokenization' },
  { label: 'Manual Capture', href: 'https://docs.moyasar.com/guides/manual-capture' },
  { label: 'API Reference', href: 'https://docs.moyasar.com/api' },
];

export function Step08Done({ completedSteps, onGoTo }) {
  const testedCount = SCENARIO_STEPS.filter((s) => completedSteps.has(s.index)).length;

  return (
    <StepCard title="Done">
      <div className={styles.summary}>
        <div className={styles.trophy} aria-hidden="true">✓</div>
        <h3 className={styles.summaryTitle}>
          {testedCount === SCENARIO_STEPS.length
            ? 'You tested every payment flow.'
            : `You tested ${testedCount} of ${SCENARIO_STEPS.length} payment flows.`}
        </h3>
        <p className={styles.summaryText}>
          You are ready to integrate Moyasar into your application.
        </p>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionLabel}>Steps completed</div>
        <div className={styles.stepList}>
          {SCENARIO_STEPS.map((s) => {
            const done = completedSteps.has(s.index);
            return (
              <div key={s.index} className={`${styles.stepRow} ${done ? styles.done : styles.skipped}`}>
                <span className={styles.stepIcon} aria-hidden="true">
                  {done ? '✓' : '○'}
                </span>
                <span className={styles.stepName}>{s.label}</span>
                <button
                  type="button"
                  className={styles.rerunBtn}
                  onClick={() => onGoTo(s.index)}
                >
                  Re-run
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionLabel}>Moyasar documentation</div>
        <div className={styles.docLinks}>
          {DOC_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.docLink}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <button type="button" className="btn" onClick={() => onGoTo(0)}>
        Restart wizard
      </button>
    </StepCard>
  );
}
