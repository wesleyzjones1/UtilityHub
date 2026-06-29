import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import FavoriteButton from '../../components/FavoriteButton/FavoriteButton';
import { recordRecentTool } from '../../hooks/useRecentTools';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { getRelatedPages } from '../../registry/pages';
import styles from './PageShell.module.css';

/**
 * Shared wrapper for every tool page.
 * Renders: title/description → children → how-to-use → related tools.
 */
export default function PageShell({ page, children, howToUse = [] }) {
  useDocumentMeta({ title: page.title, description: page.description });

  const related = getRelatedPages(page.id, 4);

  // Record this tool as recently used so it can be surfaced on the home page.
  useEffect(() => {
    recordRecentTool(page.id);
  }, [page.id]);

  return (
    <article className={styles.shell}>
      {/* ── Page header ── */}
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{page.title}</h1>
          <FavoriteButton pageId={page.id} title={page.title} />
        </div>
        <p className={styles.description}>{page.description}</p>
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

      {/* ── Related tools ── */}
      {related.length > 0 && (
        <section className={styles.related} aria-labelledby="related-heading">
          <h2 id="related-heading" className={styles.relatedTitle}>Related tools</h2>
          <ul className={styles.relatedGrid}>
            {related.map(p => (
              <li key={p.id}>
                <Link to={p.path} className={styles.relatedCard}>
                  <span className={styles.relatedCardTitle}>{p.title}</span>
                  <span className={styles.relatedCardDesc}>{p.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
