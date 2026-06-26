import styles from './EmptyState.module.css';

export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className={styles.root} role="status">
      {icon && <div className={styles.icon} aria-hidden="true">{icon}</div>}
      {title && <p className={styles.title}>{title}</p>}
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
