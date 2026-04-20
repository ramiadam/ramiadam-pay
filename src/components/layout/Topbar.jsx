import styles from './Topbar.module.css';

export function Topbar({ theme, onToggleTheme }) {
  return (
    <header className={styles.topbar}>
      <div>
        <div className={styles.brand}>RTB</div>
        <div className={styles.sub}>Moyasar Payments Wizard</div>
      </div>
      <div className={styles.right}>
        <span className={styles.dot} aria-hidden="true" />
        <button
          className={styles.themeBtn}
          onClick={onToggleTheme}
          type="button"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
      </div>
    </header>
  );
}
