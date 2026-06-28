import { useCallback, useState } from 'react';

const STORAGE_KEY = 'uh-recent-tools';
const MAX_RECENT = 8;

export function readRecentTools() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

/** Move `id` to the front of the recents list, de-duplicated and capped. */
export function recordRecentTool(id) {
  const next = [id, ...readRecentTools().filter(x => x !== id)].slice(0, MAX_RECENT);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function useRecentTools() {
  const [recent, setRecent] = useState(readRecentTools);
  const record = useCallback((id) => setRecent(recordRecentTool(id)), []);
  return { recent, record };
}
