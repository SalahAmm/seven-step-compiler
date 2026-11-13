import { Link } from 'react-router-dom'
import { ArrowRight, CircleCheck } from 'lucide-react'
import { M } from '../../components/Math'
import { BoardFigure, Callout, Grammar, Pill, SectionHeading } from '../../components/ui'
import { Ll1Lab } from '../../components/Ll1Lab'
import { ParseTree, abdceTree } from '../../components/ParseTree'
import { LessonShell } from './LessonShell'

const firstRows = [
  {
    symbol: 'Z',
    set: '{d, ε}',
    why: 'Z → dcZ gives d. Z → ε gives ε. Nothing else can start a Z.',
  },
  {
    symbol: 'X',
    set: '{a, ε}',
    why: 'X → aXb gives a. X → ε gives ε. The b never starts the rule; it comes after X.',
  },
  {
    symbol: 'Y',
    set: '{c, d, e}',
    why: 'Y → cZ gives c. Y → Ze: Z can vanish, so the first real symbol becomes e; when Z does not vanish it starts with d.',
  },
  {
    symbol: 'S',
    set: '{a, c, d, e}',
    why: 'S → XY: X can vanish, so Y’s first symbols join in. Y cannot vanish, so ε never reaches S.',
  },
]

const followRows = [
  {
    symbol: 'S',
    set: '{$}',
    why: 'S is the start symbol. The end marker is placed in FOLLOW(S) by definition.',
  },
  {
    symbol: 'X',
    set: '{b, c, d, e}',
    why: 'S → XY puts FIRST(Y) = {c, d, e} after X. X → aXb puts b after the inner X.',
  },
  {
    symbol: 'Y',
    set: '{$}',
    why: 'Y is at the very end of S → XY, so whatever can follow S can follow Y. Nothing else follows Y.',
  },
  {
    symbol: 'Z',
    set: '{e, $}',
    why: 'Y → Ze puts e after Z. Y → cZ puts Z at the end, so FOLLOW(Y) = {$} also enters FOLLOW(Z).',
  },
]

const tableRows = [
  { nt: 'S', a: 'S → XY', b: '—', c: 'S → XY', d: 'S → XY', e: 'S → XY', dollar: '—' },
  { nt: 'X', a: 'X → aXb', b: 'X → ε', c: 'X → ε', d: 'X → ε', e: 'X → ε', dollar: '—' },
  { nt: 'Y', a: '—', b: '—', c: 'Y → cZ', d: 'Y → Ze', e: 'Y → Ze', dollar: '—' },
  { nt: 'Z', a: '—', b: '—', c: '—', d: 'Z → dcZ', e: 'Z → ε', dollar: 'Z → ε' },
]

const traceRows = [
  { stack: '$S', input: 'abdce$', action: '[S, a] → S → XY; push YX' },
  { stack: '$YX', input: 'abdce$', action: '[X, a] → X → aXb; push bXa' },
  { stack: '$YbXa', input: 'abdce$', action: 'match a; pop and advance' },
  { stack: '$YbX', input: 'bdce$', action: '[X, b] → X → ε; push nothing' },
  { stack: '$Yb', input: 'bdce$', action: 'match b; pop and advance' },
  { stack: '$Y', input: 'dce$', action: '[Y, d] → Y → Ze; push eZ' },
  { stack: '$eZ', input: 'dce$', action: '[Z, d] → Z → dcZ; push Zcd' },
  { stack: '$eZcd', input: 'dce$', action: 'match d; pop and advance' },
  { stack: '$eZc', input: 'ce$', action: 'match c; pop and advance' },
  { stack: '$eZ', input: 'e$', action: '[Z, e] → Z → ε; push nothing' },
  { stack: '$e', input: 'e$', action: 'match e; pop and advance' },
  { stack: '$', input: '$', action: 'accept' },
]

