import { describe, it, expect } from 'vitest';
import {
  convertBase, sortNumbers, formatArray,
  fToC, cToF, toKelvin, convertTemperature,
  convertDistance, generateMarkdownTable,
} from './converters';

// ── convertBase ───────────────────────────────────────────────────────────────

describe('convertBase', () => {
  it('returns empty for empty input', () => {
    expect(convertBase('', 'decimal', 'binary')).toEqual({ output: '', error: null });
  });

  it('decimal → binary', () => {
    expect(convertBase('10', 'decimal', 'binary')).toMatchObject({ output: '1010', error: null });
  });

  it('binary → decimal', () => {
    expect(convertBase('1010', 'binary', 'decimal')).toMatchObject({ output: '10', error: null });
  });

  it('decimal → hexadecimal', () => {
    expect(convertBase('255', 'decimal', 'hexadecimal')).toMatchObject({ output: 'FF', error: null });
  });

  it('hexadecimal → decimal', () => {
    expect(convertBase('FF', 'hexadecimal', 'decimal')).toMatchObject({ output: '255', error: null });
  });

  it('decimal → octal', () => {
    expect(convertBase('8', 'decimal', 'octal')).toMatchObject({ output: '10', error: null });
  });

  it('octal → decimal', () => {
    expect(convertBase('10', 'octal', 'decimal')).toMatchObject({ output: '8', error: null });
  });

  it('text → hexadecimal', () => {
    const { output } = convertBase('A', 'text', 'hexadecimal');
    expect(output).toBe('41');
  });

  it('hexadecimal → text', () => {
    const { output } = convertBase('41', 'hexadecimal', 'text');
    expect(output).toBe('A');
  });

  it('text → binary', () => {
    // charCode('A') = 65, 65 in binary = 1000001
    expect(convertBase('A', 'text', 'binary').output).toBe('1000001');
  });

  it('text → decimal', () => {
    expect(convertBase('A', 'text', 'decimal').output).toBe('65');
  });

  it('multi-char text → hex (space-separated)', () => {
    const { output } = convertBase('Hi', 'text', 'hexadecimal');
    expect(output).toBe('48 69');
  });

  it('hex → text (space-separated)', () => {
    expect(convertBase('48 69', 'hexadecimal', 'text').output).toBe('Hi');
  });

  it('returns error for invalid binary', () => {
    const { error } = convertBase('2', 'binary', 'decimal');
    expect(error).toBeTruthy();
  });

  it('same base returns same value', () => {
    expect(convertBase('42', 'decimal', 'decimal').output).toBe('42');
  });
});

// ── sortNumbers ───────────────────────────────────────────────────────────────

describe('sortNumbers', () => {
  it('sorts ascending by default', () => {
    expect(sortNumbers('3\n1\n2')).toBe('1\n2\n3');
  });

  it('sorts descending', () => {
    expect(sortNumbers('1\n3\n2', 'desc')).toBe('3\n2\n1');
  });

  it('handles decimals', () => {
    expect(sortNumbers('1.5\n0.5\n2.5')).toBe('0.5\n1.5\n2.5');
  });

  it('removes duplicates when flag is set', () => {
    expect(sortNumbers('3\n1\n3\n2', 'asc', true)).toBe('1\n2\n3');
  });

  it('handles comma-separated input', () => {
    expect(sortNumbers('3,1,2')).toBe('1\n2\n3');
  });

  it('returns empty for empty input', () => {
    expect(sortNumbers('')).toBe('');
  });

  it('ignores non-numeric lines', () => {
    expect(sortNumbers('3\nabc\n1')).toBe('1\n3');
  });

  it('handles negative numbers', () => {
    expect(sortNumbers('0\n-5\n3')).toBe('-5\n0\n3');
  });
});

// ── formatArray ───────────────────────────────────────────────────────────────

