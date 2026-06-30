import { useCallback, useEffect, useRef, useState } from 'react';
import ToolPreview from './ToolPreview';

const SHOW_DELAY = 140;

/**
 * Shared hover-preview logic for navbar menus. Spread `getItemProps(page)` onto
 * each tool link and render `preview` once inside the menu container.
 */
export function useToolPreview() {
  const [state, setState] = useState(null); // { page, rect } | null
  const timer = useRef(null);

  const clear = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  // Clean up any pending timer on unmount.
  useEffect(() => clear, [clear]);

  const show = useCallback((page, el) => {
    clear();
    const rect = el.getBoundingClientRect();
    timer.current = setTimeout(() => setState({ page, rect }), SHOW_DELAY);
  }, [clear]);

  const hide = useCallback(() => {
    clear();
    setState(null);
  }, [clear]);

  const getItemProps = useCallback((page) => ({
    onMouseEnter: (e) => show(page, e.currentTarget),
    onMouseLeave: hide,
  }), [show, hide]);

  const preview = state ? <ToolPreview page={state.page} rect={state.rect} /> : null;

  return { getItemProps, preview };
}
