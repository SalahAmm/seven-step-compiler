import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUp, ChevronLeft, ChevronRight, List, Map, X } from 'lucide-react'
import { useProgress } from '../context/ProgressContext'

type DockLink = { to: string; label: string }

type StageDockProps = {
  stageId: number
  stageLabel: string
  sections: { id: string; label: string }[]
  previous?: DockLink
  next?: DockLink
  deepDives?: DockLink[]
  locale?: 'en' | 'ar'
}

const labels = {
  en: {
    previous: 'Previous',
    next: 'Next',
    contents: 'Stage index',
    sheetTitle: 'This stage',
    close: 'Close stage index',
    top: 'Top of this stage',
    dives: 'Full notes',
    stageOf: (id: number) => `Stage ${id} of 7`,
    dock: 'Stage navigation',
    stages: 'Jump to a stage',
    courseMap: 'Full course map',
  },
  ar: {
    previous: 'السابق',
    next: 'التالي',
    contents: 'فهرس المرحلة',
    sheetTitle: 'هذه المرحلة',
    close: 'إغلاق فهرس المرحلة',
    top: 'أعلى المرحلة',
    dives: 'الملاحظات الكاملة',
    stageOf: (id: number) => `المرحلة ${id} من 7`,
    dock: 'التنقل بين المراحل',
    stages: 'الانتقال إلى مرحلة',
    courseMap: 'خريطة المقرر كاملة',
  },
}

export function StageDock({
  stageId,
  stageLabel,
  sections,
  previous,
  next,
  deepDives = [],
  locale = 'en',
}: StageDockProps) {
  const [open, setOpen] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const { isComplete } = useProgress()
  const t = labels[locale]
  const isRtl = locale === 'ar'
  const stageBase = isRtl ? '/ar/stage' : '/guide'
  const courseMapTo = isRtl ? '/ar' : '/'
  const PrevIcon = isRtl ? ChevronRight : ChevronLeft
  const NextIcon = isRtl ? ChevronLeft : ChevronRight

  const close = () => setOpen(false)

  useEffect(() => {
    if (!open) return
    returnFocusRef.current = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 30)

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        return
      }
      if (event.key !== 'Tab' || !sheetRef.current) return
      const focusable = sheetRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.clearTimeout(focusTimer)
      window.removeEventListener('keydown', onKey)
      returnFocusRef.current?.focus?.()
    }
  }, [open])

  const jumpTo = (id: string) => {
    setOpen(false)
    window.setTimeout(() => {
      const element = document.getElementById(id)
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }

  return (
    <>
      <nav className="stage-dock" aria-label={t.dock} dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="stage-dock-rail" role="group" aria-label={t.stages}>
          {Array.from({ length: 7 }, (_, index) => {
            const id = index + 1
            const current = id === stageId
            const complete = isComplete(`stage-${id}`)
            return (
              <Link
                key={id}
                to={`${stageBase}/${id}`}
                className={`stage-rail-step${current ? ' is-current' : ''}${complete ? ' is-complete' : ''}`}
                aria-current={current ? 'page' : undefined}
                aria-label={t.stageOf(id)}
              >
                <span aria-hidden="true" />
              </Link>
            )
          })}
        </div>

        <div className="stage-dock-row">
          {previous ? (
            <Link className="stage-dock-link" to={previous.to}>
              <PrevIcon size={18} aria-hidden="true" />
              <span className="stage-dock-copy">
                <small>{t.previous}</small>
                <strong>{previous.label}</strong>
              </span>
            </Link>
          ) : (
            <span className="stage-dock-link is-disabled" aria-disabled="true">
              <PrevIcon size={18} aria-hidden="true" />
              <span className="stage-dock-copy"><small>{t.previous}</small></span>
            </span>
          )}

          <button
            type="button"
            className="stage-dock-contents"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-haspopup="dialog"
          >
            <List size={17} aria-hidden="true" />
            <span>
              <strong>{t.contents}</strong>
              <small dir="ltr">{stageId} / 7</small>
            </span>
          </button>

          {next ? (
            <Link className="stage-dock-link is-next" to={next.to}>
              <span className="stage-dock-copy">
                <small>{t.next}</small>
                <strong>{next.label}</strong>
              </span>
              <NextIcon size={18} aria-hidden="true" />
            </Link>
          ) : (
            <span className="stage-dock-link is-next is-disabled" aria-disabled="true">
              <span className="stage-dock-copy"><small>{t.next}</small></span>
              <NextIcon size={18} aria-hidden="true" />
            </span>
          )}
        </div>
      </nav>

      {open ? (
        <div className="sheet-layer" dir={isRtl ? 'rtl' : 'ltr'}>
          <button type="button" className="sheet-scrim" onClick={close} aria-label={t.close} tabIndex={-1} />
          <div
            className="contents-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contents-sheet-title"
            ref={sheetRef}
          >
            <div className="sheet-grip" aria-hidden="true" />
            <div className="sheet-head">
              <div>
                <span className="sheet-eyebrow">{t.stageOf(stageId)}</span>
                <h2 id="contents-sheet-title">{t.sheetTitle}</h2>
                <p>{stageLabel}</p>
              </div>
              <button
                type="button"
                className="icon-btn sheet-close"
                onClick={close}
                aria-label={t.close}
                ref={closeRef}
              >
                <X size={20} />
              </button>
            </div>

            <div className="sheet-body">
              <button type="button" className="sheet-item sheet-top" onClick={() => jumpTo('stage-top')}>
                <ArrowUp size={16} aria-hidden="true" />
                <span>{t.top}</span>
              </button>
              {sections.map((section, index) => (
                <button
                  type="button"
                  className="sheet-item"
                  key={section.id}
                  onClick={() => jumpTo(section.id)}
                >
                  <span className="sheet-num">{String(index + 1).padStart(2, '0')}</span>
                  <span>{section.label}</span>
                  <ChevronLeft className="sheet-chevron" size={15} aria-hidden="true" style={{ transform: isRtl ? undefined : 'scaleX(-1)' }} />
                </button>
              ))}

              {deepDives.length > 0 ? (
                <div className="sheet-dives">
                  <div className="sheet-dives-label">{t.dives}</div>
                  {deepDives.map((item) => (
                    <Link key={item.to} to={item.to} onClick={close}>
                      {item.label}
                      <ChevronRight size={14} aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              ) : null}

              <Link className="sheet-map-link" to={courseMapTo} onClick={close}>
                <Map size={17} aria-hidden="true" />
                <span>{t.courseMap}</span>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
