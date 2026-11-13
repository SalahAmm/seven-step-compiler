import { Link } from 'react-router-dom'
import { useState } from 'react'
import {
  ArrowRight,
  Check,
  CircleCheck,
  Cpu,
  Printer,
  ShieldCheck,
} from 'lucide-react'
import { QcmQuiz } from '../components/Quiz'
import { Callout, SectionHeading } from '../components/ui'
import { useProgress } from '../context/ProgressContext'

const pipeline = [
  {
    num: '01',
    name: 'Lexical analysis',
    input: 'source characters',
    output: 'tokens',
    detail: 'Remove whitespace and comments; recognise identifiers, numbers, keywords and operators.',
  },
  {
    num: '02',
    name: 'Syntax analysis',
    input: 'tokens',
    output: 'parse tree / AST',
    detail: 'Check the token sequence against the grammar. Build the tree that records the structure.',
  },
  {
    num: '03',
    name: 'Semantic analysis',
    input: 'tree + symbols',
    output: 'checked tree',
    detail: 'Resolve names, check declarations and types, and reject programs that are structurally legal but meaningless.',
  },
]

const backend = [
  {
    num: '04',
    name: 'Intermediate code',
    input: 'checked tree',
    output: 'three-address code',
    detail: 'Lower the tree into a simple, machine-independent instruction form.',
  },
  {
    num: '05',
    name: 'Optimisation',
    input: 'intermediate code',
    output: 'faster code',
    detail: 'Remove redundant work while preserving meaning: constant folding, dead-code elimination, and more.',
  },
  {
    num: '06',
    name: 'Code generation',
    input: 'optimised code',
    output: 'machine code',
    detail: 'Choose registers and instructions, then emit the target program.',
  },
]

const checklist = [
  {
    id: 'arden',
    title: "Arden's lemma",
    prompt: 'Did every accepting state’s equation receive + ε?',
    detail:
      'An accepting state has an extra way to stop: the empty word. Without + ε, the final regex misses every word that ends exactly at that state.',
  },
  {
    id: 'complement',
    title: 'Complement of an automaton',
    prompt: 'Did you complete the DFA with the sink state before flipping the circles?',
    detail:
      'Complement only works on a complete DFA. Add ∅ and send every missing arrow there first; then swap accepting and non-accepting states. Flipping first loses words that die on a missing transition.',
  },
  {
    id: 'first',
    title: 'FIRST sets',
    prompt: 'Did ε leak into FIRST(A) when a non-nullable symbol sits at the end?',
    detail:
      'For A → Ze, Z is nullable but e is not. FIRST(A) contains d and e, never ε. Add ε only when the entire right-hand side can vanish.',
  },
  {
    id: 'follow',
    title: 'FOLLOW sets',
    prompt: 'Is $ in FOLLOW(S), and is ε absent from every FOLLOW set?',
    detail:
      'The start symbol is followed by the end marker. FOLLOW contains terminals and $ only — ε is a word, not a symbol that can sit to the right.',
  },
  {
    id: 'recursion',
    title: 'Left-recursion order',
    prompt: 'Before touching C, did you substitute both A and B at the front?',
    detail:
      'The order A < B < C is the algorithm. A front B that survives into C can hide a new left recursion. Substitute every earlier non-terminal, then eliminate direct recursion.',
  },
]

