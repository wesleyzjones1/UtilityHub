import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../registry/pages';
import SupportCard from '../../components/SupportCard/SupportCard';
import FavoriteButton from '../../components/FavoriteButton/FavoriteButton';
import { recordRecentTool } from '../../hooks/useRecentTools';
import styles from './PageShell.module.css';

/**
 * Shared wrapper for every tool page.
 * Renders: breadcrumb → badge → centered title/description → children → how-to-use.
 */
export default function PageShell({ page, children, howToUse = [] }) {
  const category = CATEGORIES[page.category];

  // Record this tool as recently used so it can be surfaced on the home page.
  useEffect(() => {
    recordRecentTool(page.id);
  }, [page.id]);

  return (
    <article className={styles.shell}>
      {/* ── Breadcrumb ── */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link to="/" className={styles.bcLink}>Home</Link>
        <span className={styles.bcSep} aria-hidden="true">/</span>
        <span className={styles.bcItem}>{category?.label}</span>
        <span className={styles.bcSep} aria-hidden="true">/</span>
        <span className={styles.bcItem} aria-current="page">{page.title}</span>
      </nav>

      {/* ── Page header ── */}
      <header className={styles.header}>
        <span className={styles.badge}>{category?.label}</span>
        <h1 className={styles.title}>{page.title}</h1>
        <p className={styles.description}>{page.description}</p>
        <div className={styles.favRow}>
          <FavoriteButton pageId={page.id} title={page.title} showLabel />
        </div>
      </header>

      {/* ── Tool interface ── */}
      <div className={styles.content}>
        {children}
      </div>

      {/* ── How to use ── */}
      {howToUse.length > 0 && (
        <section className={styles.howTo} aria-labelledby="how-to-heading">
          <h2 id="how-to-heading" className={styles.howToTitle}>How to use</h2>
          <ol className={styles.howToList}>
            {howToUse.map((step, i) => (
              <li key={i} className={styles.howToStep}>
                <span className={styles.howToNum} aria-hidden="true">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      <SupportCard />
    </article>
  );
}
