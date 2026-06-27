import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '../../../test-utils';
import IcoCreator from './IcoCreator';

const PAGE = {
  id: 'ico-creator', title: 'ICO Creator', description: 'Create .ico files.',
  category: 'image', path: '/tools/ico-creator',
};

describe('IcoCreator', () => {
  it('renders title', () => {
    renderWithRouter(<IcoCreator page={PAGE} />);
    expect(screen.getAllByText('ICO Creator').length).toBeGreaterThan(0);
  });

  it('renders drop zone', () => {
    renderWithRouter(<IcoCreator page={PAGE} />);
    expect(screen.getByText(/drop an image here/i)).toBeDefined();
  });

  it('renders how-to steps', () => {
    renderWithRouter(<IcoCreator page={PAGE} />);
    expect(screen.getByText(/drop any image/i)).toBeDefined();
  });
});
