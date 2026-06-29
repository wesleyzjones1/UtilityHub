import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AdPreferenceProvider } from './context/AdPreferenceContext';
import { SupportProvider } from './context/SupportContext';
import { FavoritesProvider } from './context/FavoritesContext';

function AllProviders({ children }) {
  return (
    <MemoryRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AdPreferenceProvider>
            <FavoritesProvider>
              <SupportProvider>
                {children}
              </SupportProvider>
            </FavoritesProvider>
          </AdPreferenceProvider>
        </LanguageProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}

export function renderWithRouter(ui) {
  return render(ui, { wrapper: AllProviders });
}

export function renderWithProviders(ui) {
  return render(ui, { wrapper: AllProviders });
}

export * from '@testing-library/react';
