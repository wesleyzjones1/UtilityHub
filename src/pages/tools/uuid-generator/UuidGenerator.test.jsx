import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import UuidGenerator from './UuidGenerator';

const PAGE = {
  id: 'uuid-generator', title: 'UUID Generator',
  description: 'Generate UUIDs.', category: 'web', path: '/tools/uuid-generator',
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('UuidGenerator', () => {
  it('renders the title', () => {
    renderWithRouter(<UuidGenerator page={PAGE} />);
    expect(screen.getAllByText('UUID Generator').length).toBeGreaterThan(0);
  });

  it('renders a valid v4 UUID on first render', () => {
    renderWithRouter(<UuidGenerator page={PAGE} />);
    const codes = document.querySelectorAll('code');
    expect(codes.length).toBeGreaterThan(0);
    expect(codes[0].textContent).toMatch(UUID_RE);
  });

  it('generates the requested number of UUIDs', async () => {
    const user = userEvent.setup();
    renderWithRouter(<UuidGenerator page={PAGE} />);
    await user.selectOptions(screen.getByLabelText('Count'), '10');
    await user.click(screen.getByRole('button', { name: 'Generate' }));
    expect(document.querySelectorAll('code').length).toBe(10);
  });

  it('shows a "Copy all" button when multiple UUIDs are generated', async () => {
    const user = userEvent.setup();
    renderWithRouter(<UuidGenerator page={PAGE} />);
    await user.selectOptions(screen.getByLabelText('Count'), '5');
    await user.click(screen.getByRole('button', { name: 'Generate' }));
    expect(screen.getByRole('button', { name: /copy all/i })).toBeDefined();
  });

  it('generates unique values', async () => {
    const user = userEvent.setup();
    renderWithRouter(<UuidGenerator page={PAGE} />);
    await user.selectOptions(screen.getByLabelText('Count'), '25');
    await user.click(screen.getByRole('button', { name: 'Generate' }));
    const values = [...document.querySelectorAll('code')].map(c => c.textContent);
    expect(new Set(values).size).toBe(values.length);
  });
});
