import { Link, Navigate, useParams } from 'react-router-dom';
import { CATEGORIES, PAGE_BY_CATEGORY } from '../../registry/pages';
import { useLanguage } from '../../context/LanguageContext';
import FavoriteButton from '../../components/FavoriteButton/FavoriteButton';
import styles from './CategoryPage.module.css';

export default function CategoryPage() {
  const { categoryId } = useParams();
  const category = CATEGORIES[categoryId];
  const pages = PAGE_BY_CATEGORY[categoryId] ?? [];
  const { t, td, tt } = useLanguage();

  if (!category) return <Navigate to="/" replace />;

  const catKey = `cat${category.id.charAt(0).toUpperCase() + category.id.slice(1)}`;
  const label = t(catKey);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>{label}</h1>
        <p className={styles.subtitle}>
          {t(`${catKey}Desc`)} &mdash; {pages.length} tool{pages.length !== 1 ? 's' : ''}
        </p>
      </header>

      <ul className={styles.grid} aria-label={`${label} tools`}>
        {pages.map(page => (
          <li key={page.id} className={styles.item}>
            <Link to={page.path} className={styles.card}>
              <span className={styles.cardTitle}>{tt(page)}</span>
              <span className={styles.cardDesc}>{td(page)}</span>
            </Link>
            <FavoriteButton pageId={page.id} title={tt(page)} variant="chip" />
          </li>
        ))}
      </ul>
    </div>
  );
}
