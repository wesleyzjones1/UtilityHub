import { Link, Navigate, useParams } from 'react-router-dom';
import { CATEGORIES, PAGE_BY_CATEGORY } from '../../registry/pages';
import styles from './CategoryPage.module.css';

export default function CategoryPage() {
  const { categoryId } = useParams();
  const category = CATEGORIES[categoryId];
  const pages = PAGE_BY_CATEGORY[categoryId] ?? [];

  if (!category) return <Navigate to="/" replace />;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/" className={styles.bcLink}>Home</Link>
          <span className={styles.bcSep} aria-hidden="true">/</span>
          <span className={styles.bcCurrent} aria-current="page">{category.label}</span>
        </nav>
        <h1 className={styles.title}>{category.label}</h1>
        <p className={styles.subtitle}>
          {category.description} &mdash; {pages.length} tool{pages.length !== 1 ? 's' : ''}
        </p>
      </header>

      <ul className={styles.grid} aria-label={`${category.label} tools`}>
        {pages.map(page => (
          <li key={page.id}>
            <Link to={page.path} className={styles.card}>
              <span className={styles.cardTitle}>{page.title}</span>
              <span className={styles.cardDesc}>{page.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
