import { useCallback, useEffect, useRef, useState } from 'react';
import PageShell from '../../../templates/PageShell/PageShell';
import styles from './CountdownTimer.module.css';

const HOW_TO_USE = [
  'Type a number of minutes (e.g. 5 for five minutes, or 0.5 for 30 seconds).',
  'Press Enter or click Start to begin the full-screen countdown.',
  'Press Space or click the timer to pause and resume.',
  'Press Escape at any time to stop and return to the input.',
];

/** Parse input string → total seconds, or null if invalid. */
function parseInput(raw) {
  const s = raw.trim();
  if (!s) return null;

  // MM:SS or H:MM:SS formats
  if (/^\d+:\d{2}(:\d{2})?$/.test(s)) {
    const parts = s.split(':').map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return parts[0] * 60 + parts[1];
  }

  // Plain number → minutes
  const n = parseFloat(s);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n * 60);
}

/** Format total seconds → "MM:SS" or "H:MM:SS". */
function formatTime(total) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export default function CountdownTimer({ page }) {
  const [input, setInput] = useState('');
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  // 'idle' | 'running' | 'paused' | 'done'
  const [phase, setPhase] = useState('idle');
  const inputRef = useRef(null);

  // Tick
  useEffect(() => {
    if (phase !== 'running') return;
    if (secondsLeft <= 0) { setPhase('done'); return; }
    const id = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) { setPhase('done'); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase, secondsLeft]);

  const stop = useCallback(() => {
    setPhase('idle');
    setSecondsLeft(0);
    setTotalSeconds(0);
    // Re-focus input after stopping
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  // Keyboard controls for the overlay
  useEffect(() => {
    if (phase === 'idle') return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        stop();
      } else if (e.key === ' ' && (phase === 'running' || phase === 'paused')) {
        e.preventDefault();
        setPhase(p => p === 'running' ? 'paused' : 'running');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, stop]);

  function start() {
    const secs = parseInput(input);
    if (!secs) return;
    setTotalSeconds(secs);
    setSecondsLeft(secs);
    setPhase('running');
  }

  function handleSubmit(e) {
    e.preventDefault();
    start();
  }

  function togglePause() {
    setPhase(p => p === 'running' ? 'paused' : 'running');
  }

  // Progress 0→1 for the ring
  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 1;
  const isDone = phase === 'done';
  const isOverlay = phase !== 'idle';

  // SVG ring
  const R = 120;
  const C = 2 * Math.PI * R;
  const dash = C * progress;

  return (
    <>
      {/* Full-screen overlay when running/paused/done */}
      {isOverlay && (
        <div
          className={`${styles.overlay} ${isDone ? styles.overlayDone : ''}`}
          role="dialog"
          aria-label="Countdown timer"
          aria-live="polite"
        >
          <div className={styles.overlayCenter}>
            <button
              className={styles.timerBtn}
              onClick={isDone ? undefined : togglePause}
              aria-label={phase === 'running' ? 'Pause timer' : phase === 'paused' ? 'Resume timer' : undefined}
              disabled={isDone}
            >
              {/* Progress ring */}
              {!isDone && (
                <svg className={styles.ring} viewBox="0 0 280 280" overflow="visible" aria-hidden="true">
                  <circle cx="140" cy="140" r={R} className={styles.ringTrack} />
                  <circle
                    cx="140"
                    cy="140"
                    r={R}
                    className={styles.ringProgress}
                    style={{
                      strokeDasharray: `${dash} ${C}`,
                      transform: 'rotate(-90deg)',
                      transformOrigin: '50% 50%',
                    }}
                  />
                </svg>
              )}

              <div className={styles.timeDisplay}>
                {isDone ? (
                  <span className={styles.doneText}>Time's up!</span>
                ) : (
                  <>
                    <span className={styles.time}>{formatTime(secondsLeft)}</span>
                    {phase === 'paused' && (
                      <span className={styles.pausedLabel}>Paused</span>
                    )}
                  </>
                )}
              </div>
            </button>
          </div>

          <div className={styles.overlayControls}>
            {isDone ? (
              <button className={styles.restartBtn} onClick={() => {
                setSecondsLeft(totalSeconds);
                setPhase('running');
              }}>
                Restart
              </button>
            ) : (
              <button className={styles.pauseControl} onClick={togglePause}>
                {phase === 'running' ? 'Pause' : 'Resume'}
              </button>
            )}
            <button className={styles.stopBtn} onClick={stop}>
              Stop
            </button>
          </div>

        </div>
      )}

      {/* Setup screen (always rendered, hidden behind overlay) */}
      <PageShell page={page} howToUse={HOW_TO_USE}>
        <div className={styles.setup}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label htmlFor="timer-input" className={styles.inputLabel}>
              Enter time in minutes
            </label>
            <div className={styles.inputRow}>
              <input
                id="timer-input"
                ref={inputRef}
                type="text"
                className={styles.input}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="e.g. 5"
                aria-label="Timer duration in minutes"
                autoComplete="off"
                inputMode="decimal"
              />
              <button
                type="submit"
                className={styles.startBtn}
                disabled={!parseInput(input)}
                aria-label="Start countdown"
              >
                Start
              </button>
            </div>
            <p className={styles.hint}>
              Examples: <button type="button" className={styles.exampleBtn} onClick={() => setInput('1')}>1 min</button>
              <button type="button" className={styles.exampleBtn} onClick={() => setInput('5')}>5 min</button>
              <button type="button" className={styles.exampleBtn} onClick={() => setInput('25')}>25 min</button>
              <button type="button" className={styles.exampleBtn} onClick={() => setInput('0:30')}>30 sec</button>
            </p>
          </form>
        </div>
      </PageShell>
    </>
  );
}
