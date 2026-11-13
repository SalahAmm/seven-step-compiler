import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { DeepDives, GuideShell } from '../../components/GuideChrome'
import { DrillList } from '../../components/DrillList'
import { Ll1Lab } from '../../components/Ll1Lab'
import { M } from '../../components/Math'
import { ParseTree, abdceTree } from '../../components/ParseTree'
import { Callout, Pill, SectionHeading } from '../../components/ui'
import { getGuideStage } from '../../data/guide'

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

const conflictQuestions = [
  {
    id: 'Q.2.1',
    grammar: 'S → AB | BA,   A → a | b,   B → b | c',
    verdict: 'Not LL(1)',
    why: 'FIRST(AB) = {a,b} and FIRST(BA) = {b,c}. They overlap on b: a FIRST–FIRST conflict at S.',
  },
  {
    id: 'Q.2.2',
    grammar: 'S → AB,   A → a | ε,   B → SB | c',
    verdict: 'Not LL(1)',
    why: 'FIRST(a) = {a} and FOLLOW(A) = FIRST(B) includes a (through S → AB and B → SB). FIRST–FOLLOW conflict at A. The grammar is also indirectly left-recursive.',
  },
  {
    id: 'Q.2.3',
    grammar: 'S → AB | CD,   A → Ea,   E → e | ε,   C → a | b,   B → c,   D → d',
    verdict: 'Not LL(1)',
    why: 'FIRST(AB) = FIRST(A) = {e,a} because E can vanish. FIRST(CD) = {a,b}. They overlap on a: FIRST–FIRST conflict at S.',
  },
]

