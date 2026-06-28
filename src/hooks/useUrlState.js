import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Two-way bind a single string value to a URL query parameter so a tool's state
 * is shareable/bookmarkable. Works under the app's hash router (the query lives
 * inside the hash, e.g. #/tools/base64?mode=decode). Updates use `replace` so
 * typing doesn't flood browser history.
 *
 * @returns {[string, (next: string) => void]}
 */
export function useUrlState(key, defaultValue = '') {
  const [params, setParams] = useSearchParams();
  const value = params.has(key) ? params.get(key) : defaultValue;

  const setValue = useCallback((next) => {
    setParams(prev => {
      const p = new URLSearchParams(prev);
      if (next === undefined || next === null || next === '') {
        p.delete(key);
      } else {
        p.set(key, next);
      }
      return p;
    }, { replace: true });
  }, [key, setParams]);

  return [value, setValue];
}
