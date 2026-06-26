import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

function AllProviders({ children }) {
  return (
    <MemoryRouter>
      <ThemeProvider>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}

export function renderWithRouter(ui) {
  return render(ui, { wrapper: MemoryRouter });
}

export function renderWithProviders(ui) {
  return render(ui, { wrapper: AllProviders });
}

export * from '@testing-library/react';
