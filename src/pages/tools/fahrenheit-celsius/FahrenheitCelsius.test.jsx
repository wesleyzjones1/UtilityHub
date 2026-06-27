import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import FahrenheitCelsius from './FahrenheitCelsius';

const PAGE = {
  id: 'fahrenheit-celsius', title: 'Fahrenheit to Celsius',
  description: 'Convert temperatures.', category: 'math',
  path: '/tools/fahrenheit-celsius',
};

describe('FahrenheitCelsius', () => {
  it('renders title', () => {
    renderWithRouter(<FahrenheitCelsius page={PAGE} />);
    expect(screen.getAllByText('Fahrenheit to Celsius').length).toBeGreaterThan(0);
  });

  it('renders Fahrenheit, Celsius, and Kelvin inputs', () => {
    renderWithRouter(<FahrenheitCelsius page={PAGE} />);
    expect(screen.getByRole('spinbutton', { name: /fahrenheit/i })).toBeDefined();
    expect(screen.getByRole('spinbutton', { name: /celsius/i })).toBeDefined();
    expect(screen.getByRole('spinbutton', { name: /kelvin/i })).toBeDefined();
  });

  it('converts 32°F to 0°C', async () => {
    const user = userEvent.setup();
    renderWithRouter(<FahrenheitCelsius page={PAGE} />);
    await user.type(screen.getByRole('spinbutton', { name: /fahrenheit/i }), '32');
    expect(screen.getByRole('spinbutton', { name: /celsius/i }).value).toBe('0');
  });

  it('converts 0°C to 32°F', async () => {
    const user = userEvent.setup();
    renderWithRouter(<FahrenheitCelsius page={PAGE} />);
    await user.type(screen.getByRole('spinbutton', { name: /celsius/i }), '0');
    expect(screen.getByRole('spinbutton', { name: /fahrenheit/i }).value).toBe('32');
  });

  it('shows Kelvin when °C is entered', async () => {
    const user = userEvent.setup();
    renderWithRouter(<FahrenheitCelsius page={PAGE} />);
    await user.type(screen.getByRole('spinbutton', { name: /celsius/i }), '0');
    expect(screen.getByRole('spinbutton', { name: /kelvin/i }).value).toBe('273.15');
  });

  it('clears other fields when input is empty', async () => {
    const user = userEvent.setup();
    renderWithRouter(<FahrenheitCelsius page={PAGE} />);
    const fInput = screen.getByRole('spinbutton', { name: /fahrenheit/i });
    await user.type(fInput, '32');
    await user.clear(fInput);
    expect(screen.getByRole('spinbutton', { name: /celsius/i }).value).toBe('');
  });
});
