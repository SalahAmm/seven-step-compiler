import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Automaton } from '../../components/Automaton'
import { ArdenLab } from '../../components/ArdenLab'
import { ComplementLab } from '../../components/ComplementLab'
import { DeepDives, GuideShell } from '../../components/GuideChrome'
import { DrillList } from '../../components/DrillList'
import { M } from '../../components/Math'
import { BoardFigure, Callout, Pill, SectionHeading } from '../../components/ui'
import { dfaEdges, dfaStates, ecloseEdges, ecloseStates, minEdges, minStates, pqrEdges, pqrStates } from '../../data/automata'
import { getGuideStage } from '../../data/guide'

const subsetRows = [
  { state: 'A = {p}', a: 'B', b: '∅', c: '∅', accepting: false },
  { state: 'B = {p, q, r}', a: 'B', b: 'C', c: 'D', accepting: true },
  { state: 'C = {p, r}', a: 'B', b: 'C', c: 'D', accepting: true },
  { state: 'D = {q, r}', a: '∅', b: 'C', c: 'D', accepting: true },
  { state: '∅', a: '∅', b: '∅', c: '∅', accepting: false },
]

const splitRows = [
  { group: 'Group 0', states: 'S₀', behaviour: 'Non-accepting. Stays in Group 0 on b, enters Group 1 on a.' },
  { group: 'Group 1', states: 'S₁, S₂, S₃, S₄', behaviour: 'All accepting. On a and b, all four stay inside Group 1 — no split.' },
]

