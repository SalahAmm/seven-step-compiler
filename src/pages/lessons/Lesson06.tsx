import { Link } from 'react-router-dom'
import { ArrowRight, CircleCheck } from 'lucide-react'
import { M } from '../../components/Math'
import { BoardFigure, Callout, Grammar, Pill, SectionHeading } from '../../components/ui'
import { LessonShell } from './LessonShell'

export function Lesson06() {
  return (
    <LessonShell id={6}>
      <p className="lead-in">
        ε-productions and long right-hand sides are legal in a grammar but inconvenient for parsing. The conversion is
        a pipeline: find every nullable symbol, add the variants that omit it, then binarize until every rule has
        exactly two non-terminals or exactly one terminal.
      </p>

      <section>
        <SectionHeading id="nullable">Removing ε-productions</SectionHeading>
        <p>
          A non-terminal is <strong>nullable</strong> if it can derive the empty word:
          <M>{String.raw`\;X \Rightarrow^* \varepsilon`}</M>. The brute-force recipe is:
        </p>
        <ol className="steps">
          <li>
            <strong>Find every nullable non-terminal.</strong>
            <p>Start with all <M>{String.raw`X \to \varepsilon`}</M>. Then repeat: if every symbol on the right of a rule is nullable, the left side is nullable too, until nothing changes.</p>
          </li>
          <li>
            <strong>Delete the ε-rules.</strong>
            <p>Keep <M>{String.raw`S \to \varepsilon`}</M> only if the empty word belongs to the language and the exercise asks you to preserve it.</p>
          </li>
          <li>
            <strong>Add variants with the nullable symbol removed.</strong>
            <p>For every rule containing a nullable symbol, add a copy without it. If the symbol appears twice, test every combination of keeping and removing each occurrence.</p>
          </li>
        </ol>

        <h3>Set 2, Exercise 03.1(a) — the official grammar</h3>
        <Grammar
          label="G1 before ε-removal"
          lines={[
            'S → A T A | B T B',
            'T → A T A | B T B | ε',
            'A → a',
            'B → b',
          ]}
        />
        <p>
          The only nullable symbol is <M>{String.raw`T`}</M>. <M>{String.raw`A`}</M> derives only
          <span className="mono"> a</span>, and <M>{String.raw`B`}</M> derives only <span className="mono">b</span>, so
          neither can vanish. Every rule of the form <M>{String.raw`X \to ATA`}</M> gets a companion
          <M>{String.raw`\;X \to AA`}</M>; every <M>{String.raw`X \to BTB`}</M> gets
          <M>{String.raw`\;X \to BB`}</M>.
        </p>
        <div className="table-wrap">
          <table className="data-table">
            <caption>The variant table. Do not delete the original rule; add the shorter copy.</caption>
            <thead>
              <tr>
                <th scope="col">Original</th>
                <th scope="col">T is present</th>
                <th scope="col">Add</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="mono">S → ATA</td><td>yes</td><td className="mono">S → AA</td></tr>
              <tr><td className="mono">S → BTB</td><td>yes</td><td className="mono">S → BB</td></tr>
              <tr><td className="mono">T → ATA</td><td>yes</td><td className="mono">T → AA</td></tr>
              <tr><td className="mono">T → BTB</td><td>yes</td><td className="mono">T → BB</td></tr>
            </tbody>
          </table>
        </div>
        <M block focus>{String.raw`G_1':\quad S \to ATA \mid BTB \mid AA \mid BB,\quad T \to ATA \mid BTB \mid AA \mid BB,\quad A \to a,\quad B \to b`}</M>
        <Callout variant="note" title="Why T keeps its non-ε rules">
          <p>
            Removing <M>{String.raw`T \to \varepsilon`}</M> does not remove <M>{String.raw`T`}</M> from the grammar.
            The symbol can still appear on a right-hand side and be expanded to <span className="mono">ATA</span> or
            <span className="mono"> BTB</span>. Only the empty production disappears.
          </p>
        </Callout>
      </section>

      <section>
        <SectionHeading id="cnf">Chomsky Normal Form</SectionHeading>
        <p>
          A grammar is in Chomsky Normal Form when every production has one of exactly two shapes:
        </p>
        <div className="two-col">
          <div className="panel accent">
            <h4>Two non-terminals</h4>
            <M block quiet>{String.raw`A \to BC`}</M>
            <p>Exactly two symbols, both uppercase.</p>
          </div>
          <div className="panel">
            <h4>One terminal</h4>
            <M block quiet>{String.raw`A \to a`}</M>
            <p>Exactly one lowercase symbol.</p>
          </div>
        </div>
        <p>
          Only the start symbol may keep <M>{String.raw`S \to \varepsilon`}</M>, and only if
          <M>{String.raw`\;\varepsilon`}</M> is in the language. There are no unit rules
          <M>{String.raw`\;A \to B`}</M>, no mixed terminals and non-terminals, and no right-hand side longer than two.
        </p>

        <h3>The conversion pipeline</h3>
        <ol className="steps">
          <li><strong>Remove ε-productions.</strong><p>Use the nullable-symbol method from the previous section.</p></li>
          <li><strong>Remove unit rules.</strong><p>If <M>{String.raw`A \to B`}</M>, replace it with all of <M>{String.raw`B`}</M>’s right-hand sides. Repeat until no unit rule remains.</p></li>
          <li><strong>Isolate mixed terminals.</strong><p>For a rule such as <M>{String.raw`A \to aTb`}</M>, introduce <M>{String.raw`X_a \to a`}</M> and <M>{String.raw`X_b \to b`}</M>, then rewrite as <M>{String.raw`A \to X_a T X_b`}</M>.</p></li>
          <li><strong>Binarize long right-hand sides.</strong><p>For <M>{String.raw`A \to A T A`}</M>, group the last two symbols into a new non-terminal: <M>{String.raw`A \to A X`}</M> with <M>{String.raw`X \to T A`}</M>. Repeat until every rule has length at most two.</p></li>
        </ol>

        <h3>Set 2, Exercise 03.1(b) — the final CNF</h3>
        <p>
          In <M>{String.raw`G_1'`}</M>, there are no ε-rules and no unit rules. The rules
          <M>{String.raw`A \to a`}</M> and <M>{String.raw`B \to b`}</M> already isolate the terminals. The only problem
          is the three-symbol right-hand sides <span className="mono">ATA</span> and <span className="mono">BTB</span>.
        </p>
        <BoardFigure
          title="Binarizing ATA and BTB"
          note="Group the last two symbols"
          caption={
            <>
              <strong>The new symbols are ordinary non-terminals.</strong> <M>{String.raw`X \to TA`}</M> means “a T
              followed by an A”; <M>{String.raw`Y \to TB`}</M> means “a T followed by a B”. The original three-symbol
              sequence is preserved by the grouping.
            </>
          }
        >
          <div className="cnf-figure">
            <div className="cnf-row">
              <span className="cnf-token">A</span>
              <span className="cnf-token">T</span>
              <span className="cnf-token">A</span>
              <span className="cnf-arrow" aria-hidden="true">⟶</span>
              <span className="cnf-token">A</span>
              <span className="cnf-token cnf-new">X</span>
              <span className="cnf-rule">X → T A</span>
            </div>
            <div className="cnf-row">
              <span className="cnf-token">B</span>
              <span className="cnf-token">T</span>
              <span className="cnf-token">B</span>
              <span className="cnf-arrow" aria-hidden="true">⟶</span>
              <span className="cnf-token">B</span>
              <span className="cnf-token cnf-new">Y</span>
              <span className="cnf-rule">Y → T B</span>
            </div>
          </div>
        </BoardFigure>

        <Grammar
          label="Final CNF grammar G1''"
          lines={[
            'S → A X | B Y | A A | B B',
            'T → A X | B Y | A A | B B',
            'X → T A',
            'Y → T B',
            'A → a',
            'B → b',
          ]}
          note="Every right-hand side is either two uppercase letters or one lowercase letter."
        />
        <div className="shape-check">
          <Pill tone="ok">A → BC</Pill>
          <Pill tone="ok">A → a</Pill>
          <Pill tone="ok">no ε</Pill>
          <Pill tone="ok">no unit rules</Pill>
          <Pill tone="ok">no mixed RHS</Pill>
        </div>

        <Callout variant="trap" title="Do not create a new symbol for a pair that already exists">
          <p>
            If <M>{String.raw`X \to TA`}</M> is already a rule, reuse <M>{String.raw`X`}</M>. Introducing a fresh
            non-terminal for every occurrence is legal but wasteful, and it makes the final grammar harder to check.
          </p>
        </Callout>
        <Callout variant="key" title="The CNF check">
          <p>
            Read every line and ask: “Two uppercase, or one lowercase?” If any line fails, the grammar is not in CNF.
            Also check that no <M>{String.raw`\varepsilon`}</M> survives except possibly <M>{String.raw`S \to \varepsilon`}</M>.
          </p>
        </Callout>

        <div className="lesson-takeaway">
          <CircleCheck size={18} aria-hidden="true" />
          <div>
            <strong>Lesson 6 in one sentence.</strong>
            <p>
              Add every way of omitting a nullable symbol, delete the ε-rules, then group long right-hand sides until
              every rule is <M>{String.raw`A \to BC`}</M> or <M>{String.raw`A \to a`}</M>.
            </p>
          </div>
        </div>
        <div className="lesson-next">
          <p>Next: the ordered algorithm that removes direct and indirect left recursion without breaking the grammar.</p>
          <Link className="text-link" to="/lessons/7">
            Removing left recursion <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </LessonShell>
  )
}
