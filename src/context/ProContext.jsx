import { createContext, useCallback, useContext, useState } from 'react';

const ProContext = createContext(null);

export function ProProvider({ children }) {
  const [isPro, setIsPro] = useState(
    () => localStorage.getItem('uh-pro') === 'true'
  );

  const activatePro = useCallback(() => {
    setIsPro(true);
    localStorage.setItem('uh-pro', 'true');
  }, []);

  const deactivatePro = useCallback(() => {
    setIsPro(false);
    localStorage.removeItem('uh-pro');
  }, []);

  return (
    <ProContext.Provider value={{ isPro, activatePro, deactivatePro }}>
      {children}
    </ProContext.Provider>
  );
}

export function usePro() {
  const ctx = useContext(ProContext);
  if (!ctx) throw new Error('usePro must be used within ProProvider');
  return ctx;
}
