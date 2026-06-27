import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.copy}>
          &copy; {new Date().getFullYear()} UtilityHub &mdash; Free tools, no sign-up required.
        </span>
      </div>
    </footer>
  );
}
