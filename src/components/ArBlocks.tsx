import { Callout } from './ui'
import { DrillList } from './DrillList'
import { BidiText } from './BidiText'
import { M } from './Math'
import type { ArBlock, ArSection } from '../data/arabic'

function BlockView({ block }: { block: ArBlock }) {
  switch (block.t) {
    case 'p':
      return <p><BidiText>{block.text}</BidiText></p>
    case 'h3':
      return <h3><BidiText>{block.text}</BidiText></h3>
    case 'list': {
      const items = block.items.map((item) => <li key={item}><BidiText>{item}</BidiText></li>)
      return block.ordered ? <ol>{items}</ol> : <ul>{items}</ul>
    }
    case 'formula':
      return (
        <div className="ar-formula" dir="ltr">
          <M block>{block.tex}</M>
          {block.caption ? <p className="ar-formula-caption"><BidiText>{block.caption}</BidiText></p> : null}
        </div>
      )
    case 'code':
      return (
        <figure className="ar-code-block">
          <pre className="ar-code" dir="ltr"><code>{block.code}</code></pre>
          {block.caption ? <figcaption><BidiText>{block.caption}</BidiText></figcaption> : null}
        </figure>
      )
    case 'callout':
      return (
        <Callout variant={block.tone === 'warn' ? 'trap' : 'key'} title={<BidiText>{block.title}</BidiText>}>
          <p><BidiText>{block.text}</BidiText></p>
        </Callout>
      )
    case 'table':
      return (
        <div className="table-wrap ar-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                {block.head.map((cell) => <th scope="col" key={cell}><BidiText>{cell}</BidiText></th>)}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, index) => (
                <tr key={`${row[0]}-${index}`}>
                  {row.map((cell, cellIndex) => (
                    <td key={`${cell}-${cellIndex}`}><BidiText>{cell}</BidiText></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'drill':
      return null
    case 'note':
      return <p className="ar-note"><BidiText>{block.text}</BidiText></p>
    default:
      return null
  }
}

export function ArSectionView({ section }: { section: ArSection }) {
  const drills = section.blocks
    .filter((block): block is Extract<ArBlock, { t: 'drill' }> => block.t === 'drill')
    .map((block) => ({ q: <BidiText>{block.q}</BidiText>, a: <BidiText>{block.a}</BidiText> }))

  return (
    <section id={section.id} className="ar-section">
      <h2>{section.label}</h2>
      {section.blocks.map((block, index) => (
        <BlockView block={block} key={`${section.id}-${block.t}-${index}`} />
      ))}
      {drills.length > 0 ? <DrillList items={drills} /> : null}
    </section>
  )
}
