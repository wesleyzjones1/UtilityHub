/**
 * Self-contained math engine for the Graph Calculator.
 *
 * `compile(expr)` turns a user expression in `x` (e.g. "x^2 - 4", "2sin(x)")
 * into a pure `(x) => number` evaluator via a tokenizer → shunting-yard → RPN
 * pipeline. No `eval`/`new Function`, so arbitrary code can't run.
 *
 * Also provides sampling and numeric root-finding used to draw the curve and
 * report x-intercepts and the y-intercept.
 */

const FUNCTIONS = {
  sin: Math.sin, cos: Math.cos, tan: Math.tan,
  asin: Math.asin, acos: Math.acos, atan: Math.atan,
  sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh,
  sqrt: Math.sqrt, cbrt: Math.cbrt, abs: Math.abs,
  exp: Math.exp, ln: Math.log, log: Math.log10, log2: Math.log2,
  sign: Math.sign, floor: Math.floor, ceil: Math.ceil, round: Math.round,
};

const CONSTANTS = { pi: Math.PI, e: Math.E, tau: Math.PI * 2 };

const OPERATORS = {
  '+': { prec: 2, assoc: 'L', fn: (a, b) => a + b },
  '-': { prec: 2, assoc: 'L', fn: (a, b) => a - b },
  '*': { prec: 3, assoc: 'L', fn: (a, b) => a * b },
  '/': { prec: 3, assoc: 'L', fn: (a, b) => a / b },
  '%': { prec: 3, assoc: 'L', fn: (a, b) => a % b },
  '^': { prec: 4, assoc: 'R', fn: (a, b) => Math.pow(a, b) },
};

// Unary minus binds tighter than * but looser than ^, so -x^2 === -(x^2).
const UNARY_PREC = 3.5;

const VALUE_TYPES = new Set(['num', 'var', 'const', 'rparen']);
const AFTER_VALUE_MULT = new Set(['num', 'var', 'const', 'func', 'lparen']);

function tokenize(input) {
  const s = input.toLowerCase().replace(/\s+/g, '').replace(/\*\*/g, '^');
  const tokens = [];
  let i = 0;

  while (i < s.length) {
    const c = s[i];

    if (/[0-9.]/.test(c)) {
      let j = i + 1;
      while (j < s.length && /[0-9.]/.test(s[j])) j++;
      const raw = s.slice(i, j);
      if ((raw.match(/\./g) || []).length > 1) throw new Error(`Invalid number "${raw}"`);
      tokens.push({ type: 'num', value: parseFloat(raw) });
      i = j;
    } else if (/[a-z]/.test(c)) {
      let j = i + 1;
      while (j < s.length && /[a-z0-9]/.test(s[j])) j++;
      const name = s.slice(i, j);
      if (Object.prototype.hasOwnProperty.call(FUNCTIONS, name)) {
        tokens.push({ type: 'func', name });
      } else if (name === 'x') {
        tokens.push({ type: 'var' });
      } else if (Object.prototype.hasOwnProperty.call(CONSTANTS, name)) {
        tokens.push({ type: 'const', value: CONSTANTS[name] });
      } else {
        throw new Error(`Unknown name "${name}"`);
      }
      i = j;
    } else if (OPERATORS[c]) {
      tokens.push({ type: 'op', op: c });
      i++;
    } else if (c === '(') {
      tokens.push({ type: 'lparen' });
      i++;
    } else if (c === ')') {
      tokens.push({ type: 'rparen' });
      i++;
    } else {
      throw new Error(`Unexpected character "${c}"`);
    }
  }

  return insertImplicitMultiplication(tokens);
}

// Turn "2x", "3(x+1)", ")(", "2sin(x)" into explicit multiplications.
function insertImplicitMultiplication(tokens) {
  const out = [];
  for (let i = 0; i < tokens.length; i++) {
    const prev = tokens[i - 1];
    const cur = tokens[i];
    if (prev && VALUE_TYPES.has(prev.type) && AFTER_VALUE_MULT.has(cur.type)) {
      out.push({ type: 'op', op: '*' });
    }
    out.push(cur);
  }
  return out;
}

function toRPN(tokens) {
  const output = [];
  const stack = [];
  let expectOperand = true;

  const popWhile = (test) => {
    while (stack.length && test(stack[stack.length - 1])) output.push(stack.pop());
  };

  for (const tk of tokens) {
    switch (tk.type) {
      case 'num':
      case 'var':
      case 'const':
        output.push(tk);
        expectOperand = false;
        break;
      case 'func':
        stack.push(tk);
        expectOperand = true;
        break;
      case 'op': {
        if (expectOperand) {
          // Unary position.
          if (tk.op === '-') {
            popWhile(t => t.type === 'uop' && t.prec > UNARY_PREC);
            stack.push({ type: 'uop', prec: UNARY_PREC });
          } else if (tk.op !== '+') {
            throw new Error(`Unexpected operator "${tk.op}"`);
          }
          // Unary plus is a no-op; still expecting an operand.
        } else {
          const o1 = { ...OPERATORS[tk.op], type: 'op', op: tk.op };
          popWhile(t =>
            (t.type === 'op' || t.type === 'uop') &&
            (t.prec > o1.prec || (t.prec === o1.prec && o1.assoc === 'L'))
          );
          stack.push(o1);
          expectOperand = true;
        }
        break;
      }
      case 'lparen':
        stack.push(tk);
        expectOperand = true;
        break;
      case 'rparen': {
        popWhile(t => t.type !== 'lparen');
        if (!stack.length) throw new Error('Mismatched parentheses');
        stack.pop(); // discard the '('
        if (stack.length && stack[stack.length - 1].type === 'func') output.push(stack.pop());
        expectOperand = false;
        break;
      }
      default:
        throw new Error('Invalid token');
    }
  }

  while (stack.length) {
    const t = stack.pop();
    if (t.type === 'lparen') throw new Error('Mismatched parentheses');
    output.push(t);
  }
  return output;
}

