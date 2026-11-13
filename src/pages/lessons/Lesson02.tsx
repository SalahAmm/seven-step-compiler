import { Link } from 'react-router-dom'
import { ArrowRight, CircleCheck } from 'lucide-react'
import { M } from '../../components/Math'
import { Automaton, AutomatonLegend } from '../../components/Automaton'
import type { AutoEdge, AutoState } from '../../components/Automaton'
import { DfaRunner } from '../../components/Machine'
import { BoardFigure, Callout, Pill, SectionHeading } from '../../components/ui'
import { limitEdges, limitStates, productEdges, productStates } from '../../data/automata'
import { LessonShell } from './LessonShell'

/* A deliberately tiny DFA used only to label the anatomy. */
const anatomyStates: AutoState[] = [
  { id: 'even', label: 'even', x: 170, y: 170, start: true, accepting: true },
  { id: 'odd', label: 'odd', x: 430, y: 170 },
]

const anatomyEdges: AutoEdge[] = [
  { from: 'even', to: 'odd', label: 'a', bend: -24 },
  { from: 'odd', to: 'even', label: 'a', bend: -24 },
  { from: 'even', to: 'even', label: 'b', loop: 'above' },
  { from: 'odd', to: 'odd', label: 'b', loop: 'above' },
]

const productRows = [
  ['(0,0)', '(1,0)', '(0,1)'],
  ['(0,1)', '(1,1)', '(0,2)'],
  ['(0,2)', '(1,2)', '(0,0)'],
  ['(1,0)', '(0,0)', '(1,1)'],
  ['(1,1)', '(0,1)', '(1,2)'],
  ['(1,2)', '(0,2)', '(1,0)'],
]

