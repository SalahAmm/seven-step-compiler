import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { DeepDives, GuideShell } from '../../components/GuideChrome'
import { DrillList } from '../../components/DrillList'
import { M } from '../../components/Math'
import { Callout, Grammar, Pill, SectionHeading } from '../../components/ui'
import { getGuideStage } from '../../data/guide'

const firstRows = [
  {
    symbol: 'Z',
    set: '{d, ε}',
    why: 'Z → dcZ gives d. Z → ε gives ε. Nothing else can start a Z.',
  },
  {
    symbol: 'X',
    set: '{a, ε}',
    why: 'X → aXb gives a. X → ε gives ε. The trailing b never starts the rule.',
  },
  {
    symbol: 'Y',
    set: '{c, d, e}',
    why: 'Y → cZ gives c. Y → Ze gives d, and because Z can vanish, e becomes visible too. Y cannot vanish because e remains.',
  },
  {
    symbol: 'S',
    set: '{a, c, d, e}',
    why: 'S → XY: X contributes a and can vanish, so Y contributes c, d, e. Y cannot vanish, so ε never reaches S.',
  },
]

const followRows = [
  {
    symbol: 'S',
    set: '{$}',
    why: 'S is the start symbol. The end marker is placed there by definition.',
  },
  {
    symbol: 'X',
    set: '{b, c, d, e}',
    why: 'S → XY puts FIRST(Y) after X. X → aXb puts b after the inner X.',
  },
  {
    symbol: 'Y',
    set: '{$}',
    why: 'Y ends S → XY, so whatever follows S follows Y. Nothing else follows Y.',
  },
  {
    symbol: 'Z',
    set: '{e, $}',
    why: 'Y → Ze puts e after Z. Y → cZ puts Z at the end, so FOLLOW(Y) = {$} enters FOLLOW(Z).',
  },
]

