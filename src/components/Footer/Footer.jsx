import { Link } from 'react-router-dom';
import { useSupport } from '../../context/SupportContext';
import InstallButton from '../InstallButton/InstallButton';
import styles from './Footer.module.css';

const REPO_URL = import.meta.env.VITE_REPO_URL ?? 'https://github.com/wesleyzjones1/UtilityHub';

export default function Footer() {
  const { openSupport } = useSupport();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.copy}>
          &copy; {new Date().getFullYear()} UtilityHub
        </span>
        <div className={styles.supportGroup}>
          <span className={styles.supportText}>
            If this tool saved you time, consider supporting the project.
          </span>
          <button className={styles.supportBtn} onClick={openSupport} aria-label="Support UtilityHub">
            <span className={styles.supportHeart} aria-hidden="true">♥</span>
            <span>Support</span>
          </button>
        </div>
        <div className={styles.links}>
          <InstallButton />
          <Link className={styles.link} to="/about">About</Link>
        </div>
      </div>
    </footer>
  );
}
