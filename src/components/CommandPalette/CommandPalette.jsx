import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchPages, PAGE_BY_ID, CATEGORIES } from '../../registry/pages';
import { readRecentTools } from '../../hooks/useRecentTools';
import { useLanguage } from '../../context/LanguageContext';
import styles from './CommandPalette.module.css';

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { t, tt } = useLanguage();

  const results = useMemo(() => {
    if (query.trim()) return searchPages(query);
    // Empty query → recent tools as quick suggestions.
    return readRecentTools().map(id => PAGE_BY_ID[id]).filter(Boolean).slice(0, 6);
  }, [query, open]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActiveIndex(0);
    const timer = setTimeout(() => inputRef.current?.focus(), 0);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => { setActiveIndex(0); }, [query]);

  if (!open) return null;

  function go(page) {
    if (!page) return;
    navigate(page.path);
    onClose();
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      go(results[activeIndex]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  }

  const heading = query.trim() ? t('cmdResults') : t('cmdRecent');

  return (
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true" aria-label={t('cmdPaletteLabel')}>
      <div className={styles.panel} onClick={e => e.stopPropagation()}>
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          placeholder={t('cmdSearchPlaceholder')}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label={t('cmdSearchLabel')}
          aria-activedescendant={results[activeIndex] ? `cmd-${results[activeIndex].id}` : undefined}
          autoComplete="off"
          spellCheck={false}
        />

        {results.length > 0 ? (
          <>
            <p className={styles.sectionLabel}>{heading}</p>
            <ul className={styles.list} role="listbox">
              {results.map((page, i) => (
                <li key={page.id} id={`cmd-${page.id}`} role="option" aria-selected={i === activeIndex}>
                  <button
                    className={`${styles.item} ${i === activeIndex ? styles.itemActive : ''}`}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => go(page)}
                  >
                    <span className={styles.itemTitle}>{tt(page)}</span>
                    <span className={styles.itemCat}>{CATEGORIES[page.category]?.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className={styles.empty}>{query.trim() ? t('cmdNoResults') : t('cmdTypeToSearch')}</p>
        )}

        <div className={styles.footer}>
          <span><kbd className={styles.kbd}>↑</kbd><kbd className={styles.kbd}>↓</kbd> {t('cmdNavigate')}</span>
          <span><kbd className={styles.kbd}>↵</kbd> {t('cmdOpenHint')}</span>
          <span><kbd className={styles.kbd}>esc</kbd> {t('cmdCloseHint')}</span>
        </div>
      </div>
    </div>
  );
}
