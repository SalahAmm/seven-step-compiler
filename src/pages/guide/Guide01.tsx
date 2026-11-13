import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { GuideShell, DeepDives } from '../../components/GuideChrome'
import { DrillList } from '../../components/DrillList'
import { ConcatLab } from '../../components/ConcatLab'
import { GrepLab, TrapLab } from '../../components/GrepLab'
import { M } from '../../components/Math'
import { Callout, Pill, SectionHeading } from '../../components/ui'
import { getGuideStage } from '../../data/guide'

const regexSymbols = [
  {
    symbol: 'a | b  or  a + b',
    meaning: 'OR — pick exactly one.',
    example: <span className="mono">a+b</span>,
    words: <span className="mono">a</span>,
  },
  {
    symbol: '*',
    meaning: 'Zero or more copies. The empty word is allowed.',
    example: <span className="mono">a*</span>,
    words: <M>{String.raw`\varepsilon,\; a,\; aa,\; aaa,\dots`}</M>,
  },
  {
    symbol: '+ after a symbol',
    meaning: 'One or more copies. At least one, never zero.',
    example: <span className="mono">a+</span>,
    words: <M>{String.raw`a,\; aa,\; aaa,\dots`}</M>,
  },
  {
    symbol: '?',
    meaning: 'Optional — zero or one copy.',
    example: <span className="mono">a?b</span>,
    words: <span className="mono">b or ab</span>,
  },
  {
    symbol: '[a-z]',
    meaning: 'Exactly one character from the range or set.',
    example: <span className="mono">[0-9]</span>,
    words: <span className="mono">0, 1, …, 9</span>,
  },
  {
    symbol: '{1,3}',
    meaning: 'Repeat the previous item between 1 and 3 times.',
    example: <span className="mono">a{'{1,3}'}</span>,
    words: <span className="mono">a, aa, aaa</span>,
  },
]

