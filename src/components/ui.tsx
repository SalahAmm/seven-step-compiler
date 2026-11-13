import type { ReactNode } from 'react'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Info,
  Lightbulb,
  TriangleAlert,
} from 'lucide-react'
import { useProgress } from '../context/ProgressContext'
import type { LessonMeta } from '../data/course'
import { lessons } from '../data/course'
import { Link } from 'react-router-dom'

/* ------------------------------------------------------------------ */
/* Callout                                                             */
/* ------------------------------------------------------------------ */
type CalloutProps = {
  variant?: 'trap' | 'key' | 'note'
  title?: ReactNode
  children: ReactNode
}

export function Callout({ variant = 'note', title, children }: CalloutProps) {
  const Icon = variant === 'trap' ? TriangleAlert : variant === 'key' ? Lightbulb : Info
  const label = title ?? (variant === 'trap' ? 'Exam trap' : variant === 'key' ? 'Key idea' : 'Note')
  return (
    <aside className={`callout ${variant}`}>
      <div className="callout-head">
        <Icon size={16} strokeWidth={2.1} aria-hidden="true" />
        <span>{label}</span>
      </div>
      {children}
    </aside>
  )
}

/* ------------------------------------------------------------------ */
/* Board figure                                                        */
/* ------------------------------------------------------------------ */
type BoardFigureProps = {
  title: string
  note?: string
  children: ReactNode
  caption?: ReactNode
  credit?: ReactNode
  className?: string
  label?: string
}

export function BoardFigure({
  title,
  note,
  children,
  caption,
  credit,
  className,
  label,
}: BoardFigureProps) {
  return (
    <figure className={`fig ${className ?? ''}`}>
      <div className="fig-board" role="group" aria-label={label ?? title}>
        <div className="fig-board-head">
          <div className="fig-board-title">{title}</div>
          {note ? <div className="fig-board-note">{note}</div> : null}
        </div>
        <div className="fig-board-body">{children}</div>
      </div>
      {caption ? (
        <figcaption className="fig-caption">
          <div>{caption}</div>
          {credit ? <div className="caption-credit">{credit}</div> : null}
        </figcaption>
      ) : null}
    </figure>
  )
}

/* ------------------------------------------------------------------ */
/* Grammar                                                             */
/* ------------------------------------------------------------------ */
type GrammarLine = string | { text: string; tone?: 'hot' | 'dim' }

type GrammarBlockProps = {
  lines: GrammarLine[]
  note?: string
  label?: string
}

