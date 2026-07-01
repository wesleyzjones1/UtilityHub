import { useState } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AdPreferenceProvider } from './context/AdPreferenceContext';
import { SupportProvider } from './context/SupportContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { CountdownProvider } from './context/CountdownContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import CategoryPage from './pages/CategoryPage/CategoryPage';
import ToolPage from './pages/ToolPage/ToolPage';
import NotFound from './pages/NotFound/NotFound';
import { PAGES } from './registry/pages';
import { TOOL_COMPONENTS } from './registry/toolComponents';

function buildRouter() {
  return createHashRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: '/tools/category/:categoryId', element: <CategoryPage /> },
        ...PAGES.map(page => {
          const Component = TOOL_COMPONENTS[page.id] ?? ToolPage;
          return {
            path: page.path,
            element: <Component page={page} />,
          };
        }),
        { path: '*', element: <NotFound /> },
      ],
    },
  ]);
}

export default function App() {
  // Lazy-init so each mount reads the current URL (needed for test isolation).
  const [router] = useState(buildRouter);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AdPreferenceProvider>
          <FavoritesProvider>
            <SupportProvider>
              <CountdownProvider>
                <RouterProvider router={router} />
              </CountdownProvider>
            </SupportProvider>
          </FavoritesProvider>
        </AdPreferenceProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
