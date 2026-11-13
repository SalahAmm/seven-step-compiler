import { Link } from 'react-router-dom'
import { ArrowRight, CircleAlert, CircleCheck, Scissors } from 'lucide-react'
import { M } from '../../components/Math'
import { Callout, Pill, SectionHeading } from '../../components/ui'
import { ConcatLab } from '../../components/ConcatLab'
import { GrepLab, TrapLab } from '../../components/GrepLab'
import { LessonShell } from './LessonShell'

export function Lesson01() {
  return (
    <LessonShell id={1}>
      <p className="lead-in">
        This lesson is about reading formal notation without translating it twice in your head.
        Concatenation is a set product; a regular expression is a compact description of a set of words;
        and <span className="mono">grep</span> is the command that tests the description against lines of text.
        The exam loves the place where those three ideas collide.
      </p>

      <section>
        <SectionHeading id="concat">Language concatenation</SectionHeading>
        <p>
          Concatenating two languages means gluing <em>every</em> word of the first in front of <em>every</em> word
          of the second. The result is a set, so duplicates collapse.
        </p>
        <M block>{String.raw`L \cdot M = \{\, uv \;\mid\; u \in L,\; v \in M \,\}`}</M>
        <p>
          Order matters: <M>{String.raw`LM`}</M> and <M>{String.raw`ML`}</M> usually produce different words.
          The operation is associative, <M>{String.raw`(LM)N = L(MN)`}</M>, but not commutative.
        </p>

        <ConcatLab />

        <h3>Exercise Set 1, Exercise 01 — the official computation</h3>
        <p>
          Take <M>{String.raw`L = \{a, ab, bb\}`}</M> and <M>{String.raw`M = \{\varepsilon, b, a^2\}`}</M>.
          Remember that <M>{String.raw`a^2 = aa`}</M>. We glue in three rows:
        </p>
        <div className="table-wrap">
          <table className="data-table concat-official">
            <caption>Each row is one word of L; each column is one word of M.</caption>
            <thead>
              <tr>
                <th scope="col">L \ M</th>
                <th scope="col" className="mono">ε</th>
                <th scope="col" className="mono">b</th>
                <th scope="col" className="mono">aa</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" className="mono">a</th>
                <td className="mono">a</td>
                <td className="mono">ab</td>
                <td className="mono">aaa</td>
              </tr>
              <tr>
                <th scope="row" className="mono">ab</th>
                <td className="mono">ab <span className="tiny-note">duplicate</span></td>
                <td className="mono">abb</td>
                <td className="mono">abaa</td>
              </tr>
              <tr>
                <th scope="row" className="mono">bb</th>
                <td className="mono">bb</td>
                <td className="mono">bbb</td>
                <td className="mono">bbaa</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The word <span className="mono">ab</span> is produced twice — once by <span className="mono">a · b</span> and
          once by <span className="mono">ab · ε</span> — but a language is a set, so it appears once.
        </p>
        <M block focus>{String.raw`LM = \{a,\; ab,\; aaa,\; abb,\; abaa,\; bb,\; bbb,\; bbaa\}`}</M>
        <div className="result-strip">
          <Pill tone="ok">8 words</Pill>
          <span>One duplicate removed.</span>
          <span className="mono">ab = a·b = ab·ε</span>
        </div>

        <h3>The two edge cases worth memorising</h3>
        <div className="two-col">
          <div className="panel signal">
            <h4>∅ kills the product</h4>
            <p>
              If <M>{String.raw`L = \emptyset`}</M>, there is no first word to glue, so
              <M>{String.raw`\;LM = \emptyset`}</M>. Think <strong>× 0</strong>.
            </p>
            <p className="small mono">∅ · M = M · ∅ = ∅</p>
          </div>
          <div className="panel accent">
            <h4>{'{ε}'} changes nothing</h4>
            <p>
              If <M>{String.raw`L = \{\varepsilon\}`}</M>, the only word is the empty word, so
              <M>{String.raw`\;LM = M`}</M>. Think <strong>× 1</strong>.
            </p>
            <p className="small mono">{'{ε}'} · M = M · {'{ε}'} = M</p>
          </div>
        </div>

        <h3>When the second language is a star</h3>
        <p>
          Take <M>{String.raw`L = \{aa, ab, ba\}`}</M> and <M>{String.raw`M = \{a,b\}^*`}</M>.
          Every word of <M>{String.raw`L`}</M> has length 2, so every product has length at least 2.
          The three allowed prefixes are <span className="mono">aa</span>, <span className="mono">ab</span> and
          <span className="mono">ba</span>. The only length-2 words over <M>{String.raw`\{a,b\}`}</M> that are missing
          are <span className="mono">bb</span>.
        </p>
        <Callout variant="key" title="The clean description">
          <p>
            <M block quiet>{String.raw`LM = \{\, w \in \{a,b\}^* \;\mid\; |w| \ge 2 \;\text{ and } w \text{ does not start with } bb \,\}`}</M>
          </p>
          <p>
            Because <M>{String.raw`M`}</M> can supply any suffix, only the first two letters of the product matter.
            Think of <M>{String.raw`L`}</M> as a set of allowed two-letter prefixes.
          </p>
        </Callout>
      </section>

      <section>
        <SectionHeading id="regex">Regex in plain English</SectionHeading>
        <p>
          A regular expression is not a program; it is a finite description of a language. Read it left to right,
          and translate each operator into a set operation. Juxtaposition is concatenation, <M>{String.raw`+`}</M> or
          <M>{String.raw`\mid`}</M> is union, and <M>{String.raw`{}^*`}</M> is “repeat zero or more times”.
        </p>
        <Callout variant="note" title="Operator order">
          <p>
            Star binds tightest, then concatenation, then alternation. So <span className="mono">ab*</span> means
            <span className="mono"> a(b*)</span>, not <span className="mono">(ab)*</span>. When in doubt, add parentheses.
          </p>
        </Callout>

        <div className="table-wrap">
          <table className="data-table regex-reading">
            <caption>The eight descriptions from Exercise Set 1, Exercise 02 and Interro 1, Exercise 01(c).</caption>
            <thead>
              <tr>
                <th scope="col">Regex</th>
                <th scope="col">Plain English</th>
                <th scope="col">Why it works</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="mono">(a+b)*</td>
                <td>All words over {'{a, b}'}, including ε.</td>
                <td>Any sequence of choices, any length.</td>
              </tr>
              <tr>
                <td className="mono">a(a+b)*</td>
                <td>Words starting with <span className="mono">a</span>.</td>
                <td>The first symbol is fixed; the star supplies the rest.</td>
              </tr>
              <tr>
                <td className="mono">(a+b)*a</td>
                <td>Words ending with <span className="mono">a</span>.</td>
                <td>The last symbol is fixed; the star supplies the prefix.</td>
              </tr>
              <tr>
                <td className="mono">a(a|b)*a</td>
                <td>Words starting and ending with <span className="mono">a</span>, length ≥ 2.</td>
                <td>One <span className="mono">a</span> at each end; the middle can be empty.</td>
              </tr>
              <tr>
                <td className="mono">(a|b)*a(a|b)(a|b)</td>
                <td>Words whose third symbol from the end is <span className="mono">a</span>.</td>
                <td>After the marked <span className="mono">a</span>, exactly two symbols must follow.</td>
              </tr>
              <tr>
                <td className="mono">a*ba*ba*ba*</td>
                <td>Words containing exactly three <span className="mono">b</span>’s.</td>
                <td>Each <span className="mono">b</span> is separated by a block of <span className="mono">a</span>’s — possibly empty.</td>
              </tr>
              <tr>
                <td className="mono">(b+ab)*(a+ε)</td>
                <td>Words with no two consecutive <span className="mono">a</span>’s.</td>
                <td>Every <span className="mono">a</span> inside the star is immediately followed by <span className="mono">b</span>; at most one final <span className="mono">a</span> escapes.</td>
              </tr>
              <tr>
                <td className="mono">(aa+b)*</td>
                <td>Words where every block of <span className="mono">a</span>’s has even length.</td>
                <td>The only way to produce an <span className="mono">a</span> is in the pair <span className="mono">aa</span>.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>How to attack a description question</h3>
        <ol className="steps">
          <li>
            <strong>Find the fixed part.</strong>
            <p>Is there a symbol forced at the start, at the end, or at a counted position? Say it first.</p>
          </li>
          <li>
            <strong>Find the repeating part.</strong>
            <p>What does each star or plus generate? A block, a single symbol, or a pair?</p>
          </li>
          <li>
            <strong>Find the forbidden pattern.</strong>
            <p>If the regex prevents something, state the invariant: “no <span className="mono">aa</span>”, “every <span className="mono">a</span> comes with <span className="mono">b</span>”, “blocks have even length”.</p>
          </li>
        </ol>
      </section>

      <section>
        <SectionHeading id="grep">grep, line by line</SectionHeading>
        <p>
          <span className="mono">grep -E 'regexp' file</span> scans each line and prints the <strong>whole line</strong>
          if <strong>any substring</strong> matches. The rest of the line does not have to match; it is simply carried
          along in the output.
        </p>
        <GrepLab />
        <h3>Exercise Set 1, Exercise 03 — the four lines</h3>
        <div className="table-wrap">
          <table className="data-table">
            <caption>Lines in the file <span className="mono">tutu</span>: caa, cbbab, cabab, caaabba.</caption>
            <thead>
              <tr>
                <th scope="col">Pattern</th>
                <th scope="col">What it looks for</th>
                <th scope="col">Printed lines</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="mono">ca+</td>
                <td><span className="mono">c</span> followed by one or more <span className="mono">a</span>’s.</td>
                <td>
                  <span className="mono">caa</span>, <span className="mono">cabab</span>, <span className="mono">caaabba</span>
                  <span className="cell-note">no <span className="mono">cbbab</span></span>
                </td>
              </tr>
              <tr>
                <td className="mono">c(ab)+</td>
                <td><span className="mono">c</span>, then one or more copies of the block <span className="mono">ab</span>.</td>
                <td>
                  <span className="mono">cabab</span> only
                  <span className="cell-note">the other lines have no <span className="mono">ab</span> immediately after <span className="mono">c</span></span>
                </td>
              </tr>
              <tr>
                <td className="mono">baa?b</td>
                <td><span className="mono">b</span>, then <span className="mono">a</span>, then an optional <span className="mono">a</span>, then <span className="mono">b</span>: <span className="mono">bab</span> or <span className="mono">baab</span>.</td>
                <td>
                  <span className="mono">cbbab</span>, <span className="mono">cabab</span>
                  <span className="cell-note">both contain the substring <span className="mono">bab</span></span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Callout variant="trap" title="The line is not the match">
          <p>
            A common error is to test the regex against the entire line. grep does not work that way. If the line is
            <span className="mono"> xxcaaayy</span>, then <span className="mono">ca+</span> still matches the
            <span className="mono"> caaa</span> in the middle, and the whole line is printed.
          </p>
        </Callout>
      </section>

      <section>
        <SectionHeading id="trap">The character-class trap</SectionHeading>
        <p>
          Square brackets change the meaning of everything inside them. A character class is a <strong>bag of single
          characters</strong>, not a group, not a word, and not an alternation. This is the single most reliable trap
          in Interro 1, Exercise 01.
        </p>
        <div className="trap-principle">
          <div className="trap-principle-mark"><Scissors size={20} aria-hidden="true" /></div>
          <div>
            <strong>Inside <span className="mono">[...]</span>, grouping disappears.</strong>
            <p>
              <span className="mono">[(ab)+]</span> does not mean “the block <span className="mono">(ab)+</span>”.
              It means “one character chosen from the set <span className="mono">{'{ (, a, b, ), + }'}</span>”.
            </p>
          </div>
        </div>
        <TrapLab />

        <h3>Interro 1, Exercise 01(a) — the bag of five characters</h3>
        <p>
          Regex: <span className="mono">[(ab)+]+?</span>. The class contains five characters:
          <span className="mono"> (</span>, <span className="mono">a</span>, <span className="mono">b</span>,
          <span className="mono">)</span> and <span className="mono">+</span>. The suffix <span className="mono">+?</span>
          asks for at least one character from that bag.
        </p>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Word</th>
                <th scope="col">Characters used</th>
                <th scope="col">Verdict</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="mono">ba</td>
                <td><span className="mono">b</span>, <span className="mono">a</span> — both in the bag.</td>
                <td><Pill tone="ok">kept</Pill></td>
              </tr>
              <tr>
                <td className="mono">b+b+</td>
                <td><span className="mono">b</span>, <span className="mono">+</span> — both in the bag.</td>
                <td><Pill tone="ok">kept</Pill></td>
              </tr>
              <tr>
                <td className="mono">(ab))</td>
                <td><span className="mono">(</span>, <span className="mono">a</span>, <span className="mono">b</span>, <span className="mono">)</span> — all in the bag.</td>
                <td><Pill tone="ok">kept</Pill></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>Official answer:</strong> all three words survive the filter. The check marks in the correction are
          exactly right; the lesson is that the brackets turn a block into a character bag.
        </p>

        <h3>Interro 1, Exercise 01(b) — a bag plus a length limit</h3>
        <p>
          Regex: <span className="mono">[{'{'}ident{'}'}|then]{'{1,3}'}</span>. The class is
          <span className="mono"> {'{ {, i, d, e, n, t, }, |, h }'}</span>, and the quantifier allows a word of length
          1 to 3. In this correction the pattern is tested against the <strong>whole word</strong>, not a substring:
        </p>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Word</th>
                <th scope="col">Length</th>
                <th scope="col">Why</th>
                <th scope="col">Verdict</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="mono">then</td>
                <td>4</td>
                <td>All letters are allowed, but 4 &gt; 3.</td>
                <td><Pill tone="bad">out</Pill></td>
              </tr>
              <tr>
                <td className="mono">ma_variable</td>
                <td>11</td>
                <td>Contains characters outside the bag and is too long.</td>
                <td><Pill tone="bad">out</Pill></td>
              </tr>
              <tr>
                <td className="mono">net</td>
                <td>3</td>
                <td><span className="mono">n</span>, <span className="mono">e</span>, <span className="mono">t</span> are all in the bag.</td>
                <td><Pill tone="ok">kept</Pill></td>
              </tr>
              <tr>
                <td className="mono">i|e</td>
                <td>3</td>
                <td><span className="mono">i</span>, <span className="mono">|</span>, <span className="mono">e</span> are all in the bag.</td>
                <td><Pill tone="ok">kept</Pill></td>
              </tr>
              <tr>
                <td className="mono">{'{}'}</td>
                <td>2</td>
                <td><span className="mono">{'{'}</span> and <span className="mono">{'}'}</span> are in the bag.</td>
                <td><Pill tone="ok">kept</Pill></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>Official answer:</strong> <span className="mono">net</span>, <span className="mono">i|e</span>,
          <span className="mono"> {'{}'}</span>.
        </p>
        <Callout variant="note" title="Why the whole word?">
          <p>
            Real grep searches substrings, so a line containing a short allowed substring would also print. The
            correction for Exercise 01(b) reads the pattern as a whole-word test. The exam’s point is the character
            class, and the expected answers follow that whole-word convention. State the convention if you write the
            reasoning.
          </p>
        </Callout>

        <div className="lesson-takeaway">
          <CircleCheck size={18} aria-hidden="true" />
          <div>
            <strong>Lesson 1 in one sentence.</strong>
            <p>
              Concatenation is every pair; a regex describes a set; grep prints whole lines on a substring match; and
              square brackets always mean “one character from this bag”.
            </p>
          </div>
        </div>

        <div className="lesson-next">
          <CircleAlert size={17} aria-hidden="true" />
          <p>
            Next: turn those descriptions into machines. Lesson 2 gives you the four automaton patterns that cover
            most of Part I.
          </p>
          <Link className="text-link" to="/lessons/2">
            Building automata <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </LessonShell>
  )
}
