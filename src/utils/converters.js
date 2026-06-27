// ── Base Conversion ───────────────────────────────────────────────────────────

const BASE_RADIX = { binary: 2, octal: 8, decimal: 10, hexadecimal: 16 };

function toCodePoints(text) {
  return [...text].map(c => c.codePointAt(0));
}

function fromCodePoints(points) {
  return points.map(n => String.fromCodePoint(n)).join('');
}

/** Convert a single value string between bases (or text). Returns { output, error }. */
export function convertBase(value, from, to) {
  const v = value.trim();
  if (!v) return { output: '', error: null };

  try {
    if (from === 'text' && to === 'text') return { output: v, error: null };

    if (from === 'text') {
      const radix = BASE_RADIX[to];
      const parts = toCodePoints(v).map(cp => cp.toString(radix).toUpperCase());
      return { output: parts.join(' '), error: null };
    }

    if (to === 'text') {
      const radix = BASE_RADIX[from];
      const parts = v.split(/\s+/).filter(Boolean).map(p => {
        const cp = parseInt(p, radix);
        if (isNaN(cp) || cp < 0 || cp > 0x10FFFF) throw new Error(`Invalid value: ${p}`);
        return cp;
      });
      return { output: fromCodePoints(parts), error: null };
    }

    // numeric ↔ numeric
    const fromRadix = BASE_RADIX[from];
    const toRadix   = BASE_RADIX[to];
    const decimal   = parseInt(v, fromRadix);
    if (isNaN(decimal)) return { output: '', error: `"${v}" is not a valid ${from} number.` };
    return { output: decimal.toString(toRadix).toUpperCase(), error: null };
  } catch (err) {
    return { output: '', error: err.message };
  }
}

// ── Number Sorting ────────────────────────────────────────────────────────────

/** Sort numbers from a newline/comma-separated string. Returns sorted string. */
export function sortNumbers(text, order = 'asc', removeDuplicates = false) {
  const raw = text.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
  const nums = raw.map(s => ({ raw: s, val: parseFloat(s) })).filter(n => !isNaN(n.val));
  if (!nums.length) return '';

  const sorted = [...nums].sort((a, b) =>
    order === 'asc' ? a.val - b.val : b.val - a.val
  );

  const result = removeDuplicates
    ? sorted.filter((n, i, arr) => i === 0 || n.val !== arr[i - 1].val)
    : sorted;

  return result.map(n => n.raw).join('\n');
}

// ── Array Formatter ────────────────────────────────────────────────────────────

/** Format a list of items (one per line) into an array literal. */
export function formatArray(text, style = 'js', quoteChar = 'single') {
  const items = text.split('\n').map(s => s.trim()).filter(Boolean);
  if (!items.length) return '';

  const q = quoteChar === 'double' ? '"' : quoteChar === 'none' ? '' : "'";
  const wrap = item => (q ? `${q}${item}${q}` : item);

  switch (style) {
    case 'js':
      return `[${items.map(wrap).join(', ')}]`;
    case 'js-multiline':
      return `[\n  ${items.map(wrap).join(',\n  ')},\n]`;
    case 'json':
      return JSON.stringify(items);
    case 'json-pretty':
      return JSON.stringify(items, null, 2);
    case 'python':
      return `[${items.map(i => `'${i}'`).join(', ')}]`;
    case 'csv':
      return items.map(wrap).join(', ');
    case 'sql-in':
      return `IN (${items.map(i => `'${i}'`).join(', ')})`;
    default:
      return `[${items.map(wrap).join(', ')}]`;
  }
}

// ── Temperature ────────────────────────────────────────────────────────────────

export function fToC(f) {
  return (f - 32) * 5 / 9;
}

export function cToF(c) {
  return c * 9 / 5 + 32;
}

export function toKelvin(c) {
  return c + 273.15;
}

function fmt(n) {
  if (!isFinite(n)) return '';
  const s = n.toPrecision(8);
  return String(parseFloat(s));
}

/** Convert a temperature string. Returns { f, c, k } or { error }. */
export function convertTemperature(value, sourceUnit) {
  const n = parseFloat(value);
  if (value.trim() === '' || isNaN(n)) return { f: '', c: '', k: '' };
  let c;
  if (sourceUnit === 'f') c = fToC(n);
  else if (sourceUnit === 'k') c = n - 273.15;
  else c = n;
  return { f: fmt(cToF(c)), c: fmt(c), k: fmt(toKelvin(c)) };
}

// ── Distance Conversion ───────────────────────────────────────────────────────

// meters per unit
const DISTANCE_M = {
  mm:   0.001,
  cm:   0.01,
  m:    1,
  km:   1000,
  in:   0.0254,
  ft:   0.3048,
  yd:   0.9144,
  mi:   1609.344,
  nmi:  1852,
};

export const DISTANCE_UNITS = [
  { value: 'mm',  label: 'Millimetres (mm)' },
  { value: 'cm',  label: 'Centimetres (cm)' },
  { value: 'm',   label: 'Metres (m)' },
  { value: 'km',  label: 'Kilometres (km)' },
  { value: 'in',  label: 'Inches (in)' },
  { value: 'ft',  label: 'Feet (ft)' },
  { value: 'yd',  label: 'Yards (yd)' },
  { value: 'mi',  label: 'Miles (mi)' },
  { value: 'nmi', label: 'Nautical miles (nmi)' },
];

/** Convert a distance value between units. Returns { output, error }. */
export function convertDistance(value, from, to) {
  const v = value.trim();
  if (!v) return { output: '', error: null };
  const n = parseFloat(v);
  if (isNaN(n)) return { output: '', error: 'Please enter a valid number.' };
  const meters = n * DISTANCE_M[from];
  const result = meters / DISTANCE_M[to];
  return { output: fmt(result), error: null };
}

// ── Markdown Table ────────────────────────────────────────────────────────────

/** Auto-detect the most likely column separator in the first line. */
function detectSeparator(line) {
  if (line.includes('\t')) return '\t';
  if (line.includes('|')) return '|';
  if (line.includes(';')) return ';';
  return ',';
}

/** Generate a Markdown table from delimited text. */
export function generateMarkdownTable(text, separator = 'auto') {
  const lines = text.split('\n').filter(l => l.trim());
  if (!lines.length) return '';

  const sep = separator === 'auto' ? detectSeparator(lines[0]) : separator;
  const rows = lines.map(l =>
    l.split(sep).map(cell => cell.trim().replace(/\|/g, '\\|'))
  );

  const colCount = Math.max(...rows.map(r => r.length));
  const padded = rows.map(r =>
    [...r, ...Array(Math.max(0, colCount - r.length)).fill('')]
  );

  const widths = Array.from({ length: colCount }, (_, ci) =>
    Math.max(3, ...padded.map(r => r[ci]?.length ?? 0))
  );

  const cell = (text, w) => ` ${text.padEnd(w)} `;
  const divider = widths.map(w => '-'.repeat(w + 2));

  const header = `|${padded[0].map((t, ci) => cell(t, widths[ci])).join('|')}|`;
  const sep_row = `|${divider.join('|')}|`;
  const body = padded.slice(1).map(
    row => `|${row.map((t, ci) => cell(t, widths[ci])).join('|')}|`
  );

  return [header, sep_row, ...body].join('\n');
}
