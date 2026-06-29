import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readRecentTools, recordRecentTool } from './useRecentTools';

let store = {};

beforeEach(() => {
  store = {};
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn(key => store[key] ?? null),
      setItem: vi.fn((key, val) => { store[key] = val; }),
      removeItem: vi.fn(key => { delete store[key]; }),
    },
    writable: true,
    configurable: true,
  });
});

describe('useRecentTools helpers', () => {
  it('returns an empty list initially', () => {
    expect(readRecentTools()).toEqual([]);
  });

  it('records a tool to the front', () => {
    recordRecentTool('word-counter');
    expect(readRecentTools()).toEqual(['word-counter']);
  });

  it('moves an existing tool to the front without duplicating', () => {
    recordRecentTool('a');
    recordRecentTool('b');
    recordRecentTool('a');
    expect(readRecentTools()).toEqual(['a', 'b']);
  });

  it('caps the list at 8 entries', () => {
    for (let i = 0; i < 12; i++) recordRecentTool(`tool-${i}`);
    const recent = readRecentTools();
    expect(recent).toHaveLength(8);
    expect(recent[0]).toBe('tool-11');
  });

  it('tolerates malformed localStorage data', () => {
    store['uh-recent-tools'] = 'not json';
    expect(readRecentTools()).toEqual([]);
  });
});
