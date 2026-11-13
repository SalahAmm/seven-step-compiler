import { Link } from 'react-router-dom'
import { ArrowRight, CircleCheck, Sparkles } from 'lucide-react'
import { Automaton } from '../components/Automaton'
import type { AutoEdge, AutoState } from '../components/Automaton'
import { M } from '../components/Math'
import { ParseTree } from '../components/ParseTree'
import { BoardFigure, Callout, Grammar } from '../components/ui'

const tinyStates: AutoState[] = [
  { id: 'q0', label: 'q0', x: 130, y: 175, start: true },
  { id: 'q1', label: 'q1', x: 390, y: 175, accepting: true },
]

const tinyEdges: AutoEdge[] = [
  { from: 'q0', to: 'q0', label: 'b', loop: 'below' },
  { from: 'q0', to: 'q1', label: 'a', bend: -24 },
  { from: 'q1', to: 'q1', label: 'a', loop: 'above' },
  { from: 'q1', to: 'q0', label: 'b', bend: 24 },
]

const words = [
  {
    symbol: 'Σ',
    name: 'Alphabet',
    plain: 'The allowed letters.',
    example: <span className="mono">{'{a, b}'}</span>,
  },
  {
    symbol: 'w',
    name: 'Word',
    plain: 'Any string built from those letters, read left to right.',
    example: <span className="mono">aba</span>,
  },
  {
    symbol: 'L',
    name: 'Language',
    plain: 'A set of words. A collection, not a single string.',
    example: <M>{String.raw`L = \{a, ab, bb\}`}</M>,
  },
  {
    symbol: 'ε',
    name: 'Empty word',
    plain: 'The word with zero letters. It is a real word, like 0 is a real number.',
    example: <M>{String.raw`|w| = 0`}</M>,
  },
  {
    symbol: '∅',
    name: 'Empty set',
    plain: 'A language with no words at all — not even the empty word.',
    example: <M>{String.raw`\emptyset = \{\,\}`}</M>,
  },
  {
    symbol: 'δ',
    name: 'Transition',
    plain: 'A rule that says: in this state, reading this letter, go there.',
    example: <M>{String.raw`\delta(q_0,a)=q_1`}</M>,
  },
]

const pipeline = [
  { label: 'Source text', note: 'characters', tone: 'ink' },
  { label: 'Lexer', note: 'tokens', tone: 'green' },
  { label: 'Parser', note: 'tree', tone: 'ink' },
  { label: 'Checks', note: 'types & names', tone: 'green' },
  { label: 'Target code', note: 'machine', tone: 'ink' },
]

const tree = {
  label: 'S',
  children: [
    { label: 'a', terminal: true },
    {
      label: 'S',
      children: [
        { label: 'a', terminal: true },
        {
          label: 'S',
          children: [{ label: 'b', terminal: true }],
        },
      ],
    },
  ],
}