export function Lesson08() {
  return (
    <LessonShell id={8}>
      <p className="lead-in">
        FIRST and FOLLOW are two questions asked from opposite directions. FIRST asks what a symbol can begin with.
        FOLLOW asks what can appear immediately after it. Fill the table from FIRST, close the ε-rules with FOLLOW, and
        the parser writes itself. This is the highest-point section of Part II.
      </p>

      <section>
        <SectionHeading id="first">FIRST sets</SectionHeading>
        <p>
          <M>{String.raw`\mathrm{FIRST}(X)`}</M> is the set of terminals that can begin a word derived from
          <M>{String.raw`\,X`}</M>, plus <M>{String.raw`\varepsilon`}</M> if <M>{String.raw`X`}</M> can disappear
          completely.
        </p>
        <Callout variant="key" title="The one-sentence definition">
          <p>
            What are the first lowercase letters a rule for <M>{String.raw`X`}</M> can spit out — and can the whole rule
            vanish?
          </p>
        </Callout>

        <ol className="steps">
          <li>
            <strong>Terminals are immediate.</strong>
            <p>
              For a terminal <M>{String.raw`a`}</M>, <M>{String.raw`\mathrm{FIRST}(a) = \{a\}`}</M>. A terminal never
              derives ε.
            </p>
          </li>
          <li>
            <strong>Walk the right-hand side from left to right.</strong>
            <p>
              For <M>{String.raw`X \to Y_1Y_2\dots Y_k`}</M>, add
              <M>{String.raw`\;\mathrm{FIRST}(Y_1) - \{\varepsilon\}`}</M>. Continue to
              <M>{String.raw`\,Y_2`}</M> only if <M>{String.raw`Y_1`}</M> is nullable. Continue to
              <M>{String.raw`\,Y_3`}</M> only if both <M>{String.raw`Y_1`}</M> and <M>{String.raw`Y_2`}</M> are
              nullable, and so on.
            </p>
          </li>
          <li>
            <strong>Add ε only when the entire right-hand side can vanish.</strong>
            <p>
              If every symbol <M>{String.raw`Y_1,\dots,Y_k`}</M> is nullable — or the rule is literally
              <M>{String.raw`\;X \to \varepsilon`}</M> — then <M>{String.raw`\varepsilon \in \mathrm{FIRST}(X)`}</M>.
              One surviving terminal at the end is enough to keep ε out.
            </p>
          </li>
        </ol>

        <Callout variant="trap" title="The Y → Ze trap">
          <p>
            In the official grammar, <M>{String.raw`Z \to dcZ \mid \varepsilon`}</M> and
            <M>{String.raw`\;Y \to Ze`}</M>. Because <M>{String.raw`Z`}</M> is nullable, the first symbol of
            <M>{String.raw`\,Ze`}</M> can be <span className="mono">d</span> (Z does not vanish) or
            <span className="mono"> e</span> (Z vanishes and e takes over). So
            <M>{String.raw`\;\mathrm{FIRST}(Y) = \{c,d,e\}`}</M>.
          </p>
          <p>
            <strong>ε is not in <M>{String.raw`\mathrm{FIRST}(Y)`}</M>.</strong> The final
            <span className="mono"> e</span> is a terminal that never disappears. A rule can contain a nullable symbol
            and still be non-nullable as a whole. The same mistake would wrongly put ε in
            <M>{String.raw`\;\mathrm{FIRST}(S)`}</M>.
          </p>
        </Callout>

        <h3>Exercise Set 2, Exercise 09 — the grammar</h3>
        <Grammar
          label="Grammar G"
          lines={['S → X Y', 'X → a X b | ε', 'Y → c Z | Z e', 'Z → d c Z | ε']}
          note="Terminals are {a, b, c, d, e}. ε is not a terminal: it is the absence of a symbol."
        />

        <p>
          Compute bottom-up: a symbol’s FIRST set depends on the symbols on the right of its rules. Start with
          <M>{String.raw`Z`}</M>, then <M>{String.raw`X`}</M> and <M>{String.raw`Y`}</M>, then
          <M>{String.raw`S`}</M>.
        </p>

        <div className="table-wrap">
          <table className="data-table first-table">
            <caption>FIRST sets for G, with the reason for every member.</caption>
            <thead>
              <tr>
                <th scope="col">Symbol</th>
                <th scope="col">FIRST</th>
                <th scope="col">Why</th>
              </tr>
            </thead>
            <tbody>
              {firstRows.map((row) => (
                <tr key={row.symbol}>
                  <td className="mono">{row.symbol}</td>
                  <td className="mono cell-set">{row.set}</td>
                  <td>{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Callout variant="note" title="Nullable is a separate fact">
          <p>
            Write the nullable symbols down before computing FIRST: <M>{String.raw`X`}</M> and
            <M>{String.raw`\;Z`}</M> are nullable; <M>{String.raw`Y`}</M> and <M>{String.raw`S`}</M> are not. FIRST
            uses nullability as a permission slip to continue along the right-hand side. It does not automatically copy
            ε into every ancestor.
          </p>
        </Callout>
      </section>

      <section>
        <SectionHeading id="follow">FOLLOW sets</SectionHeading>
        <p>
          <M>{String.raw`\mathrm{FOLLOW}(X)`}</M> is the set of terminals — plus the end marker
          <M>{String.raw`\$`}</M> — that can appear immediately to the right of <M>{String.raw`X`}</M> in some
          sentential form. <strong>ε is never in a FOLLOW set.</strong> FOLLOW contains only terminals and
          <M>{String.raw`\$`}</M>.
        </p>

        <ol className="steps">
          <li>
            <strong>Seed the start symbol.</strong>
            <p>
              Put <M>{String.raw`\$`}</M> in <M>{String.raw`\mathrm{FOLLOW}(S)`}</M>. The input ends after the start
              symbol, so the end marker is always legal there.
            </p>
          </li>
          <li>
            <strong>Scan every right-hand side for X.</strong>
            <p>
              For each occurrence of <M>{String.raw`X`}</M> in a rule <M>{String.raw`A \to \alpha X \beta`}</M>, add
              <M>{String.raw`\;\mathrm{FIRST}(\beta) - \{\varepsilon\}`}</M> to
              <M>{String.raw`\;\mathrm{FOLLOW}(X)`}</M>.
            </p>
          </li>
          <li>
            <strong>If the tail can vanish, inherit the parent’s FOLLOW.</strong>
            <p>
              If <M>{String.raw`\beta \Rightarrow^* \varepsilon`}</M>, or if <M>{String.raw`X`}</M> is the last symbol
              of the rule, also add <M>{String.raw`\mathrm{FOLLOW}(A)`}</M> to
              <M>{String.raw`\;\mathrm{FOLLOW}(X)`}</M>. Repeat until no set changes.
            </p>
          </li>
        </ol>

        <div className="table-wrap">
          <table className="data-table follow-table">
            <caption>FOLLOW sets for G. Every reason comes from an occurrence on a right-hand side.</caption>
            <thead>
              <tr>
                <th scope="col">Symbol</th>
                <th scope="col">FOLLOW</th>
                <th scope="col">Why</th>
              </tr>
            </thead>
            <tbody>
              {followRows.map((row) => (
                <tr key={row.symbol}>
                  <td className="mono">{row.symbol}</td>
                  <td className="mono cell-set">{row.set}</td>
                  <td>{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Callout variant="trap" title="Where students lose FOLLOW points">
          <p>
            <strong>1.</strong> Forgetting <M>{String.raw`\$`}</M> in <M>{String.raw`\mathrm{FOLLOW}(S)`}</M>.
            <strong> 2.</strong> Writing ε inside a FOLLOW set — it is not a terminal and can never sit after a symbol.
            <strong> 3.</strong> Missing the inheritance case: when <M>{String.raw`X`}</M> is last, everything that
            follows <M>{String.raw`A`}</M> also follows <M>{String.raw`X`}</M>.
          </p>
        </Callout>
      </section>

      <section>
        <SectionHeading id="table">The LL(1) table</SectionHeading>
        <p>
          Rows are non-terminals. Columns are terminals plus <M>{String.raw`\$`}</M>. Every rule gets placed by the
          same two-step rule:
        </p>
        <ol className="steps">
          <li>
            <strong>Place A → α under FIRST(α).</strong>
            <p>
              For every terminal <M>{String.raw`t \in \mathrm{FIRST}(\alpha)`}</M> with
              <M>{String.raw`t \ne \varepsilon`}</M>, write <M>{String.raw`A \to \alpha`}</M> in cell
              <M>{String.raw`\;[A,t]`}</M>.
            </p>
          </li>
          <li>
            <strong>If α can vanish, place it under FOLLOW(A).</strong>
            <p>
              When <M>{String.raw`\varepsilon \in \mathrm{FIRST}(\alpha)`}</M>, also write
              <M>{String.raw`\;A \to \alpha`}</M> in every cell <M>{String.raw`[A,b]`}</M> with
              <M>{String.raw`b \in \mathrm{FOLLOW}(A)`}</M>. This is exactly why an ε-rule needs FOLLOW.
            </p>
          </li>
        </ol>

        <div className="table-wrap">
          <table className="data-table ll-table">
            <caption>The complete LL(1) table for G. “—” means the cell is empty.</caption>
            <thead>
              <tr>
                <th scope="col" className="ll-corner"> </th>
                <th scope="col">a</th>
                <th scope="col">b</th>
                <th scope="col">c</th>
                <th scope="col">d</th>
                <th scope="col">e</th>
                <th scope="col">$</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => (
                <tr key={row.nt}>
                  <th scope="row" className="mono">{row.nt}</th>
                  <td>{row.a === '—' ? <span className="ll-empty">—</span> : <span className="ll-rule">{row.a}</span>}</td>
                  <td>{row.b === '—' ? <span className="ll-empty">—</span> : <span className="ll-rule">{row.b}</span>}</td>
                  <td>{row.c === '—' ? <span className="ll-empty">—</span> : <span className="ll-rule">{row.c}</span>}</td>
                  <td>{row.d === '—' ? <span className="ll-empty">—</span> : <span className="ll-rule">{row.d}</span>}</td>
                  <td>{row.e === '—' ? <span className="ll-empty">—</span> : <span className="ll-rule">{row.e}</span>}</td>
                  <td>{row.dollar === '—' ? <span className="ll-empty">—</span> : <span className="ll-rule">{row.dollar}</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Callout variant="key" title="Is G LL(1)? Yes.">
          <p>
            Every cell contains <strong>at most one rule</strong>. The table is <em>singly defined</em>
            (<span className="mono">mono-définie</span>). A cell with two or more rules is a conflict, and one conflict
            is enough to say the grammar is not LL(1).
          </p>
        </Callout>

        <BoardFigure
          title="Parse tree for abdce"
          note="S → XY, then the ε-branches"
          caption={
            <>
              The left <M>{String.raw`X`}</M> matches <span className="mono">ab</span>, with the inner
              <M>{String.raw` \,X`}</M> erased by <M>{String.raw`X \to \varepsilon`}</M>. The right
              <M>{String.raw` \,Y`}</M> becomes <M>{String.raw`Ze`}</M>, and the inner <M>{String.raw`Z`}</M> matches
              <span className="mono"> dc</span> before vanishing. Leaves, left to right: <span className="mono">a b d c e</span>.
            </>
          }
        >
          <div className="figure-scroll parse-tree-scroll">
            <ParseTree tree={abdceTree} ariaLabel="Parse tree for abdce: S branches to X and Y; X produces a, an epsilon X, and b; Y produces Z then e; Z produces d, c, and an epsilon Z." />
          </div>
        </BoardFigure>
      </section>

      <section>
        <SectionHeading id="trace">Stack trace lab</SectionHeading>
        <p>
          The analyzer keeps the stack with its top on the <strong>right</strong>. At every step, compare the top of the
          stack with the current input letter.
        </p>
        <ul className="rule-list">
          <li>
            <strong>Top is a non-terminal.</strong> Look up <M>{String.raw`[A, a]`}</M> in the table. Pop
            <M>{String.raw`\,A`}</M> and push the right-hand side <em>in reverse</em>, so the first symbol of the rule
            sits on top. For <M>{String.raw`A \to \varepsilon`}</M>, push nothing.
          </li>
          <li>
            <strong>Top is a terminal that matches.</strong> Pop it and advance the input pointer.
          </li>
          <li>
            <strong>Top and input are both $.</strong> Accept. The word is in <M>{String.raw`L(G)`}</M>.
          </li>
          <li>
            <strong>Empty table cell or mismatched terminal.</strong> Reject. No legal move exists.
          </li>
        </ul>

        <div className="table-wrap">
          <table className="data-table trace-table">
            <caption>The official trace for “abdce”. Stack top is on the right.</caption>
            <thead>
              <tr>
                <th scope="col">Stack</th>
                <th scope="col">Input</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {traceRows.map((row, index) => (
                <tr key={`${row.stack}-${index}`} className={index === traceRows.length - 1 ? 'is-accept' : ''}>
                  <td className="mono">{row.stack}</td>
                  <td className="mono">{row.input}</td>
                  <td className={index === traceRows.length - 1 ? 'mono' : ''}>{row.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>
          Read the expansions in order and you get the leftmost derivation:
        </p>
        <M block>{String.raw`S \Rightarrow XY \Rightarrow aXbY \Rightarrow abY \Rightarrow abZe \Rightarrow abdcZe \Rightarrow abdce`}</M>

        <Ll1Lab />

        <Callout variant="note" title="Why the trace is the derivation">
          <p>
            Each expansion replaces the leftmost non-terminal, because that is the symbol sitting on top of the stack.
            The sequence of rules in the Action column is therefore the leftmost derivation. A rightmost derivation would
            expand the rightmost non-terminal first and would not match this stack order.
          </p>
        </Callout>
      </section>

      <section>
        <SectionHeading id="conflicts">Conflict checks without the table</SectionHeading>
        <p>
          You can often decide “is this grammar LL(1)?” quickly. Three checks cover the exam:
        </p>
        <div className="three-col">
          <div className="panel signal">
            <h4>FIRST–FIRST</h4>
            <p>
              Two alternatives for the same non-terminal start with a common terminal:
              <M>{String.raw`\;\mathrm{FIRST}(\alpha) \cap \mathrm{FIRST}(\beta) \ne \emptyset`}</M>.
            </p>
          </div>
          <div className="panel">
            <h4>FIRST–FOLLOW</h4>
            <p>
              One alternative can vanish, and the other starts with a symbol that can follow the non-terminal:
              <M>{String.raw`\;\mathrm{FIRST}(\text{other}) \cap \mathrm{FOLLOW}(A) \ne \emptyset`}</M>.
            </p>
          </div>
          <div className="panel">
            <h4>Left recursion</h4>
            <p>
              Any direct or indirect <M>{String.raw`A \Rightarrow^+ A\gamma`}</M> makes LL(1) parsing impossible. The
              parser would call itself forever.
            </p>
          </div>
        </div>

        <h3>Exercise Set 2, Exercise 07 — three verdicts</h3>

        <div className="conflict-card">
          <div className="conflict-head">
            <span className="conflict-num">Q2.1</span>
            <Pill tone="bad">Not LL(1)</Pill>
          </div>
          <Grammar label="Grammar 2.1" lines={['S → A B | B A', 'A → a | b', 'B → b | c']} />
          <div className="conflict-math">
            <M block quiet>{String.raw`\mathrm{FIRST}(AB) = \{a,b\}, \qquad \mathrm{FIRST}(BA) = \{b,c\}`}</M>
            <M block quiet>{String.raw`\{a,b\} \cap \{b,c\} = \{b\} \ne \emptyset`}</M>
          </div>
          <p>
            <strong>FIRST–FIRST conflict on b.</strong> The parser cannot choose between
            <span className="mono"> S → AB</span> and <span className="mono">S → BA</span> after reading only
            <span className="mono"> b</span>.
          </p>
        </div>

        <div className="conflict-card">
          <div className="conflict-head">
            <span className="conflict-num">Q2.2</span>
            <Pill tone="bad">Not LL(1)</Pill>
          </div>
          <Grammar label="Grammar 2.2" lines={['S → A B', 'A → a | ε', 'B → S B | c']} />
          <div className="conflict-math">
            <M block quiet>{String.raw`\mathrm{FIRST}(A) = \{a,\varepsilon\}, \qquad \mathrm{FOLLOW}(A) = \mathrm{FIRST}(B) = \{a,c\}`}</M>
            <M block quiet>{String.raw`\mathrm{FIRST}(A) \cap \mathrm{FOLLOW}(A) = \{a\} \ne \emptyset`}</M>
          </div>
          <p>
            <strong>FIRST–FOLLOW conflict on a — plus hidden left recursion.</strong> Since
            <M>{String.raw`A \Rightarrow \varepsilon`}</M>, we get
            <M>{String.raw`\;S \Rightarrow AB \Rightarrow B \Rightarrow SB`}</M>. Two independent reasons to reject
            LL(1), and either one is enough.
          </p>
        </div>

        <div className="conflict-card">
          <div className="conflict-head">
            <span className="conflict-num">Q2.3</span>
            <Pill tone="bad">Not LL(1)</Pill>
          </div>
          <Grammar
            label="Grammar 2.3"
            lines={['S → A B | C D', 'A → E a', 'E → e | ε', 'C → a | b', 'B → c', 'D → d']}
          />
          <div className="conflict-math">
            <M block quiet>{String.raw`\mathrm{FIRST}(AB) = \mathrm{FIRST}(A) = \{e,a\}`}</M>
            <M block quiet>{String.raw`\mathrm{FIRST}(CD) = \mathrm{FIRST}(C) = \{a,b\}`}</M>
            <M block quiet>{String.raw`\{e,a\} \cap \{a,b\} = \{a\} \ne \emptyset`}</M>
          </div>
          <p>
            <strong>FIRST–FIRST conflict on a.</strong> <M>{String.raw`E`}</M> is nullable, so
            <M>{String.raw`A \to Ea`}</M> can begin with <span className="mono">e</span> (E survives) or
            <span className="mono"> a</span> (E vanishes). Both alternatives of S can therefore start with
            <span className="mono"> a</span>.
          </p>
        </div>

        <Callout variant="trap" title="Transformation is not a certificate">
          <p>
            “Non-left-recursive and left-factored” does <strong>not</strong> imply LL(1). Q2.2 has no direct left
            recursion after rewriting and still fails on FIRST–FOLLOW. Use the three checks, not the shape of the
            grammar.
          </p>
        </Callout>

        <div className="lesson-takeaway">
          <CircleCheck size={18} aria-hidden="true" />
          <div>
            <strong>Lesson 8 in one sentence.</strong>
            <p>
              FIRST fills the columns a rule can start in; FOLLOW fills the extra columns of an ε-rule; at most one
              entry per cell means LL(1).
            </p>
          </div>
        </div>
        <div className="lesson-next">
          <p>Next: pushdown automata — the machine that gives a context-free grammar its memory.</p>
          <Link className="text-link" to="/lessons/9">
            Pushdown automata <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </LessonShell>
  )
}
