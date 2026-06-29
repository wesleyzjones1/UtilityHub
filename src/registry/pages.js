/**
 * Page registry — single source of truth for all tools and routes.
 *
 * To add a new tool:
 *   1. Add an entry to PAGES below (sorted alphabetically within its category).
 *   2. Create the component at src/pages/tools/<id>/<ComponentName>.jsx.
 *   3. Wire the component import into App.jsx (or set component: null for a placeholder).
 *
 * Fields:
 *   id          — unique slug, used as the route key
 *   title       — display name (alphabetically sorted within category)
 *   description — short description (≤ 80 chars), shown in search results and listings
 *   category    — must match a key in CATEGORIES
 *   path        — URL path (must be unique)
 *   keywords    — array of search terms beyond title/description
 */

export const CATEGORIES = {
  text: {
    id: 'text',
    label: 'Text Tools',
    description: 'Manipulate, analyze, and transform text',
  },
  math: {
    id: 'math',
    label: 'Math & Numbers',
    description: 'Calculators, converters, and number utilities',
  },
  color: {
    id: 'color',
    label: 'Color Tools',
    description: 'Pick, convert, and generate color schemes',
  },
  image: {
    id: 'image',
    label: 'Image Tools',
    description: 'Convert, resize, crop, and optimize images',
  },
  web: {
    id: 'web',
    label: 'Web & Code',
    description: 'Format, encode, and validate code and data',
  },
  time: {
    id: 'time',
    label: 'Time & Date',
    description: 'Timezones, countdowns, and date calculations',
  },
};

