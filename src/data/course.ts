export type LessonMeta = {
  id: number
  slug: string
  title: string
  navLabel: string
  part: 'I' | 'II'
  partName: string
  blurb: string
  planSlot: string
  sections: { id: string; label: string }[]
}

export const lessons: LessonMeta[] = [
  {
    id: 1,
    slug: 'concatenation-regex-grep',
    title: 'Concatenation, regex & the grep trap',
    navLabel: 'Concatenation & regex',
    part: 'I',
    partName: 'Lexical analysis',
    blurb:
      'Glue two languages together, translate regex into plain English, and see why square brackets break every intuition from grep.',
    planSlot: 'Stage 1',
    sections: [
      { id: 'concat', label: 'Language concatenation' },
      { id: 'regex', label: 'Regex in plain English' },
      { id: 'grep', label: 'grep, line by line' },
      { id: 'trap', label: 'The character-class trap' },
    ],
  },
  {
    id: 2,
    slug: 'building-automata',
    title: 'Building automata that count',
    navLabel: 'Building automata',
    part: 'I',
    partName: 'Lexical analysis',
    blurb:
      'Four reusable machines: modulo counting, forbidden substrings, product automata, and numbers below a limit. Draw them once, adapt them all exam long.',
    planSlot: 'Stage 1',
    sections: [
      { id: 'anatomy', label: 'Automaton anatomy' },
      { id: 'regex-rules', label: 'Rules → regex' },
      { id: 'modulo', label: 'Modulo machines' },
      { id: 'forbidden', label: 'Forbidden substrings' },
      { id: 'limit', label: 'Numbers below 139' },
    ],
  },
  {
    id: 3,
    slug: 'ardens-lemma',
    title: 'Automaton → regex with Arden',
    navLabel: "Arden's lemma",
    part: 'I',
    partName: 'Lexical analysis',
    blurb:
      'The four-step mechanical recipe. Write one equation per state, substitute, and apply X = AX + B → X = A*B until the start state is solved.',
    planSlot: 'Stage 3',
    sections: [
      { id: 'recipe', label: 'The four-step recipe' },
      { id: 'walkthrough', label: 'Official walkthrough' },
      { id: 'lab', label: 'Step through it' },
    ],
  },
  {
    id: 4,
    slug: 'nfa-to-dfa',
    title: 'NFA → DFA, complement & minimization',
    navLabel: 'NFA → DFA & minimization',
    part: 'I',
    partName: 'Lexical analysis',
    blurb:
      'Subset construction without inaccessible states, the sink state that makes complement work, and the fast partition method that shrinks a DFA to two states.',
    planSlot: 'Stage 3',
    sections: [
      { id: 'eclose', label: 'ε-closures' },
      { id: 'determinize', label: 'Subset construction' },
      { id: 'complement', label: 'Complete & complement' },
      { id: 'minimize', label: 'Minimization' },
    ],
  },
  {
    id: 5,
    slug: 'grammar-types-ambiguity',
    title: 'Grammar types, trees & ambiguity',
    navLabel: 'Types & ambiguity',
    part: 'II',
    partName: 'Syntactic analysis',
    blurb:
      'Tell Type 3 from Type 2 from Type 1 at a glance, read a parse tree, and prove a grammar ambiguous by finding one word with two trees.',
    planSlot: 'Stage 4',
    sections: [
      { id: 'types', label: 'The three types' },
      { id: 'derivations', label: 'Leftmost & rightmost' },
      { id: 'ambiguity', label: 'Proving ambiguity' },
    ],
  },
  {
    id: 6,
    slug: 'epsilon-cnf',
    title: 'ε-removal & Chomsky Normal Form',
    navLabel: 'CNF & ε-removal',
    part: 'II',
    partName: 'Syntactic analysis',
    blurb:
      'Find every nullable non-terminal, duplicate rules with the nullable symbol removed, then binarize until every production is A → BC or A → a.',
    planSlot: 'Stage 4',
    sections: [
      { id: 'nullable', label: 'Removing ε-productions' },
      { id: 'cnf', label: 'Chomsky Normal Form' },
    ],
  },
  {
    id: 7,
    slug: 'left-recursion',
    title: 'Removing left recursion',
    navLabel: 'Left recursion',
    part: 'II',
    partName: 'Syntactic analysis',
    blurb:
      'Respect the order A < B < C. Substitute every earlier non-terminal first, then eliminate direct recursion. The full Interro 2 walkthrough.',
    planSlot: 'Stage 4',
    sections: [
      { id: 'basics', label: 'Direct & indirect' },
      { id: 'algorithm', label: 'The ordered algorithm' },
      { id: 'worked', label: 'Full walkthrough' },
      { id: 'factoring', label: 'Left factoring' },
    ],
  },
  {
    id: 8,
    slug: 'first-follow-ll1',
    title: 'FIRST, FOLLOW & LL(1) parsing',
    navLabel: 'FIRST, FOLLOW, LL(1)',
    part: 'II',
    partName: 'Syntactic analysis',
    blurb:
      'Compute the two sets, fill the table, detect conflicts without the table, and step a real LL(1) stack machine through the word abdce.',
    planSlot: 'Stages 5-6',
    sections: [
      { id: 'first', label: 'FIRST sets' },
      { id: 'follow', label: 'FOLLOW sets' },
      { id: 'table', label: 'The LL(1) table' },
      { id: 'trace', label: 'Stack trace lab' },
      { id: 'conflicts', label: 'Conflict checks' },
    ],
  },
  {
    id: 9,
    slug: 'pushdown-automata',
    title: 'Pushdown automata',
    navLabel: 'Pushdown automata',
    part: 'II',
    partName: 'Syntactic analysis',
    blurb:
      'An NFA with a stack of plates. Build machines for aⁿbⁿ, aⁿbᵐ, and nested counts — then read a PDA back into a language.',
    planSlot: 'Stage 7',
    sections: [
      { id: 'anatomy', label: 'The machine' },
      { id: 'patterns', label: 'Three build patterns' },
      { id: 'reading', label: 'PDA → language' },
    ],
  },
]

export const getLesson = (id: number) => lessons.find((lesson) => lesson.id === id)
