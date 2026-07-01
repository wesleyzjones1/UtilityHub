import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
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

  it('renders attenuation, shunt, and series inputs', () => {
    renderWithRouter(<PiAttenuator page={PAGE} />);
    expect(screen.getByRole('spinbutton', { name: /attenuation db/i })).toBeDefined();
    expect(screen.getByRole('spinbutton', { name: /r shunt/i })).toBeDefined();
    expect(screen.getByRole('spinbutton', { name: /r series/i })).toBeDefined();
  });

  it('fills the matched resistors from a 6 dB target at 50 Ω', () => {
    renderWithRouter(<PiAttenuator page={PAGE} />);
    fireEvent.change(screen.getByRole('spinbutton', { name: /attenuation db/i }), { target: { value: '6' } });
    expect(screen.getByRole('spinbutton', { name: /r shunt/i }).value).toBe('150.5');
    expect(screen.getByRole('spinbutton', { name: /r series/i }).value).toBe('37.4');
  });

  it('computes attenuation from both shunt and series resistors', () => {
    renderWithRouter(<PiAttenuator page={PAGE} />);
    fireEvent.change(screen.getByRole('spinbutton', { name: /r shunt/i }), { target: { value: '150.5' } });
    fireEvent.change(screen.getByRole('spinbutton', { name: /r series/i }), { target: { value: '37.4' } });
    expect(screen.getByRole('spinbutton', { name: /attenuation db/i }).value).toBe('6');
  });

  it('updates the gain when only the series resistor changes', () => {
    renderWithRouter(<PiAttenuator page={PAGE} />);
    // Start from the matched 6 dB design, then change series independently.
    fireEvent.change(screen.getByRole('spinbutton', { name: /attenuation db/i }), { target: { value: '6' } });
    fireEvent.change(screen.getByRole('spinbutton', { name: /r series/i }), { target: { value: '100' } });
    // Shunt is preserved; gain recomputes from both resistors.
    expect(screen.getByRole('spinbutton', { name: /r shunt/i }).value).toBe('150.5');
    expect(screen.getByRole('spinbutton', { name: /attenuation db/i }).value).toBe('9.8');
  });

  it('shows an error for a 0 dB target', () => {
    renderWithRouter(<PiAttenuator page={PAGE} />);
    fireEvent.change(screen.getByRole('spinbutton', { name: /attenuation db/i }), { target: { value: '0' } });
    expect(screen.getByRole('alert')).toBeDefined();
  });

  it('renders the diagram', () => {
    renderWithRouter(<PiAttenuator page={PAGE} />);
    expect(screen.getByRole('img', { name: /pi network/i })).toBeDefined();
  });
});
