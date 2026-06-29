import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CATEGORIES, PAGE_BY_CATEGORY, PAGES } from '../../registry/pages';
import { useFavorites } from '../../context/FavoritesContext';
import styles from './CategoryNav.module.css';

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.8L12 17.77 6.8 19.52l.99-5.8-4.21-4.1 5.82-.85L12 3.5z" />
    </svg>
  );
}

function FavoritesDropdown({ groups, onClose }) {
  return (
    <div className={styles.dropdown} role="menu" aria-label="Favorites">
      <div className={styles.favDropdownInner}>
        {groups.map(({ cat, pages }) => (
          <div key={cat.id} className={styles.favGroup}>
            <div className={styles.favGroupLabel}>{cat.label}</div>
            <ul className={styles.favGroupList}>
              {pages.map(page => (
                <li key={page.id}>
                  <Link
                    to={page.path}
                    className={styles.dropdownItem}
                    role="menuitem"
                    onClick={onClose}
                  >
                    <span className={styles.dropdownItemTitle}>{page.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function Dropdown({ category, pages, onClose }) {
  const isWide = pages.length > 8;
  return (
    <div
      className={`${styles.dropdown} ${isWide ? styles.dropdownWide : ''}`}
      role="menu"
      aria-label={`${category.label} tools`}
    >
      <ul className={`${styles.dropdownList} ${isWide ? styles.dropdownListWide : ''}`}>
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
            </Link>
          </li>
        ))}
      </ul>
      <div className={styles.dropdownFooter}>
        <Link
          to={`/tools/category/${category.id}`}
          className={styles.dropdownFooterLink}
          onClick={onClose}
        >
          View all {pages.length} tools →
        </Link>
      </div>
    </div>
  );
}

export default function CategoryNav() {
  const [openCategory, setOpenCategory] = useState(null);
  const navRef = useRef(null);
  const navigate = useNavigate();
  const { favorites } = useFavorites();

  const close = useCallback(() => setOpenCategory(null), []);

  const favPages = PAGES.filter(p => favorites.includes(p.id));
  const favGroups = Object.values(CATEGORIES)
    .map(cat => ({ cat, pages: favPages.filter(p => p.category === cat.id) }))
    .filter(g => g.pages.length > 0);

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
    <nav className={styles.nav} ref={navRef} aria-label="Category navigation">
      {/* Favorites hover toggle — only rendered when tools are saved */}
      {favGroups.length > 0 && (
        <div
          className={styles.navItem}
          onMouseEnter={() => setOpenCategory('__favorites__')}
          onMouseLeave={close}
        >
          <button
            className={`${styles.navButton} ${styles.navButtonFav} ${openCategory === '__favorites__' ? styles.navButtonActive : ''}`}
            aria-expanded={openCategory === '__favorites__'}
            aria-haspopup="menu"
            aria-label="Favorites"
          >
            <StarIcon />
            <span className={styles.favChevron}><ChevronIcon /></span>
          </button>
          {openCategory === '__favorites__' && (
            <FavoritesDropdown groups={favGroups} onClose={close} />
          )}
        </div>
      )}

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
              onClick={() => navigate(`/tools/category/${cat.id}`)}
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
