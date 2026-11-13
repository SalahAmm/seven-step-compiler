import { useMemo } from 'react'
import katex from 'katex'

type MathProps = {
  children: string
  block?: boolean
  quiet?: boolean
  focus?: boolean
}

export function M({ children, block = false, quiet = false, focus = false }: MathProps) {
  const html = useMemo(
    () =>
      katex.renderToString(children, {
        displayMode: block,
        throwOnError: false,
        strict: false,
        output: 'html',
      }),
    [children, block],
  )

  if (block) {
    return (
      <span className={`eq${quiet ? ' is-quiet' : ''}${focus ? ' is-focus' : ''}`}>
        <span dangerouslySetInnerHTML={{ __html: html }} />
      </span>
    )
  }

  return (
    <span
      className="math-inline"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
