import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { DeepDives, GuideShell } from '../../components/GuideChrome'
import { DrillList } from '../../components/DrillList'
import { LeftRecursionLab } from '../../components/LeftRecursionLab'
import { M } from '../../components/Math'
import { TreePair, acbbTreeOne, acbbTreeTwo } from '../../components/ParseTree'
import { Callout, Grammar, Pill, SectionHeading } from '../../components/ui'
import { getGuideStage } from '../../data/guide'

const hierarchy = [
  {
    type: 'Type 3 · Regular',
    tell: 'Counts are independent. No pair has to match.',
    example: <M>{String.raw`L_2 = \{(ab)^n c\,d^m \mid n,m \ge 0\}`}</M>,
    grammar: 'S → abS | cA,   A → dA | ε',
  },
  {
    type: 'Type 2 · Context-free',
    tell: 'Nested pairs, like an onion. One count wraps another.',
    example: <M>{String.raw`L_1 = \{a^n b^m c\,d^m e^n \mid n,m \ge 0\}`}</M>,
    grammar: 'S → aSe | A,   A → bAd | c',
  },
  {
    type: 'Type 1 · Not context-free',
    tell: 'Three or more matching counts, or crossing dependencies.',
    example: <M>{String.raw`L_3 = \{a^n b\,(cd)^n e^n \mid n \ge 0\}`}</M>,
    grammar: 'No CFG can count all three at once.',
  },
]

const cnfVariants = [
  { original: 'S → ATA', add: 'S → AA' },
  { original: 'S → BTB', add: 'S → BB' },
  { original: 'T → ATA', add: 'T → AA' },
  { original: 'T → BTB', add: 'T → BB' },
]

