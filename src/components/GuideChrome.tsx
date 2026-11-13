import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Compass,
  Target,
} from 'lucide-react'
import { useProgress } from '../context/ProgressContext'
import type { GuideStage } from '../data/guide'
import { guideStages } from '../data/guide'
import { StageDock } from './StageDock'

export function StageHeader({ stage }: { stage: GuideStage }) {
  const { isComplete, toggle } = useProgress()
  const key = `stage-${stage.id}`
  const done = isComplete(key)

  const scrollTo = (id: string) => {
    const element = document.getElementById(id)
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header className="lesson-head stage-head" id="stage-top">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Course</Link>
        <span className="sep" aria-hidden="true">/</span>
        <span>7-stage guide</span>
        <span className="sep" aria-hidden="true">/</span>
        <span>Stage {stage.id}</span>
      </nav>

      <div className="stage-kicker">
        <Compass size={14} aria-hidden="true" />
        {stage.kicker}
        <span className="stage-kicker-focus">{stage.focus}</span>
      </div>

      <div className="lesson-title-row">
        <div>
          <h1 className="lesson-title">{stage.title}</h1>
          <p className="lesson-intro">{stage.blurb}</p>
        </div>
        <button
          type="button"
          className={`complete-toggle${done ? ' is-done' : ''}`}
          aria-pressed={done}
          onClick={() => toggle(key)}
        >
          <Check size={14} strokeWidth={2.4} aria-hidden="true" />
          {done ? 'Stage complete' : 'Mark stage complete'}
        </button>
      </div>

      <div className="stage-outcomes">
        <div className="stage-outcomes-label">
          <Target size={14} aria-hidden="true" />
          By the end of this stage
        </div>
        <ul>
          {stage.outcomes.map((outcome) => (
            <li key={outcome}>{outcome}</li>
          ))}
        </ul>
      </div>

      <div className="lesson-meta">
        <span><strong>Stage {stage.id}</strong> of 7</span>
        <span><strong>Focus</strong> · {stage.focus}</span>
        <span><strong>Exam</strong> · {stage.examRefs.join(' · ')}</span>
      </div>

      <div className="toc-card">
        <div className="toc-label">In this stage</div>
        <div className="toc-links">
          {stage.sections.map((section) => (
            <button type="button" key={section.id} onClick={() => scrollTo(section.id)}>
              {section.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}

export function StageFooter({ stage }: { stage: GuideStage }) {
  const index = guideStages.findIndex((item) => item.id === stage.id)
  const previous = index > 0 ? guideStages[index - 1] : null
  const next = index >= 0 && index < guideStages.length - 1 ? guideStages[index + 1] : null
  const { isComplete, toggle } = useProgress()
  const key = `stage-${stage.id}`
  const done = isComplete(key)

  return (
    <footer className="lesson-end">
      <div className="complete-banner">
        <div>
          <p className="complete-title">{done ? 'Stage marked complete.' : 'Finished this stage?'}</p>
          <p className="complete-copy">
            {done
              ? 'Progress is saved in this browser. Move on when the ideas feel automatic.'
              : 'Mark it complete so the progress bar reflects what you have actually covered.'}
          </p>
        </div>
        <button
          type="button"
          className={`btn ${done ? 'btn-ghost' : 'btn-primary'}`}
          aria-pressed={done}
          onClick={() => toggle(key)}
        >
          <CircleCheck size={16} aria-hidden="true" />
          {done ? 'Unmark' : 'Mark stage complete'}
        </button>
      </div>

      <nav className="lesson-nav" aria-label="Previous and next stage">
        {previous ? (
          <Link className="lesson-nav-link previous" to={`/guide/${previous.id}`}>
            <span className="lesson-nav-dir"><ChevronLeft size={14} aria-hidden="true" /> Previous stage</span>
            <span className="lesson-nav-title">{previous.title}</span>
          </Link>
        ) : (
          <Link className="lesson-nav-link previous" to="/basics">
            <span className="lesson-nav-dir"><ChevronLeft size={14} aria-hidden="true" /> Back to</span>
            <span className="lesson-nav-title">The absolute basics</span>
          </Link>
        )}
        {next ? (
          <Link className="lesson-nav-link next" to={`/guide/${next.id}`}>
            <span className="lesson-nav-dir">Next stage <ChevronRight size={14} aria-hidden="true" /></span>
            <span className="lesson-nav-title">{next.title}</span>
          </Link>
        ) : (
          <Link className="lesson-nav-link next" to="/war-room">
            <span className="lesson-nav-dir">Finish <ChevronRight size={14} aria-hidden="true" /></span>
            <span className="lesson-nav-title">Exam war room</span>
          </Link>
        )}
      </nav>
    </footer>
  )
}

export function DeepDives({ stage }: { stage: GuideStage }) {
  return (
    <aside className="deep-dives">
      <div className="deep-dives-copy">
        <BookOpen size={17} aria-hidden="true" />
        <div>
          <strong>Want the longer derivation?</strong>
          <p>The survival guide is enough for the exam. These full notes add every intermediate step.</p>
        </div>
      </div>
      <div className="deep-dives-links">
        {stage.deepDives.map((item) => (
          <Link key={item.lessonId} to={`/lessons/${item.lessonId}`}>
            {item.label} <ArrowRight size={14} aria-hidden="true" />
          </Link>
        ))}
      </div>
    </aside>
  )
}

export function GuideShell({ stage, children }: { stage: GuideStage; children: ReactNode }) {
  const index = guideStages.findIndex((item) => item.id === stage.id)
  const previous = index > 0
    ? { to: `/guide/${guideStages[index - 1].id}`, label: guideStages[index - 1].navLabel }
    : { to: '/basics', label: 'Basics' }
  const next = index >= 0 && index < guideStages.length - 1
    ? { to: `/guide/${guideStages[index + 1].id}`, label: guideStages[index + 1].navLabel }
    : { to: '/war-room', label: 'War room' }

  return (
    <>
      <StageHeader stage={stage} />
      <article className="lesson-body prose guide-body">{children}</article>
      <StageFooter stage={stage} />
      <StageDock
        stageId={stage.id}
        stageLabel={stage.title}
        sections={stage.sections}
        previous={previous}
        next={next}
        deepDives={stage.deepDives.map((item) => ({
          to: `/lessons/${item.lessonId}`,
          label: item.label,
        }))}
      />
    </>
  )
}
