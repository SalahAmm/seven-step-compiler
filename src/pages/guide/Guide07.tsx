import { Link } from 'react-router-dom'
import { ArrowRight, CircleCheck, ShieldCheck } from 'lucide-react'
import { Automaton } from '../../components/Automaton'
import type { AutoEdge, AutoState } from '../../components/Automaton'
import { DeepDives, GuideShell } from '../../components/GuideChrome'
import { DrillList } from '../../components/DrillList'
import { M } from '../../components/Math'
import { PdaLab } from '../../components/PdaLab'
import { QcmQuiz } from '../../components/Quiz'
import { BoardFigure, Callout, Pill, SectionHeading } from '../../components/ui'
import { getGuideStage } from '../../data/guide'

const anbnStates: AutoState[] = [
  { id: 'q0', label: 'q0', x: 120, y: 180, start: true },
  { id: 'q1', label: 'q1', x: 390, y: 180 },
  { id: 'qf', label: 'qf', x: 655, y: 180, accepting: true },
]

const anbnEdges: AutoEdge[] = [
  { from: 'q0', to: 'q0', label: 'a, ε / A', loop: 'above' },
  { from: 'q0', to: 'q1', label: 'ε, ε / ε', bend: 0 },
  { from: 'q1', to: 'q1', label: 'b, A / ε', loop: 'above' },
  { from: 'q1', to: 'qf', label: 'ε, # / ε', bend: 0 },
]

const moves = [
  {
    move: 'Push',
    delta: 'δ(q, a, ε) = {⟨q, A⟩}',
    plain: 'Read a, require nothing, put A on top. This is counting.',
  },
  {
    move: 'Pop',
    delta: 'δ(q, b, A) = {⟨q, ε⟩}',
    plain: 'Read b, require A on top, remove it, push nothing. This is matching.',
  },
  {
    move: 'Switch phase',
    delta: 'δ(q, ε, ε) = {⟨q′, ε⟩}',
    plain: 'Read nothing and leave the stack alone. Move from pushing to popping.',
  },
  {
    move: 'Accept',
    delta: 'δ(q, ε, #) = {⟨qf, ε⟩}',
    plain: 'The bottom marker is on top, so every pushed symbol was cleared.',
  },
]

const patterns = [
  {
    id: '01',
    title: 'Equal counts · aⁿbⁿ',
    language: <M>{String.raw`\{a^n b^n \mid n \ge 0\}`}</M>,
    recipe: 'Push A for every a. Switch at the boundary. Pop A for every b. Accept only when # is on top.',
    note: 'No free-pop rule. Every b must consume exactly one A, so the counts must match.',
  },
  {
    id: '02',
    title: 'At least as many a’s · aⁿbᵐ, n ≥ m',
    language: <M>{String.raw`\{a^n b^m \mid n \ge m \ge 0\}`}</M>,
    recipe: 'Push A for every a. Pop A for every b. Then throw away leftover A’s with δ(q, ε, A) = {⟨q, ε⟩}.',
    note: 'The free ε-pop is the whole difference from aⁿbⁿ. It lets extra a’s disappear without reading input.',
  },
  {
    id: '03',
    title: 'Nested counts · aⁿbᵐc dᵐeⁿ',
    language: <M>{String.raw`\{a^n b^m c\,d^m e^n \mid n,m \ge 0\}`}</M>,
    recipe: 'Push A for a, push B for b. Read c and switch. Pop B for d, pop A for e. Accept at #.',
    note: 'The stack is two layers: A’s wrap the outside, B’s the inside. The middle c separates the two matching phases.',
  },
]

const qcmLogic = [
  {
    statement: 'LL grammars are not ambiguous.',
    answer: true,
    logic: 'LL forces one rule per lookahead, so one leftmost derivation. That is unambiguity by definition.',
  },
  {
    statement: 'Every context-free language has a PDA.',
    answer: true,
    logic: 'A non-deterministic PDA recognises exactly the context-free languages. It simulates the grammar’s leftmost derivation on its stack.',
  },
  {
    statement: 'Left-recursive CFGs are ambiguous.',
    answer: false,
    logic: 'S → Sa | a is left-recursive but every word has exactly one tree. Left recursion breaks LL(1), not unambiguity.',
  },
  {
    statement: 'Every non-left-recursive, left-factored grammar is LL.',
    answer: false,
    logic: 'A FIRST–FOLLOW conflict can survive both transformations. S → Aa, A → a | ε is the counterexample.',
  },
  {
    statement: 'Ambiguous grammars are not LL.',
    answer: true,
    logic: 'LL implies unambiguous. The contrapositive is: ambiguous implies not LL.',
  },
]

