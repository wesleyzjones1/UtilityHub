import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <span className={styles.code}>404</span>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.sub}>
          The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
        </p>
        <Link to="/" className={styles.homeLink}>Go to home</Link>
      </div>
    </div>
  );
}
