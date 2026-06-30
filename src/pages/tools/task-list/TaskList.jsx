import { useEffect, useState } from 'react';
import PageShell from '../../../templates/PageShell/PageShell';
import styles from './TaskList.module.css';

const STORAGE_KEY = 'uh-task-list';

function readTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function TaskList({ page }) {
  const [tasks, setTasks] = useState(readTasks);
  const [draft, setDraft] = useState('');

  // Persist on every change — same per-browser pattern as favourites.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setTasks(prev => [...prev, { id: makeId(), text, done: false }]);
    setDraft('');
  };

  const toggleTask = (id) =>
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)));

  const deleteTask = (id) =>
    setTasks(prev => prev.filter(t => t.id !== id));

  const clearCompleted = () =>
    setTasks(prev => prev.filter(t => !t.done));

  const doneCount = tasks.filter(t => t.done).length;

  return (
    <PageShell page={page}>
      <div className={styles.layout}>
        <form className={styles.addRow} onSubmit={addTask}>
          <input
            type="text"
            className={styles.input}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            aria-label="New task"
            placeholder="e.g. Send the project update email"
          />
          <button type="submit" className={styles.addBtn}>Add</button>
        </form>

        {tasks.length === 0 ? (
          <p className={styles.empty}>No tasks yet — add one above to get started.</p>
        ) : (
          <>
            <ul className={styles.list}>
              {tasks.map(task => (
                <li key={task.id} className={styles.item}>
                  <button
                    type="button"
                    className={`${styles.toggle} ${task.done ? styles.toggleDone : ''}`}
                    onClick={() => toggleTask(task.id)}
                    aria-pressed={task.done}
                  >
                    <span className={styles.check} aria-hidden="true">{task.done ? '✓' : ''}</span>
                    <span className={styles.text}>{task.text}</span>
                  </button>
                  <button
                    type="button"
                    className={styles.delete}
                    onClick={() => deleteTask(task.id)}
                    aria-label={`Delete task: ${task.text}`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>

            <div className={styles.footer}>
              <span className={styles.count}>{doneCount} of {tasks.length} done</span>
              {doneCount > 0 && (
                <button type="button" className={styles.clearBtn} onClick={clearCompleted}>
                  Clear completed
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
}
