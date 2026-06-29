// ── Case Conversion ──────────────────────────────────────────────────────────

export function toUpperCase(text) {
  return text.toUpperCase();
}

export function toLowerCase(text) {
  return text.toLowerCase();
}

export function toTitleCase(text) {
  return text.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

export function toSentenceCase(text) {
  if (!text) return text;
  return text
    .toLowerCase()
    .replace(/(^|[.!?]\s+)([a-z])/g, (_, sep, c) => sep + c.toUpperCase());
}

export function toCamelCase(text) {
  return text
    .trim()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/^[A-Z]/, c => c.toLowerCase());
}

export function toPascalCase(text) {
  const camel = toCamelCase(text);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

export function toSnakeCase(text) {
  return text
    .trim()
    .replace(/([A-Z])/g, '_$1')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase();
}

export function toKebabCase(text) {
  return text
    .trim()
    .replace(/([A-Z])/g, '-$1')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

export function toConstantCase(text) {
  return toSnakeCase(text).toUpperCase();
}

export function convertCase(text, type) {
  if (!text) return text;
  switch (type) {
    case 'upper':    return toUpperCase(text);
    case 'lower':    return toLowerCase(text);
    case 'title':    return toTitleCase(text);
    case 'sentence': return toSentenceCase(text);
    case 'camel':    return toCamelCase(text);
    case 'pascal':   return toPascalCase(text);
    case 'snake':    return toSnakeCase(text);
    case 'kebab':    return toKebabCase(text);
    case 'constant': return toConstantCase(text);
    default:         return text;
  }
}

// ── Unicode Text Styles ──────────────────────────────────────────────────────

export function toBoldText(text) {
  return [...text].map(c => {
    const code = c.charCodeAt(0);
    if (code >= 0x61 && code <= 0x7A) return String.fromCodePoint(0x1D41A + (code - 0x61));
    if (code >= 0x41 && code <= 0x5A) return String.fromCodePoint(0x1D400 + (code - 0x41));
    if (code >= 0x30 && code <= 0x39) return String.fromCodePoint(0x1D7CE + (code - 0x30));
    return c;
  }).join('');
}

export function toItalicText(text) {
  return [...text].map(c => {
    const code = c.charCodeAt(0);
    if (code >= 0x61 && code <= 0x7A) return String.fromCodePoint(0x1D44E + (code - 0x61));
    if (code >= 0x41 && code <= 0x5A) return String.fromCodePoint(0x1D434 + (code - 0x41));
    return c;
  }).join('');
}

export function toStrikethroughText(text) {
  return [...text].map(c => c === '\n' ? c : c + '̶').join('');
}

// ── Reverse ──────────────────────────────────────────────────────────────────

export function reverseText(text) {
  return [...text].reverse().join('');
}

export function reverseWords(text) {
  return text.split(/(\s+)/).reverse().join('');
}

export function reverseTextInEachWord(text) {
  return text.replace(/\S+/g, word => [...word].reverse().join(''));
}

// ── Remove / Clean ─────────────────────────────────────────────────────────

export function removeTrailingWhitespace(text) {
  return text.split('\n').map(line => line.trimEnd()).join('\n');
}

export function removeAllWhitespace(text, mode = 'all') {
  switch (mode) {
    case 'all':    return text.replace(/\s+/g, '');
    case 'spaces': return text.replace(/ /g, '');
    case 'tabs':   return text.replace(/\t/g, '');
    case 'extra':  return text.replace(/[ \t]+/g, ' ').trim();
    default:       return text;
  }
}

export function removeLineBreaks(text, replacement = ' ') {
  return text.replace(/\r\n|\r|\n/g, replacement);
}

export function removeTextFormatting(text) {
  return text
    .replace(/<[^>]+>/g, '')
    .replace(/\*\*(.+?)\*\*/gs, '$1')
    .replace(/\*(.+?)\*/gs, '$1')
    .replace(/__(.+?)__/gs, '$1')
    .replace(/_([^_]+?)_/gs, '$1')
    .replace(/~~(.+?)~~/gs, '$1')
    .replace(/`{3}[\s\S]+?`{3}/g, m =>
      m.replace(/`{3}[a-z]*\n?|\n?`{3}/g, '')
    )
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/^>\s*/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function removeCharacter(text, chars, caseSensitive = true) {
  if (!chars) return text;
  const escaped = [...chars]
    .map(c => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('');
  const flags = caseSensitive ? 'g' : 'gi';
  return text.replace(new RegExp(`[${escaped}]`, flags), '');
}

// ── Add Punctuation ──────────────────────────────────────────────────────────

const END_PUNCT_RE = /[.!?,;:]$/;

export function addPunctuation(text, punct = '.', mode = 'missing') {
  return text.split('\n').map(line => {
    const trimmed = line.trimEnd();
    if (!trimmed) return line;
    switch (mode) {
      case 'missing':
        return END_PUNCT_RE.test(trimmed) ? trimmed : trimmed + punct;
      case 'always':
        return trimmed + punct;
      case 'replace':
        return trimmed.replace(END_PUNCT_RE, '') + punct;
      default:
        return line;
    }
  }).join('\n');
}

// ── Column / Inline Conversion ───────────────────────────────────────────────

export function columnsToInline(text, separator = ', ') {
  return text.split('\n').map(l => l.trim()).filter(Boolean).join(separator);
}

export function inlineToColumns(text, separator = ',') {
  const parts = separator === 'space'
    ? text.split(/\s+/)
    : text.split(new RegExp(separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  return parts.map(s => s.trim()).filter(Boolean).join('\n');
}

// ── Sort ──────────────────────────────────────────────────────────────────────

export function sortWords(text, order = 'asc', caseSensitive = false) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return '';

  const compareFn = (a, b) => {
    const ca = caseSensitive ? a : a.toLowerCase();
    const cb = caseSensitive ? b : b.toLowerCase();
    switch (order) {
      case 'asc':         return ca.localeCompare(cb);
      case 'desc':        return cb.localeCompare(ca);
      case 'length-asc':  return a.length - b.length || ca.localeCompare(cb);
      case 'length-desc': return b.length - a.length || ca.localeCompare(cb);
      default:            return 0;
    }
  };

  return [...words].sort(compareFn).join('\n');
}

// ── Word Count Stats ──────────────────────────────────────────────────────────

export function countText(text) {
  if (!text) {
    return { chars: 0, charsNoSpaces: 0, words: 0, uniqueWords: 0, sentences: 0, paragraphs: 0, lines: 0, readingTime: 0 };
  }
  const words = text.trim().split(/\s+/).filter(Boolean);
  const uniqueWords = new Set(words.map(w => w.toLowerCase())).size;
  const sentenceMatches = text.match(/[^.!?]*[.!?]+/g) || [];
  const sentences = sentenceMatches.length || (text.trim() ? 1 : 0);
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length || (text.trim() ? 1 : 0);
  const lines = text.split('\n').length;
  const wordCount = words.length;
  return {
    chars: text.length,
    charsNoSpaces: text.replace(/\s/g, '').length,
    words: wordCount,
    uniqueWords,
    sentences,
    paragraphs,
    lines,
    readingTime: Math.max(1, Math.ceil(wordCount / 200)),
  };
}

// ── Word Frequency ────────────────────────────────────────────────────────────

export function wordFrequency(text, { caseSensitive = false, minLength = 1, excludeStopWords = false } = {}) {
  const raw = text.match(/\b[a-zA-Z']+\b/g) || [];
  const freq = new Map();
  for (const w of raw) {
    const key = caseSensitive ? w : w.toLowerCase();
    if (key.length < minLength) continue;
    if (excludeStopWords && STOP_WORDS.has(key.toLowerCase())) continue;
    freq.set(key, (freq.get(key) || 0) + 1);
  }
  const total = [...freq.values()].reduce((s, n) => s + n, 0);
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([word, count]) => ({
      word,
      count,
      pct: total ? Math.round((count / total) * 100) : 0,
    }));
}

const STOP_WORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with',
  'by','from','is','are','was','were','be','been','being','have','has',
  'had','do','does','did','will','would','could','should','may','might',
  'shall','can','not','no','so','as','it','its','this','that','these',
  'those','he','she','we','you','i','me','my','him','his','her','our',
  'us','your','they','them','their','what','which','who','whom','when',
  'where','why','how','if','then','than','just','up','out','about','into',
  'more','also','all','any','each','other','such','same','very','own',
]);
