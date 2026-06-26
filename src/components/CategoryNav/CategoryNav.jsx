import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, PAGE_BY_CATEGORY } from '../../registry/pages';
import styles from './CategoryNav.module.css';

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Dropdown({ category, pages, onClose }) {
  return (
    <div className={styles.dropdown} role="menu" aria-label={`${category.label} tools`}>
      <ul className={styles.dropdownList}>
        {pages.map(page => (
          <li key={page.id}>
            <Link
              to={page.path}
              className={styles.dropdownItem}
              role="menuitem"
              aria-label={page.title}
              onClick={onClose}
            >
              <span className={styles.dropdownItemTitle}>{page.title}</span>
              <span className={styles.dropdownItemDesc}>{page.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CategoryNav() {
  const [openCategory, setOpenCategory] = useState(null);
  const navRef = useRef(null);

  const close = useCallback(() => setOpenCategory(null), []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [close]);

  // Close on outside click
  useEffect(() => {
    if (!openCategory) return;
    const onPointer = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) close();
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [openCategory, close]);

  return (
    <nav className={styles.nav} ref={navRef} aria-label="Category navigation">
      {Object.values(CATEGORIES).map(cat => {
        const isOpen = openCategory === cat.id;
        const pages = PAGE_BY_CATEGORY[cat.id] ?? [];
        return (
          <div
            key={cat.id}
            className={styles.navItem}
            onMouseEnter={() => setOpenCategory(cat.id)}
            onMouseLeave={close}
          >
            <button
              className={`${styles.navButton} ${isOpen ? styles.navButtonActive : ''}`}
              onClick={() => setOpenCategory(cat.id)}
              aria-expanded={isOpen}
              aria-haspopup="menu"
            >
              {cat.label}
              <ChevronIcon />
            </button>
            {isOpen && (
              <Dropdown category={cat} pages={pages} onClose={close} />
            )}
          </div>
        );
      })}
    </nav>
  );
}
