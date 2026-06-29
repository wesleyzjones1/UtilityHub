import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../test-utils';
import DualPanelTemplate from './DualPanelTemplate';

const mockPage = {
  id: 'case-converter',
  title: 'Case Converter',
  description: 'Convert text between cases.',
  category: 'text',
  path: '/tools/case-converter',
  keywords: [],
};

function renderTemplate(props = {}) {
  return renderWithRouter(<DualPanelTemplate page={mockPage} {...props} />);
}

describe('DualPanelTemplate', () => {
  it('renders page title', () => {
    renderTemplate();
    expect(screen.getByRole('heading', { level: 1, name: 'Case Converter' })).toBeInTheDocument();
  });

  it('renders input textarea', () => {
    renderTemplate({ input: 'hello world' });
    const inputs = screen.getAllByRole('textbox');
    expect(inputs[0].value).toBe('hello world');
  });

  it('renders output textarea as readonly', () => {
    renderTemplate({ output: 'HELLO WORLD' });
    const textareas = screen.getAllByRole('textbox');
    const readOnly = textareas.find(t => t.readOnly);
    expect(readOnly.value).toBe('HELLO WORLD');
  });

  it('calls onInputChange when user types', async () => {
    const user = userEvent.setup();
    const onInputChange = vi.fn();
    renderTemplate({ input: '', onInputChange });
    const inputTextarea = screen.getAllByRole('textbox')[0];
    await user.type(inputTextarea, 'a');
    expect(onInputChange).toHaveBeenCalled();
  });

  it('shows copy button when output is non-empty', () => {
    renderTemplate({ output: 'some output' });
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
  });

  it('does not show copy button when output is empty', () => {
    renderTemplate({ output: '' });
    expect(screen.queryByRole('button', { name: 'Copy' })).not.toBeInTheDocument();
  });

  it('renders topControls', () => {
    renderTemplate({ topControls: <button>Options</button> });
    expect(screen.getByRole('button', { name: 'Options' })).toBeInTheDocument();
  });

  it('renders actions', () => {
    renderTemplate({ actions: <button>Clear</button> });
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
  });

  it('renders custom input/output labels', () => {
    renderTemplate({ inputLabel: 'Raw JSON', outputLabel: 'Pretty JSON' });
    expect(screen.getByRole('textbox', { name: 'Raw JSON' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Pretty JSON' })).toBeInTheDocument();
  });

  it('renders how-to-use steps', () => {
    renderTemplate({ howToUse: ['Paste JSON', 'Click format'] });
    expect(screen.getByText('Paste JSON')).toBeInTheDocument();
  });
});
