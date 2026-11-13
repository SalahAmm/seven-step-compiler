import type { MouseEvent, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Printer } from 'lucide-react'
import { M } from '../components/Math'
import { Callout } from '../components/ui'

function SectionTitle({ children, aside }: { children: ReactNode; aside: string }) {
  return (
    <div className="cheat-section-head">
      <h2>{children}</h2>
      <span>{aside}</span>
    </div>
  )
}

export function CheatSheet() {
  const jumpTo = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <header className="page-head">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Course</Link>
          <span className="sep" aria-hidden="true">/</span>
          <span>Master cheat sheet</span>
        </nav>
        <h1 className="page-title">The whole course, on one page.</h1>
        <p className="lede">
          Symbols, regex, and the six formulas that carry the exam. Read it once, then keep it
          open while you practise.
        </p>
        <div className="page-actions">
          <button type="button" className="btn btn-primary" onClick={() => window.print()}>
            <Printer size={15} aria-hidden="true" /> Print the sheet
          </button>
          <Link className="btn btn-ghost" to="/lessons/1">
            Start Lesson 1 <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </header>

      <nav className="cheat-nav" aria-label="Cheat sheet sections">
        <a href="#symbols" onClick={jumpTo('symbols')}>Symbols</a>
        <a href="#regex" onClick={jumpTo('regex')}>Regex</a>
        <a href="#formulas" onClick={jumpTo('formulas')}>Six formulas</a>
        <a href="#mistakes" onClick={jumpTo('mistakes')}>Five mistakes</a>
      </nav>

      <section className="cheat-section" id="symbols">
        <SectionTitle aside="Read the notation once">The symbols, in plain English</SectionTitle>
        <div className="symbol-grid">
          <div className="symbol-card">
            <div className="symbol-mark"><M>{'\\Sigma \\;\\text{or}\\; V'}</M></div>
            <h3>Alphabet</h3>
            <p>The allowed letters. <span className="mono">{'{a, b}'}</span> or <span className="mono">{'{0, 1}'}</span>.</p>
          </div>
          <div className="symbol-card">
            <div className="symbol-mark"><M>{'\\varepsilon'}</M></div>
            <h3>Empty word</h3>
            <p>Zero letters. It is the identity of concatenation: <M>{'w\\varepsilon = \\varepsilon w = w'}</M>. Think <strong>×1</strong>.</p>
          </div>
          <div className="symbol-card">
            <div className="symbol-mark"><M>{'\\emptyset'}</M></div>
            <h3>Empty set</h3>
            <p>Zero words. It kills concatenation: <M>{'L \\cdot \\emptyset = \\emptyset'}</M>. Think <strong>×0</strong>.</p>
          </div>
          <div className="symbol-card">
            <div className="symbol-mark"><span className="mono symbol-letters">a b c</span></div>
            <h3>Terminals</h3>
            <p>Lowercase: the actual letters that appear in the final word.</p>
          </div>
          <div className="symbol-card">
            <div className="symbol-mark"><span className="mono symbol-letters">S A B</span></div>
            <h3>Non-terminals</h3>
            <p>Uppercase placeholders replaced by grammar rules. <M>{'S'}</M> is the start symbol.</p>
          </div>
          <div className="symbol-card">
            <div className="symbol-mark"><M>{'\\$'}</M></div>
            <h3>End marker</h3>
            <p>Marks the end of the input in FOLLOW sets and in the LL(1) stack simulation.</p>
          </div>
        </div>
        <div className="symbol-note">
          <div>
            <span className="symbol-note-title">The one-line difference</span>
            <p><M>{'\\varepsilon'}</M> is a word with no letters. <M>{'\\emptyset'}</M> is a language with no words. <M>{'\\{\\varepsilon\\}'}</M> is the language containing exactly the empty word — and it is not empty.</p>
          </div>
          <div>
            <span className="symbol-note-title">Free teleport</span>
            <p>An <M>{'\\varepsilon'}</M>-arrow in an automaton moves you without reading a letter. It does not consume input, and it can be taken any number of times.</p>
          </div>
        </div>
      </section>

      <section className="cheat-section" id="regex">
        <SectionTitle aside="Same thing, two syntaxes">Regex quick reference</SectionTitle>
        <div className="table-wrap">
          <table className="data-table regex-table">
            <thead>
              <tr><th scope="col">Pattern</th><th scope="col">Means</th><th scope="col">Watch out</th></tr>
            </thead>
            <tbody>
              <tr>
                <td className="mono">a | b&nbsp;&nbsp;or&nbsp;&nbsp;a + b</td>
                <td>a OR b.</td>
                <td>One symbol at a time; wrap a longer choice in parentheses.</td>
              </tr>
              <tr>
                <td className="mono">a*</td>
                <td>Zero or more a’s: <M>{'\\varepsilon, a, aa, aaa, \\dots'}</M></td>
                <td>The star includes ε.</td>
              </tr>
              <tr>
                <td className="mono">a+</td>
                <td>One or more a’s: <M>{'a, aa, aaa, \\dots = aa^*'}</M></td>
                <td>Not the same as <span className="mono">a*</span>: ε is excluded.</td>
              </tr>
              <tr>
                <td className="mono">a?</td>
                <td>Optional a: zero or one.</td>
                <td>Same as <span className="mono">(a | ε)</span>.</td>
              </tr>
              <tr>
                <td className="mono">a{'{m,n}'}</td>
                <td>Between m and n copies of a.</td>
                <td>Count copies, not the whole pattern, unless you group.</td>
              </tr>
              <tr className="regex-warning">
                <td className="mono">[abc]</td>
                <td>ONE character from <span className="mono">{'{a, b, c}'}</span>.</td>
                <td>Not the string “abc”. Not a group. Not alternation. This is the Interro 1 trap.</td>
              </tr>
              <tr>
                <td className="mono">(ab)*</td>
                <td>Zero or more copies of the block ab.</td>
                <td>Parentheses group the block; brackets would destroy it.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Callout variant="trap" title="grep reads substrings">
          <p>
            <span className="mono">grep -E 'regexp' file</span> prints the whole line if <strong>any substring</strong> matches.
            In the exam’s character-class questions, read the official correction’s convention carefully:
            the point is always what <span className="mono">[...]</span> does to the pattern.
          </p>
        </Callout>
      </section>

      <section className="cheat-section" id="formulas">
        <SectionTitle aside="The six that carry the exam">The six golden formulas</SectionTitle>

        <div className="cheat-formula">
          <div className="cheat-formula-head">
            <h3>Arden’s lemma</h3>
            <span>Automaton → regex</span>
          </div>
          <p className="cheat-formula-note">
            Write one equation per state, add <M>{'+\\varepsilon'}</M> for every accepting state, then eliminate variables.
          </p>
          <div className="formula-pair">
            <div>
              <span className="formula-label">Left-linear (standard)</span>
              <M block>{'X = AX + B \\;\\Longrightarrow\\; X = A^*B'}</M>
              <p>Valid when <M>{'\\varepsilon \\notin A'}</M>.</p>
            </div>
            <div>
              <span className="formula-label">Right-linear</span>
              <M block>{'R = RP + Q \\;\\Longrightarrow\\; R = QP^*'}</M>
              <p>Keep the side of the recursion straight.</p>
            </div>
          </div>
        </div>

        <div className="cheat-formula">
          <div className="cheat-formula-head">
            <h3>Chomsky Normal Form</h3>
            <span>Every rule, two shapes</span>
          </div>
          <div className="formula-pair">
            <div>
              <M block>{'A \\to BC'}</M>
              <p>Exactly two non-terminals.</p>
            </div>
            <div>
              <M block>{'A \\to a'}</M>
              <p>Exactly one terminal.</p>
            </div>
          </div>
          <p className="cheat-formula-note">
            Only the start symbol may keep <M>{'S \\to \\varepsilon'}</M>, and only if ε is in the language.
            No unit rules, no mixed terminals and non-terminals, no RHS longer than 2.
          </p>
        </div>

        <div className="cheat-formula">
          <div className="cheat-formula-head">
            <h3>Direct left recursion removal</h3>
            <span>Split α from β</span>
          </div>
          <M block>{'A \\to A\\alpha_1 \\mid A\\alpha_2 \\mid \\beta_1 \\mid \\beta_2'}</M>
          <M block quiet>{'\\Longleftrightarrow'}</M>
          <M block>{'A \\to \\beta_1 A\' \\mid \\beta_2 A\''}</M>
          <M block>{'A\' \\to \\alpha_1 A\' \\mid \\alpha_2 A\' \\mid \\varepsilon'}</M>
          <p className="cheat-formula-note">
            Non-recursive <M>{'\\beta'}</M>’s go first, each followed by <M>{'A\''}</M>.
            Leftover tails <M>{'\\alpha'}</M>’s go in <M>{'A\''}</M>, each followed by <M>{'A\''}</M>, plus ε.
          </p>
        </div>

        <div className="cheat-formula">
          <div className="cheat-formula-head">
            <h3>Left factoring</h3>
            <span>Pull the common prefix</span>
          </div>
          <M block>{'A \\to \\alpha\\beta_1 \\mid \\alpha\\beta_2'}</M>
          <M block quiet>{'\\Longleftrightarrow'}</M>
          <M block>{'A \\to \\alpha A\',\\quad A\' \\to \\beta_1 \\mid \\beta_2'}</M>
          <p className="cheat-formula-note">
            Use it when rules share a prefix. It delays the choice until the distinguishing symbol.
          </p>
        </div>

        <div className="cheat-formula">
          <div className="cheat-formula-head">
            <h3>LL(1) conflict checks</h3>
            <span>Say no without the table</span>
          </div>
          <ul className="formula-list">
            <li><strong>FIRST–FIRST:</strong> for <M>{'A \\to \\alpha \\mid \\beta'}</M>, if <M>{'\\mathrm{FIRST}(\\alpha) \\cap \\mathrm{FIRST}(\\beta) \\ne \\emptyset'}</M>.</li>
            <li><strong>FIRST–FOLLOW:</strong> if one side can vanish to ε and <M>{'\\mathrm{FIRST}(\\text{other}) \\cap \\mathrm{FOLLOW}(A) \\ne \\emptyset'}</M>.</li>
            <li><strong>Left recursion:</strong> any direct or indirect <M>{'A \\Rightarrow^+ A\\gamma'}</M> is never LL(1).</li>
          </ul>
        </div>

        <div className="cheat-formula">
          <div className="cheat-formula-head">
            <h3>Complementary automaton</h3>
            <span>Flip the double circles</span>
          </div>
          <ol className="complement-steps">
            <li><span>1</span><div><strong>Determinize</strong> — the machine must be a DFA.</div></li>
            <li><span>2</span><div><strong>Complete</strong> — add the sink state <M>{'\\emptyset'}</M> and send every missing arrow there.</div></li>
            <li><span>3</span><div><strong>Swap</strong> — accepting states become non-accepting, and vice versa. Arrows stay identical.</div></li>
          </ol>
        </div>
      </section>

      <section className="cheat-section" id="mistakes">
        <SectionTitle aside="Check before you hand in">The five mistakes</SectionTitle>
        <ol className="mistake-list">
          <li>
            <span>1</span>
            <div><strong>Arden:</strong> missing <M>{'+\\varepsilon'}</M> in an accepting state’s equation.</div>
          </li>
          <li>
            <span>2</span>
            <div><strong>Complement:</strong> flipping states before adding the sink state that makes the DFA complete.</div>
          </li>
          <li>
            <span>3</span>
            <div><strong>FIRST:</strong> leaving ε in <M>{'\\mathrm{FIRST}(A)'}</M> when a non-nullable symbol follows it, as in <M>{'A \\to Ze'}</M>.</div>
          </li>
          <li>
            <span>4</span>
            <div><strong>FOLLOW:</strong> forgetting <M>{'\\$'}</M> in <M>{'\\mathrm{FOLLOW}(S)'}</M>, or putting ε inside a FOLLOW set at all.</div>
          </li>
          <li>
            <span>5</span>
            <div><strong>Left recursion:</strong> touching <M>{'C'}</M> before substituting both <M>{'A'}</M> and <M>{'B'}</M> at the front.</div>
          </li>
        </ol>
        <div className="cheat-cta">
          <p>Ready to test the symbols under pressure?</p>
          <Link className="btn btn-primary" to="/war-room">
            Enter the war room <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  )
}