const drills = [
  {
    q: 'Write the Arden equation for an accepting state p with incoming a from p and b from q.',
    a: 'Xp = a Xp + b Xq + ε. The + ε is present because p is accepting.',
  },
  {
    q: 'When may you swap the double circles to complement an automaton?',
    a: 'Only after determinising and completing it with a sink state. Then swap accepting and non-accepting states without changing any arrow.',
  },
  {
    q: 'Compute FIRST(Y) for Y → cZ | Ze with Z → dcZ | ε.',
    a: 'FIRST(Y) = {c, d, e}. Z is nullable, so e can become the first real symbol; ε is not in FIRST(Y) because e never disappears.',
  },
  {
    q: 'What is FOLLOW(S) for the start symbol S, and can ε appear in a FOLLOW set?',
    a: 'FOLLOW(S) always contains $. ε never appears in any FOLLOW set — only terminals and $.',
  },
  {
    q: 'A table cell contains S → AB and S → BA. Is the grammar LL(1)?',
    a: 'No. A cell with two rules is a conflict. The grammar is not LL(1).',
  },
  {
    q: 'Why does a PDA for aⁿbᵐ with n ≥ m need a free pop of A?',
    a: 'After reading the b’s, unused A’s may remain. The free ε-pop removes them so the stack can return to #.',
  },
  {
    q: 'Is every left-recursive grammar ambiguous?',
    a: 'No. A → Aa | a is left-recursive but unambiguous. Left recursion blocks LL(1) parsing; it does not create ambiguity.',
  },
  {
    q: 'Name the two trees that prove a grammar ambiguous.',
    a: 'Two different parse trees for the same word, both rooted at S. One word with two structures is enough.',
  },
]

const finalBlocks = [
  { time: '0–15 min', label: 'QCM statements', note: 'Commit to Vrai/Faux, then read every explanation.' },
  { time: '15–30 min', label: 'Definitions', note: 'Compiler vs interpreter, front-end, back-end, AST.' },
  { time: '30–50 min', label: 'Eight drills', note: 'Answer aloud before opening each solution.' },
  { time: '50–60 min', label: 'Checklist', note: 'Five boxes. Do not submit with an unchecked box.' },
]

