/** Pure percentage helpers. All return a Number, or NaN if inputs aren't finite. */

function nums(...vals) {
  return vals.map(Number);
}

/** What is `percent`% of `value`?  e.g. percentOf(10, 200) → 20 */
export function percentOf(percent, value) {
  const [p, v] = nums(percent, value);
  if (!Number.isFinite(p) || !Number.isFinite(v)) return NaN;
  return (p / 100) * v;
}

/** `part` is what percent of `whole`?  e.g. whatPercent(20, 200) → 10 */
export function whatPercent(part, whole) {
  const [a, b] = nums(part, whole);
  if (!Number.isFinite(a) || !Number.isFinite(b) || b === 0) return NaN;
  return (a / b) * 100;
}

/** Percent change from `from` to `to`.  e.g. percentChange(100, 150) → 50 */
export function percentChange(from, to) {
  const [a, b] = nums(from, to);
  if (!Number.isFinite(a) || !Number.isFinite(b) || a === 0) return NaN;
  return ((b - a) / a) * 100;
}

/** Round to at most 4 decimals and trim trailing zeros for display. */
export function formatNumber(value) {
  if (!Number.isFinite(value)) return '';
  return parseFloat(value.toFixed(4)).toString();
}
