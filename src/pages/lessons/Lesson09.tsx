import { Link } from 'react-router-dom'
import { ArrowRight, CircleCheck } from 'lucide-react'
import { M } from '../../components/Math'
import { Automaton } from '../../components/Automaton'
import type { AutoEdge, AutoState } from '../../components/Automaton'
import { BoardFigure, Callout, Pill, SectionHeading } from '../../components/ui'
import { PdaLab } from '../../components/PdaLab'
import { LessonShell } from './LessonShell'

const anbnStates: AutoState[] = [
  { id: 'q0', label: 'q0', x: 120, y: 175, start: true },
  { id: 'q1', label: 'q1', x: 390, y: 175 },
  { id: 'qf', label: 'qf', x: 655, y: 175, accepting: true },
]

const anbnEdges: AutoEdge[] = [
  { from: 'q0', to: 'q0', label: 'a, ε / A', loop: 'above' },
  { from: 'q0', to: 'q1', label: 'ε, ε / ε', bend: 0 },
  { from: 'q1', to: 'q1', label: 'b, A / ε', loop: 'above' },
  { from: 'q1', to: 'qf', label: 'ε, # / ε', bend: 0 },
]

const transitionRows = [
  {
    move: 'Push A',
    delta: 'δ(q, a, ε) = {⟨q, A⟩}',
    stack: 'A is placed on top. Nothing is popped first.',
    use: 'Count each a.',
  },
  {
    move: 'Pop A',
    delta: 'δ(q, b, A) = {⟨q, ε⟩}',
    stack: 'The top A must be there, then it is removed. Nothing is pushed.',
    use: 'Match each b against an a.',
  },
  {
    move: 'Change phase',
    delta: 'δ(q, ε, ε) = {⟨q′, ε⟩}',
    stack: 'No input is read and the stack is untouched.',
    use: 'Move from pushing to popping.',
  },
  {
    move: 'Accept',
    delta: 'δ(q, ε, #) = {⟨qf, ε⟩}',
    stack: 'The bottom marker is on top, so every plate has been cleared.',
    use: 'Finish only when the stack is back to #.',
  },
]

