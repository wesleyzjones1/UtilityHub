import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import ToolPage from './pages/ToolPage/ToolPage';
import NotFound from './pages/NotFound/NotFound';
import { PAGES } from './registry/pages';

import AddPunctuation from './pages/tools/add-punctuation/AddPunctuation';
import BoldText from './pages/tools/bold-text/BoldText';
import CaseConverter from './pages/tools/case-converter/CaseConverter';
import InlineColumnConverter from './pages/tools/inline-column-converter/InlineColumnConverter';
import ItalicText from './pages/tools/italic-text/ItalicText';
import RemoveAllWhitespace from './pages/tools/remove-all-whitespace/RemoveAllWhitespace';
import RemoveCharacter from './pages/tools/remove-character/RemoveCharacter';
import RemoveLineBreaks from './pages/tools/remove-line-breaks/RemoveLineBreaks';
import RemoveTextFormatting from './pages/tools/remove-text-formatting/RemoveTextFormatting';
import RemoveTrailingWhitespace from './pages/tools/remove-trailing-whitespace/RemoveTrailingWhitespace';
import ReverseText from './pages/tools/reverse-text/ReverseText';
import ReverseTextInWord from './pages/tools/reverse-text-in-word/ReverseTextInWord';
import ReverseWords from './pages/tools/reverse-words/ReverseWords';
import SortWords from './pages/tools/sort-words/SortWords';
import StrikethroughText from './pages/tools/strikethrough-text/StrikethroughText';
import TextCompare from './pages/tools/text-compare/TextCompare';
import WordCounter from './pages/tools/word-counter/WordCounter';
import WordFrequency from './pages/tools/word-frequency/WordFrequency';

const TOOL_COMPONENTS = {
  'add-punctuation':        AddPunctuation,
  'bold-text':              BoldText,
  'case-converter':         CaseConverter,
  'inline-column-converter': InlineColumnConverter,
  'italic-text':            ItalicText,
  'remove-all-whitespace':  RemoveAllWhitespace,
  'remove-character':       RemoveCharacter,
  'remove-line-breaks':     RemoveLineBreaks,
  'remove-text-formatting': RemoveTextFormatting,
  'remove-trailing-whitespace': RemoveTrailingWhitespace,
  'reverse-text':           ReverseText,
  'reverse-text-in-word':   ReverseTextInWord,
  'reverse-words':          ReverseWords,
  'sort-words':             SortWords,
  'strikethrough-text':     StrikethroughText,
  'text-compare':           TextCompare,
  'word-counter':           WordCounter,
  'word-frequency':         WordFrequency,
};

function buildRouter() {
  return createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
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
        <RouterProvider router={router} />
      </LanguageProvider>
    </ThemeProvider>
  );
}
