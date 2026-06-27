export function parseNumbers(input) {
  if (!input.trim()) return [];
  return input.split(/[\s,\n]+/).map(Number).filter(n => !isNaN(n) && String(n) !== '');
}

export function mean(nums) {
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function median(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function mode(nums) {
  const freq = {};
  nums.forEach(n => { freq[n] = (freq[n] || 0) + 1; });
  const maxFreq = Math.max(...Object.values(freq));
  if (maxFreq === 1) return null;
  return Object.keys(freq).filter(k => freq[k] === maxFreq).map(Number);
}

export function variance(nums) {
  const m = mean(nums);
  return mean(nums.map(n => (n - m) ** 2));
}

export function stddev(nums) {
  return Math.sqrt(variance(nums));
}