export function Basics() {
  return (
    <>
      <header className="page-head basics-head">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Course</Link>
          <span className="sep" aria-hidden="true">/</span>
          <span>Absolute basics</span>
        </nav>
        <div className="hero-kicker">
          <Sparkles size={14} aria-hidden="true" />
          The pre-stage primer · no prerequisites
        </div>
        <h1 className="page-title">You are not behind. You are at the start.</h1>
        <p className="lede">
          Compilation uses a small vocabulary and then reuses it everywhere. Learn these six words and one picture,
          and every later page stops looking like a foreign language.
        </p>
        <div className="page-actions">
          <Link className="btn btn-primary" to="/guide/1">
            Start Stage 1 <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link className="btn btn-ghost" to="/cheatsheet">
            Keep the symbols open
          </Link>
        </div>
      </header>

      <section className="basics-section">
        <div className="section-head compact">
          <div>
            <span className="eyebrow">Vocabulary</span>
            <h2>Six words unlock the course.</h2>
          </div>
          <p>
            You do not need to memorise formal definitions. You need to know what each symbol is pointing at when
            an exercise uses it.
          </p>
        </div>
        <div className="basics-grid">
          {words.map((word) => (
            <article className="basics-card" key={word.name}>
              <div className="basics-symbol">{word.symbol}</div>
              <h3>{word.name}</h3>
              <p>{word.plain}</p>
              <div className="basics-example">{word.example}</div>
            </article>
          ))}
        </div>
      </section>

      <Callout variant="trap" title="ε is not ∅">
        <p>
          <M>{String.raw`\varepsilon`}</M> is a word: the word of length zero. <M>{String.raw`\emptyset`}</M> is a
          language: it contains no words at all. So <M>{String.raw`\{\varepsilon\} \ne \emptyset`}</M>. This
          distinction appears in almost every set question.
        </p>
      </Callout>

      <section className="basics-section">
        <div className="section-head compact">
          <div>
            <span className="eyebrow">A machine</span>
            <h2>A DFA is a map that reads one letter at a time.</h2>
          </div>
          <p>
            Start at the arrow. Follow the road labelled with the next letter. When the word ends, accept if you are
            standing on a double circle.
          </p>
        </div>

        <BoardFigure
          title="Words ending in a"
          note="Σ = {a, b}"
          label="DFA with states q0 and q1. q0 is the start, q1 is accepting. Reading a moves to q1, reading b returns to q0."
          caption={
            <>
              The machine only remembers one bit: <strong>“did the last letter equal a?”</strong> That is why two
              states are enough.
            </>
          }
        >
          <Automaton
            states={tinyStates}
            edges={tinyEdges}
            width={560}
            height={300}
            ariaLabel="DFA for words ending in a. q0 is the start state and q1 is accepting."
          />
        </BoardFigure>

        <div className="basics-read">
          <div>
            <h3>Read the drawing</h3>
            <ul>
              <li><strong>Arrow from nowhere</strong> — the start state.</li>
              <li><strong>Double circle</strong> — an accepting state.</li>
              <li><strong>Every state has one arrow per letter</strong> — this is a DFA, the strict kind.</li>
            </ul>
          </div>
          <div>
            <h3>Try a word</h3>
            <p>
              For <span className="mono">aba</span>: start at <span className="mono">q0</span>, read <span className="mono">a</span>
              {' '}→ <span className="mono">q1</span>, read <span className="mono">b</span> → <span className="mono">q0</span>,
              read <span className="mono">a</span> → <span className="mono">q1</span>. End on a double circle → accepted.
            </p>
          </div>
        </div>
      </section>

      <section className="basics-section">
        <div className="section-head compact">
          <div>
            <span className="eyebrow">A grammar</span>
            <h2>A grammar is a set of replacement rules.</h2>
          </div>
          <p>
            Start from <span className="mono">S</span>. Replace one uppercase placeholder at a time until only
            lowercase letters remain. That final line is a word in the language.
          </p>
        </div>

        <div className="basics-grammar">
          <div>
            <Grammar
              lines={['S → aS', 'S → b']}
              note="Read: S can become aS, or S can become b."
            />
            <div className="derivation-box">
              <div className="derivation-label">A derivation of aab</div>
              <div className="derivation-line">
                <span>S</span><span className="arrow">⇒</span><span>aS</span><span className="arrow">⇒</span>
                <span>aaS</span><span className="arrow">⇒</span><span>aab</span>
              </div>
            </div>
          </div>
          <div className="basics-tree">
            <div className="basics-tree-label">The same derivation as a parse tree</div>
            <ParseTree tree={tree} ariaLabel="Parse tree for the word aab using S to aS and S to b." maxWidth={380} />
          </div>
        </div>
      </section>

      <section className="basics-section">
        <div className="section-head compact">
          <div>
            <span className="eyebrow">The big picture</span>
            <h2>What a compiler actually does.</h2>
          </div>
          <p>
            For this exam, you only need the front half: characters become tokens, tokens become a tree, and the
            tree gets checked. The back half is one definition question at most.
          </p>
        </div>
        <div className="basics-pipeline" aria-label="Compiler pipeline">
          {pipeline.map((stage, index) => (
            <div className={`basics-stage ${stage.tone}`} key={stage.label}>
              <span className="basics-stage-num">0{index + 1}</span>
              <strong>{stage.label}</strong>
              <span>{stage.note}</span>
              {index < pipeline.length - 1 ? <span className="basics-stage-arrow" aria-hidden="true">→</span> : null}
            </div>
          ))}
        </div>
        <Callout variant="key" title="The one sentence to remember">
          <p>
            A compiler translates a whole program before it runs; an interpreter executes it while reading it.
            Everything else in this course is a detail of how the translation is organised.
          </p>
        </Callout>
      </section>

      <section className="basics-finish">
        <div>
          <span className="eyebrow">Ready?</span>
          <h2>You now have enough vocabulary to start.</h2>
          <p>
            Stage 1 begins with the same six words, then turns them into exam recipes. Keep this page open if a symbol
            stops making sense.
          </p>
        </div>
        <div className="basics-finish-actions">
          <Link className="btn btn-primary" to="/guide/1">
            Start Stage 1 <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link className="btn btn-outline" to="/cheatsheet">
            Open the cheat sheet
          </Link>
        </div>
        <ul className="basics-checks">
          <li><CircleCheck size={15} aria-hidden="true" /> I know the difference between ε and ∅.</li>
          <li><CircleCheck size={15} aria-hidden="true" /> I can follow a DFA arrow.</li>
          <li><CircleCheck size={15} aria-hidden="true" /> I can read a grammar rule.</li>
        </ul>
      </section>
    </>
  )
}
