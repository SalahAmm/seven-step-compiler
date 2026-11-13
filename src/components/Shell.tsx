import { useEffect, useRef, useState } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowUp, Check, Globe2, Menu, Printer, X } from 'lucide-react'
import { guideStages } from '../data/guide'
import { arStages } from '../data/arabic'
import { useProgress } from '../context/ProgressContext'
import {
  isArabicPath,
  toArabicPath,
  toEnglishPath,
} from '../i18n/routes'

function BrandMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M1 20h3.4" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3.5 20 6.3 20" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6.2 20 7.4 20" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 17.8 16.7 11.6" stroke="currentColor" strokeWidth="1.3" />
      <path d="M24.2 11.6 29.2 16.6" stroke="currentColor" strokeWidth="1.3" />
      <path d="M31.8 24.4c2.3 3.5 1.2 8.6-2.2 10.8" stroke="currentColor" strokeWidth="1.3" strokeDasharray="2.2 2.6" opacity=".55" />
      <circle cx="8" cy="20" r="4.2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="20" cy="9" r="4.2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="33" cy="20" r="4.8" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="33" cy="20" r="2.6" stroke="var(--lime-deep)" strokeWidth="1.4" />
      <circle cx="8" cy="20" r="1.35" fill="currentColor" />
    </svg>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function ReadingProgress({ isAr }: { isAr: boolean }) {
  const [progress, setProgress] = useState(0)
  const { pathname } = useLocation()

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [pathname])

  return (
    <div className="reading-bar" aria-hidden="true" title={isAr ? 'تقدّم القراءة' : 'Reading progress'}>
      <div className="reading-fill" style={{ width: `${progress * 100}%` }} />
    </div>
  )
}