export function WarRoom() {
  const { count } = useProgress()
  const [checked, setChecked] = useState<string[]>([])
  const allChecked = checked.length === checklist.length

  const toggleCheck = (id: string) => {
    setChecked((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  return (
    <>
      <header className="page-head war-head">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Course</Link>
          <span className="sep" aria-hidden="true">/</span>
          <span>Exam war room</span>
        </nav>
        <div className="war-kicker">
          <ShieldCheck size={15} aria-hidden="true" />
          Final stage · QCM, definitions, drills
        </div>
        <h1 className="page-title">The exam war room.</h1>
        <p className="lede">
          No new theory. Five true/false statements, one compiler pipeline, eight drills and a checklist that catches
          the mistakes the corrigés warn about.
        </p>
        <div className="page-actions">
          <button type="button" className="btn btn-primary" onClick={() => window.print()}>
            <Printer size={15} aria-hidden="true" /> Print the war room
          </button>
          <Link className="btn btn-ghost" to="/cheatsheet">
            Reopen the cheat sheet
          </Link>
        </div>
        <div className="war-readiness">
          <div>
            <span className="war-readiness-label">Stages marked complete</span>
            <span className="war-readiness-value">{count} / 7</span>
          </div>
          <div className="progress-track" aria-hidden="true">
            <div className="progress-fill" style={{ width: `${(count / 7) * 100}%` }} />
          </div>
          <p>
            {count === 7
              ? 'The full notebook is covered. Spend the final stretch on recall, not rereading.'
              : 'The war room works even if you skipped a stage — but the checklist will expose the gap.'}
          </p>
        </div>
      </header>

      <section className="war-section">
        <SectionHeading id="qcm">Five statements, no hedging</SectionHeading>
        <p className="war-intro">
          These are the exact QCM traps from Interro 2. Wrong answers lose points, so decide before you reveal the
          explanation. LL implies unambiguous; the converse is not true.
        </p>
        <QcmQuiz />
        <Callout variant="key" title="The logic behind the five">
          <p>
            Learn the implications, not the sentences. <strong>LL ⇒ unambiguous</strong>; therefore
            <strong> ambiguous ⇒ not LL</strong>. <strong>Left recursion does not imply ambiguity</strong>, and
            <strong> left-factoring does not guarantee LL(1)</strong>. A PDA recognises every context-free language
            because it can simulate the grammar’s leftmost derivation.
          </p>
        </Callout>
      </section>

      <section className="war-section">
        <SectionHeading id="pipeline">The compiler, end to end</SectionHeading>
        <p className="war-intro">
          If a one-point definition question appears, this is the diagram to reproduce. The front-end analyses; the
          back-end generates. The symbol table and error handler cut across both.
        </p>

        <div className="pipeline-board" role="img" aria-label="Compiler pipeline: lexical analysis, syntax analysis and semantic analysis form the front-end; intermediate code, optimisation and code generation form the back-end. The symbol table and error handler support every stage.">
          <div className="pipeline-band">
            <span className="pipeline-band-label">Front-end · analysis</span>
            <div className="pipeline-stages">
              {pipeline.map((stage, index) => (
                <div className="pipeline-stage-wrap" key={stage.num}>
                  <div className="pipeline-stage">
                    <div className="pipeline-stage-top">
                      <span className="pipeline-num">{stage.num}</span>
                      <span className="pipeline-io">{stage.input} → {stage.output}</span>
                    </div>
                    <h3>{stage.name}</h3>
                    <p>{stage.detail}</p>
                  </div>
                  {index < pipeline.length - 1 ? (
                    <span className="pipeline-arrow" aria-hidden="true">→</span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="pipeline-bridge" aria-hidden="true">
            <span>abstract syntax tree</span>
            <span className="pipeline-bridge-line" />
            <span>lowering</span>
          </div>

          <div className="pipeline-band back">
            <span className="pipeline-band-label">Back-end · generation</span>
            <div className="pipeline-stages">
              {backend.map((stage, index) => (
                <div className="pipeline-stage-wrap" key={stage.num}>
                  <div className="pipeline-stage">
                    <div className="pipeline-stage-top">
                      <span className="pipeline-num">{stage.num}</span>
                      <span className="pipeline-io">{stage.input} → {stage.output}</span>
                    </div>
                    <h3>{stage.name}</h3>
                    <p>{stage.detail}</p>
                  </div>
                  {index < backend.length - 1 ? (
                    <span className="pipeline-arrow" aria-hidden="true">→</span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="pipeline-support">
            <span><Cpu size={14} aria-hidden="true" /> Symbol table</span>
            <span>Names · types · scope · storage</span>
            <span className="pipeline-support-sep" aria-hidden="true">|</span>
            <span><ShieldCheck size={14} aria-hidden="true" /> Error handler</span>
            <span>Report · recover · continue</span>
          </div>
        </div>

        <Callout variant="trap" title="Parse tree is not an AST">
          <p>
            A <strong>parse tree</strong> keeps every grammar detail: parentheses, intermediate non-terminals, and
            ε-branches. An <strong>AST</strong> strips the superficial nodes and keeps only the essential operators and
            operands. If the question asks for the tree produced by the parser, draw the full parse tree; if it asks for
            the semantic structure, draw the AST.
          </p>
        </Callout>
      </section>

      <section className="war-section">
        <SectionHeading id="definitions">The definitions worth free points</SectionHeading>
        <div className="definition-grid">
          <article className="definition-card">
            <span className="definition-tag">Translation strategy</span>
            <h3>Compiler vs interpreter</h3>
            <p>
              A <strong>compiler</strong> translates the whole source program into target or machine code before it
              runs. A <strong>interpreter</strong> executes the source directly, statement by statement, at runtime.
            </p>
            <div className="definition-split">
              <div><span>Compiler</span><p>Whole program first · static types · C</p></div>
              <div><span>Interpreter</span><p>Line by line · dynamic types · Python, Lisp</p></div>
            </div>
          </article>

          <article className="definition-card">
            <span className="definition-tag">Front-end</span>
            <h3>Analysis</h3>
            <p>
              Lexical analysis turns characters into tokens. Syntax analysis turns tokens into a parse tree or AST.
              Semantic analysis checks types and declarations.
            </p>
            <div className="definition-chain">
              <span>characters</span><i>→</i><span>tokens</span><i>→</i><span>tree</span><i>→</i><span>checked tree</span>
            </div>
          </article>

          <article className="definition-card">
            <span className="definition-tag">Back-end</span>
            <h3>Generation</h3>
            <p>
              Intermediate code such as three-address code is optimised, then lowered into machine code. The back-end
              depends on the target machine; the front-end depends on the source language.
            </p>
            <div className="definition-chain">
              <span>IR</span><i>→</i><span>optimise</span><i>→</i><span>machine code</span>
            </div>
          </article>

          <article className="definition-card">
            <span className="definition-tag">Data structure</span>
            <h3>Symbol table</h3>
            <p>
              The shared record of names, types, scopes, and storage. The lexer may insert identifiers; the parser and
              semantic analyser look them up; later stages may annotate them.
            </p>
            <div className="definition-chain">
              <span>name</span><i>·</i><span>type</span><i>·</i><span>scope</span><i>·</i><span>address</span>
            </div>
          </article>
        </div>
      </section>

      <section className="war-section">
        <SectionHeading id="checklist">The five-point pre-submission checklist</SectionHeading>
        <p className="war-intro">
          Tick each box only when you have checked the actual answer sheet — not when you remember learning the rule.
          The panel opens the exact failure mode.
        </p>

        <div className="checklist">
          <div className="checklist-head">
            <div>
              <div className="checklist-title">Before you hand in</div>
              <div className="checklist-sub">{checked.length} of {checklist.length} checks confirmed</div>
            </div>
            <span className={`checklist-badge${allChecked ? ' is-complete' : ''}`}>
              {allChecked ? <CircleCheck size={14} aria-hidden="true" /> : null}
              {allChecked ? 'Ready' : 'In progress'}
            </span>
          </div>
          <div className="progress-track checklist-track" aria-hidden="true">
            <div className="progress-fill" style={{ width: `${(checked.length / checklist.length) * 100}%` }} />
          </div>

          <ul className="checklist-list">
            {checklist.map((item) => {
              const isChecked = checked.includes(item.id)
              return (
                <li className={`checklist-item${isChecked ? ' is-checked' : ''}`} key={item.id}>
                  <button
                    type="button"
                    className="checklist-toggle"
                    aria-pressed={isChecked}
                    onClick={() => toggleCheck(item.id)}
                  >
                    <span className="checklist-box" aria-hidden="true">
                      {isChecked ? <Check size={14} strokeWidth={2.6} /> : null}
                    </span>
                    <span className="checklist-copy">
                      <strong>{item.title}</strong>
                      <span>{item.prompt}</span>
                    </span>
                  </button>
                  <details className="checklist-detail">
                    <summary>Show the failure mode</summary>
                    <p>{item.detail}</p>
                  </details>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="war-section">
        <SectionHeading id="drills">Eight drills, one sitting</SectionHeading>
        <p className="war-intro">
          Answer aloud or on paper first. Open the solution only after you have committed. These are the moves that
          earn the method points, even when the final expression is imperfect.
        </p>
        <div className="drill-list">
          {drills.map((drill, index) => (
            <details className="drill" key={drill.q}>
              <summary>
                <span className="drill-num">D{index + 1}</span>
                <span>{drill.q}</span>
                <span className="drill-open" aria-hidden="true">+</span>
              </summary>
              <div className="drill-answer">
                <span>Answer</span>
                <p>{drill.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="war-section">
        <SectionHeading id="final-pass">The final pass</SectionHeading>
        <div className="final-pass">
          {finalBlocks.map((block) => (
            <div className="final-pass-block" key={block.time}>
              <span className="final-pass-time">{block.time}</span>
              <strong>{block.label}</strong>
              <p>{block.note}</p>
            </div>
          ))}
        </div>

        <div className="war-final">
          <div>
            <h2>You do not need more pages. You need the next correct arrow.</h2>
            <p>
              Close the notebook, reproduce the five formulas from memory, and walk one automaton and one LL(1) trace
              out loud. Then stop.
            </p>
          </div>
          <div className="war-final-actions">
            <Link className="btn btn-accent" to="/cheatsheet">
              Cheat sheet <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link className="btn btn-outline" to="/guide/1">
              Restart Stage 1
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
