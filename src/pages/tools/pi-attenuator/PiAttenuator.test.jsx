import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import PiAttenuator from './PiAttenuator';

const PAGE = {
  id: 'pi-attenuator', title: 'Pi Attenuator Calculator',
  description: 'Calculate Pi attenuator resistor values.', category: 'math',
  path: '/tools/pi-attenuator',
};

describe('PiAttenuator', () => {
  it('renders title', () => {
    renderWithRouter(<PiAttenuator page={PAGE} />);
    expect(screen.getAllByText('Pi Attenuator Calculator').length).toBeGreaterThan(0);
  });

  it('renders Inputs and Results sections', () => {
    renderWithRouter(<PiAttenuator page={PAGE} />);
    expect(screen.getByRole('region', { name: /inputs/i })).toBeDefined();
    expect(screen.getByRole('region', { name: /results/i })).toBeDefined();
  });

  it('calculates resistors for 6 dB at 50 Ω', () => {
    renderWithRouter(<PiAttenuator page={PAGE} />);
    const dbInput = screen.getByRole('spinbutton', { name: /attenuation db/i });
    fireEvent.change(dbInput, { target: { value: '6' } });
    const results = screen.getByRole('region', { name: /results/i });
    expect(results.textContent).toContain('R Shunt');
    expect(results.textContent).toContain('R Series');
  });

  it('renders the diagram section', () => {
    renderWithRouter(<PiAttenuator page={PAGE} />);
    expect(screen.getByRole('region', { name: /diagram/i })).toBeDefined();
  });

  it('shows error for 0 dB', () => {
    renderWithRouter(<PiAttenuator page={PAGE} />);
    const dbInput = screen.getByRole('spinbutton', { name: /attenuation db/i });
    fireEvent.change(dbInput, { target: { value: '0' } });
    expect(screen.getByRole('alert')).toBeDefined();
  });

  it('reverse mode: shows dB from resistors', async () => {
    renderWithRouter(<PiAttenuator page={PAGE} />);
    const modeSelect = screen.getByRole('combobox', { name: /direction/i });
    await userEvent.selectOptions(modeSelect, 'reverse');
    fireEvent.change(screen.getByRole('spinbutton', { name: /r shunt/i }), { target: { value: '150' } });
    fireEvent.change(screen.getByRole('spinbutton', { name: /r series/i }), { target: { value: '17' } });
    const results = screen.getByRole('region', { name: /results/i });
    expect(results.textContent).toContain('Attenuation');
  });
});
