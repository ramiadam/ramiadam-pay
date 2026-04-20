import styles from './Annotation.module.css';

export function Annotation({ children }) {
  return (
    <aside className={styles.annotation} role="note">
      {children}
    </aside>
  );
}
