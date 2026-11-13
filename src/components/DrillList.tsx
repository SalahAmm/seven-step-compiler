import type { ReactNode } from 'react'

export type Drill = {
  q: ReactNode
  a: ReactNode
}

export function DrillList({ items }: { items: Drill[] }) {
  return (
    <div className="drill-list lesson-drills">
      {items.map((drill, index) => (
        <details className="drill" key={index}>
          <summary>
            <span className="drill-num">D{index + 1}</span>
            <span>{drill.q}</span>
            <span className="drill-open" aria-hidden="true">+</span>
          </summary>
          <div className="drill-answer">
            <span>Answer</span>
            <div>{drill.a}</div>
          </div>
        </details>
      ))}
    </div>
  )
}
