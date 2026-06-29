import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import TextCompare from './TextCompare';

const PAGE = {
  id: 'text-compare', title: 'Text Compare',
  description: 'Compare two texts.', category: 'text',
  path: '/tools/text-compare',
};

function render() {
  return renderWithRouter(<TextCompare page={PAGE} />);
}

describe('TextCompare', () => {
  it('renders the page title', () => {
    render();
    expect(screen.getAllByText('Text Compare').length).toBeGreaterThan(0);
  });

  it('renders two input textareas', () => {
    render();
    expect(screen.getByRole('textbox', { name: /original/i })).toBeDefined();
    expect(screen.getByRole('textbox', { name: /modified/i })).toBeDefined();
  });

  it('shows empty hint when both panels are empty', () => {
    render();
    expect(screen.getByText(/enter text in both panels/i)).toBeDefined();
  });

  it('shows "identical" status when texts match', async () => {
    const user = userEvent.setup();
    render();
    await user.type(screen.getByRole('textbox', { name: /original/i }), 'hello');
    await user.type(screen.getByRole('textbox', { name: /modified/i }), 'hello');
    expect(screen.getByText(/texts are identical/i)).toBeDefined();
  });

  it('shows diff output when texts differ', async () => {
    const user = userEvent.setup();
    render();
    await user.type(screen.getByRole('textbox', { name: /original/i }), 'hello');
    await user.type(screen.getByRole('textbox', { name: /modified/i }), 'world');
    expect(screen.getByRole('region', { name: /diff output/i })).toBeDefined();
  });

  it('shows stats bar for different texts', async () => {
    const user = userEvent.setup();
    render();
    await user.type(screen.getByRole('textbox', { name: /original/i }), 'hello');
    await user.type(screen.getByRole('textbox', { name: /modified/i }), 'world');
    const statsBar = screen.getByRole('status');
    expect(within(statsBar).getByText(/removed/i)).toBeDefined();
    expect(within(statsBar).getByText(/added/i)).toBeDefined();
  });

  it('detects case-only differences', async () => {
    const user = userEvent.setup();
    render();
    await user.type(screen.getByRole('textbox', { name: /original/i }), 'Hello World');
    await user.type(screen.getByRole('textbox', { name: /modified/i }), 'hello world');
    expect(screen.getByText(/case changes/i)).toBeDefined();
  });

  it('hides diff when one panel is empty', async () => {
    const user = userEvent.setup();
    render();
    await user.type(screen.getByRole('textbox', { name: /original/i }), 'hello');
    expect(screen.queryByLabelText(/diff output/i)).toBeNull();
  });
});
