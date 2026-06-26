import { describe, it, expect } from 'vitest';
import { computeDiff, lineDiff, wordDiff, diffStats } from './diff';

describe('computeDiff', () => {
  it('returns equal ops for identical arrays', () => {
    const ops = computeDiff(['a', 'b'], ['a', 'b']);
    expect(ops.every(o => o.type === 'equal')).toBe(true);
  });

  it('detects insertions', () => {
    const ops = computeDiff([], ['a']);
    expect(ops).toEqual([{ type: 'insert', left: null, right: 'a' }]);
  });

  it('detects deletions', () => {
    const ops = computeDiff(['a'], []);
    expect(ops).toEqual([{ type: 'delete', left: 'a', right: null }]);
  });

  it('handles mixed changes', () => {
    const ops = computeDiff(['a', 'b'], ['a', 'c']);
    const types = ops.map(o => o.type);
    expect(types).toContain('equal');
    expect(types).toContain('delete');
    expect(types).toContain('insert');
  });

  it('handles empty arrays', () => {
    expect(computeDiff([], [])).toEqual([]);
  });
});

describe('lineDiff', () => {
  it('returns equal for identical texts', () => {
    const ops = lineDiff('a\nb', 'a\nb');
    expect(ops.every(o => o.type === 'equal')).toBe(true);
  });

  it('detects added lines', () => {
    const ops = lineDiff('a', 'a\nb');
    const types = ops.map(o => o.type);
    expect(types).toContain('insert');
  });

  it('detects removed lines', () => {
    const ops = lineDiff('a\nb', 'a');
    const types = ops.map(o => o.type);
    expect(types).toContain('delete');
  });

  it('detects case-only changes', () => {
    const ops = lineDiff('Hello World', 'hello world');
    expect(ops.some(o => o.type === 'case-change')).toBe(true);
  });

  it('treats real content changes as change (not case-change)', () => {
    const ops = lineDiff('foo', 'bar');
    expect(ops.some(o => o.type === 'change')).toBe(true);
  });

  it('handles empty strings', () => {
    expect(() => lineDiff('', '')).not.toThrow();
  });
});

describe('wordDiff', () => {
  it('returns equal for identical lines', () => {
    const ops = wordDiff('hello world', 'hello world');
    expect(ops.every(o => o.type === 'equal')).toBe(true);
  });

  it('detects word insertions', () => {
    const ops = wordDiff('hello', 'hello world');
    expect(ops.some(o => o.type === 'insert')).toBe(true);
  });

  it('detects word deletions', () => {
    const ops = wordDiff('hello world', 'hello');
    expect(ops.some(o => o.type === 'delete')).toBe(true);
  });

  it('handles empty strings', () => {
    expect(wordDiff('', '')).toEqual([]);
  });
});

describe('diffStats', () => {
  it('counts ops correctly', () => {
    const ops = [
      { type: 'equal' },
      { type: 'insert' },
      { type: 'delete' },
      { type: 'change' },
      { type: 'case-change' },
    ];
    const stats = diffStats(ops);
    expect(stats.unchanged).toBe(1);
    expect(stats.added).toBe(2);    // insert + change
    expect(stats.removed).toBe(2);  // delete + change
    expect(stats.caseChanges).toBe(1);
  });

  it('returns zeros for empty ops', () => {
    const stats = diffStats([]);
    expect(stats).toEqual({ added: 0, removed: 0, caseChanges: 0, unchanged: 0 });
  });
});
