import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '../../../test-utils';
import RemoveBackground from './RemoveBackground';

const PAGE = {
  id: 'remove-background', title: 'Remove Background',
  description: 'Remove a simple background.', category: 'image',
  path: '/tools/remove-background',
};

describe('RemoveBackground', () => {
  it('renders title', () => {
    renderWithRouter(<RemoveBackground page={PAGE} />);
    expect(screen.getAllByText('Remove Background').length).toBeGreaterThan(0);
  });

  it('renders the drop zone', () => {
    renderWithRouter(<RemoveBackground page={PAGE} />);
    expect(screen.getAllByText(/drop an image here/i).length).toBeGreaterThan(0);
  });
});
