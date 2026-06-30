import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';
import { CATEGORIES, PAGES } from '../../registry/pages';
import { useToolPreview } from '../ToolPreview/useToolPreview';
import styles from './FavoritesMenu.module.css';

function StarIcon({ filled }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} aria-hidden="true">
      <path
        d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.8L12 17.77 6.8 19.52l.99-5.8-4.21-4.1 5.82-.85L12 3.5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FavoritesMenu() {
  const { favorites } = useFavorites();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { getItemProps, preview } = useToolPreview();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    const onPointer = (e) => {
      if (ref.current && !ref.current.contains(e.target)) close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open, close]);

  const favPages = PAGES.filter(p => favorites.includes(p.id));
  const groups = Object.values(CATEGORIES)
    .map(cat => ({ cat, pages: favPages.filter(p => p.category === cat.id) }))
    .filter(g => g.pages.length > 0);

  const count = favPages.length;

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        className={`${styles.trigger} ${open ? styles.triggerOpen : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Favorites (${count})`}
        title="Favorites"
      >
        <StarIcon filled={count > 0} />
        {count > 0 && <span className={styles.badge}>{count}</span>}
      </button>

      {open && (
        <div className={styles.dropdown} role="menu" aria-label="Favorites">
          {groups.length === 0 ? (
            <div className={styles.empty}>
              <StarIcon filled={false} />
              <p>No favorites yet</p>
              <span>Tap the star on any tool to save it here.</span>
            </div>
          ) : (
            <div className={styles.groups}>
              {groups.map(({ cat, pages }) => (
                <div key={cat.id} className={styles.group}>
                  <div className={styles.groupLabel}>{cat.label}</div>
                  <ul className={styles.list}>
                    {pages.map(page => (
                      <li key={page.id}>
                        <Link
                          to={page.path}
                          className={styles.link}
                          role="menuitem"
                          onClick={close}
                          {...getItemProps(page)}
                        >
                          {page.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          {preview}
        </div>
      )}
    </div>
  );
}
