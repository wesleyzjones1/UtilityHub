import { describe, it, expect } from 'vitest';
import {
  UNIT_CATEGORIES,
  convertUnit,
  convertTemperature,
  formatResult,
} from './unitConversions';

describe('convertUnit — length', () => {
  it('1 km = 1000 m', () => expect(convertUnit(1, 'length', 'km', 'm')).toBeCloseTo(1000, 6));
  it('1 m = 100 cm', () => expect(convertUnit(1, 'length', 'm', 'cm')).toBeCloseTo(100, 6));
  it('1 mi ≈ 1609.344 m', () => expect(convertUnit(1, 'length', 'mi', 'm')).toBeCloseTo(1609.344, 3));
  it('12 in = 1 ft', () => expect(convertUnit(12, 'length', 'in', 'ft')).toBeCloseTo(1, 6));
});

describe('convertUnit — mass', () => {
  it('1 kg = 1000 g', () => expect(convertUnit(1, 'mass', 'kg', 'g')).toBeCloseTo(1000, 6));
  it('1 lb ≈ 16 oz', () => expect(convertUnit(1, 'mass', 'lb', 'oz')).toBeCloseTo(16, 2));
});

describe('convertUnit — round trip', () => {
  it('km→mi→km is identity', () => {
    const mi = convertUnit(5, 'length', 'km', 'mi');
    expect(convertUnit(mi, 'length', 'mi', 'km')).toBeCloseTo(5, 6);
  });
});

describe('convertTemperature', () => {
  it('0 °C = 32 °F', () => expect(convertTemperature(0, 'c', 'f')).toBeCloseTo(32, 6));
  it('100 °C = 212 °F', () => expect(convertTemperature(100, 'c', 'f')).toBeCloseTo(212, 6));
  it('0 °C = 273.15 K', () => expect(convertTemperature(0, 'c', 'k')).toBeCloseTo(273.15, 6));
  it('32 °F = 0 °C', () => expect(convertTemperature(32, 'f', 'c')).toBeCloseTo(0, 6));
  it('same unit is identity', () => expect(convertTemperature(20, 'c', 'c')).toBe(20));
});

describe('convertUnit — invalid', () => {
  it('returns NaN for non-numeric input', () => expect(convertUnit('abc', 'length', 'm', 'cm')).toBeNaN());
  it('returns NaN for unknown unit', () => expect(convertUnit(1, 'length', 'm', 'xyz')).toBeNaN());
});

describe('formatResult', () => {
  it('trims trailing zeros', () => expect(formatResult(100)).toBe('100'));
  it('returns empty for NaN', () => expect(formatResult(NaN)).toBe(''));
  it('handles zero', () => expect(formatResult(0)).toBe('0'));
});

describe('UNIT_CATEGORIES', () => {
  it('exposes the expected categories', () => {
    expect(Object.keys(UNIT_CATEGORIES)).toEqual(['length', 'mass', 'volume', 'area', 'temperature']);
  });
});
