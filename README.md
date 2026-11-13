# The 7-Step Compiler

A beginner-first study guide for the Compilation module (L3 Computer Science, Université Yahia Fares – Médéa). It is built to get a student with no CS background to a passing grade on the assessment, without hiding the exam-critical detail. The same core path is available in English and Arabic, and both editions are designed phone-first for sharing in class groups.

**Read it online:** <https://salahamm.github.io/seven-step-compiler/> — every push to `master` deploys automatically through GitHub Pages.

## What is inside

- **Seven stages** — regex and grep, automata, conversions, grammars and CNF, FIRST/FOLLOW, LL(1), and PDA/QCM.
- **A pre-stage primer** — alphabet, words, languages and the idea of an automaton, from zero.
- **The reference shelf** — nine full lesson notes kept as optional deep dives.
- **The master cheat sheet** — the six formulas that carry the exam.
- **The exam war room** — recall drills, the five QCM facts and a final checklist.
- **Interactive labs** — a DFA runner, grep playground, Arden stepper, left-recursion cleaner, FIRST/FOLLOW table, LL(1) stack tracer and PDA simulator.
- **Arabic edition** — the full core path, cheat sheet, war room and reference index in Arabic, with proper RTL layout.

Study framing is expressed in stages, never in clock time. The only minute figures left are exam-hall pacing blocks in the war room.

## Routes

| English | Arabic | Purpose |
| --- | --- | --- |
| `/` | `/ar` | Survival hub and stage map |
| `/basics` | `/ar/basics` | Zero-prerequisite primer |
| `/guide/1` … `/guide/7` | `/ar/stage/1` … `/ar/stage/7` | The main path |
| `/lessons/1` … `/lessons/9` | `/ar/reference` | Optional deep dives (notes stay in English) |
| `/reference` | `/ar/reference` | Index of the full lesson notes |
| `/cheatsheet` | `/ar/cheatsheet` | Formulas and patterns |
| `/war-room` | `/ar/war-room` | Final recall and exam pacing |

Arabic is route-scoped rather than a global toggle, so English pages always keep an LTR shell. The language switch maps the current page to its counterpart and is available in the desktop sidebar and as a pill in the mobile header.

## Mobile behaviour

- The top bar keeps one labelled **Course** button that opens the full course map as a focus-trapped drawer. The drawer is titled, closes on Escape, scrim or close button, returns focus to the button, and anchors to the right in Arabic.
- A fixed stage dock on guide pages shows a seven-segment stage rail, Previous / Next, and a **Stage index** button. The rail marks the current and completed stages, and each segment jumps straight to its stage.
- **Stage index** opens a sheet titled **This stage** with the sections of the current stage, a Deep notes list, and a **Full course map** link, so one stage never becomes a dead end.
- The in-page stage table of contents is hidden on phones because the dock and sheet already cover that job; the desktop layout keeps it.
- All mobile surfaces are focus-trapped and dismissible with Escape, the scrim or a close button.
- Long formulas scroll horizontally inside their card instead of widening the page; numeric ranges and fractions are bidi-isolated so they never reverse in Arabic prose.
- Touch targets, tables, code blocks and quiz controls are sized for a 320 px viewport and up.
- A back-to-top control follows long pages without covering the stage dock.

## Running it

```bash
npm install
npm run dev
```

```bash
npm run build     # type-check + production build
npm run lint      # oxlint
npm run preview   # serve the production build
```

## Stack

React 19, TypeScript, Vite, React Router, KaTeX for typeset mathematics, and Lucide icons. Fonts are Inter (UI), Newsreader (display), JetBrains Mono (code), and Noto Sans Arabic / Noto Naskh Arabic for the Arabic edition. All fonts are loaded through Fontsource.

Content lives in `src/data` (`guide.ts`, `course.ts`, `automata.ts`, `arabic.ts`). Each guide stage is a page in `src/pages/guide` and wraps its content in `GuideShell`, which owns the stage header, progress toggle and deep-dive links. Arabic pages live in `src/pages/ar` and render the same block model through `ArBlocks`. Progress is stored locally under `seven-step-compiler/progress/v3`; guide stages use `stage-1`…`stage-7` keys and lessons use `lesson-${id}`. Progress is shared between the English and Arabic editions.

## Notes for contributors

- Use `<M>{String.raw`…`}</M>` for math. A literal dollar in KaTeX needs `\$`; an unescaped `$` produces a `.katex-error`.
- Do not introduce study-time language. Use “Stage 1” rather than a duration.
- Wrap Arabic prose that contains a numeric range or a spaced fraction in `<BidiText>`; Chromium reverses those tokens in plain RTL strings.
- Keep code, formulas and tables as LTR islands inside Arabic pages.
- Check layouts at 320 px, 390 px and desktop widths. Tables and formulas need to scroll or wrap, never push the page sideways.
- The site has no backend and no tracking. Everything runs from static assets.

