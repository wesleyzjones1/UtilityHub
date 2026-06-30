import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CATEGORIES, PAGE_BY_CATEGORY, PAGES, searchPages } from '../../registry/pages';
import { CATEGORY_ICONS } from '../../registry/categoryIcons';
import { useLanguage } from '../../context/LanguageContext';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import FavoriteButton from '../../components/FavoriteButton/FavoriteButton';
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
  const [activeIndex, setActiveIndex] = useState(-1);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const results = query.trim() ? searchPages(query) : [];
  const showResults = results.length > 0;
  const showEmpty = query.trim() && results.length === 0;

  function handleChange(e) {
    setQuery(e.target.value);
    setActiveIndex(-1);
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowDown') {
      if (!showResults) return;
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      if (!showResults) return;
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && activeIndex >= 0 && results[activeIndex]) {
      e.preventDefault();
      navigate(results[activeIndex].path);
      setQuery('');
      setActiveIndex(-1);
    } else if (e.key === 'Escape') {
      setQuery('');
      setActiveIndex(-1);
    }
  }

  function dismiss() {
    setQuery('');
    setActiveIndex(-1);
  }

  return (
    <div className={styles.heroSearchWrap}>
      <div className={`${styles.heroSearchInput} ${showResults || showEmpty ? styles.heroSearchInputOpen : ''}`}>
        <span className={styles.heroSearchIcon}><SearchIcon /></span>
        <input
          type="search"
          placeholder={t('searchPlaceholder')}
          className={styles.heroInput}
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          aria-label={t('searchLabel')}
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `hero-result-${activeIndex}` : undefined}
          autoComplete="off"
          spellCheck={false}
        />
        {query && (
          <button className={styles.heroClear} onClick={dismiss} aria-label={t('clearSearch')}>
            ✕
          </button>
        )}
      </div>

      {showResults && (
        <ul className={styles.heroResults} role="listbox">
          {results.map((page, i) => (
            <li key={page.id} id={`hero-result-${i}`} role="option" aria-selected={i === activeIndex}>
              <Link
                to={page.path}
                className={`${styles.heroResult} ${i === activeIndex ? styles.heroResultActive : ''}`}
                onClick={dismiss}
              >
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
          {t('searchNoResults')} &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
}

function ToolChip({ page }) {
  return (
    <li className={styles.toolItem}>
      <Link to={page.path} className={styles.toolLink}>{page.title}</Link>
      <FavoriteButton pageId={page.id} title={page.title} variant="chip" />
    </li>
  );
}

function CategorySection({ category }) {
  const pages = PAGE_BY_CATEGORY[category.id] ?? [];

  return (
    <section className={styles.catSection}>
      <div className={styles.catSectionHead}>
        <Link to={`/tools/category/${category.id}`} className={styles.catSectionHeadLeft}>
          <span className={styles.catIcon}>{CATEGORY_ICONS[category.id]}</span>
          <div>
            <h2 className={styles.catSectionTitle}>{category.label}</h2>
            <p className={styles.catSectionDesc}>{category.description}</p>
          </div>
        </Link>
        <span className={styles.catSectionCount}>{pages.length} tools</span>
      </div>
      <ul className={styles.toolGrid}>
        {pages.map(page => <ToolChip key={page.id} page={page} />)}
      </ul>
    </section>
  );
}

export default function Home() {
  useDocumentMeta();

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero} aria-labelledby="hero-heading">
        <h1 id="hero-heading" className={styles.heroTitle}>
          Free tools for<br />developers and power users
        </h1>
        <p className={styles.heroSub}>
          {PAGES.length} tools across {Object.keys(CATEGORIES).length} categories — no sign-up required.
        </p>
        <HeroSearch />
      </section>

      {/* All categories with every tool */}
      <section className={styles.categories} aria-label="All tools by category">
        <div className={styles.catInner}>
          {Object.values(CATEGORIES).map(cat => (
            <CategorySection key={cat.id} category={cat} />
          ))}
        </div>
      </section>
    </div>
  );
}
