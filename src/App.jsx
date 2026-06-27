import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { ProProvider } from './context/ProContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import CategoryPage from './pages/CategoryPage/CategoryPage';
import ToolPage from './pages/ToolPage/ToolPage';
import NotFound from './pages/NotFound/NotFound';
import { PAGES } from './registry/pages';

import AddPunctuation from './pages/tools/add-punctuation/AddPunctuation';
import IcoCreator from './pages/tools/ico-creator/IcoCreator';
import ImageCropper from './pages/tools/image-cropper/ImageCropper';
import ImageResizer from './pages/tools/image-resizer/ImageResizer';
import JpgToPng from './pages/tools/jpg-to-png/JpgToPng';
import PngMinifier from './pages/tools/png-minifier/PngMinifier';
import PngToJpg from './pages/tools/png-to-jpg/PngToJpg';
import SvgToPng from './pages/tools/svg-to-png/SvgToPng';
import ArrayFormatter from './pages/tools/array-formatter/ArrayFormatter';
import BaseConverter from './pages/tools/base-converter/BaseConverter';
import CssMinifier from './pages/tools/css-minifier/CssMinifier';
import DistanceConverter from './pages/tools/distance-converter/DistanceConverter';
import EngineeringCheatSheet from './pages/tools/engineering-cheat-sheet/EngineeringCheatSheet';
import FahrenheitCelsius from './pages/tools/fahrenheit-celsius/FahrenheitCelsius';
import HtmlFormatter from './pages/tools/html-formatter/HtmlFormatter';
import JsFormatter from './pages/tools/js-formatter/JsFormatter';
import JsonFormatter from './pages/tools/json-formatter/JsonFormatter';
import JsonTextFormatter from './pages/tools/json-text-formatter/JsonTextFormatter';
import MarkdownPreview from './pages/tools/markdown-preview/MarkdownPreview';
import MarkdownTable from './pages/tools/markdown-table/MarkdownTable';
import NumberSorter from './pages/tools/number-sorter/NumberSorter';
import PiAttenuator from './pages/tools/pi-attenuator/PiAttenuator';
import TypescriptFormatter from './pages/tools/typescript-formatter/TypescriptFormatter';
import XmlFormatter from './pages/tools/xml-formatter/XmlFormatter';
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
  'array-formatter':        ArrayFormatter,
  'base-converter':         BaseConverter,
  'css-minifier':           CssMinifier,
  'ico-creator':            IcoCreator,
  'image-cropper':          ImageCropper,
  'image-resizer':          ImageResizer,
  'jpg-to-png':             JpgToPng,
  'png-minifier':           PngMinifier,
  'png-to-jpg':             PngToJpg,
  'svg-to-png':             SvgToPng,
  'distance-converter':     DistanceConverter,
  'engineering-cheat-sheet': EngineeringCheatSheet,
  'fahrenheit-celsius':     FahrenheitCelsius,
  'html-formatter':         HtmlFormatter,
  'js-formatter':           JsFormatter,
  'json-formatter':         JsonFormatter,
  'json-text-formatter':    JsonTextFormatter,
  'markdown-preview':       MarkdownPreview,
  'markdown-table':         MarkdownTable,
  'number-sorter':          NumberSorter,
  'pi-attenuator':          PiAttenuator,
  'typescript-formatter':   TypescriptFormatter,
  'xml-formatter':          XmlFormatter,
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
        <ProProvider>
          <RouterProvider router={router} />
        </ProProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
