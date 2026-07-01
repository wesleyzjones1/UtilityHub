import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '../../test-utils';
import ToolPreview from './ToolPreview';

const PAGE = {
  id: 'percentage-calc',
  title: 'Percentage Calculator',
  description: 'Calculate percentages, percentage change, and ratios.',
  category: 'math',
  path: '/tools/percentage-calc',
};

const RECT = { top: 100, left: 100, right: 340, bottom: 130 };

describe('ToolPreview', () => {
  it('renders the description caption and a live snapshot of the tool', () => {
    renderWithRouter(<ToolPreview page={PAGE} rect={RECT} />);
    // Description caption is shown.
    expect(screen.getByText(/Calculate percentages/)).toBeDefined();
    // The live tool content renders (percentage-calc inputs).
    expect(screen.getByLabelText('Percent')).toBeDefined();
    // The page title is NOT shown — removed from the card and stripped by preview mode.
    expect(screen.queryByText('Percentage Calculator')).toBeNull();
  });

  it('renders nothing when there is no page', () => {
    const { container } = renderWithRouter(<ToolPreview page={null} rect={null} />);
    expect(container.firstChild).toBeNull();
  });
});
