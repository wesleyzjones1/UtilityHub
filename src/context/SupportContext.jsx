import { createContext, useCallback, useContext, useState } from 'react';

const SupportContext = createContext(null);

/**
 * Holds the open/close state of the Support modal so any component (header,
 * footer, ad-blocker notice, in-page support cards) can open it without prop
 * drilling. The modal itself is rendered once in Layout.
 */
export function SupportProvider({ children }) {
  const [open, setOpen] = useState(false);

  const openSupport = useCallback(() => setOpen(true), []);
  const closeSupport = useCallback(() => setOpen(false), []);

  return (
    <SupportContext.Provider value={{ open, openSupport, closeSupport }}>
      {children}
    </SupportContext.Provider>
  );
}

export function useSupport() {
  const ctx = useContext(SupportContext);
  if (!ctx) throw new Error('useSupport must be used within SupportProvider');
  return ctx;
}
