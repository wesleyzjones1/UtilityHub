import { createContext, useCallback, useContext, useState } from 'react';

const AdPreferenceContext = createContext(null);

const STORAGE_KEY = 'uh-hide-ads';
// Honour the legacy "uh-pro" flag so anyone who previously hid ads keeps them hidden.
const LEGACY_KEY = 'uh-pro';

function readInitial() {
  return (
    localStorage.getItem(STORAGE_KEY) === 'true' ||
    localStorage.getItem(LEGACY_KEY) === 'true'
  );
}

/**
 * Honest, local-only ad preference. Ads are optional; hiding them is free and
 * stored in this browser only. There is no purchase or verification — supporting
 * the site is a separate, voluntary action (see SupportContext / SupportModal).
 */
export function AdPreferenceProvider({ children }) {
  const [adsHidden, setAdsHidden] = useState(readInitial);

  const hideAds = useCallback(() => {
    setAdsHidden(true);
    localStorage.setItem(STORAGE_KEY, 'true');
  }, []);

  const showAds = useCallback(() => {
    setAdsHidden(false);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_KEY);
  }, []);

  const toggleAds = useCallback(() => {
    setAdsHidden(prev => {
      const next = !prev;
      if (next) {
        localStorage.setItem(STORAGE_KEY, 'true');
      } else {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(LEGACY_KEY);
      }
      return next;
    });
  }, []);

  return (
    <AdPreferenceContext.Provider value={{ adsHidden, hideAds, showAds, toggleAds }}>
      {children}
    </AdPreferenceContext.Provider>
  );
}

export function useAdPreference() {
  const ctx = useContext(AdPreferenceContext);
  if (!ctx) throw new Error('useAdPreference must be used within AdPreferenceProvider');
  return ctx;
}
