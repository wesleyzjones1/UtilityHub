import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import TaskList from './TaskList';

const PAGE = {
  id: 'task-list', title: 'Task List',
  description: 'Write a quick to-do list.', category: 'time', path: '/tools/task-list',
};

let store = {};

beforeEach(() => {
  store = {};
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn(key => store[key] ?? null),
      setItem: vi.fn((key, val) => { store[key] = val; }),
      removeItem: vi.fn(key => { delete store[key]; }),
    },
    writable: true,
    configurable: true,
  });
});

async function addTask(user, text) {
  await user.type(screen.getByLabelText('New task'), text);
  await user.click(screen.getByRole('button', { name: 'Add' }));
}

describe('TaskList', () => {
  it('renders the title', () => {
    renderWithRouter(<TaskList page={PAGE} />);
    expect(screen.getAllByText('Task List').length).toBeGreaterThan(0);
  });

  it('adds a task and shows it in the list', async () => {
    const user = userEvent.setup();
    renderWithRouter(<TaskList page={PAGE} />);
    await addTask(user, 'Buy milk');
    expect(screen.getByText('Buy milk')).toBeDefined();
    expect(screen.getByText('0 of 1 done')).toBeDefined();
  });

  it('toggles a task done and back', async () => {
    const user = userEvent.setup();
    renderWithRouter(<TaskList page={PAGE} />);
    await addTask(user, 'Buy milk');
    const toggle = screen.getByRole('button', { name: 'Buy milk' });
    await user.click(toggle);
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByText('1 of 1 done')).toBeDefined();
    await user.click(toggle);
    expect(toggle.getAttribute('aria-pressed')).toBe('false');
  });

  it('deletes a task', async () => {
    const user = userEvent.setup();
    renderWithRouter(<TaskList page={PAGE} />);
    await addTask(user, 'Buy milk');
    await user.click(screen.getByRole('button', { name: 'Delete task: Buy milk' }));
    expect(screen.queryByText('Buy milk')).toBeNull();
  });

  it('persists tasks to localStorage', async () => {
    const user = userEvent.setup();
    renderWithRouter(<TaskList page={PAGE} />);
    await addTask(user, 'Buy milk');
    expect(store['uh-task-list']).toContain('Buy milk');
  });

  it('survives a full unmount and remount (e.g. navigating away and back, or reloading)', async () => {
    const user = userEvent.setup();
    const { unmount } = renderWithRouter(<TaskList page={PAGE} />);
    await addTask(user, 'Buy milk');
    await user.click(screen.getByRole('button', { name: 'Buy milk' }));

    // Tear down the component entirely, without touching the backing store —
    // this is what actually proves persistence, not just that setItem fired.
    unmount();
    cleanup();

    renderWithRouter(<TaskList page={PAGE} />);
    expect(screen.getByText('Buy milk')).toBeDefined();
    expect(screen.getByText('1 of 1 done')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Buy milk' }).getAttribute('aria-pressed')).toBe('true');
  });
});
