import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import FavoriteButton from '../../components/FavoriteButton/FavoriteButton';
import { recordRecentTool } from '../../hooks/useRecentTools';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { useIsPreview } from '../../context/PreviewContext';
import { useLanguage } from '../../context/LanguageContext';
import { getRelatedPages } from '../../registry/pages';
import styles from './PageShell.module.css';

/**
 * Shared wrapper for every tool page.
 * Renders: title/description → children → related tools.
 *
 * In preview mode (navbar hover snapshot) only the interactive content is
 * rendered — no header, related tools, or side effects.
 */
export default function PageShell({ page, children }) {
  const isPreview = useIsPreview();
  const { t, td, tt } = useLanguage();
  const description = td(page);
  const title = tt(page);

  useDocumentMeta({ title, description, enabled: !isPreview });

  const related = isPreview ? [] : getRelatedPages(page.id, 4);

  // Record this tool as recently used so it can be surfaced on the home page.
  useEffect(() => {
    if (isPreview) return;
    recordRecentTool(page.id);
  }, [page.id, isPreview]);

  if (isPreview) {
    return <div className={styles.previewContent}>{children}</div>;
  }

  return (
    <article className={styles.shell}>
      {/* ── Page header ── */}
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{title}</h1>
          <FavoriteButton pageId={page.id} title={title} />
        </div>
        <p className={styles.description}>{description}</p>
      </header>

      {/* ── Tool interface ── */}
      <div className={styles.content}>
        {children}
      </div>

      {/* ── Related tools ── */}
      {related.length > 0 && (
        <section className={styles.related} aria-labelledby="related-heading">
          <h2 id="related-heading" className={styles.relatedTitle}>{t('relatedTools')}</h2>
          <ul className={styles.relatedGrid}>
            {related.map(p => (
              <li key={p.id}>
                <Link to={p.path} className={styles.relatedCard}>
                  <span className={styles.relatedCardTitle}>{tt(p)}</span>
                  <span className={styles.relatedCardDesc}>{td(p)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
