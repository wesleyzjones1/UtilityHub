import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, searchPages } from '../../registry/pages';
import { useLanguage } from '../../context/LanguageContext';
import styles from './SearchBar.module.css';

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function SearchBar({ onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();
  const { t, tt } = useLanguage();

  const handleChange = useCallback((e) => {
    const val = e.target.value;
    setQuery(val);
    setResults(searchPages(val));
    setActiveIdx(-1);
  }, []);

  const handleClear = useCallback(() => {
    setQuery('');
    setResults([]);
    setActiveIdx(-1);
    inputRef.current?.focus();
  }, []);

  const navigateTo = useCallback((path) => {
    navigate(path);
    setQuery('');
    setResults([]);
    onClose?.();
  }, [navigate, onClose]);

  const handleKeyDown = useCallback((e) => {
    if (!results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      navigateTo(results[activeIdx].path);
    } else if (e.key === 'Escape') {
      setQuery('');
      setResults([]);
      onClose?.();
    }
  }, [results, activeIdx, navigateTo, onClose]);

  const showResults = results.length > 0 && query.trim();

  return (
    <div className={styles.wrapper} role="search">
      <div className={`${styles.inputWrap} ${showResults ? styles.inputWrapOpen : ''}`}>
        <span className={styles.icon}><SearchIcon /></span>
        <input
          ref={inputRef}
          className={styles.input}
          type="search"
          placeholder={t('searchPlaceholder')}
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          aria-label={t('searchLabel')}
          aria-autocomplete="list"
          aria-controls={showResults ? 'search-results' : undefined}
          aria-activedescendant={activeIdx >= 0 ? `search-result-${activeIdx}` : undefined}
          autoComplete="off"
          spellCheck={false}
        />
        {query && (
          <button className={styles.clear} onClick={handleClear} aria-label={t('clearSearch')} tabIndex={-1}>
            <ClearIcon />
          </button>
        )}
      </div>

      {showResults && (
        <ul
          ref={listRef}
          id="search-results"
          className={styles.results}
          role="listbox"
          aria-label={t('searchResultsLabel')}
        >
          {results.map((page, i) => (
            <li
              key={page.id}
              id={`search-result-${i}`}
              role="option"
              aria-selected={i === activeIdx}
              className={`${styles.result} ${i === activeIdx ? styles.resultActive : ''}`}
              onPointerDown={(e) => {
                e.preventDefault();
                navigateTo(page.path);
              }}
            >
              <span className={styles.resultTitle}>{tt(page)}</span>
              <span className={styles.resultMeta}>
                {CATEGORIES[page.category]?.label}
              </span>
            </li>
          ))}
        </ul>
      )}

      {query.trim() && results.length === 0 && (
        <div className={styles.empty} role="status">
          {t('searchNoResults')} &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
}
