// LCS-based diff for Text Compare tool.

function buildLCS(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Uint32Array(n + 1));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp;
}

/**
 * Compute element-level diff between two arrays.
 * Each op: { type: 'equal'|'insert'|'delete', left, right }
 */
export function computeDiff(a, b) {
  const dp = buildLCS(a, b);
  const ops = [];
  let i = a.length;
  let j = b.length;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      ops.unshift({ type: 'equal', left: a[i - 1], right: b[j - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      ops.unshift({ type: 'insert', left: null, right: b[j - 1] });
      j--;
    } else {
      ops.unshift({ type: 'delete', left: a[i - 1], right: null });
      i--;
    }
  }
  return ops;
}

/**
 * Diff two texts line by line.
 * Adjacent delete+insert pairs are merged:
 *   - If lines differ only in case → 'case-change'
 *   - Otherwise → 'change'
 */
export function lineDiff(textA, textB) {
  const linesA = textA.split('\n');
  const linesB = textB.split('\n');
  const raw = computeDiff(linesA, linesB);

  const result = [];
  let k = 0;
  while (k < raw.length) {
    const cur = raw[k];
    const next = raw[k + 1];
    if (cur.type === 'delete' && next?.type === 'insert') {
      const isCaseOnly = cur.left.toLowerCase() === next.right.toLowerCase();
      result.push({
        type: isCaseOnly ? 'case-change' : 'change',
        left: cur.left,
        right: next.right,
      });
      k += 2;
    } else {
      result.push(cur);
      k++;
    }
  }
  return result;
}

/**
 * Diff two strings token by token (words + whitespace).
 */
export function wordDiff(lineA, lineB) {
  const tokA = tokenize(lineA);
  const tokB = tokenize(lineB);
  return computeDiff(tokA, tokB);
}

function tokenize(str) {
  return str.split(/(\s+)/).filter(t => t.length > 0);
}

/**
 * Count additions, deletions, case changes, and unchanged lines.
 */
export function diffStats(ops) {
  let added = 0;
  let removed = 0;
  let caseChanges = 0;
  let unchanged = 0;
  for (const op of ops) {
    switch (op.type) {
      case 'insert':      added++;                    break;
      case 'delete':      removed++;                  break;
      case 'change':      added++; removed++;         break;
      case 'case-change': caseChanges++;              break;
      case 'equal':       unchanged++;                break;
    }
  }
  return { added, removed, caseChanges, unchanged };
}
