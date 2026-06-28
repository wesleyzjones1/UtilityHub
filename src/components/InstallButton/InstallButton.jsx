import { useEffect, useState } from 'react';
import styles from './InstallButton.module.css';

/**
 * Renders an "Install app" affordance only when the browser has offered an
 * install prompt (the `beforeinstallprompt` event). Renders nothing otherwise,
 * so it's inert on browsers/tests where install isn't available.
 */
export default function InstallButton() {
  const [promptEvent, setPromptEvent] = useState(null);

  useEffect(() => {
    function onPrompt(e) {
      e.preventDefault();
      setPromptEvent(e);
    }
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  if (!promptEvent) return null;

  async function install() {
    promptEvent.prompt();
    await promptEvent.userChoice;
    setPromptEvent(null);
  }

  return (
    <button className={styles.btn} onClick={install}>
      <span aria-hidden="true">⬇</span> Install app
    </button>
  );
}
