import { describe, it, expect } from 'vitest';
import {
  minifyCSS, minifyHTML, minifyJS,
  formatXML, minifyXML,
  formatJSON, minifyJSON,
  encodeJSONText, decodeJSONText,
  calculatePiAttenuator, reversePiAttenuator,
} from './formatters';

describe('minifyCSS', () => {
  it('removes comments', () => {
    expect(minifyCSS('/* comment */ body { color: red; }')).not.toContain('comment');
  });
  it('collapses whitespace around braces', () => {
    const out = minifyCSS('body {\n  color: red;\n}');
    expect(out).toBe('body{color:red}');
  });
  it('returns empty for empty input', () => {
    expect(minifyCSS('')).toBe('');
  });
});

describe('minifyHTML', () => {
  it('removes comments', () => {
    expect(minifyHTML('<!-- hi --><p>hi</p>')).toBe('<p>hi</p>');
  });
  it('strips whitespace between tags', () => {
    expect(minifyHTML('<div>  <p>hi</p>  </div>')).toBe('<div><p>hi</p></div>');
  });
});

describe('minifyJS', () => {
  it('removes single-line comments', () => {
    expect(minifyJS('// comment\nconst x = 1;')).not.toContain('comment');
  });
  it('removes block comments', () => {
    expect(minifyJS('/* block */const x = 1;')).not.toContain('block');
  });
});

describe('formatXML', () => {
  it('indents nested elements', () => {
    const result = formatXML('<root><child>text</child></root>');
    expect(result).toContain('  <child>');
  });
  it('handles self-closing tags', () => {
    const result = formatXML('<root><br/></root>');
    expect(result).toContain('<br/>');
  });
  it('returns empty for empty input', () => {
    expect(formatXML('')).toBe('');
  });
});

describe('minifyXML', () => {
  it('strips whitespace between tags', () => {
    expect(minifyXML('<root>\n  <a>x</a>\n</root>')).toBe('<root><a>x</a></root>');
  });
});

describe('formatJSON', () => {
  it('formats JSON with 2-space indent', () => {
    const result = formatJSON('{"a":1}');
    expect(result).toContain('  "a": 1');
  });
  it('throws for invalid JSON', () => {
    expect(() => formatJSON('not json')).toThrow();
  });
});

describe('minifyJSON', () => {
  it('compacts JSON', () => {
    const result = minifyJSON('{ "a": 1 }');
    expect(result).toBe('{"a":1}');
  });
});

describe('encodeJSONText', () => {
  it('wraps text in JSON string quotes', () => {
    expect(encodeJSONText('hello world')).toBe('"hello world"');
  });
  it('escapes newlines', () => {
    expect(encodeJSONText('a\nb')).toBe('"a\\nb"');
  });
  it('escapes quotes', () => {
    expect(encodeJSONText('say "hi"')).toBe('"say \\"hi\\""');
  });
});

describe('decodeJSONText', () => {
  it('decodes JSON string back to plain text', () => {
    expect(decodeJSONText('"hello world"')).toBe('hello world');
  });
  it('decodes escaped newlines', () => {
    expect(decodeJSONText('"a\\nb"')).toBe('a\nb');
  });
  it('wraps bare string in quotes before parsing', () => {
    expect(decodeJSONText('hello')).toBe('hello');
  });
});

describe('calculatePiAttenuator', () => {
  it('calculates resistors for 6 dB at 50 Ω', () => {
    const { rShunt, rSeries } = calculatePiAttenuator(6, 50);
    expect(rShunt).toBeCloseTo(150.48, 0);
    expect(rSeries).toBeCloseTo(37.35, 0);
  });
  it('throws for 0 dB', () => {
    expect(() => calculatePiAttenuator(0, 50)).toThrow();
  });
});

describe('reversePiAttenuator', () => {
  it('recovers dB from resistors', () => {
    const { rShunt, rSeries } = calculatePiAttenuator(6, 50);
    const { dB } = reversePiAttenuator(rShunt, rSeries, 50);
    expect(dB).toBeCloseTo(6, 1);
  });
});
