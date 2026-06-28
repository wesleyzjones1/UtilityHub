import { Link } from 'react-router-dom';
import { PAGES, CATEGORIES } from '../../registry/pages';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { useSupport } from '../../context/SupportContext';
import styles from './About.module.css';

const REPO_URL = import.meta.env.VITE_REPO_URL ?? 'https://github.com/wesleyzjones1/UtilityHub';

// Newest first. Keep short; this is the user-facing "what's new".
const CHANGELOG = [
  {
    version: 'Favorites, recents & command palette',
    items: [
      'Star tools to pin them; recently used tools surface on the home page.',
      'Press Ctrl/⌘ + K anywhere to jump to any tool.',
      'Honest support: optional donations and a free “hide ads” toggle — no fake paywall.',
    ],
  },
  {
    version: 'Offline & installable',
    items: [
      'UtilityHub now works offline and can be installed as an app.',
      'Per-page titles and link previews for cleaner sharing and bookmarking.',
    ],
  },
  {
    version: '13 new tools',
    items: [
      'Added date, timestamp, timezone, Base64, URL, regex, gradient, palette, random, statistics, scientific calculator, lorem ipsum, and text-diff tools.',
    ],
  },
];

export default function About() {
  useDocumentMeta({
    title: 'About',
    description: 'About UtilityHub — free, private, open tools that run entirely in your browser.',
  });
  const { openSupport } = useSupport();

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/" className={styles.bcLink}>Home</Link>
          <span className={styles.bcSep} aria-hidden="true">/</span>
          <span className={styles.bcItem} aria-current="page">About</span>
        </nav>

        <h1 className={styles.title}>About UtilityHub</h1>
        <p className={styles.lede}>
          {PAGES.length} free tools across {Object.keys(CATEGORIES).length} categories — for text,
          numbers, colors, images, code, and time.
        </p>

        <section className={styles.section}>
          <h2 className={styles.h2}>Private by design</h2>
          <p className={styles.body}>
            Every tool runs entirely in your browser. Your input never leaves your device — there's
            no server processing, no account, and no tracking. That's also why it works offline once
            you've visited.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>Free, and how to help</h2>
          <p className={styles.body}>
            UtilityHub is free for everyone. If it saves you time, you can{' '}
            <button className={styles.inlineBtn} onClick={openSupport}>support the project</button>{' '}
            or simply share it. It's open source on{' '}
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className={styles.link}>GitHub</a>.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>What's new</h2>
          <ul className={styles.changelog}>
            {CHANGELOG.map((entry, i) => (
              <li key={i} className={styles.entry}>
                <p className={styles.entryTitle}>{entry.version}</p>
                <ul className={styles.entryItems}>
                  {entry.items.map((it, j) => <li key={j}>{it}</li>)}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        <Link to="/" className={styles.backLink}>← Back to all tools</Link>
      </div>
    </div>
  );
}
