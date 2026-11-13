import { Link } from 'react-router-dom'
import { ArrowRight, CircleCheck } from 'lucide-react'
import { M } from '../../components/Math'
import { Callout, Grammar, SectionHeading } from '../../components/ui'
import { LeftRecursionLab } from '../../components/LeftRecursionLab'
import { LessonShell } from './LessonShell'

export function Lesson07() {
  return (
    <LessonShell id={7}>
      <p className="lead-in">
        Left recursion is not a bug in the language; it is a bug in the grammar for a top-down parser. The cure is a
        strict order. Handle <span className="mono">A</span>, then <span className="mono">B</span>, then
        <span className="mono"> C</span>. Substitute every earlier symbol at the front, and only then remove the direct
        recursion you can see.
      </p>

      <section>
        <SectionHeading id="basics">Direct & indirect</SectionHeading>
        <div className="two-col">
          <div className="panel signal">
            <h4>Direct left recursion</h4>
            <p>The non-terminal appears at the very front of its own rule.</p>
            <M block quiet>{String.raw`A \to A\alpha`}</M>
            <p className="small">
              Example: <span className="mono">A → Aa</span>. A top-down parser would call <span className="mono">A</span>
              again before consuming anything.
            </p>
          </div>
          <div className="panel">
            <h4>Indirect (hidden) left recursion</h4>
            <p>The non-terminal returns to itself after one or more rewrites at the front.</p>
            <M block quiet>{String.raw`A \Rightarrow^+ A\gamma`}</M>
            <p className="small">
              Example from Set 2, Exercise 02: <span className="mono">T ⇒ S ⇒ Tb</span>. T is left-recursive through S,
              even though no T-rule starts with T.
            </p>
          </div>
        </div>
        <Grammar
          label="Grammar with hidden left recursion"
          lines={['S → aTb | Tb', 'T → S | c']}
          note="T → S, then S → Tb gives T ⇒ Tb. The recursion is hidden behind S."
        />
        <Callout variant="key" title="Left recursion and ambiguity are different">
          <p>
            <span className="mono">A → Aa | a</span> is left-recursive, but it generates
            <span className="mono"> a⁺</span> with exactly one parse tree per word. It is unambiguous. Left recursion
            kills LL(1) parsing; it does not automatically make the grammar ambiguous.
          </p>
        </Callout>
      </section>

      <section>
        <SectionHeading id="algorithm">The ordered algorithm</SectionHeading>
        <p>
          Number the non-terminals <M>{String.raw`A_1, A_2, \dots, A_n`}</M>. The exercise uses
          <M>{String.raw`\;A < B < C`}</M>. Process them in that order.
        </p>
        <ol className="steps">
          <li>
            <strong>Substitute every earlier non-terminal at the front.</strong>
            <p>
              If <M>{String.raw`A_i \to A_j \gamma`}</M> with <M>{String.raw`j < i`}</M>, replace
              <M>{String.raw`\,A_j`}</M> by all of its current right-hand sides. Repeat if another earlier symbol lands
              at the front.
            </p>
          </li>
          <li>
            <strong>Remove direct left recursion.</strong>
            <p>
              Split the rules into recursive ones <M>{String.raw`A_i \to A_i\alpha`}</M> and non-recursive ones
              <M>{String.raw`\;A_i \to \beta`}</M>. Then:
            </p>
            <M block>{String.raw`A_i \to \beta_1 A_i' \mid \beta_2 A_i' \mid \dots`}</M>
            <M block>{String.raw`A_i' \to \alpha_1 A_i' \mid \alpha_2 A_i' \mid \dots \mid \varepsilon`}</M>
          </li>
          <li>
            <strong>Leave a non-recursive symbol alone.</strong>
            <p>
              If <M>{String.raw`A_i`}</M> has no direct recursion after substitution, do not invent an
              <M>{String.raw`\,A_i'`}</M>. A prime with no recursive tail is pure clutter.
            </p>
          </li>
        </ol>

        <Callout variant="trap" title="The order is the whole point">
          <p>
            Substituting <span className="mono">A</span> into <span className="mono">B</span>, then
            <span className="mono"> A</span> and <span className="mono">B</span> into
            <span className="mono"> C</span>, is what exposes every hidden front. If you touch
            <span className="mono"> C</span> before both substitutions, a front <span className="mono">B</span> can
            survive and the final grammar is still left-recursive.
          </p>
        </Callout>
      </section>

      <section>
        <SectionHeading id="worked">Full walkthrough</SectionHeading>
        <p>
          Interro 2, Exercise 04, with the order <M>{String.raw`A < B < C`}</M>:
        </p>
        <Grammar
          label="G3 before transformation"
          lines={['A → A a | B C', 'B → A C | C C', 'C → B A | A C | b']}
        />

        <h3>Step 1 — handle A</h3>
        <p>
          Nothing comes before <span className="mono">A</span>, so there is nothing to substitute. The recursive rule is
          <M>{String.raw`A \to A a`}</M> with <M>{String.raw`\alpha = a`}</M>; the base rule is
          <M>{String.raw`\;A \to BC`}</M> with <M>{String.raw`\beta = BC`}</M>.
        </p>
        <M block>{String.raw`A \to BCA', \qquad A' \to aA' \mid \varepsilon`}</M>

        <h3>Step 2 — handle B</h3>
        <p>
          <span className="mono">A</span> comes before <span className="mono">B</span>, so replace the front
          <span className="mono"> A</span> in <M>{String.raw`B \to AC`}</M> by <M>{String.raw`BCA'`}</M>:
        </p>
        <M block>{String.raw`B \to BCA'C \mid CC`}</M>
        <p>
          Now <span className="mono">B</span> is directly left-recursive. The recursive tail is
          <M>{String.raw`\;CA'C`}</M>; the base is <M>{String.raw`CC`}</M>.
        </p>
        <M block>{String.raw`B \to CCB', \qquad B' \to CA'CB' \mid \varepsilon`}</M>

        <h3>Step 3 — handle C</h3>
        <p>
          Both <span className="mono">A</span> and <span className="mono">B</span> come before
          <span className="mono">C</span>. Start with <M>{String.raw`C \to BA \mid AC \mid b`}</M>.
          Replace the front <span className="mono">A</span> using <M>{String.raw`A \to BCA'`}</M>:
        </p>
        <M block>{String.raw`C \to BA \mid BCA'C \mid b`}</M>
        <p>
          Now both front rules start with <span className="mono">B</span>. Replace
          <span className="mono"> B</span> using <M>{String.raw`B \to CCB'`}</M>:
        </p>
        <M block>{String.raw`C \to CCB'A \mid CCB'CA'C \mid b`}</M>
        <p>
          The recursive tails are <M>{String.raw`CB'A`}</M> and <M>{String.raw`CB'CA'C`}</M>; the base is
          <span className="mono"> b</span>. Split:
        </p>
        <M block focus>{String.raw`C \to bC', \qquad C' \to CB'AC' \mid CB'CA'CC' \mid \varepsilon`}</M>

        <Grammar
          label="Final grammar G3′"
          lines={[
            'A → B C A′',
            'A′ → a A′ | ε',
            'B → C C B′',
            'B′ → C A′ C B′ | ε',
            'C → b C′',
            "C′ → C B′ A C′ | C B′ C A′ C C′ | ε",
          ]}
          note="Check: C starts with b, so B starts with b, so A starts with b. No left recursion remains."
        />
        <p>
          The check is a chain of first symbols: <M>{String.raw`C \to bC'`}</M> starts with
          <span className="mono"> b</span>; <M>{String.raw`B \to CCB'`}</M> therefore starts with
          <span className="mono"> b</span>; and <M>{String.raw`A \to BCA'`}</M> starts with
          <span className="mono"> b</span>. No non-terminal can return to itself at the front.
        </p>

        <LeftRecursionLab />
      </section>

      <section>
        <SectionHeading id="factoring">Left factoring</SectionHeading>
        <p>
          Left factoring is a different transformation. It does not remove recursion; it delays a choice when two rules
          share a prefix. The parser can read the common part once, then decide between the suffixes.
        </p>
        <M block>{String.raw`A \to \alpha\beta_1 \mid \alpha\beta_2 \quad\Longleftrightarrow\quad A \to \alpha A',\quad A' \to \beta_1 \mid \beta_2`}</M>
        <div className="two-col">
          <div className="panel">
            <h4>Before</h4>
            <Grammar
              label="Shared prefix a"
              lines={['A → a A B | a B C | a A C']}
            />
          </div>
          <div className="panel accent">
            <h4>After</h4>
            <Grammar
              label="Factored grammar"
              lines={['A → a A′', 'A′ → A B | B C | A C']}
            />
          </div>
        </div>
        <Callout variant="note" title="Which tool do I use?">
          <p>
            <strong>Left recursion:</strong> a non-terminal can reappear at the front. Use the ordered elimination
            algorithm. <strong>Common prefix:</strong> two rules start with the same symbols. Use left factoring. The
            two fixes are independent, and an LL(1) grammar may need both.
          </p>
        </Callout>

        <div className="lesson-takeaway">
          <CircleCheck size={18} aria-hidden="true" />
          <div>
            <strong>Lesson 7 in one sentence.</strong>
            <p>
              Process non-terminals in order, substitute every earlier front, then split each direct recursion into a
              base rule with a prime and a tail rule with ε.
            </p>
          </div>
        </div>
        <div className="lesson-next">
          <p>Next: FIRST, FOLLOW and the LL(1) table — the highest-point section of Part II.</p>
          <Link className="text-link" to="/lessons/8">
            FIRST, FOLLOW & LL(1) <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </LessonShell>
  )
}
