import { useMemo, useRef, useState } from 'react';
import PageShell from '../../../templates/PageShell/PageShell';
import {
  compile,
  sampleCurve,
  findRoots,
  autoYRange,
  formatNum,
} from './graphUtils';
import styles from './GraphCalculator.module.css';

// SVG plot geometry (viewBox units).
const W = 720;
const H = 440;
const M = { l: 48, r: 18, t: 18, b: 30 };
const PLOT_W = W - M.l - M.r;
const PLOT_H = H - M.t - M.b;

function niceStep(range, target) {
  const raw = range / target;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const step = norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10;
  return step * mag;
}

function ticks(min, max, target = 8) {
  const range = max - min;
  if (!(range > 0) || !Number.isFinite(range)) return [];
  const step = niceStep(range, target);
  const start = Math.ceil(min / step) * step;
  const out = [];
  for (let v = start; v <= max + step * 1e-9; v += step) {
    out.push(Math.round(v / step) * step);
  }
  return out;
}

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export default function GraphCalculator({ page }) {
  const [expr, setExpr] = useState('x^2 - 4');
  const [xMin, setXMin] = useState('-10');
  const [xMax, setXMax] = useState('10');
  const [evalX, setEvalX] = useState('');

  const lastValidFn = useRef(null);
  const lastValidGraph = useRef(null);

  const compiled = useMemo(() => {
    try {
      const fn = compile(expr);
      lastValidFn.current = fn;
      return { fn, error: null };
    } catch (e) {
      return { fn: null, error: e.message };
    }
  }, [expr]);

  const xmin = parseFloat(xMin);
  const xmax = parseFloat(xMax);
  const rangeValid = Number.isFinite(xmin) && Number.isFinite(xmax) && xmin < xmax;

  const graph = useMemo(() => {
    if (compiled.fn && rangeValid) {
      const points = sampleCurve(compiled.fn, xmin, xmax);
      const [yMin, yMax] = autoYRange(points);
      const roots = findRoots(compiled.fn, xmin, xmax);
      let yIntercept = null;
      if (xmin <= 0 && xmax >= 0) {
        const y0 = (() => { try { return compiled.fn(0); } catch { return NaN; } })();
        if (Number.isFinite(y0)) yIntercept = y0;
      }
      lastValidGraph.current = { points, yMin, yMax, roots, yIntercept };
    }
    return lastValidGraph.current;
  }, [compiled, rangeValid, xmin, xmax]);

  const evalResult = useMemo(() => {
    const fn = compiled.fn ?? lastValidFn.current;
    if (!fn || evalX.trim() === '') return null;
    const xv = parseFloat(evalX);
    if (!Number.isFinite(xv)) return null;
    try {
      const y = fn(xv);
      return { x: xv, y };
    } catch {
      return { x: xv, y: NaN };
    }
  }, [compiled, evalX]);

  return (
    <PageShell page={page}>
      <div className={styles.layout}>
        <div className={styles.controls}>
          <label className={styles.exprField}>
            <span className={styles.exprLabel}>f(x) =</span>
            <input
              className={styles.exprInput}
              value={expr}
              onChange={e => setExpr(e.target.value)}
              placeholder="x^2 - 4"
              aria-label="Function of x"
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
            />
          </label>
          <div className={styles.rangeField}>
            <label className={styles.rangeItem}>
              <span className={styles.rangeLabel}>x min</span>
              <input
                type="number"
                className={styles.rangeInput}
                value={xMin}
                onChange={e => setXMin(e.target.value)}
                aria-label="x minimum"
              />
            </label>
            <label className={styles.rangeItem}>
              <span className={styles.rangeLabel}>x max</span>
              <input
                type="number"
                className={styles.rangeInput}
                value={xMax}
                onChange={e => setXMax(e.target.value)}
                aria-label="x maximum"
              />
            </label>
          </div>
        </div>

        {graph && (
          <>
            <div className={styles.graphCard}>
              <Plot graph={graph} xMin={xmin} xMax={xmax} />
            </div>

            <div className={styles.results}>
              <ResultCard label="y-intercept">
                {graph.yIntercept === null
                  ? <span className={styles.muted}>x = 0 not in range</span>
                  : <span>(0, {formatNum(graph.yIntercept)})</span>}
              </ResultCard>

              <ResultCard label={`x-intercepts (${graph.roots.length})`}>
                {graph.roots.length === 0
                  ? <span className={styles.muted}>No real roots in this range</span>
                  : (
                    <span className={styles.roots}>
                      {graph.roots.map((r, i) => (
                        <code key={i} className={styles.rootChip}>x = {formatNum(r)}</code>
                      ))}
                    </span>
                  )}
              </ResultCard>

              <ResultCard label="Evaluate at x">
                <div className={styles.evalRow}>
                  <input
                    type="number"
                    className={styles.evalInput}
                    value={evalX}
                    onChange={e => setEvalX(e.target.value)}
                    placeholder="e.g. 3"
                    aria-label="Evaluate at x"
                  />
                  <span className={styles.evalOut}>
                    {evalResult
                      ? <>= <strong>{formatNum(evalResult.y)}</strong></>
                      : <span className={styles.muted}>= —</span>}
                  </span>
                </div>
              </ResultCard>
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
}

function ResultCard({ label, children }) {
  return (
    <div className={styles.resultCard}>
      <span className={styles.resultLabel}>{label}</span>
      <div className={styles.resultValue}>{children}</div>
    </div>
  );
}

function Plot({ graph, xMin, xMax }) {
  const { points, yMin, yMax, roots, yIntercept } = graph;

  const mapX = (x) => M.l + ((x - xMin) / (xMax - xMin)) * PLOT_W;
  const mapY = (y) => clamp(M.t + ((yMax - y) / (yMax - yMin)) * PLOT_H, -PLOT_H, H + PLOT_H);

  // Build the curve path, breaking on undefined values and asymptote jumps.
  const jumpLimit = (yMax - yMin) * 4;
  let d = '';
  let pen = false;
  let prevY = null;
  for (const p of points) {
    if (!Number.isFinite(p.y)) { pen = false; prevY = null; continue; }
    if (prevY !== null && Math.abs(p.y - prevY) > jumpLimit) pen = false;
    const sx = mapX(p.x);
    const sy = mapY(p.y);
    d += `${pen ? 'L' : 'M'}${sx.toFixed(1)} ${sy.toFixed(1)} `;
    pen = true;
    prevY = p.y;
  }

  const xTicks = ticks(xMin, xMax);
  const yTicks = ticks(yMin, yMax);
  const zeroInX = xMin <= 0 && xMax >= 0;
  const zeroInY = yMin <= 0 && yMax >= 0;
  const rootY = mapY(clamp(0, yMin, yMax));

  return (
    <svg
      className={styles.svg}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Graph of the function"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Grid */}
      {xTicks.map((t, i) => (
        <line key={`gx${i}`} className={styles.grid} x1={mapX(t)} y1={M.t} x2={mapX(t)} y2={M.t + PLOT_H} />
      ))}
      {yTicks.map((t, i) => (
        <line key={`gy${i}`} className={styles.grid} x1={M.l} y1={mapY(t)} x2={M.l + PLOT_W} y2={mapY(t)} />
      ))}

      {/* Axes */}
      {zeroInY && (
        <line className={styles.axis} x1={M.l} y1={mapY(0)} x2={M.l + PLOT_W} y2={mapY(0)} />
      )}
      {zeroInX && (
        <line className={styles.axis} x1={mapX(0)} y1={M.t} x2={mapX(0)} y2={M.t + PLOT_H} />
      )}

      {/* Tick labels */}
      {xTicks.map((t, i) => (
        <text key={`tx${i}`} className={styles.tickLabel} x={mapX(t)} y={M.t + PLOT_H + 18} textAnchor="middle">
          {formatNum(t)}
        </text>
      ))}
      {yTicks.map((t, i) => (
        <text key={`ty${i}`} className={styles.tickLabel} x={M.l - 6} y={mapY(t) + 3} textAnchor="end">
          {formatNum(t)}
        </text>
      ))}

      {/* Curve */}
      {d && <path className={styles.curve} d={d} fill="none" />}

      {/* x-intercepts */}
      {roots.map((r, i) => (
        <circle key={`r${i}`} className={styles.rootDot} cx={mapX(r)} cy={rootY} r={4.5} />
      ))}

      {/* y-intercept */}
      {yIntercept !== null && (
        <circle className={styles.yDot} cx={mapX(0)} cy={mapY(yIntercept)} r={4.5} />
      )}
    </svg>
  );
}
