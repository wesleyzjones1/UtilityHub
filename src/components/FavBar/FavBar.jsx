import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';
import { PAGES } from '../../registry/pages';
import styles from './FavBar.module.css';

export default function FavBar() {
  const { favorites } = useFavorites();
  const [open, setOpen] = useState(true);

  const favPages = PAGES.filter(p => favorites.includes(p.id));
  if (favPages.length === 0) return null;

  return (
    <div className={styles.bar}>
      <button
        className={styles.toggle}
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Collapse favorites' : 'Expand favorites'}
      >
        ★ Favorites
        <span className={styles.chevron} aria-hidden="true">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className={styles.links}>
          {favPages.map(p => (
            <Link key={p.id} to={p.path} className={styles.link}>
              {p.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
