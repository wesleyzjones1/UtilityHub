import { createContext, useContext } from 'react';

/**
 * When true, tool pages render in "preview" mode — just their interactive
 * content, with no page header, how-to, related tools, or side effects
 * (document title, recent-tools tracking). Used by the navbar hover preview to
 * render a live, shrunk-down snapshot of each tool.
 */
export const PreviewContext = createContext(false);

export const useIsPreview = () => useContext(PreviewContext);
