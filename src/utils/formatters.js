// Sync utilities for minification and XML formatting.
// Prettier is async and handles format mode; these handle minify mode and XML.

export function minifyCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};:,>~+])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

export function minifyHTML(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/>\s+</g, '><')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function minifyJS(js) {
  return js
    .replace(/\/\/[^\n]*/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\n\s*/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function formatXML(xml) {
  let depth = 0;
  const indent = '  ';
  const tokens = xml.replace(/>\s*</g, '>\n<').split('\n');
  const result = [];

  for (const token of tokens) {
    const t = token.trim();
    if (!t) continue;

    const isClosing = t.startsWith('</');
    const isSelfClosing = t.endsWith('/>');
    const isDeclaration = t.startsWith('<?') || t.startsWith('<!');
    const hasInlineClose = !isClosing && !isSelfClosing && t.includes('</');

    if (isClosing) depth = Math.max(0, depth - 1);
    result.push(indent.repeat(depth) + t);
    if (!isClosing && !isSelfClosing && !isDeclaration && !hasInlineClose) depth++;
  }

  return result.join('\n');
}

export function minifyXML(xml) {
  return xml
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/>\s+</g, '><')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function formatJSON(text) {
  const parsed = JSON.parse(text);
  return JSON.stringify(parsed, null, 2);
}

export function minifyJSON(text) {
  const parsed = JSON.parse(text);
  return JSON.stringify(parsed);
}

export function encodeJSONText(text) {
  return JSON.stringify(text);
}

export function decodeJSONText(text) {
  const trimmed = text.trim();
  const unwrapped = trimmed.startsWith('"') ? trimmed : `"${trimmed}"`;
  return JSON.parse(unwrapped);
}

export function calculatePiAttenuator(dB, impedance) {
  const K = Math.pow(10, dB / 20);
  if (K <= 1) throw new Error('Attenuation must be greater than 0 dB');
  const rShunt = (impedance * (K + 1)) / (K - 1);
  const rSeries = (impedance * (K * K - 1)) / (2 * K);
  return { rShunt, rSeries };
}

export function reversePiAttenuator(rShunt, rSeries, impedance) {
  // K = (rShunt + Z) / (rShunt - Z)  (from shunt formula)
  const K = (rShunt + impedance) / (rShunt - impedance);
  if (K <= 1) throw new Error('Invalid resistor values for this impedance');
  const dB = 20 * Math.log10(K);
  return { dB };
}

function trimNum(n) {
  if (!isFinite(n)) return '';
  // Show at most one decimal place (e.g. 23.4), dropping a trailing ".0".
  return String(parseFloat(n.toFixed(1)));
}

/**
 * Matched symmetric Pi attenuator: given a target attenuation and the system
 * impedance, return the resistor values that make the pad impedance-matched.
 * Used to auto-fill the resistor fields when the user types a target dB.
 *
 * @returns { rShunt, rSeries } display strings ('' when blank), or an `error`.
 */
export function matchedPiAttenuator(db, impedance) {
  const n = parseFloat(db);
  if (String(db).trim() === '' || isNaN(n)) return { rShunt: '', rSeries: '' };
  if (!(impedance > 0)) return { rShunt: '', rSeries: '', error: 'Enter a valid impedance first.' };
  if (n <= 0) return { rShunt: '', rSeries: '', error: 'Attenuation must be greater than 0 dB.' };
  const { rShunt, rSeries } = calculatePiAttenuator(n, impedance);
  return { rShunt: trimNum(rShunt), rSeries: trimNum(rSeries) };
}

/**
 * Attenuation of a symmetric Pi network from its two independent resistor
 * values (shunt legs equal, one series arm), terminated in `impedance` at both
 * ports. This is the general case — the resistors need not be matched.
 *
 * Nodal analysis with source/load = Z gives a load voltage of Vs/(Rs·D) where
 * D = GA·GB·Rseries − 1/Rseries, GA = 1/Z+1/Rsh+1/Rse, GB = 1/Rse+1/Rsh+1/Z.
 * Attenuation is referenced to the matched Vs/2 divider: ratio = (Z/2)·D.
 *
 * @returns { db } display string ('' when either resistor is blank), or `error`.
 */
export function piAttenuationDb(rShunt, rSeries, impedance) {
  const rsh = parseFloat(rShunt);
  const rse = parseFloat(rSeries);
  if (String(rShunt).trim() === '' || String(rSeries).trim() === '' || isNaN(rsh) || isNaN(rse)) {
    return { db: '' };
  }
  if (!(impedance > 0)) return { db: '', error: 'Enter a valid impedance first.' };
  if (rsh <= 0 || rse <= 0) return { db: '', error: 'Resistor values must be greater than 0 Ω.' };

  const GA = 1 / impedance + 1 / rsh + 1 / rse;
  const GB = 1 / rse + 1 / rsh + 1 / impedance;
  const ratio = (impedance / 2) * (GA * GB * rse - 1 / rse);
  if (!isFinite(ratio) || ratio <= 0) return { db: '', error: 'No valid attenuation for these values.' };
  return { db: trimNum(20 * Math.log10(ratio)) };
}
