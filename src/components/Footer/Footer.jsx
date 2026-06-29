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
        <button className={styles.support} onClick={openSupport} aria-label="Support UtilityHub">
          <span className={styles.lead}>Free to use.</span>{' '}
          If this tool saved you time, you can support the project.{' '}
          <span className={styles.heart} aria-hidden="true">♥</span>
        </button>
        <div className={styles.links}>
          <InstallButton />
          <Link className={styles.link} to="/about">About</Link>
        </div>
      </div>
    </footer>
  );
}
