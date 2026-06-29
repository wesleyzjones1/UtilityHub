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
          &copy; {new Date().getFullYear()} UtilityHub &mdash; free tools, no sign-up required.
        </span>
        <div className={styles.links}>
          <InstallButton />
          <Link className={styles.link} to="/about">About</Link>
          <button className={styles.linkBtn} onClick={openSupport}>
            <span className={styles.heart} aria-hidden="true">♥</span> Support
          </button>
          <a className={styles.link} href={REPO_URL} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
