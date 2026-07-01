import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CATEGORIES, PAGE_BY_CATEGORY } from '../../registry/pages';
import { useLanguage } from '../../context/LanguageContext';
import { useToolPreview } from '../ToolPreview/useToolPreview';
import styles from './CategoryNav.module.css';

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Dropdown({ label, pages, onClose }) {
  const { getItemProps, preview } = useToolPreview();
  const { tt } = useLanguage();
  const isWide = pages.length > 8;
  // For the 2-column layout, fill column-major (down the first column, then the
  // second) by laying the items out in a fixed number of rows.
  const wideStyle = isWide
    ? { gridTemplateRows: `repeat(${Math.ceil(pages.length / 2)}, auto)` }
    : undefined;
  return (
    <div
      className={`${styles.dropdown} ${isWide ? styles.dropdownWide : ''}`}
      role="menu"
      aria-label={`${label} tools`}
    >
      <ul
        className={`${styles.dropdownList} ${isWide ? styles.dropdownListWide : ''}`}
        style={wideStyle}
      >
        {pages.map(page => (
          <li key={page.id}>
            <Link
              to={page.path}
              className={styles.dropdownItem}
              role="menuitem"
              aria-label={tt(page)}
              onClick={onClose}
              {...getItemProps(page)}
            >
              <span className={styles.dropdownItemTitle}>{tt(page)}</span>
            </Link>
          </li>
        ))}
      </ul>
      {preview}
    </div>
  );
}

export default function CategoryNav() {
  const [openCategory, setOpenCategory] = useState(null);
  const navRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const close = useCallback(() => setOpenCategory(null), []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [close]);

  useEffect(() => {
    if (!openCategory) return;
    const onPointer = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) close();
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [openCategory, close]);

  return (
    <nav className={styles.nav} ref={navRef} aria-label={t('categoryNavigationLabel')}>
      {Object.values(CATEGORIES).map(cat => {
        const isOpen = openCategory === cat.id;
        const pages = PAGE_BY_CATEGORY[cat.id] ?? [];
        const label = t(`cat${cat.id.charAt(0).toUpperCase() + cat.id.slice(1)}`);
        return (
          <div
            key={cat.id}
            className={styles.navItem}
            onMouseEnter={() => setOpenCategory(cat.id)}
            onMouseLeave={close}
          >
            <button
              className={`${styles.navButton} ${isOpen ? styles.navButtonActive : ''}`}
              onClick={() => navigate(`/tools/category/${cat.id}`)}
              aria-expanded={isOpen}
              aria-haspopup="menu"
            >
              {label}
              <ChevronIcon />
            </button>
            {isOpen && (
              <Dropdown label={label} pages={pages} onClose={close} />
            )}
          </div>
        );
      })}
    </nav>
  );
}