function evalRPN(rpn, x) {
  const st = [];
  for (const tk of rpn) {
    switch (tk.type) {
      case 'num':
      case 'const':
        st.push(tk.value);
        break;
      case 'var':
        st.push(x);
        break;
      case 'uop':
        st.push(-st.pop());
        break;
      case 'func': {
        if (!st.length) throw new Error('Invalid expression');
        st.push(FUNCTIONS[tk.name](st.pop()));
        break;
      }
      case 'op': {
        if (st.length < 2) throw new Error('Invalid expression');
        const b = st.pop();
        const a = st.pop();
        st.push(tk.fn(a, b));
        break;
      }
      default:
        throw new Error('Invalid expression');
    }
  }
  if (st.length !== 1) throw new Error('Invalid expression');
  return st[0];
}

/**
 * Compile an expression in `x` into a `(x) => number` function.
 * Throws an Error with a readable message when the expression is invalid.
 */
export function compile(expr) {
  if (!expr || !expr.trim()) throw new Error('Enter a function of x, e.g. x^2 - 4');
  const rpn = toRPN(tokenize(expr));
  const fn = (x) => evalRPN(rpn, x);
  fn(1); // Surface structural errors (bad arity, etc.) eagerly.
  return fn;
}

function safeEval(fn, x) {
  try {
    const y = fn(x);
    return typeof y === 'number' ? y : NaN;
  } catch {
    return NaN;
  }
}

/** Sample the curve across [xMin, xMax], returning {x, y} points (y may be NaN). */
export function sampleCurve(fn, xMin, xMax, steps = 600) {
  const points = [];
  const dx = (xMax - xMin) / steps;
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * dx;
    const y = safeEval(fn, x);
    points.push({ x, y: Number.isFinite(y) ? y : NaN });
  }
  return points;
}

function bisect(fn, a, b, iters = 80) {
  let fa = safeEval(fn, a);
  for (let k = 0; k < iters; k++) {
    const m = (a + b) / 2;
    const fm = safeEval(fn, m);
    if (fm === 0 || (b - a) / 2 < 1e-13) return m;
    if (fa * fm < 0) b = m;
    else { a = m; fa = fm; }
  }
  return (a + b) / 2;
}

/**
 * Find real roots (x-intercepts) in [xMin, xMax] by scanning for sign changes
 * and refining each with bisection. Nearby duplicates are merged.
 */
export function findRoots(fn, xMin, xMax, steps = 2000) {
  const roots = [];
  const dx = (xMax - xMin) / steps;
  let prevX = xMin;
  let prevY = safeEval(fn, xMin);

  const add = (r) => {
    if (!Number.isFinite(r)) return;
    if (roots.some(existing => Math.abs(existing - r) < dx)) return;
    roots.push(r);
  };

  if (prevY === 0) add(prevX);

  for (let i = 1; i <= steps; i++) {
    const x = xMin + i * dx;
    const y = safeEval(fn, x);
    if (Number.isFinite(prevY) && Number.isFinite(y)) {
      if (y === 0) add(x);
      else if (prevY * y < 0) add(bisect(fn, prevX, x));
    }
    prevX = x;
    prevY = y;
  }

  return roots.sort((a, b) => a - b);
}

/** Robust auto y-range from sampled points, trimming asymptote spikes. */
export function autoYRange(points) {
  const ys = points.map(p => p.y).filter(Number.isFinite).sort((a, b) => a - b);
  if (!ys.length) return [-10, 10];
  const lo = ys[Math.floor((ys.length - 1) * 0.02)];
  const hi = ys[Math.ceil((ys.length - 1) * 0.98)];
  let min = lo;
  let max = hi;
  if (min === max) { min -= 1; max += 1; }
  const pad = (max - min) * 0.1;
  return [min - pad, max + pad];
}

/** Format a number for display: integers stay whole, others trim to 4 dp. */
export function formatNum(n) {
  if (!Number.isFinite(n)) return '—';
  let r = Math.round(n * 1e6) / 1e6;
  if (Object.is(r, -0)) r = 0;
  if (Number.isInteger(r)) return String(r);
  return parseFloat(r.toFixed(4)).toString();
}
