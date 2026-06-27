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