export function Guide01() {
  const stage = getGuideStage(1)!

  return (
    <GuideShell stage={stage}>
      <p className="lead-in">
        Stage 1 is vocabulary plus one skill: reading a regex the way you read a sentence. Nothing here needs a
        computer science background. By the end you will be able to translate in both directions — English to
        regex, regex to English — and you will recognise the two traps the exam keeps repeating.
      </p>

      <section id="language">
        <SectionHeading id="language">Words, languages & concatenation</SectionHeading>
        <p>
          An <strong>alphabet</strong> is the set of allowed letters, usually written <M>{String.raw`\Sigma`}</M>.
          A <strong>word</strong> is any string built from those letters. A <strong>language</strong> is a
          <em> set</em> of words. That is the whole vocabulary. For example, over{' '}
          <M>{String.raw`\Sigma = \{a,b\}`}</M>, the language <M>{String.raw`L = \{a, ab, bb\}`}</M> contains
          exactly three words.
        </p>

        <div className="compare-grid">
          <div className="compare-card">
            <div className="compare-card-head"><Pill tone="ok">A word</Pill><span className="mono">ε</span></div>
            <p>
              <M>{String.raw`\varepsilon`}</M> is the empty word: zero letters, but still a word. Its length is
              <M>{String.raw`\;|w| = 0`}</M>.
            </p>
          </div>
          <div className="compare-card">
            <div className="compare-card-head"><Pill tone="bad">A language</Pill><span className="mono">∅</span></div>
            <p>
              <M>{String.raw`\emptyset`}</M> is the empty language: no words at all, not even the empty word. So
              <M>{String.raw`\;\{\varepsilon\} \ne \emptyset`}</M>.
            </p>
          </div>
        </div>

        <h3>Concatenation: glue every word to every word</h3>
        <p>
          <M>{String.raw`L \cdot M`}</M> means: take every word of <M>{String.raw`L`}</M> and put every word of
          <M>{String.raw`M`}</M> after it. Order matters, so <M>{String.raw`LM`}</M> and <M>{String.raw`ML`}</M>{' '}
          are usually different.
        </p>
        <M block>{String.raw`L \cdot M = \{\, uv \;\mid\; u \in L,\; v \in M \,\}`}</M>
        <p>
          Two shortcut rules save time: <M>{String.raw`\emptyset \cdot M = \emptyset`}</M> (multiplying by zero
          words gives nothing) and <M>{String.raw`\{\varepsilon\} \cdot M = M`}</M> (gluing nothing changes
          nothing — the “× 1” of languages).
        </p>

        <ConcatLab />

        <Callout variant="key" title="The pattern behind the example">
          <p>
            When <M>{String.raw`M = \{a,b\}^*`}</M>, it can supply any suffix. So <M>{String.raw`LM`}</M> is decided
            only by the allowed <em>prefixes</em> in <M>{String.raw`L`}</M>. With{' '}
            <M>{String.raw`L = \{aa, ab, ba\}`}</M>, the result is every word over{' '}
            <M>{String.raw`\{a,b\}`}</M> of length at least 2 that does not start with <span className="mono">bb</span>.
          </p>
        </Callout>
      </section>

      <section id="regex">
        <SectionHeading id="regex">The six regex symbols</SectionHeading>
        <p>
          A regular expression is a short recipe for a language. Read it left to right, and translate each operator
          into a set operation. Juxtaposition means concatenation; <span className="mono">+</span> or{' '}
          <span className="mono">|</span> means union; a star means “repeat zero or more times”.
        </p>

        <div className="table-wrap">
          <table className="data-table regex-symbols">
            <caption>The only regex symbols you need for the exam.</caption>
            <thead>
              <tr><th scope="col">Symbol</th><th scope="col">Plain English</th><th scope="col">Example</th><th scope="col">Matches</th></tr>
            </thead>
            <tbody>
              {regexSymbols.map((row) => (
                <tr key={row.symbol}>
                  <td className="mono">{row.symbol}</td>
                  <td>{row.meaning}</td>
                  <td className="mono">{row.example}</td>
                  <td>{row.words}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Callout variant="note" title="Precedence">
          <p>
            Star binds tightest, then concatenation, then alternation. So <span className="mono">ab*</span> means{' '}
            <span className="mono">a(b*)</span>, not <span className="mono">(ab)*</span>. When in doubt, add
            parentheses — the exam will not deduct for being clear.
          </p>
        </Callout>

        <h3>Four shapes worth memorising</h3>
        <div className="pattern-grid">
          <article className="pattern-card">
            <div className="pattern-head"><span className="pattern-index">01</span><Pill>Starts & ends</Pill></div>
            <div className="mono pattern-regex">a(a|b)*a</div>
            <p>Starts with <span className="mono">a</span>, ends with <span className="mono">a</span>, and can have anything in between.</p>
          </article>
          <article className="pattern-card">
            <div className="pattern-head"><span className="pattern-index">02</span><Pill>Third from end</Pill></div>
            <div className="mono pattern-regex">(a|b)*a(a|b)(a|b)</div>
            <p>The third letter from the end is <span className="mono">a</span>. The final two letters can be anything.</p>
          </article>
          <article className="pattern-card">
            <div className="pattern-head"><span className="pattern-index">03</span><Pill>Exactly three</Pill></div>
            <div className="mono pattern-regex">a*ba*ba*ba*</div>
            <p>Contains exactly three <span className="mono">b</span>’s, with any number of <span className="mono">a</span>’s around them.</p>
          </article>
          <article className="pattern-card">
            <div className="pattern-head"><span className="pattern-index">04</span><Pill>Two blocks</Pill></div>
            <div className="mono pattern-regex">(aa+)|(bb+)</div>
            <p>Either two or more <span className="mono">a</span>’s, or two or more <span className="mono">b</span>’s. Not a mixture.</p>
          </article>
        </div>
      </section>

      <section id="traps">
        <SectionHeading id="traps">The two big traps</SectionHeading>

        <Callout variant="trap" title="Trap 1 — + has two meanings">
          <p>
            <strong>Between</strong> two letters, <span className="mono">a + b</span> means <strong>OR</strong>,
            exactly like <span className="mono">a | b</span>. <strong>After</strong> a letter or group,{' '}
            <span className="mono">a+</span> means <strong>one or more</strong>. The position changes the meaning.
          </p>
        </Callout>

        <Callout variant="trap" title="Trap 2 — square brackets eat the pattern">
          <p>
            Inside <span className="mono">[...]</span>, every character is a single item in a bag. Grouping,
            stars and pluses inside the brackets lose their usual meaning. The regex{' '}
            <span className="mono">[(ab)+]+?</span> is not “repeat <span className="mono">ab</span>”. It means
            “pick at least one single character from the bag <span className="mono">{'{ (,a,b,),+ }'}</span>”.
          </p>
        </Callout>

        <TrapLab />

        <p>
          The second official trap uses <span className="mono">[{'{ident}'}|then]{'{1,3}'}</span>. The outer
          brackets again make a bag of single characters: <span className="mono">{'{ i, d, e, n, t, |, h, {, } }'}</span>.
          That is why <span className="mono">then</span> fails (four characters, but the limit is three) while{' '}
          <span className="mono">net</span>, <span className="mono">i|e</span> and <span className="mono">{'{}'}</span>{' '}
          pass.
        </p>
      </section>

      <section id="grep">
        <SectionHeading id="grep">grep, line by line</SectionHeading>
        <p>
          <span className="mono">grep -E 'regex' file</span> prints a line if the regex matches <strong>any
          substring</strong> of that line. You do not need to match the whole line. This is the opposite of many
          students’ intuition, and it changes the answer.
        </p>

        <GrepLab />

        <div className="table-wrap">
          <table className="data-table">
            <caption>Set 1, Exercise 3 — the file contains caa, cbbab, cabab, caaabba.</caption>
            <thead><tr><th scope="col">Regex</th><th scope="col">What it needs</th><th scope="col">Lines that match</th></tr></thead>
            <tbody>
              <tr><td className="mono">ca+</td><td>c, then one or more a’s</td><td className="mono">caa, cabab, caaabba</td></tr>
              <tr><td className="mono">c(ab)+</td><td>c, then one or more ab blocks</td><td className="mono">cabab</td></tr>
              <tr><td className="mono">baa?b</td><td>bab or baab</td><td className="mono">cbbab, cabab</td></tr>
              <tr><td className="mono">a*</td><td>zero or more a’s — always true</td><td>all four lines</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="writing">
        <SectionHeading id="writing">Writing regex from English</SectionHeading>
        <p>
          These four recipes cover the “write a regex” questions. Learn the shape, then adapt the letters. The
          exam usually rewards the correct structure even if you use a different but equivalent expression.
        </p>

        <div className="recipe-list">
          <article className="recipe-card">
            <div className="recipe-head"><span className="recipe-num">R1</span><h3>Every block of a’s has length ≥ 2</h3></div>
            <p className="recipe-when"><strong>When:</strong> “every block”, “no isolated a”, “at least two a’s together”.</p>
            <p>
              Every chunk is either a <span className="mono">b</span> or at least two <span className="mono">a</span>’s.
              So the recipe is:
            </p>
            <div className="recipe-answer mono">(b | aa+)*</div>
            <p className="recipe-trap">
              <strong>Do not write</strong> <span className="mono">(b | aa)*</span>. That only gives an even number
              of a’s and fails on <span className="mono">aaa</span>.
            </p>
          </article>

          <article className="recipe-card">
            <div className="recipe-head"><span className="recipe-num">R2</span><h3>Every a is followed by exactly one b</h3></div>
            <p className="recipe-when"><strong>When:</strong> “each a must bring exactly one b”, “no two b’s after an a”.</p>
            <p>
              Put free <span className="mono">b</span>’s at the front, then repeat the block{' '}
              <span className="mono">ab</span>. No extra <span className="mono">b</span> may follow the block.
            </p>
            <div className="recipe-answer mono">b*(ab)*</div>
            <p className="recipe-trap">
              For “exactly two b’s after each a”, replace the block with <span className="mono">abb</span>:
              {' '}<span className="mono">b*(abb)*</span>.
            </p>
          </article>

          <article className="recipe-card">
            <div className="recipe-head"><span className="recipe-num">R3</span><h3>No two consecutive underscores</h3></div>
            <p className="recipe-when"><strong>When:</strong> identifiers may contain <span className="mono">_</span>{' '}
              but <span className="mono">__</span> is forbidden.</p>
            <p>
              Use the <strong>sandwich trick</strong>: every optional underscore must stand immediately before a
              non-underscore character, plus one optional underscore at the very end.
            </p>
            <div className="recipe-answer mono">[a-zA-Z](_?[a-zA-Z0-9'])*_?</div>
            <p className="recipe-trap">
              The first character is a letter. Digits, apostrophes and single underscores may follow, but two
              underscores can never touch.
            </p>
          </article>

          <article className="recipe-card">
            <div className="recipe-head"><span className="recipe-num">R4</span><h3>Email and command syntax</h3></div>
            <p className="recipe-when"><strong>When:</strong> the exercise gives a grammar-like description with
              optional arguments.</p>
            <p>
              Escape the special symbols (<span className="mono">@ - [ ] space</span>). Build the small pieces
              first, then combine them:
            </p>
            <div className="recipe-answer recipe-answer-stack">
              <div><span>Email</span><code>[a-zA-Z0-9_-]+ \@ [a-zA-Z0-9_-]+</code></div>
              <div><span>id</span><code>[a-zA-Z][a-zA-Z0-9]*</code></div>
              <div><span>arg list</span><code>{'{id}'} (\ {'{id}'})*</code></div>
              <div><span>option</span><code>\[ \-[a-z] (\, \-[a-z])* \]</code></div>
            </div>
            <p className="recipe-trap">
              A command is an id followed by an optional argument list and an optional option block. Keep the
              spaces and brackets escaped exactly as the correction does.
            </p>
          </article>
        </div>
      </section>

      <section id="drills">
        <SectionHeading id="drills">Quick-check drills</SectionHeading>
        <p>Answer on paper first. Open the solution only after you have committed.</p>
        <DrillList
          items={[
            {
              q: <>Which words from <span className="mono">{'{ab, ba, (a+b), aaba}'}</span> match <span className="mono">[(ab)+]{'{1,3}'}</span>?</>,
              a: (
                <>
                  <p>
                    Only <span className="mono">ab</span> and <span className="mono">ba</span>. The outer brackets
                    select 1–3 single characters from <span className="mono">{'{ (, a, b, ), + }'}</span>.{' '}
                    <span className="mono">(a+b)</span> is five characters and <span className="mono">aaba</span> is
                    four — both exceed the limit.
                  </p>
                </>
              ),
            },
            {
              q: <>Write a regex for “every block of <span className="mono">a</span>’s has length at least 2”.</>,
              a: <p><span className="mono">(b | aa+)*</span>. The chunk <span className="mono">aa+</span> allows two or more a’s, and <span className="mono">b</span> handles the gaps.</p>,
            },
            {
              q: <>Does <span className="mono">b*(ab)*</span> allow the word <span className="mono">abb</span>?</>,
              a: <p>No. After <span className="mono">a</span>, the block supplies exactly one <span className="mono">b</span>. A second <span className="mono">b</span> would leave the pattern.</p>,
            },
          ]}
        />
      </section>

      <Callout variant="key" title="What you can now do">
        <p>
          You can read the six symbols, translate four standard English patterns into regex, explain why{' '}
          <span className="mono">[...]</span> breaks grouping, and predict what <span className="mono">grep</span>{' '}
          will print. That is the whole of Stage 1 — and it is already worth several points.
        </p>
        <p>
          Next: Stage 2 turns these descriptions into pictures. <Link className="text-link" to="/guide/2">Continue to automata <ArrowRight size={14} aria-hidden="true" /></Link>
        </p>
      </Callout>

      <DeepDives stage={stage} />
    </GuideShell>
  )
}
