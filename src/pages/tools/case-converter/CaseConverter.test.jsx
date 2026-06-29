import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import CaseConverter from './CaseConverter';

const PAGE = {
  id: 'case-converter', title: 'Case Converter',
  description: 'Convert text between cases.', category: 'text',
  path: '/tools/case-converter',
};

function render() {
  return renderWithRouter(<CaseConverter page={PAGE} />);
}

describe('CaseConverter', () => {
  it('renders the page title', () => {
    render();
    expect(screen.getAllByText('Case Converter').length).toBeGreaterThan(0);
  });

  it('renders input and output textareas', () => {
    render();
    expect(screen.getByRole('textbox', { name: /input/i })).toBeDefined();
    expect(screen.getByRole('textbox', { name: /converted/i })).toBeDefined();
  });

  it('converts to uppercase by default', async () => {
    const user = userEvent.setup();
    render();
    await user.type(screen.getByRole('textbox', { name: /input/i }), 'hello');
    expect(screen.getByRole('textbox', { name: /converted/i }).value).toBe('HELLO');
  });

  it('converts to lowercase when selected', async () => {
    const user = userEvent.setup();
    render();
    await user.click(screen.getByRole('button', { name: /lower case/i }));
    await user.type(screen.getByRole('textbox', { name: /input/i }), 'HELLO');
    expect(screen.getByRole('textbox', { name: /converted/i }).value).toBe('hello');
  });

  it('converts to title case', async () => {
    const user = userEvent.setup();
    render();
    await user.click(screen.getByRole('button', { name: /title case/i }));
    await user.type(screen.getByRole('textbox', { name: /input/i }), 'hello world');
    expect(screen.getByRole('textbox', { name: /converted/i }).value).toBe('Hello World');
  });

  it('shows empty output for empty input', () => {
    render();
    expect(screen.getByRole('textbox', { name: /converted/i }).value).toBe('');
  });
});
