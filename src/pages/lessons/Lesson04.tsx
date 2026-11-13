import { Link } from 'react-router-dom'
import { ArrowRight, CircleCheck } from 'lucide-react'
import { M } from '../../components/Math'
import { Automaton, AutomatonLegend } from '../../components/Automaton'
import { BoardFigure, Callout, SectionHeading } from '../../components/ui'
import { ComplementLab } from '../../components/ComplementLab'
import { dfaEdges, dfaStates, ecloseEdges, ecloseStates, minEdges, minStates } from '../../data/automata'
import { LessonShell } from './LessonShell'

const subsetRows = [
  { state: '→ A', set: '{p}', accepting: false, onA: 'B', onB: '∅', onC: '∅' },
  { state: 'B', set: '{p, q, r}', accepting: true, onA: 'B', onB: 'C', onC: 'D' },
  { state: 'C', set: '{p, r}', accepting: true, onA: 'B', onB: 'C', onC: 'D' },
  { state: 'D', set: '{q, r}', accepting: true, onA: '∅', onB: 'C', onC: 'D' },
  { state: '∅', set: '∅', accepting: false, onA: '∅', onB: '∅', onC: '∅' },
]

const minimizationRows = [
  { state: 'S0', accepting: false, onA: 'S1', onB: 'S0' },
  { state: 'S1', accepting: true, onA: 'S2', onB: 'S3' },
  { state: 'S2', accepting: true, onA: 'S2', onB: 'S2' },
  { state: 'S3', accepting: true, onA: 'S4', onB: 'S3' },
  { state: 'S4', accepting: true, onA: 'S2', onB: 'S3' },
]