describe('formatArray', () => {
  it('formats as JS array with single quotes', () => {
    expect(formatArray('a\nb\nc', 'js', 'single')).toBe("['a', 'b', 'c']");
  });

  it('formats as JS array with double quotes', () => {
    expect(formatArray('a\nb', 'js', 'double')).toBe('["a", "b"]');
  });

  it('formats as JSON array', () => {
    expect(formatArray('a\nb', 'json', 'double')).toBe('["a","b"]');
  });

  it('formats as Python list', () => {
    expect(formatArray('a\nb', 'python')).toBe("['a', 'b']");
  });

  it('formats as CSV', () => {
    expect(formatArray('a\nb\nc', 'csv', 'none')).toBe('a, b, c');
  });

  it('formats as SQL IN clause', () => {
    expect(formatArray('a\nb', 'sql-in')).toBe("IN ('a', 'b')");
  });

  it('returns empty for empty input', () => {
    expect(formatArray('')).toBe('');
  });

  it('skips blank lines', () => {
    expect(formatArray('a\n\nb', 'js', 'none')).toBe('[a, b]');
  });
});

// ── temperature ───────────────────────────────────────────────────────────────

describe('fToC', () => {
  it('converts 32°F to 0°C', () => expect(fToC(32)).toBe(0));
  it('converts 212°F to 100°C', () => expect(fToC(212)).toBe(100));
  it('converts -40°F to -40°C', () => expect(fToC(-40)).toBe(-40));
});

describe('cToF', () => {
  it('converts 0°C to 32°F', () => expect(cToF(0)).toBe(32));
  it('converts 100°C to 212°F', () => expect(cToF(100)).toBe(212));
});

describe('toKelvin', () => {
  it('converts 0°C to 273.15K', () => expect(toKelvin(0)).toBe(273.15));
});

describe('convertTemperature', () => {
  it('returns empty strings for empty input', () => {
    expect(convertTemperature('', 'f')).toEqual({ f: '', c: '', k: '' });
  });

  it('converts from F correctly', () => {
    const r = convertTemperature('32', 'f');
    expect(r.c).toBe('0');
    expect(r.k).toBe('273.15');
  });

  it('converts from C correctly', () => {
    const r = convertTemperature('100', 'c');
    expect(r.f).toBe('212');
    expect(r.k).toBe('373.15');
  });

  it('converts from K correctly', () => {
    const r = convertTemperature('273.15', 'k');
    expect(r.c).toBe('0');
  });
});

// ── convertDistance ────────────────────────────────────────────────────────────

describe('convertDistance', () => {
  it('returns empty for empty input', () => {
    expect(convertDistance('', 'm', 'km')).toEqual({ output: '', error: null });
  });

  it('returns error for non-numeric', () => {
    expect(convertDistance('abc', 'm', 'km').error).toBeTruthy();
  });

  it('converts 1 km to 1000 m', () => {
    expect(convertDistance('1', 'km', 'm').output).toBe('1000');
  });

  it('converts 1 m to 100 cm', () => {
    expect(convertDistance('1', 'm', 'cm').output).toBe('100');
  });

  it('converts 1 mile to feet (approx)', () => {
    const { output } = convertDistance('1', 'mi', 'ft');
    expect(parseFloat(output)).toBeCloseTo(5280, 0);
  });

  it('converts same unit to same value', () => {
    expect(convertDistance('42', 'm', 'm').output).toBe('42');
  });
});

// ── generateMarkdownTable ─────────────────────────────────────────────────────

describe('generateMarkdownTable', () => {
  it('returns empty for empty input', () => {
    expect(generateMarkdownTable('')).toBe('');
  });

  it('generates a table from CSV', () => {
    const result = generateMarkdownTable('Name,Age\nAlice,30\nBob,25');
    expect(result).toContain('| Name');
    expect(result).toContain('| Alice');
    expect(result).toContain('---');
  });

  it('generates a table from tab-separated input', () => {
    const result = generateMarkdownTable('Name\tAge\nAlice\t30');
    expect(result).toContain('Name');
    expect(result).toContain('Alice');
  });

  it('escapes pipe characters in cells', () => {
    const result = generateMarkdownTable('A|B,C', ',');
    expect(result).toContain('\\|');
  });

  it('pads cells to equal widths', () => {
    const result = generateMarkdownTable('A,LongHeader\na,b');
    const lines = result.split('\n');
    // All lines should have the same length (same column widths)
    expect(lines[0].length).toBe(lines[1].length);
  });
});
