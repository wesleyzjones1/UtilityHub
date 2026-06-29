import { registerSW } from 'virtual:pwa-register';

/**
 * Registers the service worker for offline support. `registerType: 'autoUpdate'`
 * (see vite.config.js) means new versions activate and refresh automatically, so
 * no update prompt UI is needed here.
 */
export function setupPWA() {
  if (typeof window === 'undefined') return;
  registerSW({ immediate: true });
}
