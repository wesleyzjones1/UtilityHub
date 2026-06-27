import { describe, it, expect } from 'vitest';
import { hexToRgb, rgbToHex, hexToHsl, contrastLabel } from './colorUtils';

describe('hexToRgb', () => {
  it('parses white', () => expect(hexToRgb('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 }));
  it('parses black', () => expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 }));
  it('parses red', () => expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 }));
  it('parses a mixed color', () => expect(hexToRgb('#1A2B3C')).toEqual({ r: 26, g: 43, b: 60 }));
});

describe('rgbToHex', () => {
  it('converts white', () => expect(rgbToHex(255, 255, 255)).toBe('#FFFFFF'));
  it('converts black', () => expect(rgbToHex(0, 0, 0)).toBe('#000000'));
  it('converts red', () => expect(rgbToHex(255, 0, 0)).toBe('#FF0000'));
  it('pads single-digit channels', () => expect(rgbToHex(1, 2, 3)).toBe('#010203'));
});

describe('hexToHsl', () => {
  it('white is 0° 0% 100%', () => expect(hexToHsl('#FFFFFF')).toEqual({ h: 0, s: 0, l: 100 }));
  it('black is 0° 0% 0%', () => expect(hexToHsl('#000000')).toEqual({ h: 0, s: 0, l: 0 }));
  it('pure red is 0° 100% 50%', () => expect(hexToHsl('#FF0000')).toEqual({ h: 0, s: 100, l: 50 }));
  it('pure green is 120° 100% 50%', () => expect(hexToHsl('#00FF00')).toEqual({ h: 120, s: 100, l: 50 }));
  it('pure blue is 240° 100% 50%', () => expect(hexToHsl('#0000FF')).toEqual({ h: 240, s: 100, l: 50 }));
});

describe('contrastLabel', () => {
  it('returns black for white background', () => expect(contrastLabel('#FFFFFF')).toBe('#000000'));
  it('returns white for black background', () => expect(contrastLabel('#000000')).toBe('#FFFFFF'));
  it('returns white for dark blue', () => expect(contrastLabel('#1E3A5F')).toBe('#FFFFFF'));
  it('returns black for light yellow', () => expect(contrastLabel('#FFFF99')).toBe('#000000'));
});
