import styles from './Step00Welcome.module.css';

const FLOW_STEPS = [
  'Enter API Keys',
  'Card Payment',
  'Save Card + Token Pay',
  'Authorize + Capture',
  'Apple Pay',
  'Samsung Pay',
  'STC Pay',
];

export function Step00Welcome({ onStart }) {
  return (
    <div className={styles.welcome}>
      <div className={styles.hero} aria-hidden="true">RTB</div>
      <h1 className={styles.tagline}>Moyasar Payments Wizard</h1>
      <p className={styles.sub}>
        A step-by-step interactive guide through every Moyasar payment flow.
        Use your own test API keys, run real payments in test mode, and see
        the raw API responses — all without writing any integration code first.
      </p>

      <div className={styles.steps} aria-label="Steps you will complete">
        {FLOW_STEPS.map((step, i) => (
          <span key={i} className={styles.stepChip}>
            {i + 1}. {step}
          </span>
        ))}
      </div>

      <button
        className={styles.startBtn}
        onClick={onStart}
        type="button"
        autoFocus
      >
        Start Tutorial
      </button>
    </div>
  );
}
