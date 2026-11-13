import { Link } from 'react-router-dom'
import { ArrowRight, CircleCheck } from 'lucide-react'
import { M } from '../../components/Math'
import { BoardFigure, Callout, Grammar, SectionHeading } from '../../components/ui'
import { TreePair, acbbTreeOne, acbbTreeTwo, cdaTreeOne, cdaTreeTwo } from '../../components/ParseTree'
import { LessonShell } from './LessonShell'

export function Lesson05() {
  return (
    <LessonShell id={5}>
      <p className="lead-in">
        Part II begins with a classification question that looks like theory but is really pattern matching. Ask how
        many counts have to agree. No matching counts means regular; nested matching counts means context-free; three
        counts that must agree means a single stack is not enough.
      </p>

      <section>
        <SectionHeading id="types">The three types</SectionHeading>
        <p>
          The exercise set gives you languages and asks for the smallest machine or grammar that can recognise them.
          The tell-tale sign is in the exponents, not in the alphabet.
        </p>
        <div className="table-wrap">
          <table className="data-table type-table">
            <caption>Set 2, Exercise 01 — classify at a glance.</caption>
            <thead>
              <tr>
                <th scope="col">Type</th>
                <th scope="col">Name</th>
                <th scope="col">Machine</th>
                <th scope="col">Tell-tale sign</th>
                <th scope="col">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Type 3</strong></td>
                <td>Regular</td>
                <td>Finite automaton</td>
                <td>No two parts must match counts: independent exponents, or a finite language.</td>
                <td className="mono">L₂ = {'{(ab)ⁿ c dᵐ | n, m ≥ 0}'}</td>
              </tr>
              <tr>
                <td><strong>Type 2</strong></td>
                <td>Context-free (CFG)</td>
                <td>Pushdown automaton (PDA)</td>
                <td>Nested or mirrored matching counts: outside matches outside, inside matches inside.</td>
                <td className="mono">L₁ = {'{aⁿ bᵐ c dᵐ eⁿ | n, m ≥ 0}'}</td>
              </tr>
              <tr>
                <td><strong>Type 1</strong></td>
                <td>Context-sensitive (not CFG)</td>
                <td>—</td>
                <td>Three matching counts, or cross-matching counts. One stack cannot count three things at once.</td>
                <td className="mono">L₃ = {'{aⁿ b (cd)ⁿ eⁿ | n ≥ 0}'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="three-col type-explainers">
          <div className="panel accent">
            <h4>L₂ is regular</h4>
            <p className="mono">L₂ = {'{(ab)ⁿ c dᵐ | n,m ≥ 0}'}</p>
            <p>
              The number of <span className="mono">ab</span> blocks and the number of
              <span className="mono"> d</span>’s never have to agree. Read <span className="mono">ab</span> in a loop,
              then <span className="mono">c</span>, then loop on <span className="mono">d</span>. No memory is needed.
            </p>
            <Grammar
              label="Regular grammar for L2"
              lines={['S → abS | cA', 'A → dA | ε']}
              note="Right-linear: every rule has at most one non-terminal, on the right."
            />
          </div>
          <div className="panel">
            <h4>L₁ is context-free</h4>
            <p className="mono">L₁ = {'{aⁿ bᵐ c dᵐ eⁿ | n,m ≥ 0}'}</p>
            <p>
              The <span className="mono">a</span>’s match the <span className="mono">e</span>’s on the outside; the
              <span className="mono"> b</span>’s match the <span className="mono">d</span>’s on the inside. Push the
              outside, then the inside, and pop in the reverse order.
            </p>
            <Grammar
              label="CFG for L1"
              lines={['S → aSe | A', 'A → bAd | c']}
              note="Outside-in: the grammar wraps one matching pair at a time."
            />
          </div>
          <div className="panel signal">
            <h4>L₃ is not context-free</h4>
            <p className="mono">L₃ = {'{aⁿ b (cd)ⁿ eⁿ | n ≥ 0}'}</p>
            <p>
              There are three occurrences of <span className="mono">n</span>: the <span className="mono">a</span>’s, the
              <span className="mono"> cd</span> pairs, and the <span className="mono">e</span>’s. A single stack can
              match two counts, but not three independent ones.
            </p>
            <p className="small">
              It is context-sensitive (Type 1), but the course only asks you to say that it is not CFG.
            </p>
          </div>
        </div>

        <Callout variant="key" title="The quick decision rule">
          <p>
            <strong>Independent loops</strong> → regular. <strong>Nested matching pairs</strong> → context-free.
            <strong>Three or more counts that must agree</strong> → not context-free.
          </p>
          <p>
            Do not count letters; count <em>constraints between groups</em>. A language with many letters can still be
            regular if the groups do not have to match.
          </p>
        </Callout>

        <Callout variant="note" title="Where is Type 0?">
          <p>
            The Chomsky hierarchy starts at Type 0, the recursively enumerable languages recognised by a Turing
            machine. The exercise set and the exam table only use Types 3, 2 and 1, so Type 0 is not needed for this
            question.
          </p>
        </Callout>
      </section>

      <section>
        <SectionHeading id="derivations">Leftmost & rightmost</SectionHeading>
        <p>
          A derivation is a sequence of rewrites starting from <M>{String.raw`S`}</M>. In a
          <strong>leftmost derivation</strong> (<M>{String.raw`\Rightarrow_{lm}`}</M>) you always expand the leftmost
          non-terminal. In a <strong>rightmost derivation</strong> (<M>{String.raw`\Rightarrow_{rm}`}</M>) you always
          expand the rightmost one.
        </p>
        <p>
          The order changes, but the final word and the parse tree do not. Ambiguity is about having two different
          <em> trees</em>, not merely two different derivation orders.
        </p>

        <div className="two-col">
          <div className="panel">
            <h4>Leftmost</h4>
            <p className="derivation-line mono">S ⇒ AB ⇒ aAB ⇒ aaB ⇒ aab</p>
            <p className="small">Expand A, then A, then B.</p>
          </div>
          <div className="panel">
            <h4>Rightmost</h4>
            <p className="derivation-line mono">S ⇒ AB ⇒ Ab ⇒ aAb ⇒ aab</p>
            <p className="small">Expand B first, then the rightmost A.</p>
          </div>
        </div>
        <p className="small">
          Illustrative grammar: <span className="mono">S → AB</span>, <span className="mono">A → aA | a</span>,
          <span className="mono"> B → b</span>. Both derivations produce the same word and the same tree.
        </p>
      </section>

      <section>
        <SectionHeading id="ambiguity">Proving ambiguity</SectionHeading>
        <p>
          A grammar is ambiguous if there is <strong>one word</strong> with <strong>two different parse trees</strong>
          (equivalently, two different leftmost derivations). You only need one witness. Do not try to show that every
          word has two trees.
        </p>

        <h3>Example 1 — Set 2, Exercise 02</h3>
        <Grammar
          label="Ambiguous grammar G"
          lines={['S → aTb | Tb', 'T → S | c']}
          note="The same S can grow on the left with an a, or on the right with an extra b."
        />
        <p>
          First find the language. Every use of an <M>{String.raw`S`}</M> rule adds a <span className="mono">b</span> on
          the right; a use of <M>{String.raw`S \to aTb`}</M> also adds an <span className="mono">a</span> on the left.
          At least one <M>{String.raw`S \to \dots b`}</M> must be used, because the start symbol is an
          <M>{String.raw`S`}</M>. Hence:
        </p>
        <M block>{String.raw`L(G) = \{\, a^n c b^m \;\mid\; m \ge n \ge 0 \;\text{ and }\; m \ge 1 \,\}`}</M>
        <Callout variant="trap" title="Do not reverse the inequality">
          <p>
            In <span className="mono">acbb</span>, there is one <span className="mono">a</span> and two
            <span className="mono"> b</span>’s: <M>{String.raw`n=1`}</M>, <M>{String.raw`m=2`}</M>, so
            <M>{String.raw`\;m \ge n`}</M>. A common student answer writes <M>{String.raw`n \ge m`}</M>, which would
            exclude the very witness used to prove ambiguity.
          </p>
        </Callout>

        <p>Two derivations of the same word <span className="mono">acbb</span>:</p>
        <div className="two-col">
          <div className="panel">
            <h4>Tree 1 — choose a first</h4>
            <p className="derivation-line mono">S ⇒ aTb ⇒ aSb ⇒ aTbb ⇒ acbb</p>
            <p className="small">Use <span className="mono">S → aTb</span> at the root, then the extra b inside.</p>
          </div>
          <div className="panel">
            <h4>Tree 2 — choose an extra b first</h4>
            <p className="derivation-line mono">S ⇒ Tb ⇒ Sb ⇒ aTbb ⇒ acbb</p>
            <p className="small">Use <span className="mono">S → Tb</span> at the root, then the a inside.</p>
          </div>
        </div>

        <BoardFigure
          title="One word · two parse trees"
          note="acbb has two different structures"
          caption={
            <>
              <strong>Ambiguity proved.</strong> The same word <span className="mono">acbb</span> has two distinct parse
              trees, so <M>{String.raw`G`}</M> is ambiguous. The two trees differ at the root: one is an
              <span className="mono"> a…b</span> expansion, the other is a <span className="mono">…b</span> expansion.
            </>
          }
          credit="Set 2, Exercise 02"
        >
          <TreePair
            left={acbbTreeOne}
            right={acbbTreeTwo}
            leftLabel="Tree 1 — S → aTb at the root"
            rightLabel="Tree 2 — S → Tb at the root"
          />
        </BoardFigure>

        <h3>Example 2 — Interro 2, Exercise 02</h3>
        <Grammar
          label="Grammar for the cda ambiguity"
          lines={[
            'A → BC',
            'B → DEF | ε',
            'C → aC | a',
            'D → d | c | ε',
            'E → c | ε',
            'F → d',
          ]}
          note="The letter c can be produced by D or by E. That overlap is the source of the ambiguity."
        />
        <p>
          The word is <span className="mono">cda</span>. Both trees use <M>{String.raw`A \to BC`}</M>,
          <M>{String.raw`\,C \to a`}</M>, and <M>{String.raw`F \to d`}</M>. They differ in how
          <M>{String.raw`B \to DEF`}</M> produces the <span className="mono">c</span>:
        </p>
        <ul>
          <li><strong>Tree 1:</strong> <M>{String.raw`D \to c`}</M>, <M>{String.raw`E \to \varepsilon`}</M>, <M>{String.raw`F \to d`}</M>.</li>
          <li><strong>Tree 2:</strong> <M>{String.raw`D \to \varepsilon`}</M>, <M>{String.raw`E \to c`}</M>, <M>{String.raw`F \to d`}</M>.</li>
        </ul>
        <BoardFigure
          title="cda · the c has two possible parents"
          note="D → c or E → c"
          caption={
            <>
              <strong>Same word, different structure.</strong> The letter <span className="mono">c</span> can come from
              <span className="mono"> D</span> or from <span className="mono">E</span>. Since both choices lead to the
              same surface word, the grammar is ambiguous.
            </>
          }
          credit="Interro 2, Exercise 02"
        >
          <TreePair
            left={cdaTreeOne}
            right={cdaTreeTwo}
            leftLabel="Tree 1 — D → c, E → ε"
            rightLabel="Tree 2 — D → ε, E → c"
          />
        </BoardFigure>

        <div className="lesson-takeaway">
          <CircleCheck size={18} aria-hidden="true" />
          <div>
            <strong>Lesson 5 in one sentence.</strong>
            <p>
              Classify by counting constraints, derive by choosing a side, and prove ambiguity with one word and two
              trees.
            </p>
          </div>
        </div>
        <div className="lesson-next">
          <p>Next: remove ε-productions and binarize every rule into Chomsky Normal Form.</p>
          <Link className="text-link" to="/lessons/6">
            ε-removal & CNF <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </LessonShell>
  )
}