export function Guide05() {
  const stage = getGuideStage(5)!

  return (
    <GuideShell stage={stage}>
      <p className="lead-in">
        Stage 5 computes the two sets that make a parser predictive. <strong>FIRST</strong> answers “what can appear
        at the front of a rule?” <strong>FOLLOW</strong> answers “what can appear immediately after this symbol?”.
        Learn the three rules for each and the same grammar will keep appearing in the exam.
      </p>

      <section id="why">
        <SectionHeading id="why">Why a parser needs these sets</SectionHeading>
        <p>
          An LL(1) parser reads the input left to right, builds a leftmost derivation, and looks at exactly one
          upcoming letter. When an uppercase symbol sits on top of its stack, it must choose one of that symbol’s
          rules. It cannot see the future. FIRST and FOLLOW are the two pieces of evidence that make the choice
          possible.
        </p>

        <div className="compare-grid">
          <div className="compare-card">
            <div className="compare-card-head"><Pill tone="ok">FIRST(X)</Pill><span className="mono">look ahead</span></div>
            <p>
              Every lowercase letter that can be the very first letter of a word derived from{' '}
              <M>{String.raw`X`}</M>, plus <M>{String.raw`\varepsilon`}</M> if <M>{String.raw`X`}</M> can disappear
              completely.
            </p>
          </div>
          <div className="compare-card">
            <div className="compare-card-head"><Pill tone="bad">FOLLOW(X)</Pill><span className="mono">look behind</span></div>
            <p>
              Every lowercase letter that can appear immediately after <M>{String.raw`X`}</M> in some sentential
              form, plus <M>{String.raw`\$`}</M> when <M>{String.raw`X`}</M> can be the last symbol.
            </p>
          </div>
        </div>

        <Callout variant="note" title="The two warnings">
          <p>
            <strong>FIRST may contain ε; FOLLOW never does.</strong> FOLLOW contains the end marker{' '}
            <M>{String.raw`\$`}</M> instead.
          </p>
          <p>
            FIRST is about what a symbol can <em>produce</em>. FOLLOW is about the context in which the grammar
            <em> uses</em> that symbol. They are computed from different directions.
          </p>
        </Callout>
      </section>

      <section id="first">
        <SectionHeading id="first">FIRST — three rules</SectionHeading>

        <ol className="steps">
          <li>
            <strong>A rule starts with a terminal.</strong>
            <p>
              If <M>{String.raw`X \to a\dots`}</M>, put <M>{String.raw`a`}</M> in{' '}
              <M>{String.raw`\mathrm{FIRST}(X)`}</M>.
            </p>
          </li>
          <li>
            <strong>A rule is empty.</strong>
            <p>
              If <M>{String.raw`X \to \varepsilon`}</M>, put <M>{String.raw`\varepsilon`}</M> in{' '}
              <M>{String.raw`\mathrm{FIRST}(X)`}</M>.
            </p>
          </li>
          <li>
            <strong>A rule starts with a non-terminal.</strong>
            <p>
              For <M>{String.raw`X \to YZ\dots`}</M>, add every letter of{' '}
              <M>{String.raw`\mathrm{FIRST}(Y)`}</M> except <M>{String.raw`\varepsilon`}</M>. Only if{' '}
              <M>{String.raw`Y`}</M> can vanish do you move to <M>{String.raw`Z`}</M> and add{' '}
              <M>{String.raw`\mathrm{FIRST}(Z) - \{\varepsilon\}`}</M>. Put <M>{String.raw`\varepsilon`}</M> in{' '}
              <M>{String.raw`\mathrm{FIRST}(X)`}</M> only when <em>every</em> symbol on the right can vanish.
            </p>
          </li>
        </ol>

        <h3>A quick example of the pass-through rule</h3>
        <Grammar lines={['A → Bc', 'B → b | ε']} note="FIRST(B) = {b, ε}. What is FIRST(A)?" />
        <p>
          The rule starts with <M>{String.raw`B`}</M>, so add <M>{String.raw`b`}</M>. Because{' '}
          <M>{String.raw`\varepsilon \in \mathrm{FIRST}(B)`}</M>, the parser may skip <M>{String.raw`B`}</M> and see
          the next symbol <M>{String.raw`c`}</M>. So <M>{String.raw`\mathrm{FIRST}(A) = \{b,c\}`}</M>. It does not
          contain <M>{String.raw`\varepsilon`}</M>, because the <M>{String.raw`c`}</M> can never disappear.
        </p>

        <h3>The full Set 2, Exercise 09 grammar</h3>
        <Grammar
          label="The exam grammar"
          lines={['S → XY', 'X → aXb | ε', 'Y → cZ | Ze', 'Z → dcZ | ε']}
          note="FIRST(Y) is the trap. Read the explanation below before you copy the notebook."
        />

        <div className="table-wrap">
          <table className="data-table">
            <caption>FIRST sets, built from the most basic rule upward.</caption>
            <thead><tr><th scope="col">Symbol</th><th scope="col">FIRST</th><th scope="col">Why</th></tr></thead>
            <tbody>
              {firstRows.map((row) => (
                <tr key={row.symbol}>
                  <td className="mono"><strong>{row.symbol}</strong></td>
                  <td className="mono">{row.set}</td>
                  <td>{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Callout variant="trap" title="The #1 beginner mistake — FIRST(Y) does not get ε">
          <p>
            Look only at <M>{String.raw`Y \to Ze`}</M>. <M>{String.raw`Z`}</M> is nullable, so after skipping{' '}
            <M>{String.raw`Z`}</M>, the next symbol is <M>{String.raw`e`}</M>. That is why{' '}
            <M>{String.raw`e \in \mathrm{FIRST}(Y)`}</M>. But <M>{String.raw`e`}</M> is still standing there, so{' '}
            <M>{String.raw`Y`}</M> cannot disappear. The correct set is{' '}
            <M>{String.raw`\mathrm{FIRST}(Y) = \{c,d,e\}`}</M>, with <strong>no ε</strong>.
          </p>
          <p>
            The notebook once added ε to <M>{String.raw`\mathrm{FIRST}(Y)`}</M> and then to{' '}
            <M>{String.raw`\mathrm{FIRST}(S)`}</M>. That single slip corrupts the LL(1) table later.
          </p>
        </Callout>
      </section>

      <section id="follow">
        <SectionHeading id="follow">FOLLOW — three rules</SectionHeading>

        <ol className="steps">
          <li>
            <strong>The start symbol receives the end marker.</strong>
            <p>
              Put <M>{String.raw`\$`}</M> in <M>{String.raw`\mathrm{FOLLOW}(S)`}</M>. This is the sentence boundary,
              not a terminal in the alphabet.
            </p>
          </li>
          <li>
            <strong>A symbol appears before something.</strong>
            <p>
              In a rule <M>{String.raw`M \to \dots X\beta`}</M>, add{' '}
              <M>{String.raw`\mathrm{FIRST}(\beta) - \{\varepsilon\}`}</M> to{' '}
              <M>{String.raw`\mathrm{FOLLOW}(X)`}</M>.
            </p>
          </li>
          <li>
            <strong>A symbol is at the end, or what follows can vanish.</strong>
            <p>
              If <M>{String.raw`\beta`}</M> is empty or nullable, add{' '}
              <M>{String.raw`\mathrm{FOLLOW}(M)`}</M> to <M>{String.raw`\mathrm{FOLLOW}(X)`}</M>. Whatever can follow
              the mother can follow the last child.
            </p>
          </li>
        </ol>

        <h3>The same grammar, from the other direction</h3>
        <div className="table-wrap">
          <table className="data-table">
            <caption>FOLLOW sets. Every occurrence of a symbol on a right-hand side is a clue.</caption>
            <thead><tr><th scope="col">Symbol</th><th scope="col">FOLLOW</th><th scope="col">Why</th></tr></thead>
            <tbody>
              {followRows.map((row) => (
                <tr key={row.symbol}>
                  <td className="mono"><strong>{row.symbol}</strong></td>
                  <td className="mono">{row.set}</td>
                  <td>{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Callout variant="key" title="The dependency chain that gives Z its dollar">
          <p>
            <M>{String.raw`Y`}</M> is last in <M>{String.raw`S \to XY`}</M>, so{' '}
            <M>{String.raw`\mathrm{FOLLOW}(Y)`}</M> inherits <M>{String.raw`\mathrm{FOLLOW}(S) = \{\$\}`}</M>. Then{' '}
            <M>{String.raw`Z`}</M> is last in <M>{String.raw`Y \to cZ`}</M>, so{' '}
            <M>{String.raw`\mathrm{FOLLOW}(Z)`}</M> inherits <M>{String.raw`\{\$\}`}</M> as well. The dollar travels
            down the end of the rule.
          </p>
        </Callout>

        <Callout variant="trap" title="Three FOLLOW mistakes">
          <p>
            <strong>1. Putting ε inside FOLLOW.</strong> FOLLOW is a set of terminals plus <M>{String.raw`\$`}</M>.
            ε is not a terminal and never belongs there.
          </p>
          <p>
            <strong>2. Stopping after a nullable β.</strong> If <M>{String.raw`\beta`}</M> can vanish, also add{' '}
            <M>{String.raw`\mathrm{FOLLOW}(M)`}</M>. Do both, not one.
          </p>
          <p>
            <strong>3. Forgetting a second occurrence.</strong> A symbol may appear several times in the grammar.
            Every occurrence contributes.
          </p>
        </Callout>
      </section>

      <section id="practice">
        <SectionHeading id="practice">The full Set 2, Exercise 09 practice</SectionHeading>
        <p>
          Put the two tables side by side. The grammar is <M>{String.raw`S \to XY`}</M>,{' '}
          <M>{String.raw`X \to aXb \mid \varepsilon`}</M>, <M>{String.raw`Y \to cZ \mid Ze`}</M>, and{' '}
          <M>{String.raw`Z \to dcZ \mid \varepsilon`}</M>. The terminal alphabet is{' '}
          <M>{String.raw`\{a,b,c,d,e\}`}</M>; ε is not a terminal.
        </p>

        <div className="first-follow-board">
          <div>
            <span className="ff-board-label">FIRST</span>
            <div className="ff-set"><span className="mono">Z</span><span>{'{d, ε}'}</span></div>
            <div className="ff-set"><span className="mono">X</span><span>{'{a, ε}'}</span></div>
            <div className="ff-set ff-hot"><span className="mono">Y</span><span>{'{c, d, e}'}</span></div>
            <div className="ff-set"><span className="mono">S</span><span>{'{a, c, d, e}'}</span></div>
          </div>
          <div>
            <span className="ff-board-label">FOLLOW</span>
            <div className="ff-set"><span className="mono">S</span><span>{'{$}'}</span></div>
            <div className="ff-set"><span className="mono">X</span><span>{'{b, c, d, e}'}</span></div>
            <div className="ff-set"><span className="mono">Y</span><span>{'{$}'}</span></div>
            <div className="ff-set"><span className="mono">Z</span><span>{'{e, $}'}</span></div>
          </div>
        </div>

        <p>
          Read the two tables as a sentence: “<M>{String.raw`S`}</M> can start with a, c, d or e; whatever follows{' '}
          <M>{String.raw`X`}</M> is b, c, d or e; <M>{String.raw`Z`}</M> can be followed by e or the end of the
          word.” Those two sentences are enough to build the table in the next stage.
        </p>

        <Callout variant="note" title="A useful self-check">
          <p>
            FIRST sets should never contain <M>{String.raw`\$`}</M>. FOLLOW sets should never contain{' '}
            <M>{String.raw`\varepsilon`}</M>. If either happens, a rule was applied with the wrong symbol. Check the
            two tables against those two facts before moving on.
          </p>
        </Callout>
      </section>

      <section id="drills">
        <SectionHeading id="drills">Quick-check drills</SectionHeading>
        <DrillList
          items={[
            {
              q: <>For the grammar above, does <M>{String.raw`\mathrm{FIRST}(Y)`}</M> contain ε? Explain in one sentence.</>,
              a: (
                <p>
                  No. <M>{String.raw`Z`}</M> is nullable, but the rule <M>{String.raw`Y \to Ze`}</M> still leaves{' '}
                  <M>{String.raw`e`}</M> behind, so <M>{String.raw`Y`}</M> can never disappear completely.
                </p>
              ),
            },
            {
              q: <>Why is <M>{String.raw`\mathrm{FOLLOW}(X)`}</M> equal to <span className="mono">{'{b, c, d, e}'}</span>?</>,
              a: (
                <p>
                  <M>{String.raw`S \to XY`}</M> puts <M>{String.raw`\mathrm{FIRST}(Y) = \{c,d,e\}`}</M> after{' '}
                  <M>{String.raw`X`}</M>, and <M>{String.raw`X \to aXb`}</M> puts <M>{String.raw`b`}</M> after the
                  inner <M>{String.raw`X`}</M>.
                </p>
              ),
            },
            {
              q: (
                <>
                  For <span className="mono">S → AB</span>, <span className="mono">A → a | ε</span>,{' '}
                  <span className="mono">B → a | b</span>, find <M>{String.raw`\mathrm{FOLLOW}(A)`}</M>.
                </>
              ),
              a: <p><M>{String.raw`\mathrm{FOLLOW}(A) = \mathrm{FIRST}(B) = \{a,b\}`}</M>. B cannot vanish, so no FOLLOW(S) is added.</p>,
            },
            {
              q: <>What goes into <M>{String.raw`\mathrm{FOLLOW}(Z)`}</M> in the exam grammar?</>,
              a: <p><span className="mono">{'{e, $}'}</span>. The <span className="mono">e</span> comes from <span className="mono">Y → Ze</span>; the dollar comes from <span className="mono">Y → cZ</span> and <span className="mono">FOLLOW(Y) = {'{$}'}</span>.</p>,
            },
          ]}
        />
      </section>

      <Callout variant="key" title="What you can now do">
        <p>
          You can compute FIRST and FOLLOW for a complete grammar, explain the nullable pass-through, and catch the
          exact mistake that appears in the corrected notebook. Stage 6 turns these two sets into the LL(1) table.
        </p>
        <p>
          Next: Stage 6 builds the table, checks for conflicts, and runs the stack machine.{' '}
          <Link className="text-link" to="/guide/6">
            Continue to LL(1) <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </p>
      </Callout>

      <DeepDives stage={stage} />
    </GuideShell>
  )
}
