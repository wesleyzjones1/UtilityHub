import { describe, it, expect } from 'vitest';
import { percentOf, whatPercent, percentChange, formatNumber } from './percentageUtils';

describe('percentOf', () => {
  it('10% of 200 is 20', () => expect(percentOf(10, 200)).toBe(20));
  it('50% of 50 is 25', () => expect(percentOf(50, 50)).toBe(25));
  it('returns NaN for bad input', () => expect(percentOf('x', 200)).toBeNaN());
});

describe('whatPercent', () => {
  it('20 of 200 is 10%', () => expect(whatPercent(20, 200)).toBe(10));
  it('1 of 4 is 25%', () => expect(whatPercent(1, 4)).toBe(25));
  it('returns NaN when whole is 0', () => expect(whatPercent(5, 0)).toBeNaN());
});

describe('percentChange', () => {
  it('100 → 150 is +50%', () => expect(percentChange(100, 150)).toBe(50));
  it('200 → 100 is -50%', () => expect(percentChange(200, 100)).toBe(-50));
  it('returns NaN when from is 0', () => expect(percentChange(0, 100)).toBeNaN());
});

describe('formatNumber', () => {
  it('trims trailing zeros', () => expect(formatNumber(20.0)).toBe('20'));
  it('keeps needed decimals', () => expect(formatNumber(33.3333333)).toBe('33.3333'));
  it('returns empty for NaN', () => expect(formatNumber(NaN)).toBe(''));
});