export function Lesson02() {
  return (
    <LessonShell id={2}>
      <p className="lead-in">
        Most automaton questions are not asking you to invent a new machine. They are asking you to recognise one of
        four shapes and relabel it. Once you can see the shape, the drawing is just bookkeeping.
      </p>

      <section>
        <SectionHeading id="anatomy">Automaton anatomy</SectionHeading>
        <p>
          An automaton is a board game. The circles are <strong>states</strong> — the situations the machine can be in.
          The arrows are <strong>transitions</strong> — reading a letter moves you along an arrow. A word is accepted
          if, after reading all of it, you are standing on a double circle.
        </p>

        <BoardFigure
          title="A complete DFA · even number of a's"
          note="Start = even · accepting = even"
          caption={
            <>
              <strong>The full legend.</strong> The short incoming arrow marks the start. The double circle marks
              acceptance. Every state has one outgoing arrow for every alphabet letter, so this DFA is complete.
            </>
          }
          credit="Anatomy board"
        >
          <div className="figure-scroll">
            <Automaton
              states={anatomyStates}
              edges={anatomyEdges}
              width={620}
              height={330}
              ariaLabel="A two-state DFA. The start state even is accepting; reading a toggles between even and odd, while reading b loops."
            />
          </div>
          <AutomatonLegend
            items={[
              { label: 'start state', kind: 'start' },
              { label: 'accepting state', kind: 'accept' },
              { label: 'one arrow per letter', kind: 'read' },
            ]}
          />
        </BoardFigure>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Model</th>
                <th scope="col">Arrows out of a state</th>
                <th scope="col">ε-arrows?</th>
                <th scope="col">What it can do that a DFA cannot</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>DFA</strong></td>
                <td>At most one per letter; exactly one if the DFA is complete.</td>
                <td className="no">No</td>
                <td>—</td>
              </tr>
              <tr>
                <td><strong>NFA</strong></td>
                <td>Any number per letter.</td>
                <td className="yes">Yes</td>
                <td>Guess a branch, or teleport for free.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Callout variant="key" title="The one sentence that prevents most mistakes">
          <p>
            A DFA’s current state is a complete summary of the input read so far. If two histories lead to the same
            state, the future behaviour must be identical.
          </p>
        </Callout>
      </section>

      <section>
        <SectionHeading id="regex-rules">Rules → regex</SectionHeading>
        <p>
          Describing a language in words is often easier than writing its regex. Translate the invariant first, then
          let the regex follow. These four examples are the ones used in Interro 1, Exercise 03 and Exercise Set 1,
          Exercises 06 and 08.
        </p>

        <div className="regex-grid">
          <article className="regex-card">
            <div className="regex-card-top">
              <span className="regex-label">Caml identifier</span>
              <Pill>no two consecutive _</Pill>
            </div>
            <code className="regex-code">[a-zA-Z] (_? [a-zA-Z0-9'])* _?</code>
            <p>
              Start with a letter. Each block after that is an optional underscore followed by a normal character.
              A final underscore is allowed, but it cannot be followed by another underscore.
            </p>
            <p className="regex-why"><strong>Why:</strong> the star repeats whole blocks; an underscore inside a block is forced to sit before a letter, digit or apostrophe.</p>
          </article>

          <article className="regex-card">
            <div className="regex-card-top">
              <span className="regex-label">Every a-block has length ≥ 2</span>
              <Pill>Set 1, Ex 06(a)</Pill>
            </div>
            <code className="regex-code">(b | aaa*)*</code>
            <p>
              Either emit a <span className="mono">b</span>, or emit at least two <span className="mono">a</span>’s.
              Since every choice is repeated from scratch, a block of <span className="mono">a</span>’s can never have
              length 1.
            </p>
            <p className="regex-why"><strong>Equivalent:</strong> <span className="mono">(b | aa+)*</span>.</p>
          </article>

          <article className="regex-card">
            <div className="regex-card-top">
              <span className="regex-label">Every a followed by exactly one b</span>
              <Pill>Set 1, Ex 06(b)</Pill>
            </div>
            <code className="regex-code">(b | ab)*</code>
            <p>
              Never write an <span className="mono">a</span> alone: write the pair <span className="mono">ab</span>.
              Extra <span className="mono">b</span>’s can appear anywhere as free choices.
            </p>
            <p className="regex-why"><strong>Check:</strong> <span className="mono">abb</span> = <span className="mono">ab · b</span>; <span className="mono">bab</span> = <span className="mono">b · ab</span>.</p>
          </article>

          <article className="regex-card">
            <div className="regex-card-top">
              <span className="regex-label">Every a followed by bb</span>
              <Pill>Set 1, Ex 08(viii)</Pill>
            </div>
            <code className="regex-code">(b | abb)*</code>
            <p>
              The only way to consume an <span className="mono">a</span> is inside the block
              <span className="mono"> abb</span>. Free <span className="mono">b</span>’s fill the gaps.
            </p>
            <p className="regex-why"><strong>Invariant:</strong> immediately after every <span className="mono">a</span>, the next two symbols are <span className="mono">bb</span>.</p>
          </article>
        </div>

        <Callout variant="note" title="A useful translation habit">
          <p>
            Write the invariant as a sentence with “every” or “no”. Then ask: what is the smallest block that respects
            it? Repeat that block with a star. This is usually faster than guessing a large regex and testing it.
          </p>
        </Callout>
      </section>

      <section>
        <SectionHeading id="modulo">Modulo machines</SectionHeading>
        <p>
          To count something modulo <M>{String.raw`k`}</M>, create <M>{String.raw`k`}</M> states labelled
          <M>{String.raw`0,1,\dots,k-1`}</M>. The label is the current remainder. Reading the counted symbol advances
          the remainder; every other symbol loops.
        </p>

        <h3>Example A — number of a’s divisible by 3</h3>
        <p>
          Alphabet <M>{String.raw`\{a,b,c\}`}</M>. States <span className="mono">0</span>, <span className="mono">1</span>,
          <span className="mono">2</span>. State <span className="mono">0</span> is both start and accepting.
          Reading <span className="mono">b</span> or <span className="mono">c</span> does not change the count, so both
          loop on every state. Reading <span className="mono">a</span> advances
          <span className="mono"> 0 → 1 → 2 → 0</span>.
        </p>
        <DfaRunner
          preset="mod3"
          caption={
            <>
              <strong>Run it.</strong> The word <span className="mono">aabac</span> has three
              <span className="mono"> a</span>’s, so it ends in state 0 and is accepted. The b’s and c’s never move the
              remainder.
            </>
          }
        />

        <h3>Example B — decimal numbers divisible by 3</h3>
        <p>
          When a decimal digit <M>{String.raw`d`}</M> is appended to a number with remainder <M>{String.raw`r`}</M>,
          the new number is <M>{String.raw`10r+d`}</M>. Because <M>{String.raw`10 \equiv 1 \pmod 3`}</M>, the new
          remainder is simply <M>{String.raw`(r+d) \bmod 3`}</M>.
        </p>
        <div className="three-col">
          <div className="panel accent">
            <h4>Digits ≡ 0</h4>
            <p className="mono">0, 3, 6, 9</p>
            <p>Stay in the same state.</p>
          </div>
          <div className="panel">
            <h4>Digits ≡ 1</h4>
            <p className="mono">1, 4, 7</p>
            <p>Move +1: <span className="mono">0→1→2→0</span>.</p>
          </div>
          <div className="panel">
            <h4>Digits ≡ 2</h4>
            <p className="mono">2, 5, 8</p>
            <p>Move +2: <span className="mono">0→2→1→0</span>.</p>
          </div>
        </div>
        <DfaRunner
          preset="decimal3"
          caption={
            <>
              <strong>No multiplication needed.</strong> Type <span className="mono">2025</span>: the machine reads
              digits and keeps only the remainder. Because <span className="mono">2025 = 3 × 675</span>, it ends in 0.
            </>
          }
        />

        <h3>Example C — two conditions at once</h3>
        <p>
          Take words over <M>{String.raw`\{a,b\}`}</M> where the number of <span className="mono">a</span>’s is even
          <em> and</em> the number of <span className="mono">b</span>’s is a multiple of 3. The first condition needs 2
          remainders; the second needs 3. The product has <M>{String.raw`2 \times 3 = 6`}</M> states, one for each pair.
        </p>
        <BoardFigure
          title="Product automaton · even a's × b's ≡ 0 (mod 3)"
          note="Start & accept = (0,0)"
          caption={
            <>
              <strong>Read a pair as a memory cell.</strong> The first coordinate flips on
              <span className="mono"> a</span>; the second advances on <span className="mono">b</span>. Accept only
              when both coordinates are back to zero.
            </>
          }
          credit="Set 1, Exercise 08(iv)"
        >
          <div className="figure-scroll">
            <Automaton
              states={productStates}
              edges={productEdges}
              width={760}
              height={430}
              radius={30}
              ariaLabel="Six-state product automaton. The first coordinate tracks parity of a's; the second tracks b's modulo three."
            />
          </div>
        </BoardFigure>
        <div className="table-wrap">
          <table className="data-table compact-table">
            <caption>The same product, written as a transition table.</caption>
            <thead>
              <tr>
                <th scope="col">State</th>
                <th scope="col">on a</th>
                <th scope="col">on b</th>
              </tr>
            </thead>
            <tbody>
              {productRows.map(([state, onA, onB]) => (
                <tr key={state}>
                  <td className="mono">{state}</td>
                  <td className="mono">{onA}</td>
                  <td className="mono">{onB}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <SectionHeading id="forbidden">Forbidden substrings</SectionHeading>
        <p>
          For “does not contain <span className="mono">110</span>”, build a chain of states that records how much of
          the forbidden word you have seen. Every state on the chain is accepting. When the forbidden word is
          completed, fall into a non-accepting <strong>dead state</strong> that loops on everything.
        </p>
        <div className="state-story">
          <div className="state-story-item">
            <span className="state-dot">0</span>
            <div><strong>Nothing useful seen.</strong><p>On 0 stay; on 1 move to progress 1.</p></div>
          </div>
          <div className="state-story-item">
            <span className="state-dot">1</span>
            <div><strong>Last symbol was 1.</strong><p>On 0 the progress breaks, return to 0; on 1 move to progress 2.</p></div>
          </div>
          <div className="state-story-item">
            <span className="state-dot">2</span>
            <div><strong>Last two symbols were 11.</strong><p>On 1 stay — the last two are still 11. On 0 the word 110 has appeared: go to dead.</p></div>
          </div>
        </div>
        <DfaRunner
          preset="no110"
          caption={
            <>
              <strong>The reset is the exam point.</strong> From state 2, reading 1 must stay in 2, not return to 0.
              Try <span className="mono">111011</span> and watch the dead state take over.
            </>
          }
        />
        <Callout variant="trap" title="Do not reset too early">
          <p>
            After seeing <span className="mono">11</span>, another <span className="mono">1</span> leaves you with
            <span className="mono"> 11</span> again — the last two symbols are still a prefix of the forbidden word.
            Only reading <span className="mono">0</span> completes <span className="mono">110</span>.
          </p>
        </Callout>
      </section>

      <section>
        <SectionHeading id="limit">Numbers below 139</SectionHeading>
        <p>
          “Numbers strictly less than 139, with no leading useless zeros” is a language of decimal words. Split by
          length and branch on the first digit. An NFA is natural here because the input
          <span className="mono"> 1</span> can be a one-digit number or the start of a two- or three-digit number.
        </p>
        <BoardFigure
          title="NFA · decimal words below 139"
          note="No leading zeros · 0 accepted alone"
          caption={
            <>
              <strong>Four length classes:</strong> <span className="mono">0</span>,
              <span className="mono"> 1–9</span>, <span className="mono">10–99</span>, and
              <span className="mono"> 100–138</span>. The branch after <span className="mono">1</span> splits
              <span className="mono"> 10–12</span> from <span className="mono">13</span>; the last digit of
              <span className="mono"> 13x</span> can only be <span className="mono">0–8</span>.
            </>
          }
          credit="Interro 1, Exercise 02-2"
        >
          <div className="figure-scroll">
            <Automaton
              states={limitStates}
              edges={limitEdges}
              width={820}
              height={500}
              radius={32}
              ariaLabel="NFA for decimal numbers below 139, with branches for one, two and three digit numbers."
            />
          </div>
        </BoardFigure>
        <div className="two-col">
          <div className="panel">
            <h4>Why NFA?</h4>
            <p>
              After the first <span className="mono">1</span>, the machine guesses whether the number has one digit,
              two digits, or three digits. A DFA would need to merge those possibilities into larger states.
            </p>
          </div>
          <div className="panel tint">
            <h4>Why no leading zeros?</h4>
            <p>
              The start state sends <span className="mono">0</span> to a separate accepting state with no outgoing
              arrows. That accepts the word <span className="mono">0</span> and kills <span className="mono">00</span>,
              <span className="mono"> 01</span>, <span className="mono">007</span>, and so on.
            </p>
          </div>
        </div>
        <Callout variant="key" title="The pattern in one line">
          <p>
            To count, use remainders. To forbid a word, use a progress chain plus a dead state. To combine conditions,
            take the product. To branch on length, use an NFA.
          </p>
        </Callout>

        <div className="lesson-takeaway">
          <CircleCheck size={18} aria-hidden="true" />
          <div>
            <strong>Lesson 2 in one sentence.</strong>
            <p>
              Modulo machines remember a remainder, forbidden-substring machines remember a prefix, products remember
              two remainders, and length NFAs guess a branch.
            </p>
          </div>
        </div>
        <div className="lesson-next">
          <p>Now reverse the direction: take a finished automaton and recover its regular expression with Arden’s lemma.</p>
          <Link className="text-link" to="/lessons/3">
            Arden’s lemma <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </LessonShell>
  )
}
