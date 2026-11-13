import { useState } from 'react'

type Match = {
  word: string
  ranges: [number, number][]
  note: string
}

type Pattern = {
  key: string
  regex: string
  meaning: string
  matches: Match[]
}

const patterns: Pattern[] = [
  {
    key: 'ca+',
    regex: 'ca+',
    meaning: 'c, then one or more a’s. The line matches if this appears anywhere in it.',
    matches: [
      { word: 'caa', ranges: [[0, 3]], note: 'the whole word is caa' },
      { word: 'cbbab', ranges: [], note: 'no c followed by a' },
      { word: 'cabab', ranges: [[0, 2]], note: 'the prefix ca' },
      { word: 'caaabba', ranges: [[0, 4]], note: 'the prefix caaa' },
    ],
  },
  {
    key: 'c(ab)+',
    regex: 'c(ab)+',
    meaning: 'c, then one or more copies of the block ab.',
    matches: [
      { word: 'caa', ranges: [], note: 'after c comes a, not ab' },
      { word: 'cbbab', ranges: [], note: 'the line starts cb, not c(ab)' },
      { word: 'cabab', ranges: [[0, 5]], note: 'c + ab + ab' },
      { word: 'caaabba', ranges: [], note: 'after c comes aaa, not ab' },
    ],
  },
  {
    key: 'baa?b',
    regex: 'baa?b',
    meaning: 'b, then a, then an optional a, then b. In other words: bab or baab.',
    matches: [
      { word: 'caa', ranges: [], note: 'too short, no b…b window' },
      { word: 'cbbab', ranges: [[2, 5]], note: 'the substring bab' },
      { word: 'cabab', ranges: [[2, 5]], note: 'the substring bab' },
      { word: 'caaabba', ranges: [], note: 'has bb, not bab or baab' },
    ],
  },
]

type TrapWord = {
  word: string
  keep: boolean
  reason: string
}

type Trap = {
  key: string
  regex: string
  bag: string
  rule: string
  words: TrapWord[]
  note?: string
}

const traps: Trap[] = [
  {
    key: 'a',
    regex: '[(ab)+]+?',
    bag: '{ (  a  b  )  + }',
    rule: 'The outer [...] is a bag of five single characters. The +? asks for at least one character from that bag.',
    words: [
      { word: 'ba', keep: true, reason: 'b and a are both in the bag' },
      { word: 'b+b+', keep: true, reason: 'b and + are both in the bag' },
      { word: '(ab))', keep: true, reason: 'all five characters are in the bag' },
    ],
    note: 'Official answer: all three words pass. No grouping survives inside square brackets.',
  },
  {
    key: 'b',
    regex: '[{ident}|then]{1,3}',
    bag: '{ {  i  d  e  n  t  }  |  h }',
    rule: 'Read the class as characters, then enforce the length 1–3. “ident” is not a keyword here; it is six separate letters.',
    words: [
      { word: 'then', keep: false, reason: 'all letters are allowed, but the length is 4 — over the limit' },
      { word: 'ma_variable', keep: false, reason: 'contains m, a, _, v, r, b, l… and has length 11' },
      { word: 'net', keep: true, reason: 'length 3, and n, e, t are in the bag' },
      { word: 'i|e', keep: true, reason: 'length 3: i, |, e' },
      { word: '{}', keep: true, reason: 'length 2: { and }' },
    ],
    note: 'Official answer: net, i|e, {}. The corrigé tests the pattern against the whole word here; the exam point is the character class.',
  },
]

function Chars({ word, ranges, allowed }: { word: string; ranges: [number, number][]; allowed?: string }) {
  return (
    <span className="char-row" aria-label={word}>
      {[...word].map((char, index) => {
        const matched = ranges.some(([start, end]) => index >= start && index < end)
        const illegal = allowed ? !allowed.includes(char) : false
        return (
          <span
            key={`${char}-${index}`}
            className={`char${matched ? ' is-match' : ''}${illegal ? ' is-illegal' : ''}`}
          >
            {char === ' ' ? '␠' : char}
          </span>
        )
      })}
    </span>
  )
}

export function GrepLab() {
  const [active, setActive] = useState(patterns[0].key)
  const pattern = patterns.find((item) => item.key === active) ?? patterns[0]

  return (
    <div className="grep-lab">
      <div className="segmented" role="tablist" aria-label="grep patterns">
        {patterns.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={active === item.key}
            className={active === item.key ? 'is-active' : ''}
            onClick={() => setActive(item.key)}
          >
            <code>{item.regex}</code>
          </button>
        ))}
      </div>

      <div className="grep-body">
        <p className="grep-meaning">{pattern.meaning}</p>
        <div className="grep-words">
          {pattern.matches.map((match) => (
            <div className={`grep-word${match.ranges.length ? ' is-on' : ''}`} key={match.word}>
              <div className="grep-word-text">
                <Chars word={match.word} ranges={match.ranges} />
              </div>
              <div className="grep-verdict">
                <span className={`pill ${match.ranges.length ? 'ok' : 'bad'}`}>
                  {match.ranges.length ? 'printed' : 'not printed'}
                </span>
                <span className="grep-reason">{match.note}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="grep-rule">
          <strong>The rule:</strong> grep prints the whole line if <em>any substring</em> matches. The rest of the line is not part of the regexp.
        </p>
      </div>
    </div>
  )
}

export function TrapLab() {
  const [active, setActive] = useState(traps[0].key)
  const trap = traps.find((item) => item.key === active) ?? traps[0]
  const allowed = trap.key === 'a' ? '(ab)+' : '{ident}|then'

  return (
    <div className="trap-lab">
      <div className="segmented" role="tablist" aria-label="character class traps">
        {traps.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={active === item.key}
            className={active === item.key ? 'is-active' : ''}
            onClick={() => setActive(item.key)}
          >
            Interro 1, Ex 01 ({item.key})
          </button>
        ))}
      </div>

      <div className="trap-body">
        <div className="trap-regex">
          <span className="trap-regex-label">the regexp</span>
          <code>{trap.regex}</code>
        </div>
        <div className="trap-bag">
          <span className="trap-bag-label">the character bag</span>
          <span className="trap-bag-chars">{trap.bag}</span>
        </div>
        <p className="trap-rule">{trap.rule}</p>

        <div className="trap-words">
          {trap.words.map((item) => (
            <div className={`trap-word${item.keep ? ' is-kept' : ' is-dropped'}`} key={item.word}>
              <Chars word={item.word} ranges={[]} allowed={allowed} />
              <span className="trap-len">{item.word.length}</span>
              <span className={`pill ${item.keep ? 'ok' : 'bad'}`}>{item.keep ? 'kept' : 'filtered out'}</span>
              <span className="trap-why">{item.reason}</span>
            </div>
          ))}
        </div>
        {trap.note ? <p className="trap-note">{trap.note}</p> : null}
      </div>
    </div>
  )
}