function BackToTop({ hasDock, isAr }: { hasDock: boolean; isAr: boolean }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      setVisible(window.scrollY > 640)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      className={`back-to-top${hasDock ? ' has-dock' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={isAr ? 'العودة إلى أعلى الصفحة' : 'Back to top'}
    >
      <ArrowUp size={18} aria-hidden="true" />
    </button>
  )
}

function LanguageSwitch({
  pathname,
  isAr,
  compact = false,
}: {
  pathname: string
  isAr: boolean
  compact?: boolean
}) {
  const englishTo = toEnglishPath(pathname)
  const arabicTo = toArabicPath(pathname)
  const label = isAr ? 'Switch to English' : 'التبديل إلى العربية'

  if (compact) {
    return (
      <Link className="lang-toggle" to={isAr ? englishTo : arabicTo} aria-label={label} lang={isAr ? 'en' : 'ar'}>
        <Globe2 size={15} aria-hidden="true" />
        <span>{isAr ? 'EN' : 'العربية'}</span>
      </Link>
    )
  }

  return (
    <div className="lang-panel" role="group" aria-label={isAr ? 'اختيار اللغة' : 'Language'}>
      <Link
        className={`lang-option${!isAr ? ' is-active' : ''}`}
        to={englishTo}
        lang="en"
        aria-current={!isAr ? 'true' : undefined}
      >
        English
      </Link>
      <Link
        className={`lang-option${isAr ? ' is-active' : ''}`}
        to={arabicTo}
        lang="ar"
        aria-current={isAr ? 'true' : undefined}
      >
        العربية
      </Link>
    </div>
  )
}

type NavItem = { num: string; label: string; to: string; stage?: number }
type NavGroup = { label: string; items: NavItem[] }

function getNavGroups(isAr: boolean): NavGroup[] {
  const stages = isAr ? arStages : guideStages
  const stageItem = (id: number): NavItem => {
    const stage = stages.find((item) => item.id === id)!
    return {
      num: `S${id}`,
      label: isAr ? stage.navLabel : (stage as typeof guideStages[number]).navLabel,
      to: isAr ? `/ar/stage/${id}` : `/guide/${id}`,
      stage: id,
    }
  }

  return [
    {
      label: isAr ? 'ابدأ هنا' : 'Start here',
      items: [
        { num: '00', label: isAr ? 'نظرة عامة' : 'Overview', to: isAr ? '/ar' : '/' },
        { num: 'AB', label: isAr ? 'الأساسيات المطلقة' : 'Absolute basics', to: isAr ? '/ar/basics' : '/basics' },
        { num: 'CS', label: isAr ? 'ورقة المراجعة' : 'Master cheat sheet', to: isAr ? '/ar/cheatsheet' : '/cheatsheet' },
      ],
    },
    {
      label: isAr ? 'الجزء الأول · التحليل المعجمي' : 'Part I · Lexical analysis',
      items: [stageItem(1), stageItem(2), stageItem(3)],
    },
    {
      label: isAr ? 'الجزء الثاني · التحليل النحوي' : 'Part II · Syntactic analysis',
      items: [stageItem(4), stageItem(5), stageItem(6)],
    },
    {
      label: isAr ? 'المرحلة الأخيرة' : 'Final stage',
      items: [
        stageItem(7),
        { num: 'WR', label: isAr ? 'غرفة الامتحان' : 'Exam war room', to: isAr ? '/ar/war-room' : '/war-room' },
      ],
    },
    {
      label: isAr ? 'رفّ المراجع' : 'Reference shelf',
      items: [
        {
          num: 'RN',
          label: isAr ? 'الملاحظات الموسّعة' : 'Full lesson notes',
          to: isAr ? '/ar/reference' : '/reference',
        },
      ],
    },
  ]
}

function Sidebar({ open, onClose, isAr }: { open: boolean; onClose: () => void; isAr: boolean }) {
  const { isComplete, count, reset } = useProgress()
  const location = useLocation()
  const panelRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!open) return
    const returnFocus = document.activeElement as HTMLElement | null
    const focusTimer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>('.sidebar-close')?.focus()
    }, 40)

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !panelRef.current) return
      const focusable = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
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
      window.clearTimeout(focusTimer)
      window.removeEventListener('keydown', onKey)
      returnFocus?.focus?.()
    }
  }, [open])

  useEffect(() => {
    onClose()
    // Close the drawer only when the route itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  const handleReset = () => {
    const message = isAr ? 'هل تريد إعادة ضبط تقدّم جميع المراحل؟' : 'Reset all studied-lesson progress?'
    if (window.confirm(message)) reset()
  }

  const progress = Math.round((count / guideStages.length) * 100)
  const groups = getNavGroups(isAr)

  return (
    <aside
      className={`sidebar${open ? ' is-open' : ''}`}
      aria-label={isAr ? 'تنقل المقرر' : 'Course navigation'}
      id="course-menu"
      ref={panelRef}
      role={open ? 'dialog' : undefined}
      aria-modal={open ? 'true' : undefined}
    >
      <button type="button" className="icon-btn sidebar-close" onClick={onClose} aria-label={isAr ? 'إغلاق القائمة' : 'Close menu'}>
        <X size={19} />
      </button>

      <div className="sidebar-inner">
        <div className="sidebar-kicker">{isAr ? 'خريطة المقرر' : 'Course map'}</div>
        <Link className="brand" to={isAr ? '/ar' : '/'} onClick={onClose}>
          <BrandMark className="brand-mark" />
          <span>
            <span className="brand-name">
              {isAr ? <>المُترجِم<br />في سبع خطوات</> : <>The 7-Step<br />Compiler</>}
            </span>
            <span className="brand-sub">
              {isAr
                ? <>تجميع · السنة الثالثة إعلام آلي<br />جامعة يحيى فارس – المدية</>
                : <>Compilation · L3 Computer Science<br />Université Yahia Fares – Médéa</>}
            </span>
          </span>
        </Link>

        <LanguageSwitch pathname={location.pathname} isAr={isAr} />

        <nav className="nav">
          {groups.map((group) => (
            <div className="nav-group" key={group.label}>
              <div className="nav-label">{group.label}</div>
              {group.items.map((item) => (
                <Link
                  className={`nav-link${location.pathname === item.to ? ' is-active' : ''}`}
                  to={item.to}
                  key={item.to}
                  onClick={onClose}
                >
                  <span className="nav-num">{item.num}</span>
                  <span>{item.label}</span>
                  {item.stage && isComplete(`stage-${item.stage}`) ? (
                    <Check className="nav-check" size={14} strokeWidth={2.4} aria-label={isAr ? 'مكتملة' : 'Complete'} />
                  ) : <span />}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="progress-card">
          <div className="progress-head">
            <span className="progress-title">{isAr ? 'تقدّم المراحل السبع' : 'Seven-stage progress'}</span>
            <span className="progress-value" dir="ltr">{count} / {guideStages.length}</span>
          </div>
          <div
            className="progress-track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={guideStages.length}
            aria-valuenow={count}
            aria-label={isAr ? 'المراحل المكتملة' : 'Guide stages completed'}
          >
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <p className="progress-note">
            {count === 0
              ? (isAr ? 'جديد على المادة؟ اقرأ الأساسيات المطلقة أولا.' : 'New to the subject? Read the absolute basics first.')
              : count === guideStages.length
                ? (isAr ? 'أكملت المراحل السبع. وقت الامتحان الآن.' : 'All seven stages complete. Go win the QCM.')
                : (isAr ? 'محفوظ في هذا المتصفح. واصل التقدّم.' : 'Saved in this browser. Keep going.')}
          </p>
        </div>

        <div className="sidebar-foot">
          <Link to={isAr ? '/ar/cheatsheet' : '/cheatsheet'}>{isAr ? 'ورقة المراجعة' : 'Cheat sheet'}</Link>
          {count > 0 ? (
            <button type="button" onClick={handleReset}>{isAr ? 'إعادة الضبط' : 'Reset progress'}</button>
          ) : null}
        </div>
      </div>
    </aside>
  )
}

function MobileBar({ onOpen, open, isAr }: { onOpen: () => void; open: boolean; isAr: boolean }) {
  const { count } = useProgress()
  const { pathname } = useLocation()
  return (
    <div className="mobile-bar">
      <button
        type="button"
        className="mobile-menu-btn"
        onClick={onOpen}
        aria-label={isAr ? 'فتح خريطة المقرر' : 'Open course map'}
        aria-expanded={open}
        aria-controls="course-menu"
      >
        <Menu size={18} aria-hidden="true" />
        <span>{isAr ? 'المقرر' : 'Course'}</span>
      </button>
      <Link className="mobile-brand" to={isAr ? '/ar' : '/'}>
        <BrandMark />
        <span className="mobile-brand-full">{isAr ? 'المُترجِم في سبع خطوات' : 'The 7-Step Compiler'}</span>
        <span className="mobile-brand-short">{isAr ? 'سبع خطوات' : '7-Step'}</span>
      </Link>
      <div className="mobile-actions">
        <div className="mobile-progress" aria-hidden="true">
          <span>{count}/7</span>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${(count / guideStages.length) * 100}%` }} />
          </div>
        </div>
        <LanguageSwitch pathname={pathname} isAr={isAr} compact />
      </div>
    </div>
  )
}