export function Lesson09() {
  return (
    <LessonShell id={9}>
      <p className="lead-in">
        A pushdown automaton is an NFA with a stack of plates. The finite states still remember a little; the stack
        remembers without limit. That unbounded memory is exactly what separates context-free languages from regular
        ones — and why a PDA can count matching pairs when a DFA cannot.
      </p>

      <section>
        <SectionHeading id="anatomy">The machine</SectionHeading>
        <p>
          A PDA has a finite set of states, an input alphabet, a stack alphabet, a start state, a set of accepting
          states, and a transition relation. The stack is <strong>last in, first out</strong>: only the top plate is
          visible, and only the top plate can be removed. The symbol <M>{String.raw`\#`}</M> marks the bottom.
        </p>

        <Callout variant="key" title="The transition format used in this course">
          <M block>
            {String.raw`\delta(\text{state},\ \text{input letter or }\varepsilon,\ \text{pop or }\varepsilon) = \{\langle \text{next state},\ \text{push or }\varepsilon\rangle\}`}
          </M>
          <p>
            Read the three inputs left to right: where you are, what you consume, and what you require on top of the
            stack. Read the output as: where you go, and what you put back on top.
          </p>
        </Callout>

        <div className="two-col">
          <div className="panel accent">
            <h4>Push without popping</h4>
            <M block quiet>{String.raw`\delta(q,a,\varepsilon) = \{\langle q,A\rangle\}`}</M>
            <p>
              Read <span className="mono">a</span>, require nothing, write <span className="mono">A</span> on top. This
              is how a PDA counts.
            </p>
          </div>
          <div className="panel">
            <h4>Pop without pushing</h4>
            <M block quiet>{String.raw`\delta(q,b,A) = \{\langle q,\varepsilon\rangle\}`}</M>
            <p>
              Read <span className="mono">b</span>, require <span className="mono">A</span> on top, remove it, write
              nothing. This is how a PDA matches.
            </p>
          </div>
        </div>

        <div className="table-wrap">
          <table className="data-table pda-move-table">
            <caption>The four moves you will write in Exercise Set 2, Exercise 04.</caption>
            <thead>
              <tr>
                <th scope="col">Move</th>
                <th scope="col">Formal transition</th>
                <th scope="col">Stack effect</th>
                <th scope="col">Why</th>
              </tr>
            </thead>
            <tbody>
              {transitionRows.map((row) => (
                <tr key={row.move}>
                  <td><strong>{row.move}</strong></td>
                  <td className="mono">{row.delta}</td>
                  <td>{row.stack}</td>
                  <td>{row.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <BoardFigure
          title="PDA for aⁿbⁿ"
          note="Push on a · pop on b · accept at #"
          caption={
            <>
              The loop on <M>{String.raw`q_0`}</M> pushes one <span className="mono">A</span> per
              <span className="mono"> a</span>. The free ε-move switches to <M>{String.raw`q_1`}</M> without reading
              input. The loop on <M>{String.raw`q_1`}</M> pops one <span className="mono">A</span> per
              <span className="mono"> b</span>. When only <M>{String.raw`\#`}</M> remains, the last ε-move accepts.
            </>
          }
        >
          <div className="figure-scroll">
            <Automaton
              states={anbnStates}
              edges={anbnEdges}
              width={780}
              height={330}
              radius={30}
              ariaLabel="Pushdown automaton for a to the n b to the n: q0 pushes A on a, moves to q1 by epsilon, q1 pops A on b, and moves to accepting state qf when the bottom marker is on top."
            />
          </div>
        </BoardFigure>

        <Callout variant="note" title="Acceptance means the stack is empty">
          <p>
            In this course, acceptance happens when the stack has returned to the bottom marker
            <M>{String.raw`\;\#`}</M> and the PDA takes a free move to an accepting state. Reaching an accepting state
            with plates still on the stack is not the acceptance condition being tested here. Always check what is left
            on the stack.
          </p>
        </Callout>
      </section>

      <section>
        <SectionHeading id="patterns">Three build patterns</SectionHeading>
        <p>
          Almost every PDA exercise is one of three shapes. Identify the shape first, then write the transitions in
          phases.
        </p>

        <div className="pattern-grid">
          <article className="pattern-card">
            <div className="pattern-head">
              <span className="pattern-index">01</span>
              <Pill>Equal counts</Pill>
            </div>
            <h3>One push, one pop</h3>
            <M block quiet>{String.raw`L_1 = \{a^n b^n \mid n \ge 0\}`}</M>
            <ol>
              <li><M>{String.raw`q_0`}</M>: on <span className="mono">a</span>, push <span className="mono">A</span>.</li>
              <li><M>{String.raw`q_0 \to q_1`}</M>: free ε-move.</li>
              <li><M>{String.raw`q_1`}</M>: on <span className="mono">b</span>, pop <span className="mono">A</span>.</li>
              <li><M>{String.raw`q_1 \to q_f`}</M>: accept when <span className="mono">#</span> is on top.</li>
            </ol>
            <p className="pattern-note">The counts match because every push must be matched by exactly one pop.</p>
          </article>

          <article className="pattern-card">
            <div className="pattern-head">
              <span className="pattern-index">02</span>
              <Pill>Inequality</Pill>
            </div>
            <h3>Flush the leftovers</h3>
            <M block quiet>{String.raw`L_2 = \{a^n b^m \mid n \ge m \ge 0\}`}</M>
            <ol>
              <li>Push <span className="mono">A</span> for every <span className="mono">a</span>.</li>
              <li>Switch phase for free.</li>
              <li>Pop one <span className="mono">A</span> for every <span className="mono">b</span>.</li>
              <li>
                After the b’s, add <M>{String.raw`\delta(q_1,\varepsilon,A) = \{\langle q_1,\varepsilon\rangle\}`}</M>{' '}
                to throw away unused <span className="mono">A</span>’s.
              </li>
            </ol>
            <p className="pattern-note">
              <M>{String.raw`n \ge m`}</M> means there may be plates left over. The free pop is what allows them to
              disappear without reading input.
            </p>
          </article>

          <article className="pattern-card">
            <div className="pattern-head">
              <span className="pattern-index">03</span>
              <Pill>Nested counts</Pill>
            </div>
            <h3>Two layers of plates</h3>
            <M block quiet>{String.raw`L_3 = \{a^n b^m c\, d^m e^n \mid n,m \ge 0\}`}</M>
            <ol>
              <li>Push <span className="mono">A</span> for every <span className="mono">a</span>.</li>
              <li>Push <span className="mono">B</span> for every <span className="mono">b</span>.</li>
              <li>Read the centre <span className="mono">c</span> and change state; stack untouched.</li>
              <li>Pop <span className="mono">B</span> for every <span className="mono">d</span>.</li>
              <li>Pop <span className="mono">A</span> for every <span className="mono">e</span>, then accept at #.</li>
            </ol>
            <p className="pattern-note">
              The B’s sit above the A’s, so the d’s must be matched before the e’s. The stack’s LIFO order enforces the
              nesting.
            </p>
          </article>
        </div>

        <Callout variant="trap" title="The flush move is not optional">
          <p>
            For <M>{String.raw`a^nb^m`}</M> with <M>{String.raw`n \ge m`}</M>, if you forget
            <M>{String.raw`\;\delta(q_1,\varepsilon,A) = \{\langle q_1,\varepsilon\rangle\}`}</M>, the PDA can only
            accept when <M>{String.raw`n = m`}</M>. The language silently becomes
            <M>{String.raw`\;a^nb^n`}</M>, which is the wrong answer. Any leftover plate that is allowed by the
            inequality needs a free pop.
          </p>
        </Callout>

        <PdaLab />
      </section>

      <section>
        <SectionHeading id="reading">PDA → language</SectionHeading>
        <p>
          The reverse exercise gives you a list of transitions and asks for <M>{String.raw`L(M)`}</M>. Do not guess from
          the state names. Trace the life of one plate and count what it represents.
        </p>
        <p>Exercise Set 2, Exercise 05:</p>
        <div className="delta-list">
          <div><span>1</span><code>δ(q0, a, ε) = {'{'}⟨q0, A⟩{'}'}</code><p>Reads any number of a’s; pushes one A each.</p></div>
          <div><span>2</span><code>δ(q0, ε, ε) = {'{'}⟨q1, ε⟩{'}'}</code><p>Switches phase for free.</p></div>
          <div><span>3</span><code>δ(q1, d, A) = {'{'}⟨q1, ε⟩{'}'}</code><p>Each d pops one A. At most as many d’s as a’s.</p></div>
          <div><span>4</span><code>δ(q1, ε, A) = {'{'}⟨q1, ε⟩{'}'}</code><p>Throws away any leftover A’s, for free.</p></div>
          <div><span>5</span><code>δ(q1, ε, #) = {'{'}⟨q2, ε⟩{'}'}</code><p>Accepts when the stack is back to the bottom marker.</p></div>
        </div>

        <ol className="steps">
          <li>
            <strong>Name the push phase.</strong>
            <p>
              <M>{String.raw`q_0`}</M> reads <span className="mono">a</span> and pushes
              <span className="mono"> A</span>. After <M>{String.raw`n`}</M> a’s, the stack holds
              <M>{String.raw`\;n`}</M> plates of type A.
            </p>
          </li>
          <li>
            <strong>Name the pop phase.</strong>
            <p>
              <M>{String.raw`q_1`}</M> reads <span className="mono">d</span> and pops one
              <span className="mono"> A</span>. So the number of d’s, <M>{String.raw`m`}</M>, cannot exceed
              <M>{String.raw`\;n`}</M>.
            </p>
          </li>
          <li>
            <strong>Interpret the flush and the acceptance.</strong>
            <p>
              Rule 4 removes unused A’s without reading input. Rule 5 accepts only when
              <M>{String.raw`\#`}</M> is on top, which means every A has been removed. Therefore
              <M>{String.raw`\;n \ge m \ge 0`}</M>.
            </p>
          </li>
        </ol>

        <M block focus>{String.raw`L(M) = \{a^n d^m \mid n \ge m \ge 0\}`}</M>

        <Callout variant="key" title="Recognize the pattern, not the letters">
          <p>
            This is Pattern 2 with <span className="mono">d</span> in place of <span className="mono">b</span>. The
            language is exactly <M>{String.raw`a^n b^m`}</M> with <M>{String.raw`n \ge m`}</M>. A PDA does not care
            about the name of the terminal; it cares about the push/pop relation.
          </p>
        </Callout>

        <h3>The four questions to ask any PDA</h3>
        <div className="table-wrap">
          <table className="data-table reading-table">
            <thead>
              <tr>
                <th scope="col">Question</th>
                <th scope="col">What to look for</th>
                <th scope="col">Effect on the language</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>What is pushed?</strong></td>
                <td className="mono">{"δ(q, a, ε) = {⟨q, A⟩}"}</td>
                <td>One plate per letter of the first block.</td>
              </tr>
              <tr>
                <td><strong>What is popped?</strong></td>
                <td className="mono">{"δ(q, d, A) = {⟨q, ε⟩}"}</td>
                <td>One plate per letter of the second block.</td>
              </tr>
              <tr>
                <td><strong>What is flushed?</strong></td>
                <td className="mono">{"δ(q, ε, A) = {⟨q, ε⟩}"}</td>
                <td>Allows an inequality: leftover plates may vanish.</td>
              </tr>
              <tr>
                <td><strong>When is it accepted?</strong></td>
                <td className="mono">{"δ(q, ε, #) = {⟨qf, ε⟩}"}</td>
                <td>Forces the stack to be empty of data plates.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Callout variant="trap" title="Do not count states as letters">
          <p>
            A transition <M>{String.raw`\delta(q_0,\varepsilon,\varepsilon) = \{\langle q_1,\varepsilon\rangle\}`}</M>
            reads no input. It changes the phase, not the word. If you count ε-moves as letters, you will insert symbols
            that never appear in <M>{String.raw`L(M)`}</M>.
          </p>
        </Callout>

        <div className="lesson-takeaway">
          <CircleCheck size={18} aria-hidden="true" />
          <div>
            <strong>Lesson 9 in one sentence.</strong>
            <p>
              Push to count, pop to match, flush to allow leftovers, and accept only when the stack is back to the
              bottom marker.
            </p>
          </div>
        </div>
        <div className="lesson-next">
          <p>All nine lessons are done. The final stage is a QCM, a pipeline map, and a five-point checklist.</p>
          <Link className="text-link" to="/war-room">
            Enter the exam war room <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </LessonShell>
  )
}
