import { Link } from 'react-router-dom'
import { ArrowRight, CircleCheck } from 'lucide-react'
import { M } from '../../components/Math'
import { Automaton } from '../../components/Automaton'
import { BoardFigure, Callout, SectionHeading } from '../../components/ui'
import { ArdenLab } from '../../components/ArdenLab'
import { pqrEdges, pqrStates } from '../../data/automata'
import { LessonShell } from './LessonShell'

export function Lesson03() {
  return (
    <LessonShell id={3}>
      <p className="lead-in">
        Arden’s lemma is the bridge from a drawing back to a regular expression. The method is mechanical: one
        equation per state, eliminate variables from the accepting end, and apply one rewrite rule every time the same
        variable appears on both sides.
      </p>

      <section>
        <SectionHeading id="recipe">The four-step recipe</SectionHeading>
        <p>
          Label the unknown language of each state <M>{String.raw`X_p`}</M>, <M>{String.raw`X_q`}</M>, and so on.
          <M>{String.raw`X_p`}</M> is the set of words that take the machine from state <M>{String.raw`p`}</M> to an
          accepting state. The equation for a state lists every outgoing arrow.
        </p>

        <ol className="steps">
          <li>
            <strong>Write one equation per state.</strong>
            <p>
              For each arrow <M>{String.raw`P \xrightarrow{a} Q`}</M>, write <M>{String.raw`aX_q`}</M>. Join alternatives
              with <M>{String.raw`+`}</M>. If <M>{String.raw`P`}</M> is accepting, add
              <M>{String.raw`\;+\varepsilon`}</M> at the end.
            </p>
          </li>
          <li>
            <strong>Substitute from the bottom up.</strong>
            <p>
              Eliminate the variables furthest from the start first, working back toward
              <M>{String.raw`\,X_{\text{start}}`}</M>.
            </p>
          </li>
          <li>
            <strong>Apply Arden whenever you see the same variable on both sides.</strong>
            <M block>{String.raw`X = AX + B \quad\Longrightarrow\quad X = A^*B`}</M>
            <p>
              If several recursive arrows exist, factor them first:
              <M>{String.raw`\;X = aX + bX + C = (a+b)X + C`}</M>.
            </p>
          </li>
          <li>
            <strong>Stop when the start state is solved.</strong>
            <p>
              The right-hand side is the regular expression of the automaton’s language.
            </p>
          </li>
        </ol>

        <div className="two-col">
          <div className="panel accent">
            <h4>Left-linear form</h4>
            <M block quiet>{String.raw`X = AX + B \;\Longrightarrow\; X = A^*B`}</M>
            <p>Valid when <M>{String.raw`\varepsilon \notin A`}</M>. This is the form used in the course.</p>
          </div>
          <div className="panel">
            <h4>Right-linear form</h4>
            <M block quiet>{String.raw`R = RP + Q \;\Longrightarrow\; R = QP^*`}</M>
            <p>Keep the recursive side straight. Do not swap <M>{String.raw`P`}</M> and <M>{String.raw`Q`}</M>.</p>
          </div>
        </div>

        <Callout variant="trap" title="The two silent point-losers">
          <p>
            <strong>1. Missing +ε.</strong> Every accepting state’s equation needs it, even if the state also has
            outgoing arrows. It represents stopping there.
          </p>
          <p>
            <strong>2. Forgetting the ε-arrow.</strong> An arrow <M>{String.raw`Q \xrightarrow{\varepsilon} R`}</M>
            contributes <M>{String.raw`X_r`}</M> with no letter in front. It is not a transition on a letter.
          </p>
        </Callout>
      </section>

      <section>
        <SectionHeading id="walkthrough">Official walkthrough</SectionHeading>
        <p>
          This is Interro 1, Exercise 04. The automaton has three states; <M>{String.raw`P`}</M> is the start and
          <M>{String.raw`R`}</M> is accepting. There is an ε-arrow from <M>{String.raw`Q`}</M> to
          <M>{String.raw`R`}</M>.
        </p>

        <BoardFigure
          title="NFA · Interro 1, Exercise 04"
          note="P start · R accepting · Q → R is ε"
          caption={
            <>
              <strong>Read the arrows before writing algebra.</strong> P loops on a and branches to Q on a. Q returns
              to P on b and teleports to R on ε. R loops on b, returns to Q on c, and jumps to P on b.
            </>
          }
          credit="Official corrigé"
        >
          <div className="figure-scroll">
            <Automaton
              states={pqrStates}
              edges={pqrEdges}
              width={720}
              height={360}
              radius={29}
              ariaLabel="Three-state NFA P, Q, R. P is start, R accepting, Q has an epsilon transition to R."
            />
          </div>
        </BoardFigure>

        <h3>Step 1 — one equation per state</h3>
        <M block>{String.raw`X_p = aX_p + aX_q \qquad (1)`}</M>
        <M block>{String.raw`X_q = bX_p + X_r \qquad (2)`}</M>
        <M block>{String.raw`X_r = bX_r + cX_q + bX_p + \varepsilon \qquad (3)`}</M>
        <p>
          The <M>{String.raw`+\varepsilon`}</M> in (3) is there because <M>{String.raw`R`}</M> is accepting. The
          <M>{String.raw`X_r`}</M> in (2) has no letter because <M>{String.raw`Q \to R`}</M> is an ε-arrow.
        </p>

        <h3>Step 2 — substitute Xq into (1) and (3)</h3>
        <p>Replace every occurrence of <M>{String.raw`X_q`}</M> by <M>{String.raw`bX_p + X_r`}</M>.</p>
        <M block>{String.raw`X_p = aX_p + a(bX_p + X_r) = (a+ab)X_p + aX_r`}</M>
        <M block>{String.raw`X_r = bX_r + c(bX_p + X_r) + bX_p + \varepsilon = (b+c)X_r + (cb+b)X_p + \varepsilon`}</M>
        <p>
          In the second line, the two <M>{String.raw`X_p`}</M> terms are <M>{String.raw`cbX_p`}</M> and
          <M>{String.raw`bX_p`}</M>; group them as <M>{String.raw`(cb+b)X_p`}</M>.
        </p>

        <h3>Step 3 — apply Arden to Xr</h3>
        <p>
          The shape is <M>{String.raw`X_r = A X_r + B`}</M> with <M>{String.raw`A = (b+c)`}</M> and
          <M>{String.raw`B = (cb+b)X_p + \varepsilon`}</M>.
        </p>
        <M block>{String.raw`X_r = (b+c)^*\big((cb+b)X_p + \varepsilon\big)`}</M>
        <M block>{String.raw`X_r = (b+c)^*(cb+b)X_p + (b+c)^*`}</M>
        <p>
          Distributing the star over the sum is valid because concatenation distributes over union:
          <M>{String.raw`A^*(B+C) = A^*B + A^*C`}</M>.
        </p>

        <h3>Step 4 — plug Xr into Xp, then apply Arden again</h3>
        <M block>{String.raw`X_p = (a+ab)X_p + a\Big[(b+c)^*(cb+b)X_p + (b+c)^*\Big]`}</M>
        <p>Factor <M>{String.raw`X_p`}</M> on the left:</p>
        <M block>{String.raw`X_p = \Big(a+ab+a(b+c)^*(cb+b)\Big)X_p + a(b+c)^*`}</M>
        <p>
          Now apply <M>{String.raw`X = AX + B \implies X = A^*B`}</M> one last time.
        </p>
        <M block focus>{String.raw`\boxed{\;X_p = \Big(a+ab+a(b+c)^*(cb+b)\Big)^*\,a(b+c)^*\;}`}</M>

        <Callout variant="key" title="How to check without redoing the algebra">
          <p>
            The expression must accept <span className="mono">a</span>: go <M>{String.raw`P \xrightarrow{a} Q
            \xrightarrow{\varepsilon} R`}</M>. It must accept words made of a prefix that returns to P plus a final
            <span className="mono"> a</span> and any number of <span className="mono">b</span>’s or
            <span className="mono"> c</span>’s in R. It must reject the empty word: P is not accepting and no ε-arrow
            leaves P.
          </p>
        </Callout>
      </section>

      <section>
        <SectionHeading id="lab">Step through it</SectionHeading>
        <p>
          Use the stepper to move through the same four moves. The left side shows the equations that survive after
          each elimination; the final box is the official answer.
        </p>
        <ArdenLab />

        <h3>What to write on the exam</h3>
        <div className="exam-writing">
          <div className="exam-writing-item">
            <span>1</span>
            <p>Define the variables and say which state is accepting.</p>
          </div>
          <div className="exam-writing-item">
            <span>2</span>
            <p>Write the three equations with <M>{String.raw`+\varepsilon`}</M> in the right place.</p>
          </div>
          <div className="exam-writing-item">
            <span>3</span>
            <p>Show the substitution, then the Arden rewrite, then the final start-state expression.</p>
          </div>
        </div>

        <div className="lesson-takeaway">
          <CircleCheck size={18} aria-hidden="true" />
          <div>
            <strong>Lesson 3 in one sentence.</strong>
            <p>
              Write the graph as equations, substitute the accepting end into the start, and use
              <M>{String.raw`\;X = AX + B \Rightarrow X = A^*B`}</M> whenever a variable appears on both sides.
            </p>
          </div>
        </div>
        <div className="lesson-next">
          <p>Next: eliminate the ε-arrows entirely and turn any NFA into a DFA — then shrink it.</p>
          <Link className="text-link" to="/lessons/4">
            NFA → DFA & minimization <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </LessonShell>
  )
}