function Footer({ isAr }: { isAr: boolean }) {
  return (
    <div className="footer">
      <div>
        <div className="footer-brand">{isAr ? 'المُترجِم في سبع خطوات' : 'The 7-Step Compiler'}</div>
        <p style={{ marginTop: 6 }}>
          {isAr
            ? <>دليل مراجعة مبني على سلاسل التمارين 1 و2 والاستجوابات 1 و2 وحلولها.<br />جامعة يحيى فارس – المدية · السنة الثالثة إعلام آلي.</>
            : <>A study guide built from Exercise Sets 1 &amp; 2, Interrogations 1 &amp; 2 and their solutions.<br />Université Yahia Fares – Médéa · L3 Computer Science.</>}
        </p>
      </div>
      <div className="footer-links">
        <Link to={isAr ? '/ar/basics' : '/basics'}>{isAr ? 'الأساسيات' : 'Absolute basics'}</Link>
        <Link to={isAr ? '/ar/cheatsheet' : '/cheatsheet'}>{isAr ? 'ورقة المراجعة' : 'Cheat sheet'}</Link>
        <Link to={isAr ? '/ar/reference' : '/reference'}>{isAr ? 'الملاحظات' : 'Full notes'}</Link>
        <Link to={isAr ? '/ar/war-room' : '/war-room'}>{isAr ? 'غرفة الامتحان' : 'War room'}</Link>
        <button type="button" className="footer-print" onClick={() => window.print()}>
          <Printer size={12} aria-hidden="true" />
          {isAr ? 'طباعة' : 'Print'}
        </button>
      </div>
    </div>
  )
}

export function Shell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const isAr = isArabicPath(pathname)
  const hasDock = /^\/(guide|ar\/stage)\/\d+$/.test(pathname)

  const skipToMain = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    const main = document.getElementById('main-content')
    if (!main) return
    main.focus({ preventScroll: true })
    main.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    document.documentElement.lang = isAr ? 'ar' : 'en'
    document.documentElement.dir = isAr ? 'rtl' : 'ltr'
    document.title = isAr ? 'المُترجِم في سبع خطوات' : 'The 7-Step Compiler'
  }, [isAr])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className={`shell${isAr ? ' is-ar' : ''}`}>
      <a className="skip-link" href="#main-content" onClick={skipToMain}>
        {isAr ? 'انتقل إلى المحتوى' : 'Skip to content'}
      </a>
      <ScrollToTop />
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} isAr={isAr} />
      <div
        className={`scrim${menuOpen ? ' is-open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <div className="main">
        <ReadingProgress isAr={isAr} />
        <MobileBar onOpen={() => setMenuOpen(true)} open={menuOpen} isAr={isAr} />
        <div className={`main-inner${hasDock ? ' has-stage-dock' : ''}`}>
          <main id="main-content" className={`page${hasDock ? ' has-stage-dock' : ''}`} tabIndex={-1}>
            {children}
          </main>
          <Footer isAr={isAr} />
        </div>
      </div>
      <BackToTop hasDock={hasDock} isAr={isAr} />
    </div>
  )
}