export function Guide07() {
  const stage = getGuideStage(7)!

  return (
    <GuideShell stage={stage}>
      <p className="lead-in">
        Stage 7 adds a stack to the automaton and closes the guide with the true/false questions. A PDA is still a
        map, but now it carries a stack of plates. That unbounded memory is exactly what lets it count matching
        pairs — and exactly what a DFA cannot do.
      </p>

      <section id="pda">
        <SectionHeading id="pda">The machine and the three patterns</SectionHeading>
        <p>
          A pushdown automaton has finite states, an input alphabet, a stack alphabet, a start state and accepting
          states. The stack is last-in, first-out: only the top plate is visible, and only the top plate can be
          removed. The symbol <M>{String.raw`\#`}</M> marks the bottom.
        </p>

        <Callout variant="key" title="How to read a transition">
          <M block>
            {String.raw`\delta(\text{state},\ \text{input or }\varepsilon,\ \text{pop or }\varepsilon) = \{\langle\text{next},\ \text{push or }\varepsilon\rangle\}`}
          </M>
          <p>
            Read the three inputs as: where I am, what I consume, and what I require on top. Read the output as:
            where I go, and what I put back on top. <M>{String.raw`\varepsilon`}</M> in the input means “read
            nothing”. <M>{String.raw`\varepsilon`}</M> in the output means “push nothing” — a pop.
          </p>
        </Callout>

        <div className="table-wrap">
          <table className="data-table">
            <caption>The four moves you will write in Set 2, Exercise 04.</caption>
            <thead><tr><th scope="col">Move</th><th scope="col">Transition</th><th scope="col">What it means</th></tr></thead>
            <tbody>
              {moves.map((row) => (
                <tr key={row.move}>
                  <td><strong>{row.move}</strong></td>
                  <td className="mono">{row.delta}</td>
                  <td>{row.plain}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>The three stack patterns</h3>
        <div className="pattern-grid">
          {patterns.map((pattern) => (
            <article className="pattern-card" key={pattern.id}>
              <div className="pattern-head"><span className="pattern-index">{pattern.id}</span><Pill>{pattern.title}</Pill></div>
              <div className="pattern-language">{pattern.language}</div>
              <p>{pattern.recipe}</p>
              <p className="pattern-note">{pattern.note}</p>
            </article>
          ))}
        </div>

        <BoardFigure
          title="PDA for aⁿbⁿ"
          note="q0 push · q1 pop · qf accept"
          label="PDA with push state q0, pop state q1, and accepting state qf."
          caption={
            <>
              The loop on <span className="mono">q0</span> pushes one <span className="mono">A</span> per{' '}
              <span className="mono">a</span>. The ε-move switches to <span className="mono">q1</span> without reading
              input. The loop on <span className="mono">q1</span> pops one <span className="mono">A</span> per{' '}
              <span className="mono">b</span>. The final ε-move accepts only when <span className="mono">#</span> is on
              top.
            </>
          }
        >
          <Automaton
            states={anbnStates}
            edges={anbnEdges}
            width={760}
            height={330}
            ariaLabel="Pushdown automaton for equal numbers of a and b."
          />
        </BoardFigure>

        <PdaLab />
      </section>

      <section id="reading">
        <SectionHeading id="reading">Reading L(M) from the transitions</SectionHeading>
        <p>
          Set 2, Exercise 05 gives five transitions. Read them in order and translate each one into a sentence:
        </p>

        <div className="delta-list">
          <div>
            <span>01</span>
            <code>δ(q₀, a, ε) = {'{⟨q₀, A⟩}'}</code>
            <p>Read <span className="mono">a</span>, push <span className="mono">A</span>. Count every a.</p>
          </div>
          <div>
            <span>02</span>
            <code>δ(q₀, ε, ε) = {'{⟨q₁, ε⟩}'}</code>
            <p>Read nothing, change state. The pushing phase ends.</p>
          </div>
          <div>
            <span>03</span>
            <code>δ(q₁, d, A) = {'{⟨q₁, ε⟩}'}</code>
            <p>Read <span className="mono">d</span>, require <span className="mono">A</span>, pop it. Match one d to one a.</p>
          </div>
          <div>
            <span>04</span>
            <code>δ(q₁, ε, A) = {'{⟨q₁, ε⟩}'}</code>
            <p>Read nothing, pop a leftover <span className="mono">A</span>. Extra a’s are allowed.</p>
          </div>
          <div>
            <span>05</span>
            <code>δ(q₁, ε, #) = {'{⟨q₂, ε⟩}'}</code>
            <p>The bottom marker is exposed. Accept. The stack is empty of A’s.</p>
          </div>
        </div>

        <p>
          Transitions 01 and 03 force the pattern <M>{String.raw`a^nd^m`}</M>: all a’s first, all d’s second. Transition
          04 lets leftover A’s vanish, so <M>{String.raw`m`}</M> may be smaller than <M>{String.raw`n`}</M>. Transition
          03 cannot fire when the stack has no A, so <M>{String.raw`m`}</M> can never exceed <M>{String.raw`n`}</M>.
        </p>

        <M block focus>{String.raw`L(M) = \{a^n d^m \mid n \ge m \ge 0\}`}</M>

        <Callout variant="trap" title="The difference between a free pop and a phase switch">
          <p>
            <M>{String.raw`\delta(q,\varepsilon,A)`}</M> reads no input but removes an <M>{String.raw`A`}</M>. It
            allows leftover counts, so it changes <M>{String.raw`n=m`}</M> into <M>{String.raw`n\ge m`}</M>.
          </p>
          <p>
            <M>{String.raw`\delta(q,\varepsilon,\varepsilon)`}</M> reads no input and does not touch the stack. It
            only changes state — usually to switch from pushing to popping. Do not confuse the two.
          </p>
        </Callout>

        <Callout variant="note" title="Why a PDA cannot do aⁿbⁿcⁿ">
          <p>
            Two counts can be matched with one stack: push for the first, pop for the second. A third count would
            require comparing a symbol that was popped long ago. The finite states cannot remember it, and the stack
            has already thrown it away. That is why <M>{String.raw`a^n b^n c^n`}</M> is not context-free.
          </p>
        </Callout>
      </section>

      <section id="qcm">
        <SectionHeading id="qcm">The five QCM facts</SectionHeading>
        <p>
          These are the exact true/false statements from Interro 2. The quiz below makes you commit before revealing
          the explanation. Use it as a diagnostic, not a reading exercise.
        </p>

        <QcmQuiz />

        <div className="qcm-logic">
          {qcmLogic.map((item) => (
            <div className="qcm-row" key={item.statement}>
              <span className={`qcm-answer ${item.answer ? 'is-true' : 'is-false'}`}>
                {item.answer ? 'TRUE' : 'FALSE'}
              </span>
              <div>
                <strong>{item.statement}</strong>
                <p>{item.logic}</p>
              </div>
            </div>
          ))}
        </div>

        <h3>Chapter 1 backup — the definitions worth free points</h3>
        <div className="definition-grid">
          <article className="definition-card">
            <span className="definition-tag">Compiler vs interpreter</span>
            <h3>Whole program, or line by line?</h3>
            <p>
              A compiler translates the whole program to machine code before it runs; static types are checked
              ahead of time (C). An interpreter executes while reading; types are checked at runtime (Python, Lisp).
            </p>
          </article>
          <article className="definition-card">
            <span className="definition-tag">Front-end</span>
            <h3>Analysis</h3>
            <p>
              Lexical analysis → syntax analysis → semantic analysis, with the symbol table and error handler
              supporting every stage. The output is an annotated syntax tree.
            </p>
          </article>
          <article className="definition-card">
            <span className="definition-tag">Back-end</span>
            <h3>Generation</h3>
            <p>
              Intermediate code → optimisation → target code. The back-end turns the analysed program into something
              the machine can run.
            </p>
          </article>
          <article className="definition-card">
            <span className="definition-tag">AST vs parse tree</span>
            <h3>Clean tree vs full tree</h3>
            <p>
              A parse tree contains every grammar symbol, including punctuation and chain rules. An AST keeps only
              the meaningful structure — operators, operands and declarations.
            </p>
          </article>
        </div>
      </section>

      <section id="finish">
        <SectionHeading id="finish">The finish line</SectionHeading>
        <p>
          You have reached the end of the guide. The goal now is not to read more; it is to make the six recipes
          retrievable under exam pressure. Here is the final checklist.
        </p>

        <div className="finish-grid">
          <div className="finish-card">
            <ShieldCheck size={20} aria-hidden="true" />
            <h3>Before you start writing</h3>
            <ul>
              <li>Scan the paper and mark the points for each exercise.</li>
              <li>Do the LL(1) question first if it carries the most points.</li>
              <li>Write the recipe name beside each answer — method earns marks.</li>
            </ul>
          </div>
          <div className="finish-card">
            <ShieldCheck size={20} aria-hidden="true" />
            <h3>If you get stuck</h3>
            <ul>
              <li>For a drawing, ask what the state must remember.</li>
              <li>For a conversion, write the first equation or the ε-closure.</li>
              <li>For a conflict, compute FIRST before FOLLOW.</li>
            </ul>
          </div>
        </div>

        <div className="finish-checklist">
          <div className="finish-checklist-head">
            <span className="eyebrow">The six-box check</span>
            <h3>Can you do each of these without notes?</h3>
          </div>
          <ul>
            <li><CircleCheck size={16} aria-hidden="true" /> Read <span className="mono">[...]</span> as a bag of single characters.</li>
            <li><CircleCheck size={16} aria-hidden="true" /> Draw the four standard automata and the dead trap.</li>
            <li><CircleCheck size={16} aria-hidden="true" /> Apply Arden, subset construction, completion and minimization.</li>
            <li><CircleCheck size={16} aria-hidden="true" /> Convert to CNF and remove left recursion in A &lt; B &lt; C order.</li>
            <li><CircleCheck size={16} aria-hidden="true" /> Fill FIRST, FOLLOW and the LL(1) table, then run the stack.</li>
            <li><CircleCheck size={16} aria-hidden="true" /> Read a PDA and answer the five true/false statements.</li>
          </ul>
        </div>

        <Callout variant="key" title="The final check">
          <p>
            Write the five formulas from memory: <M>{String.raw`X=AX+B \Rightarrow X=A^*B`}</M>, the ε-closure rule,
            the direct left-recursion pair, the FIRST pass-through rule, and the FOLLOW end rule. Then trace one
            automaton and one LL(1) word out loud. Stop. You are ready.
          </p>
        </Callout>
      </section>

      <section id="drills">
        <SectionHeading id="drills">Final drills</SectionHeading>
        <DrillList
          items={[
            {
              q: <>A PDA pushes A on every a and pops A on every b, with no free-pop rule. What is L(M)?</>,
              a: <p><M>{String.raw`\{a^n b^n \mid n \ge 0\}`}</M>. Every b must consume exactly one A, so the counts match.</p>,
            },
            {
              q: <>Add the rule δ(q, ε, A) = {'{⟨q, ε⟩}'}. What language do you get?</>,
              a: <p><M>{String.raw`\{a^n b^m \mid n \ge m \ge 0\}`}</M>. Leftover A’s can now disappear without reading input.</p>,
            },
            {
              q: <>Is a left-recursive CFG necessarily ambiguous?</>,
              a: <p>No. <M>{String.raw`S \to Sa \mid a`}</M> is left-recursive but unambiguous. Left recursion breaks LL(1), not unambiguity.</p>,
            },
            {
              q: <>Why can a PDA not recognise <span className="mono">aⁿbⁿcⁿ</span>?</>,
              a: <p>One stack can match two counts. The third count would need information already popped, and the finite states cannot store an unbounded number.</p>,
            },
            {
              q: <>What is the difference between an AST and a parse tree?</>,
              a: <p>A parse tree contains every grammar symbol and rule; an AST keeps only the meaningful structure — operators, operands and declarations.</p>,
            },
          ]}
        />
      </section>

      <Callout variant="key" title="You made it">
        <p>
          That is the whole survival guide. If you can reproduce the six recipes, you have a method for every
          exercise on the paper. Keep the cheat sheet beside you, and use the war room for the final recall pass.
        </p>
        <p>
          <Link className="text-link" to="/cheatsheet">Open the master cheat sheet <ArrowRight size={14} aria-hidden="true" /></Link>
          {' · '}
          <Link className="text-link" to="/war-room">Enter the exam war room <ArrowRight size={14} aria-hidden="true" /></Link>
        </p>
      </Callout>

      <DeepDives stage={stage} />
    </GuideShell>
  )
}
