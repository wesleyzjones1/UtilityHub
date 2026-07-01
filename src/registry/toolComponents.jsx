/**
 * Maps each tool's registry id → its React component. Single source shared by
 * the router (App.jsx) and the navbar hover preview (ToolPreview), so a live
 * snapshot of any tool can be rendered without duplicating this wiring.
 *
 * Tools absent here fall back to the "coming soon" placeholder in the router.
 */
import AddPunctuation from '../pages/tools/add-punctuation/AddPunctuation';
import ColorPicker from '../pages/tools/color-picker/ColorPicker';
import CountdownTimer from '../pages/tools/countdown-timer/CountdownTimer';
import IcoCreator from '../pages/tools/ico-creator/IcoCreator';
import ImageConverter from '../pages/tools/image-converter/ImageConverter';
import ImageCropper from '../pages/tools/image-cropper/ImageCropper';
import ImageResizer from '../pages/tools/image-resizer/ImageResizer';
import PngMinifier from '../pages/tools/png-minifier/PngMinifier';
import RemoveBackground from '../pages/tools/remove-background/RemoveBackground';
import VideoToGif from '../pages/tools/video-to-gif/VideoToGif';
import ArrayFormatter from '../pages/tools/array-formatter/ArrayFormatter';
import BaseConverter from '../pages/tools/base-converter/BaseConverter';
import CssMinifier from '../pages/tools/css-minifier/CssMinifier';
import EngineeringCheatSheet from '../pages/tools/engineering-cheat-sheet/EngineeringCheatSheet';
import FahrenheitCelsius from '../pages/tools/fahrenheit-celsius/FahrenheitCelsius';
import HtmlFormatter from '../pages/tools/html-formatter/HtmlFormatter';
import JsFormatter from '../pages/tools/js-formatter/JsFormatter';
import JsonFormatter from '../pages/tools/json-formatter/JsonFormatter';
import JsonTextFormatter from '../pages/tools/json-text-formatter/JsonTextFormatter';
import MarkdownPreview from '../pages/tools/markdown-preview/MarkdownPreview';
import MarkdownTable from '../pages/tools/markdown-table/MarkdownTable';
import GraphCalculator from '../pages/tools/graph-calculator/GraphCalculator';
import NumberSorter from '../pages/tools/number-sorter/NumberSorter';
import PiAttenuator from '../pages/tools/pi-attenuator/PiAttenuator';
import TypescriptFormatter from '../pages/tools/typescript-formatter/TypescriptFormatter';
import XmlFormatter from '../pages/tools/xml-formatter/XmlFormatter';
import BoldText from '../pages/tools/bold-text/BoldText';
import CaseConverter from '../pages/tools/case-converter/CaseConverter';
import InlineColumnConverter from '../pages/tools/inline-column-converter/InlineColumnConverter';
import RemoveAllWhitespace from '../pages/tools/remove-all-whitespace/RemoveAllWhitespace';
import RemoveCharacter from '../pages/tools/remove-character/RemoveCharacter';
import RemoveTextFormatting from '../pages/tools/remove-text-formatting/RemoveTextFormatting';
import RemoveTrailingWhitespace from '../pages/tools/remove-trailing-whitespace/RemoveTrailingWhitespace';
import ReverseText from '../pages/tools/reverse-text/ReverseText';
import ReverseTextInWord from '../pages/tools/reverse-text-in-word/ReverseTextInWord';
import SortWords from '../pages/tools/sort-words/SortWords';
import TextCompare from '../pages/tools/text-compare/TextCompare';
import WordCounter from '../pages/tools/word-counter/WordCounter';
import WordFrequency from '../pages/tools/word-frequency/WordFrequency';
import UuidGenerator from '../pages/tools/uuid-generator/UuidGenerator';
import PercentageCalc from '../pages/tools/percentage-calc/PercentageCalc';
import UnitConverter from '../pages/tools/unit-converter/UnitConverter';
import ColorConverter from '../pages/tools/color-converter/ColorConverter';
import ContrastChecker from '../pages/tools/contrast-checker/ContrastChecker';
import DateCalculator from '../pages/tools/date-calculator/DateCalculator';
import UnixTimestamp from '../pages/tools/unix-timestamp/UnixTimestamp';
import TimezoneConverter from '../pages/tools/timezone-converter/TimezoneConverter';
import Base64 from '../pages/tools/base64/Base64';
import UrlEncoder from '../pages/tools/url-encoder/UrlEncoder';
import RegexTester from '../pages/tools/regex-tester/RegexTester';
import GradientGenerator from '../pages/tools/gradient-generator/GradientGenerator';
import RandomNumber from '../pages/tools/random-number/RandomNumber';
import StatisticsCalc from '../pages/tools/statistics-calc/StatisticsCalc';
import ScientificCalc from '../pages/tools/scientific-calc/ScientificCalc';
import LoremIpsum from '../pages/tools/lorem-ipsum/LoremIpsum';
import TaskList from '../pages/tools/task-list/TaskList';

export const TOOL_COMPONENTS = {
  'add-punctuation':        AddPunctuation,
  'color-picker':           ColorPicker,
  'countdown-timer':        CountdownTimer,
  'array-formatter':        ArrayFormatter,
  'base-converter':         BaseConverter,
  'css-minifier':           CssMinifier,
  'ico-creator':            IcoCreator,
  'image-converter':        ImageConverter,
  'image-cropper':          ImageCropper,
  'image-resizer':          ImageResizer,
  'png-minifier':           PngMinifier,
  'remove-background':      RemoveBackground,
  'video-to-gif':           VideoToGif,
  'engineering-cheat-sheet': EngineeringCheatSheet,
  'fahrenheit-celsius':     FahrenheitCelsius,
  'html-formatter':         HtmlFormatter,
  'js-formatter':           JsFormatter,
  'json-formatter':         JsonFormatter,
  'json-text-formatter':    JsonTextFormatter,
  'markdown-preview':       MarkdownPreview,
  'markdown-table':         MarkdownTable,
  'graph-calculator':       GraphCalculator,
  'number-sorter':          NumberSorter,
  'pi-attenuator':          PiAttenuator,
  'typescript-formatter':   TypescriptFormatter,
  'xml-formatter':          XmlFormatter,
  'bold-text':              BoldText,
  'case-converter':         CaseConverter,
  'inline-column-converter': InlineColumnConverter,
  'remove-all-whitespace':  RemoveAllWhitespace,
  'remove-character':       RemoveCharacter,
  'remove-text-formatting': RemoveTextFormatting,
  'remove-trailing-whitespace': RemoveTrailingWhitespace,
  'reverse-text':           ReverseText,
  'reverse-text-in-word':   ReverseTextInWord,
  'sort-words':             SortWords,
  'text-compare':           TextCompare,
  'word-counter':           WordCounter,
  'word-frequency':         WordFrequency,
  'uuid-generator':         UuidGenerator,
  'percentage-calc':        PercentageCalc,
  'unit-converter':         UnitConverter,
  'color-converter':        ColorConverter,
  'contrast-checker':       ContrastChecker,
  'date-calculator':        DateCalculator,
  'unix-timestamp':         UnixTimestamp,
  'timezone-converter':     TimezoneConverter,
  'base64':                 Base64,
  'url-encoder':            UrlEncoder,
  'regex-tester':           RegexTester,
  'gradient-generator':     GradientGenerator,
  'random-number':          RandomNumber,
  'statistics-calc':        StatisticsCalc,
  'scientific-calc':        ScientificCalc,
  'lorem-ipsum':            LoremIpsum,
  'task-list':              TaskList,
};
