# UtilityHub
UtilityHub is a clean, easy-to-use collection of web tools for text, data, engineering, and image tasks. It helps users get quick results with simple utilities in one organized place.

# TODO list


```
1. 
This prompt was inturruped because of session limits, scan to see where the agent left off and continue from there,
You are a professional software engineer working on a website. keep the code clean and maintainable and do not over engineer. use /find-skills to find necessary skills during development and skill frontmatter /vercel-react-best-practices if needed. After all tasks are complete for each full prompt, commit the changes to github.

Build all text-related tools for UtilityHub using the shared templates. Focus on simple, fast, local-first logic wherever possible.

Build these pages:
- Text Case Converter.
- Add Punctuation.
- Inline Column Converter.
- Reverse Text.
- Reverse Words.
- Reverse Text in Each Word.
- Strikethrough Text.
- Italic Text.
- Bold Text.
- Remove Character.
- Text Compare.
- Remove Trailing Whitespace.
- Remove All Whitespace.
- Word Counter.
- Remove Line Breaks.
- Remove Text Formatting.
- Sort Words.
- Word Frequency.

Text Compare requirements:
- Compare both full lines and individual words.
- Highlight case differences too.
- Side-by-side layout.
- Professional and polished output.

Keep the tools easy to use and consistent with the shared template system. Make sure each page is registered properly so it appears in navigation and search. If you need UI work, use /frontend-design.

Testing requirements:
- Add automated tests for all major components and page logic.
- Cover routing, search, dropdowns, toggles, theme persistence, language persistence, and registry behavior.
- Test each tool’s core input/output behavior.
- Add tests for edge cases, empty states, invalid input, and error handling.
- Make sure new changes do not break existing pages.
- Keep tests maintainable and focused on user-facing behavior.
```

```
2. 
Build all data and conversion tools for UtilityHub using the shared templates. Keep the logic simple, predictable, and easy to maintain.

Build these pages:
- Base Converter.
- Number Sorter.
- Array Formatter.
- Fahrenheit to Celsius.
- Distance Converter.
- Markdown Table Generator.
- Engineering Cheat Sheet.

Base Converter requirements:
- Convert between hex, octal, decimal, binary, and text.
- Two dropdowns for From and To.
- One value at a time input.
- Clear, intuitive behavior.

Engineering Cheat Sheet requirements:
- Include useful conversion tables for:
  - Capacitors.
  - Frequency units.
  - Time units.
  - Mass units.
  - Common engineering shorthand.

Keep page descriptions short and useful. Make sure each page is added to the registry and appears in the correct category. If you need UI work, use /frontend-design.

Testing requirements:
- Add automated tests for all major components and page logic.
- Cover routing, search, dropdowns, toggles, theme persistence, language persistence, and registry behavior.
- Test each tool’s core input/output behavior.
- Add tests for edge cases, empty states, invalid input, and error handling.
- Make sure new changes do not break existing pages.
- Keep tests maintainable and focused on user-facing behavior.
```

```
3.
Build the engineering/code-formatting tools for UtilityHub. Use Prettier-based formatting where appropriate so the implementation stays low maintenance.

Build these pages:
- CSS Formatter and Minifier.
- HTML Formatter and Minifier.
- JavaScript Formatter and Minifier.
- JSON Formatter and Minifier.
- JSON Text Formatter.
- Markdown Formatter with Preview.
- XML Formatter and Minifier.
- TypeScript Formatter and Minifier.
- Pi Attenuator Calculator.

Requirements:
- Use Prettier-friendly logic for supported formatter pages.
- Add minify options where needed.
- Markdown Formatter must include live preview.
- JSON Text Formatter should convert plain text into JSON-escaped quoted text with line breaks.
- Pi Attenuator Calculator must support 50 ohm and 75 ohm modes and work in both directions.

Keep the UI consistent across all engineering pages. If you need UI work, use /frontend-design.

Testing requirements:
- Add automated tests for all major components and page logic.
- Cover routing, search, dropdowns, toggles, theme persistence, language persistence, and registry behavior.
- Test each tool’s core input/output behavior.
- Add tests for edge cases, empty states, invalid input, and error handling.
- Make sure new changes do not break existing pages.
- Keep tests maintainable and focused on user-facing behavior.
```

```
4.
Build all image tools for UtilityHub. Prefer browser-side processing where practical to keep maintenance low.

Build these pages:
- JPG to PNG.
- PNG to JPG.
- PNG Minifier.
- Image Cropper.
- Image Resizer.
- SVG to PNG.
- ICO Creator.

Requirements:
- Use the image-drop template where appropriate.
- Support easy preview and processing.
- Keep the UX simple.
- Use the two-panel image-to-text template if any tool needs image input plus text output.
- Make sure file handling is reliable and the UI remains responsive.
- Keep image processing lightweight where possible.

Add each page to the registry and keep everything consistent with the rest of the site. If you need UI work, use /frontend-design.

Testing requirements:
- Add automated tests for all major components and page logic.
- Cover routing, search, dropdowns, toggles, theme persistence, language persistence, and registry behavior.
- Test each tool’s core input/output behavior.
- Add tests for edge cases, empty states, invalid input, and error handling.
- Make sure new changes do not break existing pages.
- Keep tests maintainable and focused on user-facing behavior.
```

