import { useFavorites } from '../../context/FavoritesContext';
import styles from './FavoriteButton.module.css';

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

/**
 * Star toggle for favouriting a tool. Used on tool pages and home-page chips.
 * - `variant="chip"` renders the compact icon form used inside dense grids.
 * - `showLabel` renders a labelled pill (used in the tool-page header).
 */
export default function FavoriteButton({ pageId, title, variant = 'default', showLabel = false }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(pageId);

  const cls = [
    styles.btn,
    variant === 'chip' ? styles.chip : '',
    showLabel ? styles.labelled : '',
    fav ? styles.active : '',
  ].join(' ');

  return (
    <button
      type="button"
      className={cls}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(pageId); }}
      aria-pressed={fav}
      aria-label={fav ? `Remove ${title} from favorites` : `Add ${title} to favorites`}
      title={fav ? 'Remove from favorites' : 'Add to favorites'}
    >
      <StarIcon filled={fav} />
      {showLabel && <span>{fav ? 'Saved' : 'Save to favorites'}</span>}
    </button>
  );
}
