/**
 * Unit conversion tables and helpers.
 *
 * Each measurement category (except temperature) is defined by a factor to a
 * common base unit. To convert: value × factor[from] ÷ factor[to].
 * Temperature is non-linear, so it has its own dedicated converter.
 */

export const UNIT_CATEGORIES = {
  length: {
    label: 'Length',
    base: 'm',
    units: {
      mm: { label: 'Millimetre (mm)', factor: 0.001 },
      cm: { label: 'Centimetre (cm)', factor: 0.01 },
      m:  { label: 'Metre (m)',       factor: 1 },
      km: { label: 'Kilometre (km)',  factor: 1000 },
      in: { label: 'Inch (in)',       factor: 0.0254 },
      ft: { label: 'Foot (ft)',       factor: 0.3048 },
      yd: { label: 'Yard (yd)',       factor: 0.9144 },
      mi: { label: 'Mile (mi)',       factor: 1609.344 },
    },
  },
  mass: {
    label: 'Mass',
    base: 'kg',
    units: {
      mg: { label: 'Milligram (mg)', factor: 0.000001 },
      g:  { label: 'Gram (g)',       factor: 0.001 },
      kg: { label: 'Kilogram (kg)',  factor: 1 },
      t:  { label: 'Tonne (t)',      factor: 1000 },
      oz: { label: 'Ounce (oz)',     factor: 0.0283495 },
      lb: { label: 'Pound (lb)',     factor: 0.453592 },
      st: { label: 'Stone (st)',     factor: 6.35029 },
    },
  },
  volume: {
    label: 'Volume',
    base: 'l',
    units: {
      ml:    { label: 'Millilitre (ml)', factor: 0.001 },
      l:     { label: 'Litre (l)',       factor: 1 },
      m3:    { label: 'Cubic metre (m³)', factor: 1000 },
      tsp:   { label: 'Teaspoon (US)',   factor: 0.00492892 },
      tbsp:  { label: 'Tablespoon (US)', factor: 0.0147868 },
      cup:   { label: 'Cup (US)',        factor: 0.236588 },
      pt:    { label: 'Pint (US)',       factor: 0.473176 },
      gal:   { label: 'Gallon (US)',     factor: 3.78541 },
    },
  },
  area: {
    label: 'Area',
    base: 'm2',
    units: {
      cm2: { label: 'Square cm (cm²)',   factor: 0.0001 },
      m2:  { label: 'Square metre (m²)', factor: 1 },
      ha:  { label: 'Hectare (ha)',      factor: 10000 },
      km2: { label: 'Square km (km²)',   factor: 1000000 },
      ft2: { label: 'Square foot (ft²)', factor: 0.092903 },
      ac:  { label: 'Acre (ac)',         factor: 4046.86 },
    },
  },
  temperature: {
    label: 'Temperature',
    base: 'c',
    units: {
      c: { label: 'Celsius (°C)' },
      f: { label: 'Fahrenheit (°F)' },
      k: { label: 'Kelvin (K)' },
    },
  },
};

/** Convert a temperature value between c / f / k. */
export function convertTemperature(value, from, to) {
  if (from === to) return value;
  // Normalise to Celsius first.
  let c;
  if (from === 'c') c = value;
  else if (from === 'f') c = (value - 32) * (5 / 9);
  else c = value - 273.15; // kelvin

  if (to === 'c') return c;
  if (to === 'f') return c * (9 / 5) + 32;
  return c + 273.15; // kelvin
}

/**
 * Convert a numeric value from one unit to another within the same category.
 * Returns a Number, or NaN if the value isn't finite.
 */
export function convertUnit(value, category, from, to) {
  const n = Number(value);
  if (!Number.isFinite(n)) return NaN;
  if (category === 'temperature') return convertTemperature(n, from, to);

  const cat = UNIT_CATEGORIES[category];
  if (!cat) return NaN;
  const fromUnit = cat.units[from];
  const toUnit = cat.units[to];
  if (!fromUnit || !toUnit) return NaN;
  return (n * fromUnit.factor) / toUnit.factor;
}

/** Round a converted result to a sensible number of significant digits for display. */
export function formatResult(value) {
  if (!Number.isFinite(value)) return '';
  if (value === 0) return '0';
  const abs = Math.abs(value);
  // Use more decimals for small magnitudes, fewer for large.
  let str;
  if (abs >= 1000 || abs < 0.0001) str = value.toPrecision(6);
  else str = value.toFixed(6);
  // Trim trailing zeros / dangling decimal point.
  return parseFloat(str).toString();
}
