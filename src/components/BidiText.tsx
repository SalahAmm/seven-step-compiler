import type { ReactNode } from 'react'
import { M } from './Math'

/**
 * Arabic prose needs bidi isolation for two things that plain strings get
 * wrong in an RTL paragraph: numeric ranges ("1–3" renders as "3–1") and
 * numeric fractions ("0 / 7" renders as "7 / 0"). The empty-set glyph also
 * falls back to a zero-looking character in Arabic UI fonts, so it is
 * rendered through KaTeX instead.
 */
const TOKEN = /(∅)|(\d[\d.,]*\s*[–—-]\s*\d[\d.,]*)|(\d+\s*\/\s*\d+)/g

export function BidiText({ children }: { children?: ReactNode }) {
  if (typeof children !== 'string') return <>{children}</>
  if (!TOKEN.test(children)) return <>{children}</>
  TOKEN.lastIndex = 0

  const parts: ReactNode[] = []
  let cursor = 0

  for (const match of children.matchAll(TOKEN)) {
    const start = match.index ?? 0
    if (start > cursor) parts.push(children.slice(cursor, start))

    if (match[1]) {
      parts.push(<M key={`empty-${start}`}>{'\\varnothing'}</M>)
    } else {
      parts.push(
        <bdi dir="ltr" key={`num-${start}`}>
          {match[0]}
        </bdi>,
      )
    }

    cursor = start + match[0].length
  }

  if (cursor < children.length) parts.push(children.slice(cursor))
  return <>{parts}</>
}
