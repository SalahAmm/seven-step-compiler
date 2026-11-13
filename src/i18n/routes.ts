export type Lang = 'en' | 'ar'

export const isArabicPath = (pathname: string) =>
  pathname === '/ar' || pathname.startsWith('/ar/')

/**
 * Map any English study route to the closest Arabic route. The Arabic edition
 * covers the core path; deep-dive lesson links fall back to the Arabic index
 * of the English notes instead of dropping the reader on an unrelated page.
 */
export function toArabicPath(pathname: string): string {
  if (pathname === '/basics') return '/ar/basics'
  if (pathname === '/cheatsheet') return '/ar/cheatsheet'
  if (pathname === '/war-room') return '/ar/war-room'
  if (pathname === '/reference') return '/ar/reference'

  const stage = pathname.match(/^\/guide\/(\d+)$/)
  if (stage) return `/ar/stage/${stage[1]}`

  if (/^\/lessons\/\d+$/.test(pathname)) return '/ar/reference'
  return '/ar'
}

export function toEnglishPath(pathname: string): string {
  if (pathname === '/ar/basics') return '/basics'
  if (pathname === '/ar/cheatsheet') return '/cheatsheet'
  if (pathname === '/ar/war-room') return '/war-room'
  if (pathname === '/ar/reference') return '/reference'

  const stage = pathname.match(/^\/ar\/stage\/(\d+)$/)
  if (stage) return `/guide/${stage[1]}`

  return '/'
}

export function switchLanguagePath(pathname: string): string {
  return isArabicPath(pathname) ? toEnglishPath(pathname) : toArabicPath(pathname)
}
