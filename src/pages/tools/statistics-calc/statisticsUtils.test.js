import { describe, it, expect } from 'vitest';
import { parseNumbers, mean, median, mode, stddev } from './statisticsUtils';

describe('statisticsUtils', () => {
  it('parseNumbers handles comma-separated input', () => {
    expect(parseNumbers('1, 2, 3')).toEqual([1, 2, 3]);
  });

  it('mean([1, 2, 3]) === 2', () => {
    expect(mean([1, 2, 3])).toBe(2);
  });

  it('median([1, 2, 3, 4]) === 2.5', () => {
    expect(median([1, 2, 3, 4])).toBe(2.5);
  });

  it('mode([1, 1, 2, 3]) returns [1]', () => {
    expect(mode([1, 1, 2, 3])).toEqual([1]);
  });

  it('stddev([2,4,4,4,5,5,7,9]) ≈ 2', () => {
    expect(Math.abs(stddev([2, 4, 4, 4, 5, 5, 7, 9]) - 2)).toBeLessThan(0.001);
  });
});
