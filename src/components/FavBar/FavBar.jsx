import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';
import { CATEGORIES, PAGES } from '../../registry/pages';
import styles from './FavBar.module.css';

function StarIcon({ filled }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} aria-hidden="true">
      <path
        d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.8L12 17.77 6.8 19.52l.99-5.8-4.21-4.1 5.82-.85L12 3.5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 200ms ease' }}
    >
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function FavBar() {
  const { favorites } = useFavorites();
  const [open, setOpen] = useState(true);

  const favPages = PAGES.filter(p => favorites.includes(p.id));
  if (favPages.length === 0) return null;

  const groups = Object.values(CATEGORIES)
    .map(cat => ({ cat, pages: favPages.filter(p => p.category === cat.id) }))
    .filter(g => g.pages.length > 0);

  return (
    <div className={`${styles.bar} ${open ? styles.barOpen : styles.barClosed}`}>
      <button
        className={styles.toggle}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-label={open ? 'Collapse favorites' : 'Expand favorites'}
        title={open ? 'Collapse favorites' : 'Expand favorites'}
      >
        <StarIcon filled={open} />
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div className={styles.groups}>
          {groups.map(({ cat, pages }) => (
            <div key={cat.id} className={styles.group}>
              <span className={styles.groupLabel}>{cat.label}</span>
              <div className={styles.groupLinks}>
                {pages.map(page => (
                  <Link key={page.id} to={page.path} className={styles.link}>
                    {page.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