export const PAGES = [
  // ── Text Tools ─────────────────────────────────────────────────────────────
  {
    id: 'add-punctuation',
    title: 'Add Punctuation',
    description: 'Add a period, exclamation mark, or other punctuation to the end of each line.',
    category: 'text',
    path: '/tools/add-punctuation',
    keywords: ['period', 'comma', 'exclamation', 'question mark', 'semicolon', 'end of line'],
  },
  {
    id: 'bold-text',
    title: 'Bold Text Generator',
    description: 'Convert text to Unicode bold characters that work anywhere.',
    category: 'text',
    path: '/tools/bold-text',
    keywords: ['bold', 'unicode', 'facebook', 'twitter', 'social media', 'mathematical bold'],
  },
  {
    id: 'case-converter',
    title: 'Case Converter',
    description: 'Convert text between uppercase, lowercase, title case, camelCase, and more.',
    category: 'text',
    path: '/tools/case-converter',
    keywords: ['uppercase', 'lowercase', 'title case', 'camel case', 'snake case', 'kebab case'],
  },
  {
    id: 'inline-column-converter',
    title: 'Inline / Column Converter',
    description: 'Convert list of items between one-per-line (column) and inline formats.',
    category: 'text',
    path: '/tools/inline-column-converter',
    keywords: ['column', 'inline', 'list', 'comma separated', 'convert', 'one per line'],
  },
  {
    id: 'italic-text',
    title: 'Italic Text Generator',
    description: 'Convert text to Unicode italic characters for social media and chat apps.',
    category: 'text',
    path: '/tools/italic-text',
    keywords: ['italic', 'unicode', 'slanted', 'social media', 'mathematical italic'],
  },
  {
    id: 'markdown-table',
    title: 'Markdown Table Generator',
    description: 'Convert CSV or tab-separated data into a formatted Markdown table.',
    category: 'web',
    path: '/tools/markdown-table',
    keywords: ['markdown', 'table', 'csv', 'tsv', 'convert', 'pipe', 'generator'],
  },
  {
    id: 'lorem-ipsum',
    title: 'Lorem Ipsum Generator',
    description: 'Generate placeholder dummy text in various lengths.',
    category: 'text',
    path: '/tools/lorem-ipsum',
    keywords: ['placeholder', 'dummy text', 'filler', 'paragraphs'],
  },
  {
    id: 'markdown-preview',
    title: 'Markdown Preview',
    description: 'Write Markdown and preview the rendered HTML or format with Prettier.',
    category: 'web',
    path: '/tools/markdown-preview',
    keywords: ['md', 'html', 'preview', 'render', 'markdown', 'format', 'prettier'],
  },
  {
    id: 'remove-all-whitespace',
    title: 'Remove All Whitespace',
    description: 'Strip all spaces, tabs, and other whitespace characters from your text.',
    category: 'text',
    path: '/tools/remove-all-whitespace',
    keywords: ['whitespace', 'spaces', 'tabs', 'strip', 'clean'],
  },
  {
    id: 'remove-character',
    title: 'Remove Character',
    description: 'Remove any specific character or set of characters from your text.',
    category: 'text',
    path: '/tools/remove-character',
    keywords: ['remove', 'delete', 'character', 'strip', 'filter'],
  },
  {
    id: 'remove-line-breaks',
    title: 'Remove Line Breaks',
    description: 'Remove all line breaks from text and join lines into a single block.',
    category: 'text',
    path: '/tools/remove-line-breaks',
    keywords: ['line breaks', 'newline', 'carriage return', 'join', 'single line'],
  },
  {
    id: 'remove-text-formatting',
    title: 'Remove Text Formatting',
    description: 'Strip Markdown, HTML tags, and other formatting to get plain text.',
    category: 'text',
    path: '/tools/remove-text-formatting',
    keywords: ['markdown', 'html', 'strip', 'plain text', 'clean', 'formatting'],
  },
  {
    id: 'remove-trailing-whitespace',
    title: 'Remove Trailing Whitespace',
    description: 'Trim trailing spaces and tabs from the end of each line.',
    category: 'text',
    path: '/tools/remove-trailing-whitespace',
    keywords: ['trailing spaces', 'trim', 'whitespace', 'clean', 'lines'],
  },
  {
    id: 'reverse-text',
    title: 'Reverse Text',
    description: 'Reverse the entire text character by character.',
    category: 'text',
    path: '/tools/reverse-text',
    keywords: ['reverse', 'mirror', 'backwards', 'flip'],
  },
  {
    id: 'reverse-text-in-word',
    title: 'Reverse Text in Each Word',
    description: 'Reverse the characters inside each word while keeping word order.',
    category: 'text',
    path: '/tools/reverse-text-in-word',
    keywords: ['reverse', 'word', 'characters', 'scramble'],
  },
  {
    id: 'reverse-words',
    title: 'Reverse Words',
    description: 'Reverse the order of words in a sentence or block of text.',
    category: 'text',
    path: '/tools/reverse-words',
    keywords: ['reverse', 'words', 'order', 'sentence'],
  },
  {
    id: 'sort-words',
    title: 'Sort Words',
    description: 'Sort words alphabetically, by length, or shuffle them randomly.',
    category: 'text',
    path: '/tools/sort-words',
    keywords: ['sort', 'alphabetical', 'order', 'words', 'shuffle'],
  },
  {
    id: 'strikethrough-text',
    title: 'Strikethrough Text Generator',
    description: 'Add a strikethrough effect to text using Unicode combining characters.',
    category: 'text',
    path: '/tools/strikethrough-text',
    keywords: ['strikethrough', 'strike', 'cross out', 'unicode', 'social media'],
  },
  {
    id: 'text-compare',
    title: 'Text Compare',
    description: 'Compare two texts side by side with line-level and word-level diff highlighting.',
    category: 'text',
    path: '/tools/text-compare',
    keywords: ['compare', 'diff', 'difference', 'changes', 'side by side'],
  },
  {
    id: 'text-diff',
    title: 'Text Diff Viewer',
    description: 'Compare two text blocks and highlight the differences.',
    category: 'text',
    path: '/tools/text-diff',
    keywords: ['compare', 'difference', 'diff', 'changes'],
  },
  {
    id: 'word-counter',
    title: 'Word Counter',
    description: 'Count words, characters, sentences, and paragraphs in your text.',
    category: 'text',
    path: '/tools/word-counter',
    keywords: ['count', 'characters', 'lines', 'sentences'],
  },
  {
    id: 'word-frequency',
    title: 'Word Frequency Analyzer',
    description: 'Analyze how often each word appears in a block of text.',
    category: 'text',
    path: '/tools/word-frequency',
    keywords: ['frequency', 'analyze', 'statistics', 'count words'],
  },

  // ── Math & Numbers ──────────────────────────────────────────────────────────
  {
    id: 'base-converter',
    title: 'Base Converter',
    description: 'Convert values between binary, octal, decimal, hexadecimal, and text.',
    category: 'math',
    path: '/tools/base-converter',
    keywords: ['binary', 'hex', 'octal', 'decimal', 'base', 'text', 'ascii'],
  },
  {
    id: 'distance-converter',
    title: 'Distance Converter',
    description: 'Convert between metric and imperial length units like cm, m, inches, and feet.',
    category: 'math',
    path: '/tools/distance-converter',
    keywords: ['distance', 'length', 'mm', 'cm', 'm', 'km', 'inch', 'feet', 'miles', 'convert'],
  },
  {
    id: 'engineering-cheat-sheet',
    title: 'Engineering Cheat Sheet',
    description: 'Quick-reference tables for SI prefixes, capacitors, frequency, and more.',
    category: 'math',
    path: '/tools/engineering-cheat-sheet',
    keywords: ['si prefix', 'capacitor', 'frequency', 'time', 'mass', 'engineering', 'reference', 'units'],
  },
  {
    id: 'fahrenheit-celsius',
    title: 'Fahrenheit to Celsius',
    description: 'Convert temperatures between Fahrenheit, Celsius, and Kelvin.',
    category: 'math',
    path: '/tools/fahrenheit-celsius',
    keywords: ['temperature', 'fahrenheit', 'celsius', 'kelvin', 'convert', '°F', '°C'],
  },
  {
    id: 'number-sorter',
    title: 'Number Sorter',
    description: 'Sort numbers ascending or descending, with optional duplicate removal.',
    category: 'math',
    path: '/tools/number-sorter',
    keywords: ['sort', 'numbers', 'ascending', 'descending', 'order', 'list'],
  },
  {
    id: 'pi-attenuator',
    title: 'Pi Attenuator Calculator',
    description: 'Calculate Pi (π) attenuator resistor values for any dB loss and impedance.',
    category: 'math',
    path: '/tools/pi-attenuator',
    keywords: ['attenuator', 'pi', 'rf', 'resistor', 'impedance', '50 ohm', '75 ohm', 'dB', 'loss'],
  },
  {
    id: 'percentage-calc',
    title: 'Percentage Calculator',
    description: 'Calculate percentages, percentage change, and ratios.',
    category: 'math',
    path: '/tools/percentage-calc',
    keywords: ['percent', 'ratio', 'calculate', 'increase', 'decrease'],
  },
  {
    id: 'random-number',
    title: 'Random Number Generator',
    description: 'Generate random integers or decimals within a custom range.',
    category: 'math',
    path: '/tools/random-number',
    keywords: ['random', 'dice', 'range', 'generate'],
  },
  {
    id: 'scientific-calc',
    title: 'Scientific Calculator',
    description: 'Full-featured scientific calculator with trigonometry and logarithms.',
    category: 'math',
    path: '/tools/scientific-calc',
    keywords: ['calculator', 'math', 'science', 'trig', 'sin', 'cos'],
  },
  {
    id: 'statistics-calc',
    title: 'Statistics Calculator',
    description: 'Compute mean, median, mode, standard deviation, and more.',
    category: 'math',
    path: '/tools/statistics-calc',
    keywords: ['mean', 'median', 'mode', 'stddev', 'variance'],
  },
  {
    id: 'unit-converter',
    title: 'Unit Converter',
    description: 'Convert between length, weight, temperature, volume, and other units.',
    category: 'math',
    path: '/tools/unit-converter',
    keywords: ['convert', 'length', 'weight', 'temperature', 'volume', 'meters', 'feet'],
  },

  // ── Color Tools ─────────────────────────────────────────────────────────────
  {
    id: 'color-picker',
    title: 'Color Picker',
    description: 'Pick any color from your screen and instantly get its HEX, RGB, and HSL values.',
    category: 'color',
    path: '/tools/color-picker',
    keywords: ['eyedropper', 'pick', 'screen', 'rgb', 'hex', 'hsl', 'color picker'],
  },
  {
    id: 'color-converter',
    title: 'Color Converter',
    description: 'Convert colors between HEX, RGB, HSL, HSV, and CMYK.',
    category: 'color',
    path: '/tools/color-converter',
    keywords: ['hex', 'rgb', 'hsl', 'hsv', 'cmyk', 'convert'],
  },
  {
    id: 'color-palette',
    title: 'Color Palette Generator',
    description: 'Generate harmonious color palettes from a base color.',
    category: 'color',
    path: '/tools/color-palette',
    keywords: ['palette', 'scheme', 'complementary', 'analogous', 'triadic'],
  },
  {
    id: 'contrast-checker',
    title: 'Contrast Checker',
    description: 'Check foreground/background contrast ratios against WCAG standards.',
    category: 'color',
    path: '/tools/contrast-checker',
    keywords: ['accessibility', 'wcag', 'a11y', 'contrast', 'ratio'],
  },
  {
    id: 'gradient-generator',
    title: 'Gradient Generator',
    description: 'Create and copy CSS gradient strings visually.',
    category: 'color',
    path: '/tools/gradient-generator',
    keywords: ['gradient', 'css', 'linear', 'radial', 'conic'],
  },

  // ── Image Tools ────────────────────────────────────────────────────────────
  {
    id: 'ico-creator',
    title: 'ICO Creator',
    description: 'Convert any image to a multi-size .ico file for favicons.',
    category: 'image',
    path: '/tools/ico-creator',
    keywords: ['ico', 'favicon', 'icon', 'convert', 'png', 'website'],
  },
  {
    id: 'image-cropper',
    title: 'Image Cropper',
    description: 'Crop an image to a custom region entirely in your browser.',
    category: 'image',
    path: '/tools/image-cropper',
    keywords: ['crop', 'image', 'cut', 'trim', 'region', 'png', 'jpg'],
  },
  {
    id: 'image-resizer',
    title: 'Image Resizer',
    description: 'Resize images to exact pixel dimensions, keeping or ignoring the aspect ratio.',
    category: 'image',
    path: '/tools/image-resizer',
    keywords: ['resize', 'scale', 'image', 'width', 'height', 'dimensions', 'png', 'jpg'],
  },
  {
    id: 'jpg-to-png',
    title: 'JPG to PNG',
    description: 'Convert JPEG images to lossless PNG format in your browser.',
    category: 'image',
    path: '/tools/jpg-to-png',
    keywords: ['jpg', 'jpeg', 'png', 'convert', 'lossless', 'image'],
  },
  {
    id: 'png-minifier',
    title: 'PNG Minifier',
    description: 'Reduce PNG file size by scaling or re-encoding without leaving your browser.',
    category: 'image',
    path: '/tools/png-minifier',
    keywords: ['png', 'minify', 'compress', 'optimize', 'reduce', 'file size', 'image'],
  },
  {
    id: 'png-to-jpg',
    title: 'PNG to JPG',
    description: 'Convert PNG images to JPEG with a custom quality setting.',
    category: 'image',
    path: '/tools/png-to-jpg',
    keywords: ['png', 'jpg', 'jpeg', 'convert', 'compress', 'quality', 'image'],
  },
  {
    id: 'svg-to-png',
    title: 'SVG to PNG',
    description: 'Convert SVG vector graphics to PNG at any resolution.',
    category: 'image',
    path: '/tools/svg-to-png',
    keywords: ['svg', 'png', 'convert', 'vector', 'raster', 'export', 'image'],
  },
  {
    id: 'video-to-gif',
    title: 'Video to GIF',
    description: 'Convert an MP4 or WebM clip to an animated GIF right in your browser.',
    category: 'image',
    path: '/tools/video-to-gif',
    keywords: ['video', 'gif', 'animate', 'convert', 'mp4', 'webm', 'animation', 'clip'],
  },

  // ── Web & Code ──────────────────────────────────────────────────────────────
  {
    id: 'array-formatter',
    title: 'Array Formatter',
    description: 'Format a list of items into a JavaScript, JSON, Python, or SQL array literal.',
    category: 'web',
    path: '/tools/array-formatter',
    keywords: ['array', 'list', 'format', 'javascript', 'json', 'python', 'sql', 'brackets'],
  },
  {
    id: 'base64',
    title: 'Base64 Encoder / Decoder',
    description: 'Encode text or files to Base64 and decode Base64 strings.',
    category: 'web',
    path: '/tools/base64',
    keywords: ['encode', 'decode', 'base64', 'binary'],
  },
  {
    id: 'css-minifier',
    title: 'CSS Formatter / Minifier',
    description: 'Format and minify CSS with Prettier-powered beautification.',
    category: 'web',
    path: '/tools/css-minifier',
    keywords: ['minify', 'compress', 'css', 'optimize', 'format', 'beautify', 'prettier'],
  },
  {
    id: 'html-formatter',
    title: 'HTML Formatter / Minifier',
    description: 'Prettify and minify HTML code with proper indentation.',
    category: 'web',
    path: '/tools/html-formatter',
    keywords: ['format', 'beautify', 'html', 'prettify', 'indent', 'minify', 'compress'],
  },
  {
    id: 'js-formatter',
    title: 'JavaScript Formatter / Minifier',
    description: 'Format and minify JavaScript with Prettier.',
    category: 'web',
    path: '/tools/js-formatter',
    keywords: ['javascript', 'js', 'format', 'beautify', 'minify', 'prettier', 'babel'],
  },
  {
    id: 'json-formatter',
    title: 'JSON Formatter / Minifier',
    description: 'Format, validate, and minify JSON data.',
    category: 'web',
    path: '/tools/json-formatter',
    keywords: ['json', 'format', 'validate', 'prettify', 'minify'],
  },
  {
    id: 'json-text-formatter',
    title: 'JSON Text Formatter',
    description: 'Encode plain text as a JSON string and decode JSON strings back to text.',
    category: 'web',
    path: '/tools/json-text-formatter',
    keywords: ['json', 'string', 'encode', 'decode', 'escape', 'text', 'newline'],
  },
  {
    id: 'typescript-formatter',
    title: 'TypeScript Formatter / Minifier',
    description: 'Format and minify TypeScript with Prettier.',
    category: 'web',
    path: '/tools/typescript-formatter',
    keywords: ['typescript', 'ts', 'format', 'beautify', 'minify', 'prettier'],
  },
  {
    id: 'xml-formatter',
    title: 'XML Formatter / Minifier',
    description: 'Format and minify XML with proper indentation.',
    category: 'web',
    path: '/tools/xml-formatter',
    keywords: ['xml', 'format', 'beautify', 'minify', 'indent', 'prettify'],
  },
  {
    id: 'regex-tester',
    title: 'Regex Tester',
    description: 'Test and debug regular expressions interactively with live match highlighting.',
    category: 'web',
    path: '/tools/regex-tester',
    keywords: ['regex', 'regular expression', 'pattern', 'match'],
  },
  {
    id: 'url-encoder',
    title: 'URL Encoder / Decoder',
    description: 'Encode and decode URLs and query string components.',
    category: 'web',
    path: '/tools/url-encoder',
    keywords: ['url', 'encode', 'decode', 'percent', 'uri', 'query'],
  },
  {
    id: 'uuid-generator',
    title: 'UUID Generator',
    description: 'Generate RFC-compliant UUIDs (v4) instantly.',
    category: 'web',
    path: '/tools/uuid-generator',
    keywords: ['uuid', 'guid', 'unique', 'id', 'v4'],
  },

  // ── Time & Date ─────────────────────────────────────────────────────────────
  {
    id: 'countdown-timer',
    title: 'Countdown Timer',
    description: 'Set a countdown to any future date or duration.',
    category: 'time',
    path: '/tools/countdown-timer',
    keywords: ['countdown', 'timer', 'event', 'deadline'],
  },
  {
    id: 'date-calculator',
    title: 'Date Calculator',
    description: 'Calculate the number of days between two dates.',
    category: 'time',
    path: '/tools/date-calculator',
    keywords: ['date', 'days', 'difference', 'between', 'calendar'],
  },
  {
    id: 'timezone-converter',
    title: 'Timezone Converter',
    description: 'Convert a date and time between any two time zones.',
    category: 'time',
    path: '/tools/timezone-converter',
    keywords: ['timezone', 'utc', 'convert', 'time zone', 'dst'],
  },
  {
    id: 'unix-timestamp',
    title: 'Unix Timestamp Converter',
    description: 'Convert Unix epoch timestamps to human-readable dates and back.',
    category: 'time',
    path: '/tools/unix-timestamp',
    keywords: ['unix', 'epoch', 'timestamp', 'convert', 'posix'],
  },
];