export function Lesson04() {
  return (
    <LessonShell id={4}>
      <p className="lead-in">
        Determinization is a translation, not a new invention. Every DFA state is a set of NFA states that the NFA
        could be in after the same input. Once the DFA is complete, complementing it is a one-line change: swap the
        double circles. Minimization then merges states that behave identically.
      </p>

      <section>
        <SectionHeading id="eclose">ε-closures</SectionHeading>
        <p>
          <M>{String.raw`\mathrm{ECLOSE}(q)`}</M> is state <M>{String.raw`q`}</M> itself plus every state reachable from
          <M>{String.raw`\,q`}</M> using only ε-arrows, in zero, one, or more steps.
        </p>

        <BoardFigure
          title="ε-closure demo"
          note="q0 → q1 → q2 are free moves"
          caption={
            <>
              <strong>Closure is transitive.</strong> <M>{String.raw`\mathrm{ECLOSE}(q_0) = \{q_0,q_1,q_2\}`}</M>,
              because the chain of ε-arrows continues through <span className="mono">q1</span>. Also
              <M>{String.raw`\;\mathrm{ECLOSE}(q_1) = \{q_1,q_2\}`}</M> and
              <M>{String.raw`\;\mathrm{ECLOSE}(q_2) = \{q_2\}`}</M>.
            </>
          }
        >
          <div className="figure-scroll">
            <Automaton
              states={ecloseStates}
              edges={ecloseEdges}
              width={700}
              height={330}
              radius={29}
              ariaLabel="Three-state epsilon-closure demo: q0 to q1 to q2 by epsilon arrows, with an a loop on q0."
            />
          </div>
        </BoardFigure>

        <Callout variant="note" title="Closure of a set, not just a state">
          <p>
            During determinization you often need <M>{String.raw`\mathrm{ECLOSE}(S)`}</M> for a whole set
            <M>{String.raw`\,S`}</M>. Take the union of the closures of every state in
            <M>{String.raw`\,S`}</M>. An ε-arrow can be followed at any point, so skipping it would lose accepting
            paths.
          </p>
        </Callout>
      </section>

      <section>
        <SectionHeading id="determinize">Subset construction</SectionHeading>
        <p>
          The start state of the DFA is the ε-closure of the old start. Then, for every new DFA state and every letter,
          follow that letter from <em>all</em> states in the set, and take the ε-closure of the result.
        </p>

        <ol className="steps">
          <li><strong>Start.</strong><p><M>{String.raw`S_0 = \mathrm{ECLOSE}(\text{old start})`}</M>. Put it in the table.</p></li>
          <li><strong>Move on a letter.</strong><p>From every NFA state in the current set, collect all destinations on that letter.</p></li>
          <li><strong>Close the result.</strong><p>Take the ε-closure of the union. That set is the destination DFA state.</p></li>
          <li><strong>Name it if it is new.</strong><p>Add a row and repeat. The empty set is a legal sink state; include it when you need a complete DFA.</p></li>
          <li><strong>Mark accepting sets.</strong><p>A DFA state is accepting if its set contains at least one old accepting state.</p></li>
        </ol>

        <h3>The official Interro 1, Exercise 04 table</h3>
        <p>
          From <M>{String.raw`P \to aP \mid aQ`}</M>, <M>{String.raw`Q \to bP \mid R`}</M>, and
          <M>{String.raw`R \to bR \mid cQ \mid bP \mid \varepsilon`}</M>, the closures are:
          <M>{String.raw`\;\mathrm{ECLOSE}(p)=\{p\}`}</M>,
          <M>{String.raw`\;\mathrm{ECLOSE}(q)=\{q,r\}`}</M>, and
          <M>{String.raw`\;\mathrm{ECLOSE}(r)=\{r\}`}</M>.
        </p>
        <div className="table-wrap">
          <table className="data-table">
            <caption>Each DFA state is a set of NFA states. Accept if the set contains r.</caption>
            <thead>
              <tr>
                <th scope="col">DFA state</th>
                <th scope="col">Set</th>
                <th scope="col">Accept?</th>
                <th scope="col">on a</th>
                <th scope="col">on b</th>
                <th scope="col">on c</th>
              </tr>
            </thead>
            <tbody>
              {subsetRows.map((row) => (
                <tr key={row.state}>
                  <td className="mono">{row.state}</td>
                  <td className="mono">{row.set}</td>
                  <td>{row.accepting ? <span className="yes">yes</span> : <span className="no">no</span>}</td>
                  <td className="mono">{row.onA}</td>
                  <td className="mono">{row.onB}</td>
                  <td className="mono">{row.onC}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <BoardFigure
          title="Determinized DFA · states A, B, C, D, ∅"
          note="accepting = B, C, D"
          caption={
            <>
              <strong>The ∅ state makes it complete.</strong> A on b or c, and D on a, have no NFA destination. Those
              arrows go to the sink ∅, which loops on a, b and c. Without the sink, the DFA would be incomplete, and
              the complement in the next section would be wrong.
            </>
          }
          credit="Interro 1, Exercise 04 (Q3)"
        >
          <div className="figure-scroll">
            <Automaton
              states={dfaStates}
              edges={dfaEdges}
              width={780}
              height={500}
              radius={27}
              ariaLabel="Determinized DFA with states A, B, C, D and sink empty-set state. Accepting states are B, C and D."
            />
          </div>
          <AutomatonLegend
            items={[
              { label: 'start', kind: 'start' },
              { label: 'accepting', kind: 'accept' },
              { label: 'sink / dead', kind: 'dead' },
            ]}
          />
        </BoardFigure>

        <Callout variant="trap" title="No inaccessible states">
          <p>
            Build only from the start state outward. If you add a row for a set that cannot be reached from
            <M>{String.raw`\,S_0`}</M>, the resulting DFA has an inaccessible state. The subset construction naturally
            avoids this.
          </p>
        </Callout>
      </section>

      <section>
        <SectionHeading id="complement">Complete & complement</SectionHeading>
        <p>
          The complement of a DFA <M>{String.raw`A`}</M> accepts exactly the words that
          <M>{String.raw`\,A`}</M> rejects. For this to be true, every word must have a path — the DFA must be
          <strong>complete</strong>. If a letter has no arrow, the machine silently falls off and both the original and
          the complement would reject the word.
        </p>
        <ol className="complement-steps inline-steps">
          <li><span>1</span><div><strong>Determinize.</strong> The machine must be a DFA first.</div></li>
          <li><span>2</span><div><strong>Complete.</strong> Add the sink <M>{String.raw`\emptyset`}</M> and send every missing arrow there.</div></li>
          <li><span>3</span><div><strong>Swap.</strong> Accepting become rejecting, and rejecting become accepting. Keep every arrow identical.</div></li>
        </ol>
        <ComplementLab />
        <p>
          For the DFA above, the original accepts <M>{String.raw`\{B,C,D\}`}</M>. The complement therefore accepts
          <M>{String.raw`\{A,\emptyset\}`}</M>. Notice that the sink state becomes accepting: a word that falls off the
          original machine is <em>not</em> in the original language, so it <em>is</em> in the complement.
        </p>
        <Callout variant="key" title="Complement is not “flip the NFA”">
          <p>
            Flipping the accepting states of an NFA does not generally complement its language, because an NFA accepts
            if <em>some</em> path accepts. After flipping, a word may still have a non-accepting path and an accepting
            path. Determinize first, then flip.
          </p>
        </Callout>
      </section>

      <section>
        <SectionHeading id="minimize">Minimization</SectionHeading>
        <p>
          Two states are equivalent if they are both accepting or both non-accepting, and for every letter their
          destinations are equivalent. The fast partition method starts with the accepting/non-accepting split and
          refines it until no group needs to split.
        </p>
        <ol className="steps">
          <li><strong>Remove inaccessible states.</strong><p>Only states reachable from the start matter.</p></li>
          <li><strong>Initial partition.</strong><p>One group of non-accepting states, one group of accepting states.</p></li>
          <li><strong>Check every group.</strong><p>If two states in a group go to different groups on some letter, split them out. Repeat until stable.</p></li>
          <li><strong>Merge each final group.</strong><p>One state per group; keep the start group as start, and any group containing an accepting state as accepting.</p></li>
        </ol>

        <h3>Exercise Set 1, Exercise 09 — the A2 table</h3>
        <p>
          After determinizing <M>{String.raw`A_1`}</M>, the DFA <M>{String.raw`A_2`}</M> has one non-accepting state and
          four accepting states:
        </p>
        <div className="table-wrap">
          <table className="data-table">
            <caption>A2 before minimization.</caption>
            <thead>
              <tr>
                <th scope="col">State</th>
                <th scope="col">Accept?</th>
                <th scope="col">on a</th>
                <th scope="col">on b</th>
              </tr>
            </thead>
            <tbody>
              {minimizationRows.map((row) => (
                <tr key={row.state}>
                  <td className="mono">{row.state}</td>
                  <td>{row.accepting ? <span className="yes">yes</span> : <span className="no">no</span>}</td>
                  <td className="mono">{row.onA}</td>
                  <td className="mono">{row.onB}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="two-col">
          <div className="panel">
            <h4>Initial partition</h4>
            <p><span className="mono">G1 = {'{S0}'}</span> (non-accepting)</p>
            <p><span className="mono">G2 = {'{S1, S2, S3, S4}'}</span> (accepting)</p>
          </div>
          <div className="panel accent">
            <h4>Does G2 split?</h4>
            <p>
              Every state in G2 goes to a state in G2 on both <span className="mono">a</span> and
              <span className="mono">b</span>. No state behaves differently, so G2 stays together.
            </p>
          </div>
        </div>

        <M block>{String.raw`G_2 = \{S_1,S_2,S_3,S_4\} \;\longrightarrow\; \text{one accepting state } G_2`}</M>

        <BoardFigure
          title="Minimized DFA · A3"
          note="2 states · S0 start, G2 accepting"
          caption={
            <>
              <strong>The final machine.</strong> <span className="mono">S0</span> loops on b and goes to
              <span className="mono"> G2</span> on a. <span className="mono">G2</span> loops on both letters. Every
              original accepting state collapsed into one because their future behaviour was identical.
            </>
          }
          credit="Set 1, Exercise 09"
        >
          <div className="figure-scroll">
            <Automaton
              states={minStates}
              edges={minEdges}
              width={650}
              height={330}
              radius={31}
              ariaLabel="Minimized two-state DFA. S0 is start and non-accepting; G2 is accepting and loops on a and b."
            />
          </div>
        </BoardFigure>

        <Callout variant="trap" title="Split, then re-check">
          <p>
            If a state inside a group goes to a different group on some letter, split it out into its own group and
            restart the check. One pass is not enough when the new groups change the targets of other states.
          </p>
        </Callout>

        <div className="lesson-takeaway">
          <CircleCheck size={18} aria-hidden="true" />
          <div>
            <strong>Lesson 4 in one sentence.</strong>
            <p>
              Determinize by ε-closed subsets, complete with a sink before complementing, and minimize by merging
              states that agree on acceptance and on every destination group.
            </p>
          </div>
        </div>
        <div className="lesson-next">
          <p>Part I is done. Part II starts with grammar types, parse trees and ambiguity.</p>
          <Link className="text-link" to="/lessons/5">
            Grammar types & ambiguity <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </LessonShell>
  )
}
