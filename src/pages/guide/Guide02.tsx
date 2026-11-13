import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Automaton } from '../../components/Automaton'
import type { AutoEdge, AutoState } from '../../components/Automaton'
import { DfaRunner } from '../../components/Machine'
import { GuideShell, DeepDives } from '../../components/GuideChrome'
import { DrillList } from '../../components/DrillList'
import { M } from '../../components/Math'
import { BoardFigure, Callout, Pill, SectionHeading } from '../../components/ui'
import {
  limitEdges,
  limitStates,
  mod3Edges,
  mod3States,
  productEdges,
  productStates,
} from '../../data/automata'
import { getGuideStage } from '../../data/guide'

const ends00States: AutoState[] = [
  { id: 'q0', label: '0', x: 120, y: 175, start: true },
  { id: 'q1', label: '1', x: 330, y: 175 },
  { id: 'q2', label: '2', x: 540, y: 175, accepting: true },
]

const ends00Edges: AutoEdge[] = [
  { from: 'q0', to: 'q0', label: '1', loop: 'above' },
  { from: 'q0', to: 'q1', label: '0' },
  { from: 'q1', to: 'q0', label: '1', bend: 28 },
  { from: 'q1', to: 'q2', label: '0' },
  { from: 'q2', to: 'q0', label: '1', bend: 78 },
  { from: 'q2', to: 'q2', label: '0', loop: 'above' },
]

const mistakes = [
  {
    title: 'Forgetting the dead state',
    copy: '“Does not contain 110” needs a trap state that loops on every letter. Without it, a later 0 can accidentally revive the machine.',
  },
  {
    title: 'Marking the wrong states',
    copy: 'For a “does not contain” machine, every state before the forbidden pattern is accepting. Only the trap is non-accepting.',
  },
  {
    title: 'Resetting to the wrong state',
    copy: 'When a prefix breaks, return to the state that matches the new suffix — not always to the start. “Ends in 00” resets to 0 on 1, but “ends in 01” has a different fallback.',
  },
  {
    title: 'Accepting ε by accident',
    copy: 'If the empty word is not in the language, the start state must not be a double circle. Check this on every drawing.',
  },
]