/** Pages grouped by category, each group sorted alphabetically by title. */
export const PAGE_BY_CATEGORY = Object.keys(CATEGORIES).reduce((acc, catId) => {
  acc[catId] = PAGES
    .filter(p => p.category === catId)
    .sort((a, b) => a.title.localeCompare(b.title));
  return acc;
}, {});

/** Fast lookup by page id. */
export const PAGE_BY_ID = Object.fromEntries(PAGES.map(p => [p.id, p]));

/**
 * Suggest related tools for a given page.
 * Prefers other tools in the same category, then fills from other categories
 * (in registry order) up to `count` suggestions.
 */
export function getRelatedPages(pageId, count = 4) {
  const current = PAGE_BY_ID[pageId];
  if (!current) return [];
  const sameCategory = PAGES.filter(p => p.id !== pageId && p.category === current.category);
  const otherCategories = PAGES.filter(p => p.id !== pageId && p.category !== current.category);
  return [...sameCategory, ...otherCategories].slice(0, count);
}

/** Search pages by query string (title, description, keywords). */
export function searchPages(query) {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();
  return PAGES
    .filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.keywords.some(k => k.toLowerCase().includes(q))
    )
    .sort((a, b) => {
      const aTitle = a.title.toLowerCase().includes(q);
      const bTitle = b.title.toLowerCase().includes(q);
      if (aTitle && !bTitle) return -1;
      if (!aTitle && bTitle) return 1;
      return a.title.localeCompare(b.title);
    })
    .slice(0, 8);
}
