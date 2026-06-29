import { useState } from 'react';
import PageShell from '../../../templates/PageShell/PageShell';
import styles from './ScientificCalc.module.css';

const HOW_TO_USE = [
  'Click number and operator buttons to build an expression.',
  'Use scientific functions like sin, cos, log, and √.',
  'Press = to evaluate; AC clears the display.',
];

function safeEval(expr) {
  try {
    const sanitized = expr
      .replace(/π/g, 'Math.PI')
      .replace(/\be\b/g, 'Math.E')
      .replace(/sin\(/g, 'Math.sin(')
      .replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(')
      .replace(/log\(/g, 'Math.log10(')
      .replace(/ln\(/g, 'Math.log(')
      .replace(/√\(/g, 'Math.sqrt(')
      .replace(/÷/g, '/')
      .replace(/×/g, '*');
    const result = new Function('Math', 'return ' + sanitized)(Math);
    if (!isFinite(result)) return 'Error';
    const rounded = parseFloat(result.toPrecision(12));
    return String(rounded);
  } catch {
    return 'Error';
  }
}

export default function ScientificCalc({ page }) {
  const [expression, setExpression] = useState('');
  const [display, setDisplay] = useState('');
  const [evaluated, setEvaluated] = useState(false);

  function handleDigit(val) {
    if (evaluated) {
      setExpression(val);
      setDisplay(val);
      setEvaluated(false);
    } else {
      setExpression(prev => prev + val);
      setDisplay(prev => prev + val);
    }
  }

  function handleOperator(op) {
    setEvaluated(false);
    setExpression(prev => prev + op);
    setDisplay(prev => prev + op);
  }

  function handleScientific(fn) {
    setEvaluated(false);
    if (fn === 'x²') {
      setExpression(prev => prev + '**2');
      setDisplay(prev => prev + '²');
    } else if (fn === 'π') {
      setExpression(prev => prev + 'π');
      setDisplay(prev => prev + 'π');
    } else if (fn === 'e') {
      setExpression(prev => prev + 'e');
      setDisplay(prev => prev + 'e');
    } else {
      setExpression(prev => prev + fn + '(');
      setDisplay(prev => prev + fn + '(');
    }
  }

  function handlePercent() {
    const val = parseFloat(expression);
    if (!isNaN(val)) {
      const res = String(val / 100);
      setExpression(res);
      setDisplay(res);
    }
  }

  function handleNegate() {
    if (expression.startsWith('-')) {
      setExpression(prev => prev.slice(1));
      setDisplay(prev => prev.slice(1));
    } else if (expression) {
      setExpression(prev => '-' + prev);
      setDisplay(prev => '-' + prev);
    }
  }

  function handleEquals() {
    const result = safeEval(expression);
    setDisplay(result);
    setExpression(result);
    setEvaluated(true);
  }

  function handleClear() {
    setExpression('');
    setDisplay('');
    setEvaluated(false);
  }

  const shown = display || '0';

  return (
    <PageShell page={page} howToUse={HOW_TO_USE}>
      <div className={styles.calculator}>
        <div className={styles.display} aria-label="Display" role="textbox" aria-readonly="true">
          <span className={styles.displayText}>{shown}</span>
        </div>

        <div className={styles.scientificRow}>
          {['sin', 'cos', 'tan', 'log', 'ln', '√', 'x²', 'π', 'e'].map(fn => (
            <button
              key={fn}
              className={styles.btnSci}
              aria-label={fn}
              onClick={() => handleScientific(fn)}
            >
              {fn}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          <button className={styles.btnFunc} aria-label="AC" onClick={handleClear}>AC</button>
          <button className={styles.btnFunc} aria-label="+/-" onClick={handleNegate}>+/−</button>
          <button className={styles.btnFunc} aria-label="%" onClick={handlePercent}>%</button>
          <button className={styles.btnOp} aria-label="÷" onClick={() => handleOperator('÷')}>÷</button>

          <button className={styles.btnNum} aria-label="7" onClick={() => handleDigit('7')}>7</button>
          <button className={styles.btnNum} aria-label="8" onClick={() => handleDigit('8')}>8</button>
          <button className={styles.btnNum} aria-label="9" onClick={() => handleDigit('9')}>9</button>
          <button className={styles.btnOp} aria-label="×" onClick={() => handleOperator('×')}>×</button>

          <button className={styles.btnNum} aria-label="4" onClick={() => handleDigit('4')}>4</button>
          <button className={styles.btnNum} aria-label="5" onClick={() => handleDigit('5')}>5</button>
          <button className={styles.btnNum} aria-label="6" onClick={() => handleDigit('6')}>6</button>
          <button className={styles.btnOp} aria-label="-" onClick={() => handleOperator('-')}>−</button>

          <button className={styles.btnNum} aria-label="1" onClick={() => handleDigit('1')}>1</button>
          <button className={styles.btnNum} aria-label="2" onClick={() => handleDigit('2')}>2</button>
          <button className={styles.btnNum} aria-label="3" onClick={() => handleDigit('3')}>3</button>
          <button className={styles.btnOp} aria-label="+" onClick={() => handleOperator('+')}>+</button>

          <button className={`${styles.btnNum} ${styles.btnZero}`} aria-label="0" onClick={() => handleDigit('0')}>0</button>
          <button className={styles.btnNum} aria-label="." onClick={() => handleDigit('.')}>.</button>
          <button className={styles.btnEquals} aria-label="=" onClick={handleEquals}>=</button>
        </div>
      </div>
    </PageShell>
  );
}