export function Guide03() {
  const stage = getGuideStage(3)!

  return (
    <GuideShell stage={stage}>
      <p className="lead-in">
        Stage 3 is the conversion stage. Every exercise gives you one object and asks for another: automaton to
        regex, regex to automaton, NFA to DFA, DFA to its complement, or DFA to a smaller DFA. Each direction has a
        mechanical recipe, so do not improvise. Write the steps in order and the points follow.
      </p>

      <section id="arden">
        <SectionHeading id="arden">Arden’s lemma — automaton or grammar to regex</SectionHeading>
        <p>
          Arden’s lemma turns a picture into algebra. Give every state its own unknown language{' '}
          <M>{String.raw`X_p`}</M>: the set of words that carry the machine from <M>{String.raw`p`}</M> to an
          accepting state. Then read the arrows as equations.
        </p>

        <M block focus>{String.raw`X = AX + B \quad\text{and}\quad \varepsilon \notin A \quad\Longrightarrow\quad X = A^*B`}</M>

        <p>
          The shape is always the same: <M>{String.raw`X`}</M> appears on both sides, something <M>{String.raw`A`}</M>{' '}
          sits in front of the recursive copy, and <M>{String.raw`B`}</M> is everything else. The solution loops{' '}
          <M>{String.raw`A`}</M> any number of times, then finishes with <M>{String.raw`B`}</M>. Keep that order.
        </p>

        <ol className="steps">
          <li>
            <strong>Write one equation per state.</strong>
            <p>
              For each arrow <M>{String.raw`P \xrightarrow{a} Q`}</M>, write <M>{String.raw`aX_q`}</M>. Join
              alternatives with <M>{String.raw`+`}</M>. If <M>{String.raw`P`}</M> is accepting, add{' '}
              <M>{String.raw`+\varepsilon`}</M>. If <M>{String.raw`P \xrightarrow{\varepsilon} Q`}</M>, add{' '}
              <M>{String.raw`+X_q`}</M> with no letter in front.
            </p>
          </li>
          <li>
            <strong>Substitute from the bottom up.</strong>
            <p>
              Eliminate the states furthest from the start first. Replace each occurrence of that variable by its
              whole right-hand side, then simplify.
            </p>
          </li>
          <li>
            <strong>Apply Arden every time the same variable appears on both sides.</strong>
            <p>
              Factor the recursive part first: <M>{String.raw`X = aX + bX + C = (a+b)X + C`}</M>. Then read off{' '}
              <M>{String.raw`X = (a+b)^*C`}</M>.
            </p>
          </li>
        </ol>

        <Callout variant="trap" title="Never swap A and B">
          <p>
            <M>{String.raw`X = AX + B`}</M> gives <M>{String.raw`A^*B`}</M>, not <M>{String.raw`BA^*`}</M>.
            Concatenation is not commutative, so swapping them changes the language. The star always stays on the
            loop, and the exit always comes last.
          </p>
        </Callout>

        <BoardFigure
          title="Interro 1 · Exercise 04"
          note="P start · R accepting · Q → R is ε"
          label="Three-state NFA P, Q, R. P is start, R is accepting, Q has an epsilon transition to R."
          caption={
            <>
              <strong>Read the arrows first.</strong> <span className="mono">P</span> loops on{' '}
              <span className="mono">a</span> and branches to <span className="mono">Q</span> on{' '}
              <span className="mono">a</span>. <span className="mono">Q</span> returns to{' '}
              <span className="mono">P</span> on <span className="mono">b</span> and teleports to{' '}
              <span className="mono">R</span> on <span className="mono">ε</span>. <span className="mono">R</span>{' '}
              loops on <span className="mono">b</span>, returns to <span className="mono">Q</span> on{' '}
              <span className="mono">c</span>, and jumps to <span className="mono">P</span> on{' '}
              <span className="mono">b</span>.
            </>
          }
        >
          <Automaton
            states={pqrStates}
            edges={pqrEdges}
            width={720}
            height={360}
            radius={29}
            ariaLabel="NFA with states P, Q, R for the Arden walkthrough."
          />
        </BoardFigure>

        <h3>The official walkthrough, line by line</h3>
        <p>
          The grammar behind the drawing is <M>{String.raw`P \to aP \mid aQ`}</M>,{' '}
          <M>{String.raw`Q \to bP \mid R`}</M>, and <M>{String.raw`R \to bR \mid cQ \mid bP \mid \varepsilon`}</M>.
          Read each production as an equation:
        </p>
        <M block>{String.raw`X_p = aX_p + aX_q`}</M>
        <M block>{String.raw`X_q = bX_p + X_r`}</M>
        <M block>{String.raw`X_r = bX_r + cX_q + bX_p + \varepsilon`}</M>

        <p>
          Substitute <M>{String.raw`X_q`}</M> into the other two equations. Group equal variables as you go:
        </p>
        <M block>{String.raw`X_p = (a + ab)X_p + aX_r`}</M>
        <M block>{String.raw`X_r = (b + c)X_r + (cb + b)X_p + \varepsilon`}</M>

        <p>
          Now <M>{String.raw`X_r`}</M> has the Arden shape with <M>{String.raw`A = b+c`}</M> and{' '}
          <M>{String.raw`B = (cb+b)X_p + \varepsilon`}</M>. Apply the lemma:
        </p>
        <M block>{String.raw`X_r = (b+c)^*(cb+b)X_p + (b+c)^*`}</M>

        <p>Put that back into <M>{String.raw`X_p`}</M>, factor <M>{String.raw`X_p`}</M>, and apply Arden once more:</p>
        <M block>{String.raw`X_p = \bigl(a + ab + a(b+c)^*(cb+b)\bigr)X_p + a(b+c)^*`}</M>
        <M block focus>{String.raw`X_p = \bigl(a + ab + a(b+c)^*(cb+b)\bigr)^*\, a(b+c)^*`}</M>

        <ArdenLab />

        <Callout variant="note" title="Set 1, Exercise 04 — a correction worth knowing">
          <p>
            In that exercise the start state loops on <span className="mono">0</span> and leaves on{' '}
            <span className="mono">1</span>: <M>{String.raw`X_a = 0X_a + 1X_b`}</M>. Arden gives{' '}
            <M>{String.raw`X_a = 0^*1X_b`}</M>. The handwritten correction once printed <M>{String.raw`0^+`}</M>.
            It must be <M>{String.raw`0^*`}</M>: you are allowed to take zero copies of the loop before reading the{' '}
            <span className="mono">1</span>.
          </p>
        </Callout>
      </section>

      <section id="determinize">
        <SectionHeading id="determinize">NFA → DFA — subset construction</SectionHeading>
        <p>
          A DFA may not guess. Subset construction removes guessing by making every DFA state a <em>set</em> of NFA
          states: “all the places I could be after reading this prefix.” The first tool is the ε-closure.
        </p>

        <Callout variant="key" title="ε-closure in one sentence">
          <p>
            From a state, walk along <strong>only ε-arrows</strong> as far as possible. The ε-closure is every state
            you can reach that way, including the state you started from.
          </p>
        </Callout>

        <BoardFigure
          title="ε-closure · a chain of free moves"
          note="q0 → q1 → q2 on ε"
          label="Three states connected by epsilon transitions."
          caption={
            <>
              <M>{String.raw`\text{ECLOSE}(q_0) = \{q_0,q_1,q_2\}`}</M>,{' '}
              <M>{String.raw`\text{ECLOSE}(q_1) = \{q_1,q_2\}`}</M>, and{' '}
              <M>{String.raw`\text{ECLOSE}(q_2) = \{q_2\}`}</M>. The start state always includes itself.
            </>
          }
        >
          <Automaton
            states={ecloseStates}
            edges={ecloseEdges}
            width={640}
            height={280}
            ariaLabel="Three-state epsilon closure chain q0 to q1 to q2."
          />
        </BoardFigure>

        <ol className="steps">
          <li>
            <strong>Start with the closure of the old start state.</strong>
            <p>
              The DFA start state is <M>{String.raw`\text{ECLOSE}(q_0)`}</M>, written as one set.
            </p>
          </li>
          <li>
            <strong>For each set and each letter, collect every destination.</strong>
            <p>
              If any state in the set has an arrow labelled <span className="mono">a</span>, collect its target. Then
              take the ε-closure of the whole collection. That closure is the next DFA state.
            </p>
          </li>
          <li>
            <strong>Repeat until no new set appears.</strong>
            <p>
              A set is accepting exactly when it contains at least one old accepting state. Missing destinations go
              to the empty set <M>{String.raw`\emptyset`}</M>.
            </p>
          </li>
        </ol>

        <h3>The full table for Interro 1, Exercise 04</h3>
        <p>
          The NFA has start <M>{String.raw`P`}</M>, accepting <M>{String.raw`R`}</M>, and the free move{' '}
          <M>{String.raw`Q \xrightarrow{\varepsilon} R`}</M>, so <M>{String.raw`\text{ECLOSE}(Q)=\{Q,R\}`}</M>.
          Following the recipe gives five DFA states:
        </p>

        <div className="table-wrap">
          <table className="data-table">
            <caption>Subset table. The right-hand column marks groups that contain the old accepting state R.</caption>
            <thead>
              <tr>
                <th scope="col">DFA state</th>
                <th scope="col">on a</th>
                <th scope="col">on b</th>
                <th scope="col">on c</th>
                <th scope="col">Accepting?</th>
              </tr>
            </thead>
            <tbody>
              {subsetRows.map((row) => (
                <tr key={row.state}>
                  <td className="mono">{row.state}</td>
                  <td className="mono">{row.a}</td>
                  <td className="mono">{row.b}</td>
                  <td className="mono">{row.c}</td>
                  <td>{row.accepting ? <Pill tone="ok">yes</Pill> : <Pill tone="bad">no</Pill>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <BoardFigure
          title="The determinized DFA"
          note="A start · B, C, D accepting · ∅ sink"
          label="Determinized DFA with states A, B, C, D and sink state empty set."
          caption={
            <>
              Groups <span className="mono">B</span>, <span className="mono">C</span> and{' '}
              <span className="mono">D</span> all contain <span className="mono">R</span>, so all three are
              accepting. The empty group is the sink.
            </>
          }
        >
          <Automaton
            states={dfaStates}
            edges={dfaEdges}
            width={780}
            height={470}
            radius={27}
            ariaLabel="Determinized DFA with sink state."
          />
        </BoardFigure>

        <Callout variant="trap" title="Three determinization mistakes">
          <p>
            <strong>1. Forgetting the ε-closure after moving.</strong> The destination is not just where the letter
            lands; it is the closure of every landing spot.
          </p>
          <p>
            <strong>2. Missing the empty set.</strong> If a letter has no destination, the DFA still needs a state
            for it — the sink <M>{String.raw`\emptyset`}</M>.
          </p>
          <p>
            <strong>3. Marking a group accepting because it is “mostly” accepting.</strong> One old accepting state
            inside the set is enough.
          </p>
        </Callout>
      </section>

      <section id="complement">
        <SectionHeading id="complement">Complete, then complement</SectionHeading>
        <p>
          Complement means “accept exactly the words the original rejects.” The transitions do not change at all.
          Only the double circles flip — but the flip is only correct after the DFA is complete.
        </p>

        <div className="compare-grid">
          <div className="compare-card">
            <div className="compare-card-head"><Pill tone="ok">Step 1 · Complete</Pill><span className="mono">add ∅</span></div>
            <p>
              Add one non-accepting sink state. Point every missing arrow at it, and give it a self-loop on every
              letter. Now every state has exactly one arrow per letter.
            </p>
          </div>
          <div className="compare-card">
            <div className="compare-card-head"><Pill tone="bad">Step 2 · Flip</Pill><span className="mono">accept ↔ reject</span></div>
            <p>
              Turn every double circle into a single circle, and every single circle into a double circle. The sink
              becomes accepting, because a word that dies there is a word the original rejected.
            </p>
          </div>
        </div>

        <ComplementLab />

        <Callout variant="trap" title="The order is the whole trick">
          <p>
            If you flip before completing, the sink state does not exist yet, so you never make it accepting. The
            complement then rejects words that should be accepted. Complete first, flip second, and do not move a
            single arrow.
          </p>
        </Callout>
      </section>

      <section id="minimize">
        <SectionHeading id="minimize">Minimization — the split game</SectionHeading>
        <p>
          Two states are equivalent when every possible suffix leads them to the same accept/reject answer. The
          split game finds those equivalent states by separating the ones that behave differently.
        </p>

        <ol className="steps">
          <li>
            <strong>Split by acceptance.</strong>
            <p>
              Put all non-accepting states in Group 0 and all accepting states in Group 1. These are the initial
              groups.
            </p>
          </li>
          <li>
            <strong>Check every group, letter by letter.</strong>
            <p>
              If two states in the same group go to <em>different groups</em> on the same letter, split them into
              separate groups. Repeat until a full pass changes nothing.
            </p>
          </li>
          <li>
            <strong>Merge the survivors.</strong>
            <p>
              Each final group becomes one state. Keep the start group as start, and make a group accepting if any
              state inside it was accepting.
            </p>
          </li>
        </ol>

        <h3>Set 1, Exercise 09 — why only two states remain</h3>
        <p>
          The DFA has one non-accepting state <M>{String.raw`S_0`}</M> and four accepting states{' '}
          <M>{String.raw`S_1,S_2,S_3,S_4`}</M>. Look at the accepting group:
        </p>

        <div className="table-wrap">
          <table className="data-table">
            <caption>The split table. Nobody leaves Group 1, so no accepting state can be separated from the others.</caption>
            <thead><tr><th scope="col">Group</th><th scope="col">States</th><th scope="col">Behaviour on a and b</th></tr></thead>
            <tbody>
              {splitRows.map((row) => (
                <tr key={row.group}>
                  <td className="mono">{row.group}</td>
                  <td className="mono">{row.states}</td>
                  <td>{row.behaviour}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>
          On <span className="mono">a</span> and on <span className="mono">b</span>, all four accepting states land
          inside the accepting group. Group 1 never splits. The minimal machine is just{' '}
          <M>{String.raw`S_0`}</M> and one merged accepting state:
        </p>

        <BoardFigure
          title="Minimal DFA"
          note="2 states instead of 5"
          label="Minimal DFA with two states, S0 non-accepting and G2 accepting."
          caption={
            <>
              From <span className="mono">S₀</span>, <span className="mono">a</span> enters the accepting group and{' '}
              <span className="mono">b</span> stays. Inside the accepting group, every letter loops. That is the
              whole machine.
            </>
          }
        >
          <Automaton
            states={minStates}
            edges={minEdges}
            width={600}
            height={280}
            ariaLabel="Minimal two-state DFA."
          />
        </BoardFigure>

        <Callout variant="note" title="If your teacher uses the X-grid">
          <p>
            Put an <strong>X</strong> on every pair that mixes one accepting and one non-accepting state. Then put an
            X on any remaining pair <M>{String.raw`(X,Y)`}</M> when some letter sends them to a pair that already has
            an X. Repeat until stable. Pairs with no X are equivalent and merge. The split game and the X-grid are
            the same algorithm in two costumes.
          </p>
        </Callout>
      </section>

      <section id="drills">
        <SectionHeading id="drills">Quick-check drills</SectionHeading>
        <p>Solve on paper first. The answers reward the exact order of operations, not just the final string.</p>
        <DrillList
          items={[
            {
              q: (
                <>
                  Solve <M>{String.raw`X = aX + bY`}</M> and <M>{String.raw`Y = cY + d + \varepsilon`}</M>. Find{' '}
                  <M>{String.raw`X`}</M>.
                </>
              ),
              a: (
                <>
                  <p>
                    <M>{String.raw`Y = c^*(d+\varepsilon)`}</M>. Substitute:{' '}
                    <M>{String.raw`X = aX + bc^*(d+\varepsilon)`}</M>, so{' '}
                    <M>{String.raw`X = a^*bc^*(d+\varepsilon)`}</M>.
                  </p>
                </>
              ),
            },
            {
              q: <>What is the ε-closure of <span className="mono">q0</span> when <span className="mono">q0 →ε q1 →ε q2</span>?</>,
              a: <p><M>{String.raw`\{q_0,q_1,q_2\}`}</M>. The closure includes the starting state itself.</p>,
            },
            {
              q: <>Why must you complete a DFA before flipping its accepting states?</>,
              a: <p>Because the missing sink state would otherwise never be created. After completion it is non-accepting; after the flip it must become accepting, since words that die there were rejected by the original.</p>,
            },
            {
              q: <>In minimization, when can two accepting states be merged?</>,
              a: <p>When every letter sends them to states in the same current group. If one goes to an accepting group and the other to a non-accepting group, they split.</p>,
            },
          ]}
        />
      </section>

      <Callout variant="key" title="What you can now do">
        <p>
          You can turn a drawing into an equation and solve it with Arden, build a subset table, complete and
          complement a DFA in the safe order, and shrink it with the split game. That covers Set 1 Exercise 4 and 9
          and the whole of Interro 1 Exercise 4.
        </p>
        <p>
          Next: Stage 4 leaves machines behind and turns rules into grammars.{' '}
          <Link className="text-link" to="/guide/4">
            Continue to grammars <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </p>
      </Callout>

      <DeepDives stage={stage} />
    </GuideShell>
  )
}
