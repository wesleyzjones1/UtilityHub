import { describe, it, expect } from 'vitest';
import { compile, sampleCurve, findRoots, autoYRange, formatNum } from './graphUtils';

describe('compile()', () => {
  it('evaluates basic arithmetic and precedence', () => {
    expect(compile('1 + 2 * 3')(0)).toBe(7);
    expect(compile('(1 + 2) * 3')(0)).toBe(9);
    expect(compile('2 ^ 3 ^ 2')(0)).toBe(512); // right-associative
  });

  it('substitutes x', () => {
    const f = compile('x^2 - 4');
    expect(f(0)).toBe(-4);
    expect(f(2)).toBe(0);
    expect(f(3)).toBe(5);
  });

  it('handles unary minus vs exponent', () => {
    expect(compile('-x^2')(3)).toBe(-9);
    expect(compile('(-x)^2')(3)).toBe(9);
    expect(compile('-3')(0)).toBe(-3);
    expect(compile('2^-2')(0)).toBe(0.25);
  });

  it('supports implicit multiplication', () => {
    expect(compile('2x')(5)).toBe(10);
    expect(compile('3(x+1)')(1)).toBe(6);
    expect(compile('2x^2')(3)).toBe(18);
  });

  it('supports functions and constants', () => {
    expect(compile('sin(0)')(0)).toBe(0);
    expect(compile('sqrt(x)')(9)).toBe(3);
    expect(compile('cos(pi)')(0)).toBeCloseTo(-1);
    expect(compile('2sin(x)')(0)).toBe(0);
  });

  it('throws on invalid input', () => {
    expect(() => compile('')).toThrow();
    expect(() => compile('x +')).toThrow();
    expect(() => compile('(x + 1')).toThrow();
    expect(() => compile('foo(x)')).toThrow();
    expect(() => compile('*x')).toThrow(); // leading binary operator
    expect(() => compile('x @ 2')).toThrow(); // unknown character
  });
});

describe('findRoots()', () => {
  it('finds both roots of a parabola', () => {
    const roots = findRoots(compile('x^2 - 4'), -10, 10);
    expect(roots).toHaveLength(2);
    expect(roots[0]).toBeCloseTo(-2, 4);
    expect(roots[1]).toBeCloseTo(2, 4);
  });

  it('finds a linear root', () => {
    const roots = findRoots(compile('2x - 6'), -10, 10);
    expect(roots).toHaveLength(1);
    expect(roots[0]).toBeCloseTo(3, 4);
  });

  it('returns nothing when there is no real root in range', () => {
    expect(findRoots(compile('x^2 + 1'), -10, 10)).toEqual([]);
  });
});

describe('sampleCurve()', () => {
  it('returns steps + 1 points spanning the domain', () => {
    const pts = sampleCurve(compile('x'), 0, 10, 10);
    expect(pts).toHaveLength(11);
    expect(pts[0]).toEqual({ x: 0, y: 0 });
    expect(pts[10].x).toBeCloseTo(10);
    expect(pts[10].y).toBeCloseTo(10);
  });

  it('marks undefined values as NaN', () => {
    const pts = sampleCurve(compile('sqrt(x)'), -4, -1, 3);
    expect(pts.every(p => Number.isNaN(p.y))).toBe(true);
  });
});

describe('autoYRange()', () => {
  it('brackets the data with padding', () => {
    const [lo, hi] = autoYRange([{ y: 0 }, { y: 5 }, { y: 10 }]);
    expect(lo).toBeLessThanOrEqual(0);
    expect(hi).toBeGreaterThanOrEqual(10);
  });

  it('falls back when no finite data', () => {
    expect(autoYRange([{ y: NaN }])).toEqual([-10, 10]);
  });
});

describe('formatNum()', () => {
  it('keeps integers whole and trims decimals', () => {
    expect(formatNum(3)).toBe('3');
    expect(formatNum(-0)).toBe('0');
    expect(formatNum(1.23456789)).toBe('1.2346');
    expect(formatNum(Infinity)).toBe('—');
  });
});