export function Grammar({ lines, note, label = 'Grammar productions' }: GrammarBlockProps) {
  return (
    <div className="grammar" role="group" aria-label={label}>
      {lines.map((line, index) => {
        const text = typeof line === 'string' ? line : line.text
        const tone = typeof line === 'string' ? undefined : line.tone
        return (
          <div
            className={`g-line${tone === 'hot' ? ' is-hot' : ''}${tone === 'dim' ? ' is-dim' : ''}`}
            key={`${text}-${index}`}
          >
            {text}
          </div>
        )
      })}
      {note ? <div className="g-note">{note}</div> : null}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Pills / chips                                                       */
/* ------------------------------------------------------------------ */
export function Pill({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'neutral' | 'ok' | 'bad'
}) {
  return <span className={`pill ${tone === 'neutral' ? '' : tone}`}>{children}</span>
}

export function Chips({
  items,
  tone = 'neutral',
}: {
  items: string[]
  tone?: 'neutral' | 'ok' | 'bad'
}) {
  return (
    <div className="chips">
      {items.map((item) => (
        <span className={`chip ${tone === 'neutral' ? '' : tone}`} key={item}>
          {item}
        </span>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Lesson header                                                       */
/* ------------------------------------------------------------------ */
export function LessonHeader({ lesson }: { lesson: LessonMeta }) {
  const { isComplete, toggle } = useProgress()
  const done = isComplete(`lesson-${lesson.id}`)

  const scrollTo = (id: string) => {
    const element = document.getElementById(id)
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header className="lesson-head">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Course</Link>
        <span className="sep" aria-hidden="true">/</span>
        <span>Part {lesson.part} · {lesson.partName}</span>
        <span className="sep" aria-hidden="true">/</span>
        <span>Lesson {lesson.id}</span>
      </nav>

      <div className="lesson-title-row">
        <div>
          <h1 className="lesson-title">{lesson.title}</h1>
          <p className="lesson-intro">{lesson.blurb}</p>
        </div>
        <button
          type="button"
          className={`complete-toggle${done ? ' is-done' : ''}`}
          aria-pressed={done}
          onClick={() => toggle(`lesson-${lesson.id}`)}
        >
          <Check size={14} strokeWidth={2.4} aria-hidden="true" />
          {done ? 'Studied' : 'Mark studied'}
        </button>
      </div>

      <div className="lesson-meta">
        <span><strong>Part {lesson.part}</strong> · {lesson.partName}</span>
        <span><strong>Guide stage</strong> · {lesson.planSlot}</span>
        <span><strong>Lesson {lesson.id}</strong> of 9</span>
      </div>

      <div className="toc-card">
        <div className="toc-label">In this lesson</div>
        <div className="toc-links">
          {lesson.sections.map((section) => (
            <button type="button" key={section.id} onClick={() => scrollTo(section.id)}>
              {section.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}

/* ------------------------------------------------------------------ */
/* Lesson footer navigation                                            */
/* ------------------------------------------------------------------ */
export function LessonFooter({ lesson }: { lesson: LessonMeta }) {
  const index = lessons.findIndex((item) => item.id === lesson.id)
  const previous = index > 0 ? lessons[index - 1] : null
  const next = index < lessons.length - 1 ? lessons[index + 1] : null
  const { isComplete, toggle } = useProgress()
  const done = isComplete(`lesson-${lesson.id}`)

  return (
    <footer className="lesson-end">
      <div className="complete-banner">
        <div>
          <p className="complete-title">{done ? 'Lesson marked studied.' : 'Finished this lesson?'}</p>
          <p className="complete-copy">
            {done
              ? 'Your progress is saved in this browser. Move on when you are ready.'
              : 'Mark it studied to keep the seven-stage progress bar honest.'}
          </p>
        </div>
        <button
          type="button"
          className={`btn ${done ? 'btn-ghost' : 'btn-primary'}`}
          aria-pressed={done}
          onClick={() => toggle(`lesson-${lesson.id}`)}
        >
          <CircleCheck size={16} aria-hidden="true" />
          {done ? 'Unmark' : 'Mark studied'}
        </button>
      </div>

      <nav className="lesson-nav" aria-label="Previous and next lesson">
        {previous ? (
          <Link className="lesson-nav-link previous" to={`/lessons/${previous.id}`}>
            <span className="lesson-nav-dir"><ChevronLeft size={14} aria-hidden="true" /> Previous</span>
            <span className="lesson-nav-title">{previous.title}</span>
          </Link>
        ) : (
          <Link className="lesson-nav-link previous" to="/">
            <span className="lesson-nav-dir"><ChevronLeft size={14} aria-hidden="true" /> Back to</span>
            <span className="lesson-nav-title">Course overview</span>
          </Link>
        )}
        {next ? (
          <Link className="lesson-nav-link next" to={`/lessons/${next.id}`}>
            <span className="lesson-nav-dir">Next <ChevronRight size={14} aria-hidden="true" /></span>
            <span className="lesson-nav-title">{next.title}</span>
          </Link>
        ) : (
          <Link className="lesson-nav-link next" to="/war-room">
            <span className="lesson-nav-dir">Next <ChevronRight size={14} aria-hidden="true" /></span>
            <span className="lesson-nav-title">Exam war room</span>
          </Link>
        )}
      </nav>
    </footer>
  )
}

/* ------------------------------------------------------------------ */
/* Generic section heading with a real anchor target                   */
/* ------------------------------------------------------------------ */
export function SectionHeading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id}>
      {children}
    </h2>
  )
}
