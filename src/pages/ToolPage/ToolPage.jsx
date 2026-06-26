import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../registry/pages';
import styles from './ToolPage.module.css';

export default function ToolPage({ page }) {
  const category = CATEGORIES[page.category];

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/" className={styles.breadcrumbLink}>Home</Link>
          <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
          <span className={styles.breadcrumbCurrent}>{category?.label}</span>
          <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
          <span className={styles.breadcrumbCurrent}>{page.title}</span>
        </nav>

        {/* Header */}
        <div className={styles.header}>
          <span className={styles.badge}>{category?.label}</span>
          <h1 className={styles.title}>{page.title}</h1>
          <p className={styles.description}>{page.description}</p>
        </div>

        {/* Placeholder content */}
        <div className={styles.placeholder}>
          <div className={styles.placeholderIcon} aria-hidden="true">
            <WrenchIcon />
          </div>
          <p className={styles.placeholderText}>This tool is coming soon.</p>
          <p className={styles.placeholderSub}>
            The interface for <strong>{page.title}</strong> is under construction.
          </p>
          <Link to="/" className={styles.backLink}>
            ← Back to all tools
          </Link>
        </div>
      </div>
    </div>
  );
}

function WrenchIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
