import { useEffect } from 'react';
import SupportCard from '../../components/SupportCard/SupportCard';
import AdBanner from '../../components/AdBanner/AdBanner';
import FavoriteButton from '../../components/FavoriteButton/FavoriteButton';
import { recordRecentTool } from '../../hooks/useRecentTools';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import styles from './PageShell.module.css';

/**
 * Shared wrapper for every tool page.
 * Renders: title/description → children → how-to-use → support card.
 */
export default function PageShell({ page, children, howToUse = [] }) {
  useDocumentMeta({ title: page.title, description: page.description });

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

      <SupportCard />
      <AdBanner />
    </article>
  );
}