export function Guide06() {
  const stage = getGuideStage(6)!

  return (
    <GuideShell stage={stage}>
      <p className="lead-in">
        Stage 6 is the highest-scoring stage. One table, three conflict checks and one stack simulation cover most
        of the parsing exercise. The table is not new theory — it is just FIRST and FOLLOW written into a grid.
      </p>

      <section id="table">
        <SectionHeading id="table">Building the LL(1) table</SectionHeading>
        <p>
          Rows are the non-terminals. Columns are the terminals plus the end marker <M>{String.raw`\$`}</M>. Each
          cell answers one question: “If the parser is expanding this non-terminal and sees this lookahead, which
          rule should it use?”
        </p>

        <ol className="steps">
          <li>
            <strong>Fill every rule using FIRST.</strong>
            <p>
              For a rule <M>{String.raw`A \to \text{body}`}</M>, put the rule in row <M>{String.raw`A`}</M> under
              every lowercase letter in <M>{String.raw`\mathrm{FIRST}(\text{body})`}</M>. Ignore{' '}
              <M>{String.raw`\varepsilon`}</M> here.
            </p>
          </li>
          <li>
            <strong>Close nullable rules using FOLLOW.</strong>
            <p>
              If the body can vanish, also put the rule in row <M>{String.raw`A`}</M> under every symbol of{' '}
              <M>{String.raw`\mathrm{FOLLOW}(A)`}</M>, including <M>{String.raw`\$`}</M> when present.
            </p>
          </li>
          <li>
            <strong>Check the cells.</strong>
            <p>
              If every cell has at most one rule, the grammar is LL(1). If any cell has two rules, it is not — and
              that cell is the conflict to name in your answer.
            </p>
          </li>
        </ol>

        <h3>The full table for Set 2, Exercise 09</h3>
        <p>
          This is the grammar from Stage 5: <M>{String.raw`S \to XY`}</M>,{' '}
          <M>{String.raw`X \to aXb \mid \varepsilon`}</M>, <M>{String.raw`Y \to cZ \mid Ze`}</M>,{' '}
          <M>{String.raw`Z \to dcZ \mid \varepsilon`}</M>. Every cell below comes directly from the FIRST and
          FOLLOW tables.
        </p>

        <div className="table-wrap">
          <table className="data-table ll-table">
            <caption>LL(1) parsing table. Empty cells are errors: the parser would reject.</caption>
            <thead>
              <tr>
                <th className="ll-corner" scope="col">Non-terminal</th>
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
                  <th scope="row">{row.nt}</th>
                  <td className={row.a === '—' ? 'll-empty' : 'll-rule'}>{row.a}</td>
                  <td className={row.b === '—' ? 'll-empty' : 'll-rule'}>{row.b}</td>
                  <td className={row.c === '—' ? 'll-empty' : 'll-rule'}>{row.c}</td>
                  <td className={row.d === '—' ? 'll-empty' : 'll-rule'}>{row.d}</td>
                  <td className={row.e === '—' ? 'll-empty' : 'll-rule'}>{row.e}</td>
                  <td className={row.dollar === '—' ? 'll-empty' : 'll-rule'}>{row.dollar}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="compare-grid">
          <div className="compare-card">
            <div className="compare-card-head"><Pill tone="ok">Why X has no $ cell</Pill><span className="mono">FOLLOW(X)</span></div>
            <p>
              <M>{String.raw`\mathrm{FOLLOW}(X) = \{b,c,d,e\}`}</M>. It does not contain{' '}
              <M>{String.raw`\$`}</M>, so the ε-rule for <M>{String.raw`X`}</M> never goes in the dollar column.
            </p>
          </div>
          <div className="compare-card">
            <div className="compare-card-head"><Pill tone="ok">Why Z has two ε cells</Pill><span className="mono">FOLLOW(Z)</span></div>
            <p>
              <M>{String.raw`\mathrm{FOLLOW}(Z) = \{e,\$\}`}</M>, so <M>{String.raw`Z \to \varepsilon`}</M> appears
              under both <span className="mono">e</span> and <span className="mono">$</span>.
            </p>
          </div>
        </div>

        <Callout variant="key" title="The table is LL(1) — here is the proof">
          <p>
            Scan every cell. The largest number of rules in any cell is one. Therefore the grammar is LL(1), and the
            parser never has to guess. If two rules had landed in the same cell, that cell would be the named
            conflict.
          </p>
        </Callout>
      </section>

      <section id="conflicts">
        <SectionHeading id="conflicts">The three conflict checks</SectionHeading>
        <p>
          The table is the full proof, but the exam often asks you to decide LL(1) without building it. Check these
          three problems in order:
        </p>

        <div className="conflict-grid">
          <article className="conflict-card">
            <div className="conflict-head"><span className="conflict-num">01</span><h3>Left recursion</h3></div>
            <p>
              If the grammar is left-recursive, it is not LL(1). The parser would try to expand the same symbol
              forever before consuming a letter.
            </p>
            <p className="conflict-result">Any direct or indirect left recursion → stop.</p>
          </article>

          <article className="conflict-card">
            <div className="conflict-head"><span className="conflict-num">02</span><h3>FIRST–FIRST conflict</h3></div>
            <p>
              For two alternatives <M>{String.raw`A \to \alpha \mid \beta`}</M>, the parser cannot choose if{' '}
              <M>{String.raw`\mathrm{FIRST}(\alpha)`}</M> and <M>{String.raw`\mathrm{FIRST}(\beta)`}</M> share a
              letter.
            </p>
            <M block quiet>{String.raw`\mathrm{FIRST}(\alpha) \cap \mathrm{FIRST}(\beta) \ne \emptyset`}</M>
          </article>

          <article className="conflict-card">
            <div className="conflict-head"><span className="conflict-num">03</span><h3>FIRST–FOLLOW conflict</h3></div>
            <p>
              If one alternative is ε, the parser may skip it. Then the lookahead must not also be able to start the
              non-empty alternative.
            </p>
            <M block quiet>{String.raw`A \to \alpha \mid \varepsilon \quad\Rightarrow\quad \mathrm{FIRST}(\alpha) \cap \mathrm{FOLLOW}(A) = \emptyset`}</M>
          </article>
        </div>

        <h3>Set 2, Exercise 07 — all three questions at a glance</h3>
        <div className="conflict-list">
          {conflictQuestions.map((item) => (
            <article className="conflict-question" key={item.id}>
              <div className="conflict-question-head">
                <span className="conflict-question-id">{item.id}</span>
                <Pill tone="bad">{item.verdict}</Pill>
              </div>
              <div className="mono conflict-grammar">{item.grammar}</div>
              <p>{item.why}</p>
            </article>
          ))}
        </div>

        <Callout variant="trap" title="The answer format that earns marks">
          <p>
            Do not just write “not LL(1)”. Write the conflict and the overlapping symbol:{' '}
            <strong>“FIRST–FIRST conflict on b at S”</strong> or{' '}
            <strong>“FIRST–FOLLOW conflict on a at A”</strong>. That sentence is usually worth the method mark even
            if your set calculation has a small slip.
          </p>
        </Callout>
      </section>

      <section id="stack">
        <SectionHeading id="stack">The stack game</SectionHeading>
        <p>
          The parser is a stack machine. The start symbol is pushed on the right, because the right end is the top.
          The input is the word followed by <M>{String.raw`\$`}</M>.
        </p>

        <M block focus>{String.raw`\text{Stack} = \$S \qquad \text{Input} = w\$`}</M>

        <ol className="steps">
          <li>
            <strong>Look at the top of the stack and the next input letter.</strong>
            <p>
              The top of the stack is the <em>rightmost</em> character. The next input letter is the{' '}
              <em>leftmost</em> character of what remains.
            </p>
          </li>
          <li>
            <strong>If both are the same terminal, pop both.</strong>
            <p>
              A match consumes one input letter and removes one stack symbol. Then repeat.
            </p>
          </li>
          <li>
            <strong>If the top is a non-terminal, expand it.</strong>
            <p>
              Look up <M>{String.raw`(\text{top}, \text{current})`}</M> in the table. Erase the top, then push the
              right-hand side <strong>backwards</strong> so its first symbol ends up on top. If the rule is{' '}
              <M>{String.raw`A \to \varepsilon`}</M>, push nothing.
            </p>
          </li>
          <li>
            <strong>Accept when both sides are $.</strong>
            <p>
              If the stack and input both reach <M>{String.raw`\$`}</M>, the word is in the language. A missing table
              entry or a mismatched terminal is a rejection.
            </p>
          </li>
        </ol>

        <h3>Full simulation of abdce (Set 2, Exercise 09 Q5)</h3>
        <div className="table-wrap">
          <table className="data-table trace-table">
            <caption>Every row is one parser move. Top of stack is the rightmost symbol.</caption>
            <thead><tr><th scope="col">Stack</th><th scope="col">Input</th><th scope="col">Action</th></tr></thead>
            <tbody>
              {traceRows.map((row, index) => (
                <tr key={`${row.stack}-${index}`} className={row.action === 'accept' ? 'is-accept' : ''}>
                  <td className="mono">{row.stack}</td>
                  <td className="mono">{row.input}</td>
                  <td>{row.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Ll1Lab />

        <Callout variant="trap" title="The backward push, explained once">
          <p>
            Suppose the rule is <M>{String.raw`S \to XY`}</M>. If you push <span className="mono">X</span> then{' '}
            <span className="mono">Y</span>, the top becomes <span className="mono">Y</span> and the parser reads the
            rule out of order. Push <span className="mono">Y</span> first, then <span className="mono">X</span>, so
            the top is <span className="mono">X</span>. In a written trace, the stack after the move is{' '}
            <M>{String.raw`\$YX`}</M>.
          </p>
        </Callout>
      </section>

      <section id="tree">
        <SectionHeading id="tree">Derivation & parse tree</SectionHeading>
        <p>
          The action column of the trace already contains the leftmost derivation. Read the expansions in order and
          write the sentential forms:
        </p>

        <M block focus>{String.raw`S \Rightarrow XY \Rightarrow aXbY \Rightarrow abY \Rightarrow abZe \Rightarrow abdcZe \Rightarrow abdce`}</M>

        <p>
          The parse tree is the same information drawn as a picture. <M>{String.raw`S`}</M> branches into{' '}
          <M>{String.raw`X`}</M> and <M>{String.raw`Y`}</M>; <M>{String.raw`X`}</M> produces{' '}
          <span className="mono">a</span>, a nested <M>{String.raw`X`}</M> that becomes ε, and{' '}
          <span className="mono">b</span>; <M>{String.raw`Y`}</M> produces <M>{String.raw`Z`}</M> and{' '}
          <span className="mono">e</span>; <M>{String.raw`Z`}</M> produces <span className="mono">d</span>,{' '}
          <span className="mono">c</span>, and a nested <M>{String.raw`Z`}</M> that becomes ε.
        </p>

        <div className="figure-scroll parse-tree-scroll">
          <ParseTree
            tree={abdceTree}
            ariaLabel="Parse tree for abdce: S branches to X and Y; X produces a, an epsilon X, and b; Y produces Z then e; Z produces d, c, and an epsilon Z."
          />
        </div>

        <Callout variant="note" title="Reading the tree back into a derivation">
          <p>
            A leftmost derivation is a depth-first walk that always expands the leftmost non-terminal. The tree and
            the derivation are two views of the same sequence of rules — do not build them independently.
          </p>
        </Callout>
      </section>

      <section id="drills">
        <SectionHeading id="drills">Quick-check drills</SectionHeading>
        <DrillList
          items={[
            {
              q: <>In the exam table, which cells receive <span className="mono">X → ε</span>?</>,
              a: <p>Under <span className="mono">b, c, d, e</span> — exactly FOLLOW(X). It does not go under <span className="mono">a</span> or <span className="mono">$</span>.</p>,
            },
            {
              q: <>Why does the parser push the right-hand side backwards?</>,
              a: <p>Because the stack top is the right end. Reversing puts the first symbol of the rule on top, so it is expanded or matched next.</p>,
            },
            {
              q: (
                <>
                  Is <span className="mono">S → AB | BA, A → a | b, B → b | c</span> LL(1)?
                </>
              ),
              a: <p>No. FIRST(AB) = {'{a,b}'} and FIRST(BA) = {'{b,c}'} overlap on b. That is a FIRST–FIRST conflict at S.</p>,
            },
            {
              q: <>What does a cell containing two rules prove?</>,
              a: <p>The grammar is not LL(1). The parser cannot choose between the two rules with one lookahead symbol, so the grammar is ambiguous for that lookahead (or at least not LL(1)).</p>,
            },
          ]}
        />
      </section>

      <Callout variant="key" title="What you can now do">
        <p>
          You can fill the entire LL(1) table, name every conflict, simulate the parser move by move, and read off the
          leftmost derivation and parse tree. This is the 6-point exercise from Interro 2 and the largest block in
          Set 2.
        </p>
        <p>
          Next: Stage 7 adds a stack to the automaton and closes with the true/false questions.{' '}
          <Link className="text-link" to="/guide/7">
            Continue to PDA & QCM <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </p>
      </Callout>

      <DeepDives stage={stage} />
    </GuideShell>
  )
}
