import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '../../../test-utils';
import UnixTimestamp from './UnixTimestamp';

const PAGE = { id: 'unix-timestamp', title: 'Unix Timestamp Converter', description: 'Convert Unix epoch timestamps to human-readable dates and back.', category: 'time', path: '/tools/unix-timestamp' };

describe('UnixTimestamp', () => {
  it('renders the title', () => {
    renderWithRouter(<UnixTimestamp page={PAGE} />);
    expect(screen.getAllByText('Unix Timestamp Converter').length).toBeGreaterThan(0);
  });

  it('epoch input has a numeric value', () => {
    renderWithRouter(<UnixTimestamp page={PAGE} />);
    const input = screen.getByLabelText('Unix timestamp');
    expect(input.value).not.toBe('');
    expect(isNaN(Number(input.value))).toBe(false);
  });

  it('shows UTC text in the document', () => {
    renderWithRouter(<UnixTimestamp page={PAGE} />);
    expect(screen.getByText('UTC')).toBeDefined();
  });

  it('current timestamp button exists', () => {
    renderWithRouter(<UnixTimestamp page={PAGE} />);
    expect(screen.getByText('Current timestamp')).toBeDefined();
  });
});
