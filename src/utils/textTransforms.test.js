import { describe, it, expect } from 'vitest';
import {
  toUpperCase, toLowerCase, toTitleCase, toSentenceCase,
  toCamelCase, toPascalCase, toSnakeCase, toKebabCase, toConstantCase,
  convertCase,
  toBoldText, toItalicText, toStrikethroughText,
  reverseText, reverseWords, reverseTextInEachWord,
  removeTrailingWhitespace, removeAllWhitespace, removeLineBreaks,
  removeTextFormatting, removeCharacter,
  addPunctuation, columnsToInline, inlineToColumns,
  sortWords, countText, wordFrequency,
} from './textTransforms';

describe('toUpperCase', () => {
  it('converts to uppercase', () => expect(toUpperCase('hello')).toBe('HELLO'));
  it('leaves already uppercase alone', () => expect(toUpperCase('ABC')).toBe('ABC'));
});

describe('toLowerCase', () => {
  it('converts to lowercase', () => expect(toLowerCase('HELLO')).toBe('hello'));
});

describe('toTitleCase', () => {
  it('capitalizes each word', () => expect(toTitleCase('hello world')).toBe('Hello World'));
  it('lowercases rest of word', () => expect(toTitleCase('hELLO wORLD')).toBe('Hello World'));
});

describe('toSentenceCase', () => {
  it('capitalizes first letter', () => expect(toSentenceCase('hello world')).toBe('Hello world'));
  it('capitalizes after punctuation', () =>
    expect(toSentenceCase('hello world. foo bar')).toBe('Hello world. Foo bar'));
  it('returns empty string unchanged', () => expect(toSentenceCase('')).toBe(''));
});

describe('toCamelCase', () => {
  it('converts space-separated', () => expect(toCamelCase('hello world')).toBe('helloWorld'));
  it('converts snake_case', () => expect(toCamelCase('hello_world_foo')).toBe('helloWorldFoo'));
  it('converts kebab-case', () => expect(toCamelCase('foo-bar-baz')).toBe('fooBarBaz'));
});

describe('toPascalCase', () => {
  it('converts space-separated', () => expect(toPascalCase('hello world')).toBe('HelloWorld'));
});

describe('toSnakeCase', () => {
  it('converts space-separated', () => expect(toSnakeCase('hello world')).toBe('hello_world'));
  it('converts camelCase', () => expect(toSnakeCase('helloWorld')).toBe('hello_world'));
  it('handles multiple spaces', () => expect(toSnakeCase('  foo  bar  ')).toBe('foo_bar'));
});

describe('toKebabCase', () => {
  it('converts space-separated', () => expect(toKebabCase('hello world')).toBe('hello-world'));
  it('converts camelCase', () => expect(toKebabCase('helloWorld')).toBe('hello-world'));
});

describe('toConstantCase', () => {
  it('converts to SNAKE_UPPER', () => expect(toConstantCase('hello world')).toBe('HELLO_WORLD'));
});

describe('convertCase', () => {
  it('dispatches to upper', () => expect(convertCase('hi', 'upper')).toBe('HI'));
  it('dispatches to lower', () => expect(convertCase('HI', 'lower')).toBe('hi'));
  it('dispatches to title', () => expect(convertCase('hi there', 'title')).toBe('Hi There'));
  it('dispatches to sentence', () => expect(convertCase('hi there', 'sentence')).toBe('Hi there'));
  it('dispatches to camel', () => expect(convertCase('hi there', 'camel')).toBe('hiThere'));
  it('dispatches to pascal', () => expect(convertCase('hi there', 'pascal')).toBe('HiThere'));
  it('dispatches to snake', () => expect(convertCase('hi there', 'snake')).toBe('hi_there'));
  it('dispatches to kebab', () => expect(convertCase('hi there', 'kebab')).toBe('hi-there'));
  it('dispatches to constant', () => expect(convertCase('hi there', 'constant')).toBe('HI_THERE'));
  it('returns input unchanged for unknown type', () => expect(convertCase('hi', 'unknown')).toBe('hi'));
  it('returns empty string unchanged', () => expect(convertCase('', 'upper')).toBe(''));
});

describe('toBoldText', () => {
  it('converts lowercase letters to bold Unicode', () => {
    const result = toBoldText('abc');
    expect(result.codePointAt(0)).toBe(0x1D41A);
    expect(result.codePointAt(2)).toBe(0x1D41B);
  });
  it('converts uppercase letters', () => {
    const result = toBoldText('ABC');
    expect(result.codePointAt(0)).toBe(0x1D400);
  });
  it('converts digits', () => {
    const result = toBoldText('0');
    expect(result.codePointAt(0)).toBe(0x1D7CE);
  });
  it('leaves non-alpha chars unchanged', () => {
    const result = toBoldText('!');
    expect(result).toBe('!');
  });
});

