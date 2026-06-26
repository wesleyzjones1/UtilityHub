import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const FOOTER_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Contact', href: '/contact' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.copy}>
          &copy; {new Date().getFullYear()} UtilityHub
        </span>
        <nav className={styles.links} aria-label="Footer navigation">
          {FOOTER_LINKS.map(link => (
            <Link key={link.href} to={link.href} className={styles.link}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
