import { useMemo, useState } from 'react'

const rows = ['a', 'ab', 'bb']
const cols = ['ε', 'b', 'aa']

type Cell = {
  row: string
  col: string
  word: string
  duplicate: boolean
}

export function ConcatLab() {
  const [dedupe, setDedupe] = useState(false)

  const { cells, unique } = useMemo(() => {
    const seen = new Set<string>()
    const built: Cell[] = []
    const all: string[] = []
    for (const row of rows) {
      for (const col of cols) {
        const suffix = col === 'ε' ? '' : col
        const word = row + suffix
        const duplicate = seen.has(word)
        seen.add(word)
        if (!duplicate) all.push(word)
        built.push({ row, col, word, duplicate })
      }
    }
    return { cells: built, unique: all }
  }, [])

  return (
    <div className="concat-lab">
      <div className="concat-head">
        <div>
          <div className="concat-title">Glue every word of L onto every word of M.</div>
          <div className="concat-formula">L = {'{'}a, ab, bb{'}'} &nbsp;·&nbsp; M = {'{'}ε, b, aa{'}'}</div>
        </div>
        <button
          type="button"
          className={`btn btn-small ${dedupe ? 'btn-primary' : ''}`}
          aria-pressed={dedupe}
          onClick={() => setDedupe((value) => !value)}
        >
          {dedupe ? 'Restore duplicates' : 'Cross out duplicates'}
        </button>
      </div>

      <div className="table-wrap">
        <table className="data-table concat-table">
          <caption>Each cell is one concatenation. Row word first, column word second.</caption>
          <thead>
            <tr>
              <th scope="col">L \ M</th>
              {cols.map((col) => <th scope="col" key={col} className="mono">{col}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row}>
                <th scope="row" className="mono">{row}</th>
                {cells.filter((cell) => cell.row === row).map((cell) => (
                  <td key={`${cell.row}-${cell.col}`} className="mono">
                    <span className={`concat-cell${dedupe && cell.duplicate ? ' is-removed' : ''}${cell.duplicate ? ' is-duplicate' : ''}`}>
                      {cell.word}
                      {cell.duplicate ? <span className="concat-dup-label">duplicate</span> : null}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="concat-result">
        <div className="concat-result-head">
          <span>LM after set union</span>
          <span className="concat-count">{unique.length} words</span>
        </div>
        <div className="chips">
          {unique.map((word) => <span className="chip ok" key={word}>{word}</span>)}
        </div>
      </div>
      <p className="concat-note">
        The word <span className="mono">ab</span> appears twice — from <span className="mono">a·b</span> and from <span className="mono">ab·ε</span>. A language is a set, so it survives once.
        {' '}ε and ∅ are the identities: <span className="mono">L·{'{'}ε{'}'} = L</span>, while <span className="mono">L·∅ = ∅</span>.
      </p>
    </div>
  )
}