export function Guide02() {
  const stage = getGuideStage(2)!

  return (
    <GuideShell stage={stage}>
      <p className="lead-in">
        Think of an automaton as a board-game map. You start on one square, read one letter at a time, and follow
        the road with that label. If the word ends on a double circle, the word wins. Almost every exam drawing is
        one of four standard maps — learn the maps, not individual answers.
      </p>

      <section id="anatomy">
        <SectionHeading id="anatomy">The map & the two machine types</SectionHeading>
        <p>
          A <strong>state</strong> is a square on the board. A <strong>transition</strong> is a labelled road. The
          start state has an arrow from nowhere; accepting states are double circles. A word is accepted when the
          road you follow ends on a double circle.
        </p>

        <div className="compare-grid">
          <div className="compare-card">
            <div className="compare-card-head"><Pill tone="ok">DFA · strict</Pill><span className="mono">deterministic</span></div>
            <p>
              Exactly one arrow per letter from every state. No ε-arrows. The machine never has to guess.
            </p>
          </div>
          <div className="compare-card">
            <div className="compare-card-head"><Pill>NFA · chill</Pill><span className="mono">nondeterministic</span></div>
            <p>
              A state may have zero, one or several arrows for the same letter, and may have ε-arrows that move
              for free. It accepts if <em>some</em> path accepts.
            </p>
          </div>
        </div>

        <p>
          The exam often draws an <strong>incomplete DFA</strong>: a missing arrow means the word dies there. That is
          allowed for a drawing, but complement later requires a complete DFA with an explicit sink.
        </p>

        <BoardFigure
          title="Recipe 1 · words ending in 00"
          note="Σ = {0, 1}"
          label="DFA for words ending in 00. State 0 is start, state 2 is accepting."
          caption={<>The states record the longest useful suffix seen so far: nothing, one 0, or two 0’s.</>}
        >
          <Automaton
            states={ends00States}
            edges={ends00Edges}
            width={660}
            height={300}
            ariaLabel="DFA for binary words ending in 00."
          />
        </BoardFigure>
      </section>

      <section id="recipes">
        <SectionHeading id="recipes">The four drawing recipes</SectionHeading>

        <div className="recipe-list">
          <article className="recipe-card">
            <div className="recipe-head"><span className="recipe-num">R1</span><h3>“Ends with…” or “contains at least…”</h3></div>
            <p className="recipe-when"><strong>When:</strong> the condition is about a prefix or a count of matches.</p>
            <p>
              Track how much of the target you have seen. For <strong>ends in 00</strong>, the three states mean:
              nothing useful, one 0, two 0’s. A 1 breaks the streak and sends you back; while in state 2, another 0
              keeps you accepting.
            </p>
            <p>
              For <strong>contains at least three 1’s</strong>, use a chain of four states:
            </p>
            <div className="state-chain" aria-label="Four-state chain counting ones">
              <span>0</span><em>1</em><span>1</span><em>1</em><span>2</span><em>1</em><span className="accept">3</span>
            </div>
            <p className="recipe-trap">
              Put a <span className="mono">0</span> self-loop on every state. Once you reach state 3, put a{' '}
              <span className="mono">0,1</span> self-loop so any extra letter keeps you accepting.
            </p>
          </article>

          <article className="recipe-card">
            <div className="recipe-head"><span className="recipe-num">R2</span><h3>“Does NOT contain XYZ” — flip to a trap</h3></div>
            <p className="recipe-when"><strong>When:</strong> the forbidden substring is stated directly.</p>
            <p>
              Build the machine that <em>does</em> contain <span className="mono">XYZ</span>. Then make the final
              state a single-circle <strong>dead trap</strong> that loops forever, and make every earlier state a
              double circle.
            </p>
            <p>
              Example: no <span className="mono">110</span>. States 0 and 1 are accepting; state 2 is accepting
              after seeing <span className="mono">11</span>; reading 0 from state 2 reaches the trap.
            </p>
            <p className="recipe-trap">
              For no <span className="mono">aba</span>, the trap is reached after <span className="mono">aba</span>.
              On <span className="mono">b</span> from state 2 (having seen <span className="mono">ab</span>), go
              back to 0 — don’t go to the trap.
            </p>
          </article>

          <article className="recipe-card">
            <div className="recipe-head"><span className="recipe-num">R3</span><h3>“Even / odd / multiple of k” — remainder states</h3></div>
            <p className="recipe-when"><strong>When:</strong> the condition counts occurrences modulo something.</p>
            <p>
              Name each state after the remainder. For “number of a’s is a multiple of 3”, use states 0, 1, 2:
              reading <span className="mono">a</span> advances, and <span className="mono">b</span> or{' '}
              <span className="mono">c</span> loops in place.
            </p>
            <p className="recipe-trap">
              For two independent counts, use the product grid: even a’s × b’s divisible by 3 gives{' '}
              <M>{String.raw`2 \times 3 = 6`}</M> states. Reading <span className="mono">a</span> flips the first
              coordinate; reading <span className="mono">b</span> advances the second.
            </p>
          </article>

          <article className="recipe-card">
            <div className="recipe-head"><span className="recipe-num">R4</span><h3>Decimal numbers — use the mod trick</h3></div>
            <p className="recipe-when"><strong>When:</strong> the language is “decimal numbers divisible by 3” or “no leading zeros”.</p>
            <p>
              Because <M>{String.raw`10 \equiv 1 \pmod 3`}</M>, appending digit <M>{String.raw`d`}</M> updates the
              remainder as:
            </p>
            <M block quiet>{String.raw`\text{new state} = (\text{old state} + d) \bmod 3`}</M>
            <p>
              From state 0, the digits <span className="mono">{'{0,3,6,9}'}</span> loop,{' '}
              <span className="mono">{'{1,4,7}'}</span> go to 1, and <span className="mono">{'{2,5,8}'}</span> go
              to 2. The other states shift the same groups by one.
            </p>
            <p className="recipe-trap">
              If the empty word must not be accepted, add a separate start state with the same outgoing arrows as 0,
              but a single circle.
            </p>
          </article>
        </div>

        <h3>The two counting shapes</h3>
        <div className="guide-figure-grid">
          <BoardFigure
            title="One counter · mod 3"
            note="Σ = {a, b, c}"
            label="Three-state DFA counting a's modulo 3."
            caption={<>Only <span className="mono">a</span> advances; <span className="mono">b</span> and <span className="mono">c</span> loop.</>}
          >
            <Automaton
              states={mod3States}
              edges={mod3Edges}
              width={620}
              height={340}
              ariaLabel="DFA counting a's modulo 3."
            />
          </BoardFigure>
          <BoardFigure
            title="Two counters · even a × b mod 3"
            note="6 states = 2 × 3"
            label="Product DFA with six states for even a count and b count divisible by 3."
            caption={<>The grid is the product of the two independent counters. Accepting is the pair <span className="mono">(0,0)</span>.</>}
          >
            <Automaton
              states={productStates}
              edges={productEdges}
              width={760}
              height={420}
              ariaLabel="Product DFA for even a count and b count divisible by 3."
            />
          </BoardFigure>
        </div>
      </section>

      <section id="limit">
        <SectionHeading id="limit">Numbers below 139, no leading zeros</SectionHeading>
        <p>
          Split by the number of digits. That is the entire trick. The start state reads the first digit; after
          that, each branch knows whether it is already safe or one digit away from 139.
        </p>

        <BoardFigure
          title="Numbers less than 139"
          note="0–138 · no useless leading zeros"
          label="Automaton for decimal numbers from 0 to 138 with no leading zeros."
          caption={
            <>
              The accepting dead-end after <span className="mono">0</span> prevents <span className="mono">01</span>.
              Every other accepting state allows exactly the digits that keep the number below 139.
            </>
          }
        >
          <Automaton
            states={limitStates}
            edges={limitEdges}
            width={800}
            height={470}
            ariaLabel="Automaton for numbers less than 139."
          />
        </BoardFigure>

        <Callout variant="note" title="This compact drawing is an NFA">
          <p>
            From the start state, a leading <span className="mono">1</span> can begin either a two-digit number
            (10–19) or a three-digit number (100–138), so two arrows leave on the same letter. That is what keeps the
            case split readable. If the question says <strong>DFA</strong>, split that first state into its two
            futures, or run the subset construction from Stage 3. The accepted numbers do not change.
          </p>
        </Callout>

        <div className="table-wrap">
          <table className="data-table">
            <caption>The branches in words.</caption>
            <thead><tr><th scope="col">After…</th><th scope="col">You may read</th><th scope="col">Because…</th></tr></thead>
            <tbody>
              <tr><td>first digit 2–9</td><td>one more digit</td><td>20–99, then stop</td></tr>
              <tr><td>first digit 1</td><td>0–2 for the second digit</td><td>10–12 can grow to 100–129</td></tr>
              <tr><td>first digits 13</td><td>third digit 0–8</td><td>130–138; 139 is excluded</td></tr>
              <tr><td>first digits 14–19</td><td>nothing</td><td>already under 139; a third digit would exceed it</td></tr>
            </tbody>
          </table>
        </div>

        <DfaRunner preset="no110" caption="Step the “no 110” machine and watch the trap state." />
      </section>

      <section id="mistakes">
        <SectionHeading id="mistakes">Four drawing mistakes</SectionHeading>
        <div className="mistake-grid">
          {mistakes.map((mistake, index) => (
            <article className="mistake-card" key={mistake.title}>
              <span className="mistake-num">0{index + 1}</span>
              <h3>{mistake.title}</h3>
              <p>{mistake.copy}</p>
            </article>
          ))}
        </div>
        <Callout variant="key" title="The quick self-check">
          <p>
            Before you hand in any automaton: (1) is the start arrow there? (2) does every state have an arrow for
            every letter? (3) is the accepting set exactly right, including ε? (4) does the dead state really loop?
            Those four questions catch most lost points.
          </p>
        </Callout>
      </section>

      <section id="drills">
        <SectionHeading id="drills">Quick-check drills</SectionHeading>
        <DrillList
          items={[
            {
              q: <>Draw a DFA over <span className="mono">{'{0,1}'}</span> for “contains at least three 1’s”. How many states?</>,
              a: <p>Four states: 0, 1, 2, 3, with 3 accepting. Put a 0 self-loop on every state, and a 0,1 self-loop on 3.</p>,
            },
            {
              q: <>What changes when the language is “does not contain 110”?</>,
              a: <p>The state that first sees 110 becomes a non-accepting trap with a 0,1 self-loop; all earlier states become accepting. The arrows do not change.</p>,
            },
            {
              q: <>Why is the state 0 accepting in the mod-3 machine?</>,
              a: <p>Zero a’s gives remainder 0, and 0 is divisible by 3. If the empty word must be excluded, use a separate start state.</p>,
            },
            {
              q: <>For numbers below 139, why does reading 0 from the start lead to a dead-end?</>,
              a: <p>It accepts the single number 0, but no further digit may follow a leading zero. Otherwise 01 would look like a valid two-digit number.</p>,
            },
          ]}
        />
      </section>

      <Callout variant="key" title="What you can now do">
        <p>
          You can choose the correct standard map, label its states, and explain why each arrow exists. That is the
          entire drawing section of the exam. <Link className="text-link" to="/guide/3">Next: convert machines into regex and back <ArrowRight size={14} aria-hidden="true" /></Link>
        </p>
      </Callout>

      <DeepDives stage={stage} />
    </GuideShell>
  )
}
