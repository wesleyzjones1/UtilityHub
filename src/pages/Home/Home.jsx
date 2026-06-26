import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, PAGE_BY_CATEGORY, PAGES, searchPages } from '../../registry/pages';
import styles from './Home.module.css';

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.75" />
      <path d="M13 13l4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function HeroSearch() {
  const [query, setQuery] = useState('');
  const results = query.trim() ? searchPages(query) : [];
  const showResults = results.length > 0;
  const showEmpty = query.trim() && results.length === 0;

  return (
    <div className={styles.heroSearchWrap}>
      <div className={`${styles.heroSearchInput} ${showResults || showEmpty ? styles.heroSearchInputOpen : ''}`}>
        <span className={styles.heroSearchIcon}><SearchIcon /></span>
        <input
          type="search"
          placeholder="Search all tools…"
          className={styles.heroInput}
          value={query}
          onChange={e => setQuery(e.target.value)}
          aria-label="Search all tools"
          autoComplete="off"
          spellCheck={false}
        />
        {query && (
          <button className={styles.heroClear} onClick={() => setQuery('')} aria-label="Clear search">
            ✕
          </button>
        )}
      </div>

      {showResults && (
        <ul className={styles.heroResults}>
          {results.map(page => (
            <li key={page.id}>
              <Link to={page.path} className={styles.heroResult} onClick={() => setQuery('')}>
                <div className={styles.heroResultTitle}>{page.title}</div>
                <div className={styles.heroResultMeta}>
                  {CATEGORIES[page.category]?.label} · {page.description}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {showEmpty && (
        <div className={styles.heroEmpty}>
          No tools found for &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
}

function CategoryCard({ category }) {
  const pages = PAGE_BY_CATEGORY[category.id] ?? [];
  const preview = pages.slice(0, 4);

  return (
    <div className={styles.catCard}>
      <div className={styles.catCardHeader}>
        <h2 className={styles.catCardTitle}>{category.label}</h2>
        <span className={styles.catCardCount}>{pages.length} tools</span>
      </div>
      <p className={styles.catCardDesc}>{category.description}</p>
      <ul className={styles.catCardLinks}>
        {preview.map(page => (
          <li key={page.id}>
            <Link to={page.path} className={styles.catCardLink}>{page.title}</Link>
          </li>
        ))}
        {pages.length > 4 && (
          <li>
            <span className={styles.catCardMore}>+{pages.length - 4} more</span>
          </li>
        )}
      </ul>
    </div>
  );
}

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero} aria-labelledby="hero-heading">
        <h1 id="hero-heading" className={styles.heroTitle}>
          Free tools for<br />developers and power users
        </h1>
        <p className={styles.heroSub}>
          {PAGES.length} tools across {Object.keys(CATEGORIES).length} categories — no sign-up, no ads.
        </p>
        <HeroSearch />
      </section>

      {/* Category grid */}
      <section className={styles.grid} aria-labelledby="categories-heading">
        <div className={styles.gridInner}>
          <h2 id="categories-heading" className={styles.sectionTitle}>Browse by category</h2>
          <div className={styles.cards}>
            {Object.values(CATEGORIES).map(cat => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
