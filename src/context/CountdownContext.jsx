import { createContext, useCallback, useContext, useState } from 'react';

const CountdownContext = createContext(null);

export function CountdownProvider({ children }) {
  const [timerState, setTimerState] = useState(null); // null when idle

  const publishTimer = useCallback((state) => setTimerState(state), []);
  const clearTimer = useCallback(() => setTimerState(null), []);

  return (
    <CountdownContext.Provider value={{ timerState, publishTimer, clearTimer }}>
      {children}
    </CountdownContext.Provider>
  );
}

export function useCountdown() {
  const ctx = useContext(CountdownContext);
  if (!ctx) throw new Error('useCountdown must be used within CountdownProvider');
  return ctx;
}