export function Guide04() {
  const stage = getGuideStage(4)!

  return (
    <GuideShell stage={stage}>
      <p className="lead-in">
        Stage 4 is the grammar stage. A grammar is just a set of replacement rules: start from an uppercase
        placeholder, replace one symbol at a time, and stop when only lowercase letters remain. The exam asks four
        things about that process — which Chomsky type it is, whether it is ambiguous, how to put it in CNF, and how
        to remove left recursion.
      </p>

      <section id="types">
        <SectionHeading id="types">Grammar basics & the Chomsky hierarchy</SectionHeading>
        <p>
          <strong>Non-terminals</strong> are uppercase placeholders such as <M>{String.raw`S, A, B`}</M>.{' '}
          <strong>Terminals</strong> are the real letters that end up in the word, such as{' '}
          <M>{String.raw`a, b, c`}</M>. A <strong>production</strong> says that a non-terminal may be replaced by
          the string on its right.
        </p>

        <Grammar
          label="A tiny grammar"
          lines={['S → aS', 'S → b']}
          note="Start at S. Replace S by aS as many times as you like, then finish with b. The language is a*b."
        />

        <p>
          To classify a language, look at the <strong>exponents</strong>. The moment two exponents must stay equal,
          the language is no longer regular. The moment three exponents must stay equal, it is no longer
          context-free.
        </p>

        <div className="table-wrap">
          <table className="data-table">
            <caption>The three levels that appear in Set 2, Exercise 1.</caption>
            <thead>
              <tr><th scope="col">Type</th><th scope="col">How to recognise it</th><th scope="col">Language</th><th scope="col">Grammar shape</th></tr>
            </thead>
            <tbody>
              {hierarchy.map((row) => (
                <tr key={row.type}>
                  <td><strong>{row.type}</strong></td>
                  <td>{row.tell}</td>
                  <td>{row.example}</td>
                  <td className="mono">{row.grammar}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Callout variant="key" title="The quick test">
          <p>
            Write the exponents side by side. If no two must match, it is regular. If they nest in pairs, it is
            context-free. If three or more must match — or the matching crosses — it is not context-free. That single
            sentence answers Exercise 1.
          </p>
        </Callout>

        <div className="compare-grid">
          <div className="compare-card">
            <div className="compare-card-head"><Pill tone="ok">Type 3 shape</Pill><span className="mono">right-linear</span></div>
            <p>
              At most one non-terminal, and it sits at the very end: <M>{String.raw`A \to aB`}</M> or{' '}
              <M>{String.raw`A \to a`}</M>. The grammar cannot remember two counts at once.
            </p>
          </div>
          <div className="compare-card">
            <div className="compare-card-head"><Pill tone="ok">Type 2 shape</Pill><span className="mono">context-free</span></div>
            <p>
              Exactly one non-terminal on the left: <M>{String.raw`A \to \alpha`}</M>. The right side may be any mix
              of terminals and non-terminals, including nested pairs such as <M>{String.raw`S \to aSe`}</M>.
            </p>
          </div>
        </div>
      </section>

      <section id="ambiguity">
        <SectionHeading id="ambiguity">Derivations & ambiguity</SectionHeading>
        <p>
          A <strong>leftmost derivation</strong> always replaces the leftmost uppercase symbol next. A{' '}
          <strong>rightmost derivation</strong> always replaces the rightmost one. A grammar is{' '}
          <strong>ambiguous</strong> when one word has two different parse trees — equivalently, two different
          leftmost derivations.
        </p>

        <h3>Set 2, Exercise 02 — the word acbb</h3>
        <Grammar
          label="The ambiguous grammar"
          lines={['S → aTb | Tb', 'T → S | c']}
          note="Both derivations below produce the same word, acbb, but use a different first rule."
        />

        <div className="derivation-stack">
          <div className="derivation-box">
            <div className="derivation-label">Derivation 1 · start with aTb</div>
            <div className="derivation-line">
              <span>S</span><span className="arrow">⇒</span><span>aTb</span><span className="arrow">⇒</span>
              <span>aSb</span><span className="arrow">⇒</span><span>aTbb</span><span className="arrow">⇒</span>
              <span>acbb</span>
            </div>
          </div>
          <div className="derivation-box">
            <div className="derivation-label">Derivation 2 · start with Tb</div>
            <div className="derivation-line">
              <span>S</span><span className="arrow">⇒</span><span>Tb</span><span className="arrow">⇒</span>
              <span>Sb</span><span className="arrow">⇒</span><span>aTbb</span><span className="arrow">⇒</span>
              <span>acbb</span>
            </div>
          </div>
        </div>

        <TreePair
          left={acbbTreeOne}
          right={acbbTreeTwo}
          leftLabel="Tree 1 · S → aTb first"
          rightLabel="Tree 2 · S → Tb first"
        />

        <Callout variant="note" title="A second ambiguity pattern to recognise">
          <p>
            Set 2, Exercise 06 uses <M>{String.raw`T \to R \mid aTc`}</M> and{' '}
            <M>{String.raw`R \to \varepsilon \mid RbR`}</M>. After the outer <span className="mono">a…c</span>{' '}
            layers are peeled away, the middle <M>{String.raw`R`}</M> can grow by expanding either its left{' '}
            <M>{String.raw`R`}</M> or its right <M>{String.raw`R`}</M>. Two different trees for the same run of{' '}
            <span className="mono">b</span>’s means the grammar is ambiguous.
          </p>
        </Callout>

        <Callout variant="trap" title="Ambiguity is not the same as left recursion">
          <p>
            <M>{String.raw`S \to Sa \mid a`}</M> is left-recursive but unambiguous: every word has exactly one tree.
            Left recursion breaks LL(1) parsing; it does not, by itself, create two trees. This distinction is one of
            the true/false statements in Stage 7.
          </p>
        </Callout>
      </section>

      <section id="cnf">
        <SectionHeading id="cnf">ε-removal & Chomsky Normal Form</SectionHeading>
        <p>
          Chomsky Normal Form allows exactly three shapes. Nothing else is legal once you are finished:
        </p>

        <div className="cnf-shapes">
          <div><M>{String.raw`A \to BC`}</M><span>exactly two non-terminals</span></div>
          <div><M>{String.raw`A \to a`}</M><span>exactly one terminal</span></div>
          <div><M>{String.raw`S \to \varepsilon`}</M><span>only for the start symbol, only if needed</span></div>
        </div>

        <h3>Set 2, Exercise 03.1 — the official grammar</h3>
        <Grammar
          label="G before CNF"
          lines={['S → ATA | BTB', 'T → ATA | BTB | ε', 'A → a', 'B → b']}
        />

        <ol className="steps">
          <li>
            <strong>Find every nullable symbol.</strong>
            <p>
              A symbol is nullable if it can vanish. Here only <M>{String.raw`T`}</M> has an ε-rule.{' '}
              <M>{String.raw`A`}</M> derives only <span className="mono">a</span> and <M>{String.raw`B`}</M> only{' '}
              <span className="mono">b</span>, so neither can disappear.
            </p>
          </li>
          <li>
            <strong>Duplicate every rule that contains a nullable symbol.</strong>
            <p>
              Keep the original and add a copy with <M>{String.raw`T`}</M> erased. Then delete{' '}
              <M>{String.raw`T \to \varepsilon`}</M>. Do not delete <M>{String.raw`T`}</M> itself — it can still be
              expanded by its other rules.
            </p>
          </li>
          <li>
            <strong>Remove unit rules and binarize.</strong>
            <p>
              There are no unit rules here. Every right-hand side longer than two symbols must be split with a fresh
              helper non-terminal. <span className="mono">ATA</span> becomes{' '}
              <M>{String.raw`A X`}</M> with <M>{String.raw`X \to TA`}</M>; <span className="mono">BTB</span>{' '}
              becomes <M>{String.raw`B Y`}</M> with <M>{String.raw`Y \to TB`}</M>.
            </p>
          </li>
        </ol>

        <div className="table-wrap">
          <table className="data-table">
            <caption>The ε-variants. The original rule stays; the shorter copy is added.</caption>
            <thead><tr><th scope="col">Original</th><th scope="col">Add</th></tr></thead>
            <tbody>
              {cnfVariants.map((row) => (
                <tr key={row.original}>
                  <td className="mono">{row.original}</td>
                  <td className="mono">{row.add}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Grammar
          label="Final CNF"
          lines={[
            'S → AX | BY | AA | BB',
            'T → AX | BY | AA | BB',
            'X → TA',
            'Y → TB',
            'A → a',
            'B → b',
          ]}
          note="Every rule now has exactly two non-terminals or exactly one terminal."
        />

        <Callout variant="trap" title="Four CNF mistakes">
          <p>
            <strong>1. Deleting the original rule.</strong> You add the shorter variant; you do not replace the rule
            that still contains the nullable symbol.
          </p>
          <p>
            <strong>2. Forgetting a combination.</strong> If a nullable symbol appears twice, you need the variants
            with each occurrence removed.
          </p>
          <p>
            <strong>3. Leaving a terminal inside a long rule.</strong> A rule like{' '}
            <M>{String.raw`S \to aAB`}</M> needs a helper <M>{String.raw`X \to a`}</M> first, giving{' '}
            <M>{String.raw`S \to XAB`}</M>, then a second split.
          </p>
          <p>
            <strong>4. Keeping ε everywhere.</strong> Only the start symbol may keep an ε-rule, and only when the
            empty word belongs to the language.
          </p>
        </Callout>
      </section>

      <section id="recursion">
        <SectionHeading id="recursion">Left recursion & left factoring</SectionHeading>
        <p>
          A grammar is <strong>left-recursive</strong> when a non-terminal can reach itself through the first symbol
          of a right-hand side — directly (<M>{String.raw`A \to A\dots`}</M>) or through a cycle (
          <M>{String.raw`A \to B\dots`}</M> and <M>{String.raw`B \to A\dots`}</M>). An LL parser would loop forever,
          so the exam always asks you to remove it.
        </p>

        <h3>Direct left recursion</h3>
        <p>
          Suppose <M>{String.raw`A`}</M> has recursive rules <M>{String.raw`A \to A\alpha`}</M> and non-recursive
          rules <M>{String.raw`A \to \beta`}</M>. Move the tail to a fresh symbol:
        </p>
        <M block>{String.raw`A \to A\alpha_1 \mid A\alpha_2 \mid \beta_1 \mid \beta_2`}</M>
        <M block focus>{String.raw`A \to \beta_1A' \mid \beta_2A' \qquad A' \to \alpha_1A' \mid \alpha_2A' \mid \varepsilon`}</M>
        <p>
          Every base case <M>{String.raw`\beta`}</M> keeps <M>{String.raw`A'`}</M> at the back. Every recursive tail{' '}
          <M>{String.raw`\alpha`}</M> moves to <M>{String.raw`A'`}</M> and also keeps <M>{String.raw`A'`}</M> at the
          back. The ε-rule is what lets the recursion stop.
        </p>

        <h3>Indirect left recursion — respect A &lt; B &lt; C</h3>
        <ol className="steps">
          <li>
            <strong>Go in the given order.</strong>
            <p>
              Handle <M>{String.raw`A`}</M> first, then <M>{String.raw`B`}</M>, then <M>{String.raw`C`}</M>. The
              order is part of the answer, not a suggestion.
            </p>
          </li>
          <li>
            <strong>Substitute earlier letters at the front.</strong>
            <p>
              When handling <M>{String.raw`C`}</M>, any rule <M>{String.raw`C \to A\dots`}</M> or{' '}
              <M>{String.raw`C \to B\dots`}</M> must be expanded with the current rules of{' '}
              <M>{String.raw`A`}</M> or <M>{String.raw`B`}</M>.
            </p>
          </li>
          <li>
            <strong>Then fix direct recursion.</strong>
            <p>
              After substitution, if the current symbol starts with itself, apply the direct formula. Do not apply
              the formula before substituting — you will miss the cycle.
            </p>
          </li>
        </ol>

        <h3>Interro 2, Exercise 04 — the full A &lt; B &lt; C run</h3>
        <Grammar
          label="G3 before removal"
          lines={['A → Aa | BC', 'B → AC | CC', 'C → BA | AC | b']}
          note="The required order is A first, then B, then C."
        />

        <div className="recursion-steps">
          <article>
            <span className="recursion-tag">A</span>
            <h4>No earlier letters</h4>
            <p>
              <M>{String.raw`A \to Aa \mid BC`}</M> is directly recursive. With <M>{String.raw`\alpha=a`}</M> and{' '}
              <M>{String.raw`\beta=BC`}</M>:
            </p>
            <M block quiet>{String.raw`A \to BCA' \qquad A' \to aA' \mid \varepsilon`}</M>
          </article>

          <article>
            <span className="recursion-tag">B</span>
            <h4>Substitute A, then split B</h4>
            <p>
              <M>{String.raw`B \to AC \mid CC`}</M> starts with <M>{String.raw`A`}</M>. Replace{' '}
              <M>{String.raw`A`}</M> by <M>{String.raw`BCA'`}</M>:
            </p>
            <M block quiet>{String.raw`B \to BCA'C \mid CC`}</M>
            <p>Now <M>{String.raw`B`}</M> is directly recursive. Apply the formula:</p>
            <M block quiet>{String.raw`B \to CCB' \qquad B' \to CA'CB' \mid \varepsilon`}</M>
          </article>

          <article>
            <span className="recursion-tag">C</span>
            <h4>Substitute A, then B, then split C</h4>
            <p>
              <M>{String.raw`C \to BA \mid AC \mid b`}</M>. Replace <M>{String.raw`A`}</M> by{' '}
              <M>{String.raw`BCA'`}</M>:
            </p>
            <M block quiet>{String.raw`C \to BA \mid BCA'C \mid b`}</M>
            <p>
              Both leading <M>{String.raw`B`}</M>’s are then replaced by <M>{String.raw`CCB'`}</M>:
            </p>
            <M block quiet>{String.raw`C \to CCB'A \mid CCB'CA'C \mid b`}</M>
            <p>Now the direct formula gives the final pair:</p>
            <M block quiet>{String.raw`C \to bC' \qquad C' \to CB'AC' \mid CB'CA'CC' \mid \varepsilon`}</M>
          </article>
        </div>

        <LeftRecursionLab />

        <h3>Left factoring — extra marks</h3>
        <p>
          If two rules of the same symbol share a prefix, factor it out. This does not remove left recursion; it
          removes a FIRST–FIRST conflict. For example:
        </p>
        <M block>{String.raw`A \to aAB \mid aBc \mid aAC`}</M>
        <M block>{String.raw`A \to aA' \qquad A' \to AB \mid Bc \mid AC`}</M>
        <p>
          If two parts of <M>{String.raw`A'`}</M> still share the next symbol, repeat the same move.
        </p>

        <Callout variant="trap" title="Left recursion mistakes that cost the whole question">
          <p>
            <strong>1. Fixing B before substituting A.</strong> You must expand earlier letters first, or the cycle
            survives.
          </p>
          <p>
            <strong>2. Dropping a base case.</strong> Every non-recursive rule must appear on the new{' '}
            <M>{String.raw`A`}</M>, each carrying <M>{String.raw`A'`}</M>.
          </p>
          <p>
            <strong>3. Forgetting ε.</strong> Without <M>{String.raw`A' \to \varepsilon`}</M> the recursion can
            never stop.
          </p>
          <p>
            <strong>4. Confusing left factoring with left recursion.</strong> Factoring fixes a shared prefix;
            recursion removal fixes a self-reference. The exam may ask for both.
          </p>
        </Callout>
      </section>

      <section id="drills">
        <SectionHeading id="drills">Quick-check drills</SectionHeading>
        <DrillList
          items={[
            {
              q: <>Remove direct left recursion from <span className="mono">A → Aa | b</span>.</>,
              a: (
                <p>
                  <M>{String.raw`A \to bA'`}</M> and <M>{String.raw`A' \to aA' \mid \varepsilon`}</M>. The base case{' '}
                  <span className="mono">b</span> carries <M>{String.raw`A'`}</M>; the tail <span className="mono">a</span>{' '}
                  moves to <M>{String.raw`A'`}</M>.
                </p>
              ),
            },
            {
              q: (
                <>
                  With <span className="mono">A &lt; B</span>, remove left recursion from{' '}
                  <span className="mono">A → Aa | b</span> and <span className="mono">B → Ac | Bd | e</span>.
                </>
              ),
              a: (
                <>
                  <p>
                    First <M>{String.raw`A \to bA'`}</M>, <M>{String.raw`A' \to aA' \mid \varepsilon`}</M>.
                  </p>
                  <p>
                    Substitute <M>{String.raw`A`}</M> into <M>{String.raw`B`}</M>:{' '}
                    <M>{String.raw`B \to bA'c \mid Bd \mid e`}</M>. Then split:{' '}
                    <M>{String.raw`B \to bA'cB' \mid eB'`}</M>, <M>{String.raw`B' \to dB' \mid \varepsilon`}</M>.
                  </p>
                </>
              ),
            },
            {
              q: <>Put <span className="mono">S → Aa</span>, <span className="mono">A → a</span> into CNF.</>,
              a: <p>Create <M>{String.raw`X \to a`}</M>, then <M>{String.raw`S \to AX`}</M>. The rule <M>{String.raw`A \to a`}</M> is already legal.</p>,
            },
            {
              q: <>Is <span className="mono">{'{aⁿ bⁿ cⁿ | n ≥ 0}'}</span> context-free?</>,
              a: <p>No. Three exponents must match. A pushdown automaton has only one stack, so it can match two counts but not three.</p>,
            },
          ]}
        />
      </section>

      <Callout variant="key" title="What you can now do">
        <p>
          You can classify a grammar by its exponents, prove ambiguity with two trees, convert to CNF, and remove
          direct or ordered indirect left recursion. Those are Set 2 Exercises 1–3 and 8 plus Interro 2 Exercise 4.
        </p>
        <p>
          Next: Stage 5 computes the two sets that make LL(1) parsing possible.{' '}
          <Link className="text-link" to="/guide/5">
            Continue to FIRST & FOLLOW <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </p>
      </Callout>

      <DeepDives stage={stage} />
    </GuideShell>
  )
}
