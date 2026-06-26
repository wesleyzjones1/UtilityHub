import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import RemoveCharacter from './RemoveCharacter';

const PAGE = {
  id: 'remove-character', title: 'Remove Character',
  description: 'Remove characters.', category: 'text',
  path: '/tools/remove-character',
};

describe('RemoveCharacter', () => {
  it('renders title', () => {
    renderWithRouter(<RemoveCharacter page={PAGE} />);
    expect(screen.getAllByText('Remove Character').length).toBeGreaterThan(0);
  });

  it('removes specified character from input', async () => {
    const user = userEvent.setup();
    renderWithRouter(<RemoveCharacter page={PAGE} />);
    await user.type(screen.getByRole('textbox', { name: /input/i }), 'hello!');
    await user.type(screen.getByRole('textbox', { name: /characters to remove/i }), '!');
    expect(screen.getByRole('textbox', { name: /cleaned/i }).value).toBe('hello');
  });

  it('shows input unchanged when no chars specified', async () => {
    const user = userEvent.setup();
    renderWithRouter(<RemoveCharacter page={PAGE} />);
    await user.type(screen.getByRole('textbox', { name: /input/i }), 'hello');
    expect(screen.getByRole('textbox', { name: /cleaned/i }).value).toBe('hello');
  });

  it('renders case sensitive toggle', () => {
    renderWithRouter(<RemoveCharacter page={PAGE} />);
    expect(screen.getByRole('switch')).toBeDefined();
  });
});
