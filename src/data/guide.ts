export type GuideStage = {
  id: number
  slug: string
  title: string
  navLabel: string
  focus: string
  kicker: string
  outcome: string
  blurb: string
  examRefs: string[]
  outcomes: string[]
  sections: { id: string; label: string }[]
  deepDives: { lessonId: number; label: string }[]
}

export const guideStages: GuideStage[] = [
  {
    id: 1,
    slug: 'regex-grep',
    title: 'Regex, languages & grep',
    navLabel: 'Regex & grep',
    focus: 'Read & write',
    kicker: 'Stage 1 · The vocabulary stage',
    outcome: 'Read a regular expression in plain English, write one from a sentence, and survive the bracket trap.',
    blurb:
      'No CS background needed. We start with alphabet, word and language, then turn the six regex symbols into a recipe you can read aloud.',
    examRefs: ['Set 1 · Ex 1–3, 6', 'Interro 1 · Ex 1, 3'],
    outcomes: [
      'Multiply two word sets without missing a word.',
      'Translate between English and regex using four reusable shapes.',
      'Spot the two `+` meanings and the square-bracket trap.',
    ],
    sections: [
      { id: 'language', label: 'Words, languages & concatenation' },
      { id: 'regex', label: 'The six regex symbols' },
      { id: 'traps', label: 'The two big traps' },
      { id: 'grep', label: 'grep, line by line' },
      { id: 'writing', label: 'Writing regex from English' },
      { id: 'drills', label: 'Quick-check drills' },
    ],
    deepDives: [
      { lessonId: 1, label: 'Full regex & grep notes' },
      { lessonId: 2, label: 'Regex-building patterns' },
    ],
  },
  {
    id: 2,
    slug: 'automata',
    title: 'Building automata',
    navLabel: 'Automata maps',
    focus: 'Draw',
    kicker: 'Stage 2 · The drawing stage',
    outcome: 'Recognise the four machine shapes and draw a correct DFA without inventing one from scratch.',
    blurb:
      'An automaton is a board-game map. Learn the four maps that cover almost every exercise: ends-with, does-not-contain, modulo, and numbers below a limit.',
    examRefs: ['Set 1 · Ex 5, 7, 8', 'Interro 1 · Ex 2'],
    outcomes: [
      'Explain DFA versus NFA in one sentence.',
      'Draw the four standard machines from memory.',
      'Use a dead state and a product grid without fear.',
    ],
    sections: [
      { id: 'anatomy', label: 'The map & the two machine types' },
      { id: 'recipes', label: 'The four drawing recipes' },
      { id: 'limit', label: 'Numbers below 139' },
      { id: 'mistakes', label: 'Four drawing mistakes' },
      { id: 'drills', label: 'Quick-check drills' },
    ],
    deepDives: [{ lessonId: 2, label: 'Full automata notes & diagrams' }],
  },
  {
    id: 3,
    slug: 'conversions',
    title: 'Arden, determinization & minimization',
    navLabel: 'Conversions',
    focus: 'Convert',
    kicker: 'Stage 3 · The conversion stage',
    outcome: 'Move between regex, NFA, DFA, complement and minimal DFA with a recipe for each direction.',
    blurb:
      'One formula unlocks automaton-to-regex. Then subset construction turns an NFA into a DFA, a sink state makes complement safe, and the split game shrinks the result.',
    examRefs: ['Set 1 · Ex 4, 9', 'Interro 1 · Ex 4'],
    outcomes: [
      'Apply Arden’s lemma without swapping A and B.',
      'Build a subset table and mark accepting groups correctly.',
      'Complete, complement and minimize a DFA in the right order.',
    ],
    sections: [
      { id: 'arden', label: 'Arden’s lemma' },
      { id: 'determinize', label: 'NFA → DFA' },
      { id: 'complement', label: 'Complete & complement' },
      { id: 'minimize', label: 'Minimization' },
      { id: 'drills', label: 'Quick-check drills' },
    ],
    deepDives: [
      { lessonId: 3, label: 'Full Arden walkthrough' },
      { lessonId: 4, label: 'Full determinization & minimization' },
    ],
  },
  {
    id: 4,
    slug: 'grammars-cnf',
    title: 'Grammars, CNF & left recursion',
    navLabel: 'Grammars & CNF',
    focus: 'Clean up',
    kicker: 'Stage 4 · The grammar stage',
    outcome: 'Classify a grammar, clean it into CNF, and remove left recursion in the exam’s required order.',
    blurb:
      'Grammars look abstract until you treat them as replacement rules. We cover the Chomsky types, ambiguity, ε-removal, CNF, direct and indirect left recursion, and left factoring.',
    examRefs: ['Set 2 · Ex 1–3, 8', 'Interro 2 · Ex 4'],
    outcomes: [
      'Tell Type 3, Type 2 and Type 1 apart by their exponents.',
      'Convert a grammar to CNF without losing words.',
      'Remove indirect left recursion using A < B < C.',
    ],
    sections: [
      { id: 'types', label: 'Grammar basics & Chomsky types' },
      { id: 'ambiguity', label: 'Derivations & ambiguity' },
      { id: 'cnf', label: 'ε-removal & CNF' },
      { id: 'recursion', label: 'Left recursion & factoring' },
      { id: 'drills', label: 'Quick-check drills' },
    ],
    deepDives: [
      { lessonId: 5, label: 'Grammar types & ambiguity' },
      { lessonId: 6, label: 'ε-removal & CNF' },
      { lessonId: 7, label: 'Left recursion walkthrough' },
    ],
  },
  {
    id: 5,
    slug: 'first-follow',
    title: 'FIRST & FOLLOW',
    navLabel: 'FIRST & FOLLOW',
    focus: 'Predict',
    kicker: 'Stage 5 · The prediction stage',
    outcome: 'Compute FIRST and FOLLOW correctly, including the nullable-symbol case that costs most marks.',
    blurb:
      'FIRST answers “what can appear at the front?”. FOLLOW answers “what can appear immediately after?”. Together they let an LL(1) parser predict its next move.',
    examRefs: ['Set 2 · Ex 9', 'Interro 2 · Ex 3'],
    outcomes: [
      'Compute FIRST with the ε pass-through rule.',
      'Compute FOLLOW without ever putting ε inside it.',
      'Catch the nullable mistake on FIRST(Y) before it spreads.',
    ],
    sections: [
      { id: 'why', label: 'Why a parser needs these sets' },
      { id: 'first', label: 'FIRST, in three rules' },
      { id: 'follow', label: 'FOLLOW, in three rules' },
      { id: 'practice', label: 'The full Set 2 example' },
      { id: 'drills', label: 'Quick-check drills' },
    ],
    deepDives: [{ lessonId: 8, label: 'Full FIRST–FOLLOW–LL(1) notes' }],
  },
  {
    id: 6,
    slug: 'll1-parser',
    title: 'LL(1) tables & stack traces',
    navLabel: 'LL(1) parser',
    focus: 'Parse',
    kicker: 'Stage 6 · The big-points stage',
    outcome: 'Fill the LL(1) table, prove whether a grammar is LL(1), and run the stack machine for a full word.',
    blurb:
      'This is the single highest-scoring section. One table, one stack rule, and three conflict checks cover the whole exercise — including the full abdce trace and parse tree.',
    examRefs: ['Set 2 · Ex 7, 9', 'Interro 2 · Ex 2, 3'],
    outcomes: [
      'Fill every table cell from FIRST and FOLLOW.',
      'Detect left recursion, FIRST–FIRST and FIRST–FOLLOW conflicts.',
      'Simulate the parser and read off the leftmost derivation.',
    ],
    sections: [
      { id: 'table', label: 'Building the table' },
      { id: 'conflicts', label: 'The three conflict checks' },
      { id: 'stack', label: 'The stack game' },
      { id: 'tree', label: 'Derivation & parse tree' },
      { id: 'drills', label: 'Quick-check drills' },
    ],
    deepDives: [{ lessonId: 8, label: 'Full LL(1) lab & tables' }],
  },
  {
    id: 7,
    slug: 'pda-qcm',
    title: 'Pushdown automata & the QCM',
    navLabel: 'PDA & QCM',
    focus: 'Finish',
    kicker: 'Stage 7 · The final stage',
    outcome: 'Build a PDA for the three standard languages, read L(M), and lock in the five true/false answers.',
    blurb:
      'A PDA is an NFA with a stack of plates. We build the three exam machines, read a language back from transitions, then finish with the exact QCM traps.',
    examRefs: ['Set 2 · Ex 4–5', 'Interro 2 · Ex 1'],
    outcomes: [
      'Read a PDA transition as push, pop, or free move.',
      'Build machines for aⁿbⁿ, aⁿbᵐ and nested counts.',
      'Answer the five QCM statements with the reasoning, not memory.',
    ],
    sections: [
      { id: 'pda', label: 'The machine & three patterns' },
      { id: 'reading', label: 'Reading L(M)' },
      { id: 'qcm', label: 'The five QCM facts' },
      { id: 'finish', label: 'Finish line' },
      { id: 'drills', label: 'Quick-check drills' },
    ],
    deepDives: [
      { lessonId: 9, label: 'Full PDA notes & lab' },
      { lessonId: 8, label: 'LL(1) deep dive' },
    ],
  },
]

export const getGuideStage = (id: number) => guideStages.find((stage) => stage.id === id)
