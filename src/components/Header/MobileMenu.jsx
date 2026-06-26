import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, PAGE_BY_CATEGORY } from '../../registry/pages';
import SearchBar from '../SearchBar/SearchBar';
import styles from './MobileMenu.module.css';

function ChevronIcon({ open }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms ease' }}
    >
      <path d="M2.5 5l4.5 4.5L11.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function MobileMenu({ id, open, onClose }) {
  const [openCat, setOpenCat] = useState(null);

  if (!open) return null;

  return (
    <div id={id} className={styles.overlay} aria-modal="true" role="dialog" aria-label="Navigation menu">
      <div className={styles.searchSection}>
        <SearchBar onClose={onClose} />
      </div>

      <nav className={styles.nav} aria-label="Category navigation">
        {Object.values(CATEGORIES).map(cat => {
          const isOpen = openCat === cat.id;
          const pages = PAGE_BY_CATEGORY[cat.id] ?? [];
          return (
            <div key={cat.id} className={styles.catGroup}>
              <button
                className={styles.catButton}
                onClick={() => setOpenCat(isOpen ? null : cat.id)}
                aria-expanded={isOpen}
              >
                <span>{cat.label}</span>
                <ChevronIcon open={isOpen} />
              </button>

              {isOpen && (
                <ul className={styles.toolList}>
                  {pages.map(page => (
                    <li key={page.id}>
                      <Link to={page.path} className={styles.toolLink} onClick={onClose}>
                        {page.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
