import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SinglePanelTemplate from './SinglePanelTemplate';

const mockPage = {
  id: 'number-base',
  title: 'Number Base Converter',
  description: 'Convert numbers between bases.',
  category: 'math',
  path: '/tools/number-base',
  keywords: [],
};

function renderTemplate(props = {}) {
  return render(
    <MemoryRouter>
      <SinglePanelTemplate page={mockPage} {...props} />
    </MemoryRouter>
  );
}

describe('SinglePanelTemplate', () => {
  it('renders page title', () => {
    renderTemplate();
    expect(screen.getByRole('heading', { level: 1, name: 'Number Base Converter' })).toBeInTheDocument();
  });

  it('renders children', () => {
    renderTemplate({ children: <div>Tool controls here</div> });
    expect(screen.getByText('Tool controls here')).toBeInTheDocument();
  });

  it('renders topControls', () => {
    renderTemplate({ topControls: <button>Mode</button> });
    expect(screen.getByRole('button', { name: 'Mode' })).toBeInTheDocument();
  });

  it('renders actions', () => {
    renderTemplate({ actions: <button>Convert</button> });
    expect(screen.getByRole('button', { name: 'Convert' })).toBeInTheDocument();
  });

  it('renders how-to-use steps', () => {
    renderTemplate({ howToUse: ['Enter a number', 'Pick target base'] });
    expect(screen.getByText('Enter a number')).toBeInTheDocument();
    expect(screen.getByText('Pick target base')).toBeInTheDocument();
  });
});
