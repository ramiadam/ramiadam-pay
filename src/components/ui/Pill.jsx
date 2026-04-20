import styles from './Pill.module.css';

/**
 * Status pill. variant: 'ok' | 'bad' | 'warn' | null
 */
export function Pill({ children, variant = null, className = '' }) {
  const variantClass = variant ? styles[variant] : '';
  return (
    <span className={`${styles.pill} ${variantClass} ${className}`}>
      {children}
    </span>
  );
}
