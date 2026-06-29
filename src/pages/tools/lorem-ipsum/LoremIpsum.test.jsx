import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import LoremIpsum from './LoremIpsum';

const PAGE = {
  id: 'lorem-ipsum',
  title: 'Lorem Ipsum Generator',
  description: 'Generate placeholder dummy text in various lengths.',
  category: 'text',
  path: '/tools/lorem-ipsum',
};

describe('LoremIpsum', () => {
  it('renders the title', () => {
    renderWithRouter(<LoremIpsum page={PAGE} />);
    expect(screen.getAllByText('Lorem Ipsum Generator').length).toBeGreaterThan(0);
  });

  it('output textarea has content on mount', () => {
    renderWithRouter(<LoremIpsum page={PAGE} />);
    const textarea = screen.getByRole('textbox', { name: /generated text/i });
    expect(textarea.value.length).toBeGreaterThan(0);
  });

  it('selecting Words type and clicking Generate shows lorem ipsum words', async () => {
    const user = userEvent.setup();
    renderWithRouter(<LoremIpsum page={PAGE} />);
    await user.selectOptions(screen.getByRole('combobox', { name: /output type/i }), 'words');
    const countInput = screen.getByRole('spinbutton', { name: /count/i });
    await user.clear(countInput);
    await user.type(countInput, '30');
    await user.click(screen.getByRole('button', { name: /generate text/i }));
    const textarea = screen.getByRole('textbox', { name: /generated text/i });
    expect(textarea.value.trim().length).toBeGreaterThan(0);
    expect(textarea.value.toLowerCase()).toMatch(/[a-z]+/);
  });

  it('1 sentence is shorter than 3 paragraphs', async () => {
    const user = userEvent.setup();
    renderWithRouter(<LoremIpsum page={PAGE} />);

    await user.selectOptions(screen.getByRole('combobox', { name: /output type/i }), 'sentences');
    const countInput = screen.getByRole('spinbutton', { name: /count/i });
    await user.clear(countInput);
    await user.type(countInput, '1');
    await user.click(screen.getByRole('button', { name: /generate text/i }));
    const sentenceOutput = screen.getByRole('textbox', { name: /generated text/i }).value;

    await user.selectOptions(screen.getByRole('combobox', { name: /output type/i }), 'paragraphs');
    await user.clear(countInput);
    await user.type(countInput, '3');
    await user.click(screen.getByRole('button', { name: /generate text/i }));
    const paraOutput = screen.getByRole('textbox', { name: /generated text/i }).value;

    expect(sentenceOutput.length).toBeLessThan(paraOutput.length);
  });
});