describe('toItalicText', () => {
  it('converts lowercase letters to italic Unicode', () => {
    const result = toItalicText('a');
    expect(result.codePointAt(0)).toBe(0x1D44E);
  });
  it('converts uppercase letters', () => {
    const result = toItalicText('A');
    expect(result.codePointAt(0)).toBe(0x1D434);
  });
  it('leaves digits unchanged (no italic digits)', () => {
    expect(toItalicText('5')).toBe('5');
  });
});

describe('toStrikethroughText', () => {
  it('adds combining overlay after each character', () => {
    const result = toStrikethroughText('hi');
    expect([...result].length).toBe(4); // h + overlay + i + overlay
  });
  it('preserves newlines without overlay', () => {
    const result = toStrikethroughText('a\nb');
    const chars = [...result];
    const newlineIdx = chars.indexOf('\n');
    expect(newlineIdx).not.toBe(-1);
    expect(chars[newlineIdx]).toBe('\n');
  });
});

describe('reverseText', () => {
  it('reverses characters', () => expect(reverseText('abc')).toBe('cba'));
  it('handles unicode correctly', () => expect(reverseText('ab')).toBe('ba'));
  it('reverses empty string', () => expect(reverseText('')).toBe(''));
});

describe('reverseWords', () => {
  it('reverses word order', () => expect(reverseWords('hello world')).toBe('world hello'));
  it('reverses multi-word sentence', () =>
    expect(reverseWords('one two three')).toBe('three two one'));
});

describe('reverseTextInEachWord', () => {
  it('reverses chars in each word', () =>
    expect(reverseTextInEachWord('hello world')).toBe('olleh dlrow'));
  it('preserves word order', () =>
    expect(reverseTextInEachWord('abc xyz')).toBe('cba zyx'));
});

describe('removeTrailingWhitespace', () => {
  it('removes trailing spaces from each line', () => {
    expect(removeTrailingWhitespace('hello   \nworld  ')).toBe('hello\nworld');
  });
  it('leaves leading spaces intact', () => {
    expect(removeTrailingWhitespace('  hello  ')).toBe('  hello');
  });
  it('handles empty string', () => {
    expect(removeTrailingWhitespace('')).toBe('');
  });
});

describe('removeAllWhitespace', () => {
  it('removes all whitespace (default)', () =>
    expect(removeAllWhitespace('h e l l o')).toBe('hello'));
  it('removes spaces only', () =>
    expect(removeAllWhitespace('a b\tc', 'spaces')).toBe('ab\tc'));
  it('removes tabs only', () =>
    expect(removeAllWhitespace('a\tb c', 'tabs')).toBe('ab c'));
  it('collapses extra spaces', () =>
    expect(removeAllWhitespace('a  b   c', 'extra')).toBe('a b c'));
});

describe('removeLineBreaks', () => {
  it('replaces newlines with space by default', () =>
    expect(removeLineBreaks('a\nb\nc')).toBe('a b c'));
  it('joins with no gap when replacement is empty', () =>
    expect(removeLineBreaks('a\nb', '')).toBe('ab'));
  it('handles \\r\\n', () =>
    expect(removeLineBreaks('a\r\nb')).toBe('a b'));
});

describe('removeTextFormatting', () => {
  it('strips bold markdown', () =>
    expect(removeTextFormatting('**bold**')).toBe('bold'));
  it('strips italic markdown', () =>
    expect(removeTextFormatting('*italic*')).toBe('italic'));
  it('strips heading', () =>
    expect(removeTextFormatting('# Heading')).toBe('Heading'));
  it('strips HTML tags', () =>
    expect(removeTextFormatting('<b>bold</b>')).toBe('bold'));
  it('extracts link text', () =>
    expect(removeTextFormatting('[click](http://x.com)')).toBe('click'));
  it('removes images', () =>
    expect(removeTextFormatting('![alt](img.png)')).toBe(''));
  it('strips blockquotes', () =>
    expect(removeTextFormatting('> quote')).toBe('quote'));
});

describe('removeCharacter', () => {
  it('removes specified characters', () =>
    expect(removeCharacter('hello!', '!')).toBe('hello'));
  it('removes multiple different characters', () =>
    expect(removeCharacter('a,b;c', ',;')).toBe('abc'));
  it('returns original when chars is empty', () =>
    expect(removeCharacter('hello', '')).toBe('hello'));
  it('is case sensitive by default', () =>
    expect(removeCharacter('Hello', 'H')).toBe('ello'));
  it('is case insensitive when flag set', () =>
    expect(removeCharacter('Hello World', 'h', false)).toBe('ello World'));
});