```
5. 
Implement the full search and navigation behavior for UtilityHub.

Requirements:
- Search pages by name and aliases.
- Show live suggestions while typing.
- Clicking a suggestion navigates to that page.
- Make it easy to search even when the user uses alternate wording.
- Keep the category tabs in the header with hover dropdowns.
- Pages should be grouped by category and sorted alphabetically inside each category.
- New pages added to the registry should automatically appear in navigation and search.
- Make sure the home page lists page groups clearly.
- Keep the navigation responsive and easy to use on mobile.

Do not build new tool logic in this stage. Focus on navigation, search, and page discovery. If you need UI work, use /frontend-design.

Testing requirements:
- Add automated tests for all major components and page logic.
- Cover routing, search, dropdowns, toggles, theme persistence, language persistence, and registry behavior.
- Test each tool’s core input/output behavior.
- Add tests for edge cases, empty states, invalid input, and error handling.
- Make sure new changes do not break existing pages.
- Keep tests maintainable and focused on user-facing behavior.
```

```
6. 
Implement the global theme and multilingual support for UtilityHub.

Requirements:
- Dark mode should be the default.
- Add a light/dark toggle in the top right of the header.
- Cache the chosen theme so it persists across reloads and future visits.
- Add a language selector with flags and language names.
- Place the language selector left of the theme toggle.
- Cache the chosen language across visits.
- Make it easy to add more languages later.
- Use a clean translation structure.
- Keep the UI compact and responsive.
- Preserve user choices without requiring sign-in.

Do not build page content in this stage. Focus only on theme persistence, language persistence, and selector UI. If you need UI work, use /frontend-design.

Testing requirements:
- Add automated tests for all major components and page logic.
- Cover routing, search, dropdowns, toggles, theme persistence, language persistence, and registry behavior.
- Test each tool’s core input/output behavior.
- Add tests for edge cases, empty states, invalid input, and error handling.
- Make sure new changes do not break existing pages.
- Keep tests maintainable and focused on user-facing behavior.
```

```
7.
Add monetization features to UtilityHub with minimal maintenance.

Requirements:
- Show ads in the free version.
- Detect ad blockers.
- Show a dismissible request asking users to turn off the blocker.
- If the user dismisses it, let them continue using the site.
- Add a “Remove ads and support me” button in the header.
- Route that button to a $5/month support flow.
- Use a low-maintenance subscription approach.
- Prefer a self-serve billing experience.
- Do not require sign-in unless absolutely necessary.
- Make sure the ad-removal state persists correctly after payment.
- Keep the user experience respectful and simple.

Keep implementation simple and practical. If you need UI work, use /frontend-design.

Testing requirements:
- Add automated tests for all major components and page logic.
- Cover routing, search, dropdowns, toggles, theme persistence, language persistence, and registry behavior.
- Test each tool’s core input/output behavior.
- Add tests for edge cases, empty states, invalid input, and error handling.
- Make sure new changes do not break existing pages.
- Keep tests maintainable and focused on user-facing behavior.
```

```
8.
Add a color picker tool where you can click on a color on your computer and it will show you the RGB value is #FFFFFF and also copy it to clipboard and display the color picked.

Add a Countdown Timer page that allows you to simply tyle in a number and it countsdown from there, this should cover the whole screen similar to https://e.ggtimer.com/5 and should be easy to control and stop with escape. the timer should also show the countdown in the taskbar next to the .ico.

Testing requirements:
- Add automated tests for all major components and page logic.
- Cover routing, search, dropdowns, toggles, theme persistence, language persistence, and registry behavior.
- Test each tool’s core input/output behavior.
- Add tests for edge cases, empty states, invalid input, and error handling.
- Make sure new changes do not break existing pages.
- Keep tests maintainable and focused on user-facing behavior.
```

```
9.
Do a final polish pass on UtilityHub.

Requirements:
- Improve spacing, responsiveness, and alignment.
- Check accessibility.
- Add empty states and loading states.
- Ensure all pages are registered correctly.
- Verify routing works for all tools.
- Make the UI look clean and professional on different screen sizes.
- Keep the codebase modular and easy to extend.
- Do not add unnecessary complexity.
- Fix any broken navigation, labels, or layout inconsistencies.

Focus only on cleanup, consistency, and reliability. If you need UI work, use /frontend-design. Ask yourself, does this make the site better or is it just noise, if it is noise then remove it to make the site more simple, polished and professional.

Testing requirements:
- Add automated tests for all major components and page logic.
- Cover routing, search, dropdowns, toggles, theme persistence, language persistence, and registry behavior.
- Test each tool’s core input/output behavior.
- Add tests for edge cases, empty states, invalid input, and error handling.
- Make sure new changes do not break existing pages.
- Keep tests maintainable and focused on user-facing behavior.
```