describe('addPunctuation', () => {
  it('adds period to line missing punctuation', () =>
    expect(addPunctuation('Hello')).toBe('Hello.'));
  it('skips lines that already have punctuation (missing mode)', () =>
    expect(addPunctuation('Hello.')).toBe('Hello.'));
  it('always appends in always mode', () =>
    expect(addPunctuation('Hello.', '.', 'always')).toBe('Hello..'));
  it('replaces existing punctuation in replace mode', () =>
    expect(addPunctuation('Hello!', '?', 'replace')).toBe('Hello?'));
  it('handles multi-line', () => {
    const result = addPunctuation('Hello\nWorld');
    expect(result).toBe('Hello.\nWorld.');
  });
  it('leaves blank lines unchanged', () =>
    expect(addPunctuation('Hello\n\nWorld')).toBe('Hello.\n\nWorld.'));
});

describe('columnsToInline', () => {
  it('joins lines with separator', () =>
    expect(columnsToInline('a\nb\nc', ', ')).toBe('a, b, c'));
  it('filters blank lines', () =>
    expect(columnsToInline('a\n\nb', ', ')).toBe('a, b'));
});

describe('inlineToColumns', () => {
  it('splits by comma', () =>
    expect(inlineToColumns('a, b, c', ',')).toBe('a\nb\nc'));
  it('splits by space', () =>
    expect(inlineToColumns('a b c', 'space')).toBe('a\nb\nc'));
  it('filters empty parts', () =>
    expect(inlineToColumns('a,,b', ',')).toBe('a\nb'));
});

describe('sortWords', () => {
  it('sorts asc by default', () =>
    expect(sortWords('banana apple cherry')).toBe('apple\nbanana\ncherry'));
  it('sorts desc', () =>
    expect(sortWords('banana apple cherry', 'desc')).toBe('cherry\nbanana\napple'));
  it('sorts by length ascending', () =>
    expect(sortWords('banana apple a', 'length-asc')).toBe('a\napple\nbanana'));
  it('sorts by length descending', () =>
    expect(sortWords('banana apple a', 'length-desc')).toBe('banana\napple\na'));
  it('is case insensitive by default', () => {
    const result = sortWords('Banana apple', 'asc', false);
    expect(result.split('\n')[0].toLowerCase()).toBe('apple');
  });
  it('returns empty for empty input', () =>
    expect(sortWords('')).toBe(''));
});

describe('countText', () => {
  it('returns zeros for empty input', () => {
    const stats = countText('');
    expect(stats.words).toBe(0);
    expect(stats.chars).toBe(0);
  });
  it('counts words correctly', () =>
    expect(countText('hello world foo').words).toBe(3));
  it('counts characters', () =>
    expect(countText('abc').chars).toBe(3));
  it('counts chars without spaces', () =>
    expect(countText('a b c').charsNoSpaces).toBe(3));
  it('counts lines', () =>
    expect(countText('a\nb\nc').lines).toBe(3));
  it('counts unique words', () =>
    expect(countText('the cat and the dog').uniqueWords).toBe(4));
  it('calculates reading time of at least 1', () =>
    expect(countText('word').readingTime).toBeGreaterThanOrEqual(1));
  it('calculates reading time for long text', () => {
    const text = Array(210).fill('word').join(' ');
    expect(countText(text).readingTime).toBe(2);
  });
});

describe('wordFrequency', () => {
  it('returns empty for empty text', () =>
    expect(wordFrequency('')).toEqual([]));
  it('counts word occurrences', () => {
    const result = wordFrequency('apple apple banana');
    expect(result[0].word).toBe('apple');
    expect(result[0].count).toBe(2);
  });
  it('is case-insensitive by default', () => {
    const result = wordFrequency('Apple apple APPLE');
    expect(result[0].count).toBe(3);
  });
  it('is case-sensitive when flag set', () => {
    const result = wordFrequency('Apple apple', { caseSensitive: true });
    expect(result.length).toBe(2);
  });
  it('calculates percentage', () => {
    const result = wordFrequency('a a b');
    const aEntry = result.find(r => r.word === 'a');
    expect(aEntry.pct).toBe(67);
  });
  it('sorts by frequency descending', () => {
    const result = wordFrequency('b a a a b b b');
    expect(result[0].word).toBe('b');
  });
  it('excludes stop words when flag set', () => {
    const result = wordFrequency('the cat and the dog', { excludeStopWords: true });
    const words = result.map(r => r.word);
    expect(words).not.toContain('the');
    expect(words).not.toContain('and');
    expect(words).toContain('cat');
  });
});
