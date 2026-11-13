import { Link, Navigate, useParams } from 'react-router-dom'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Compass,
  Target,
} from 'lucide-react'
import { ArSectionView } from '../../components/ArBlocks'
import { StageDock } from '../../components/StageDock'
import { useProgress } from '../../context/ProgressContext'
import { arStages } from '../../data/arabic'

export function ArStage() {
  const { id } = useParams()
  const stage = arStages.find((item) => item.id === Number(id))
  const { isComplete, toggle } = useProgress()

  if (!stage) return <Navigate to="/ar" replace />

  const key = `stage-${stage.id}`
  const done = isComplete(key)
  const index = arStages.findIndex((item) => item.id === stage.id)
  const previous = index > 0
    ? { to: `/ar/stage/${arStages[index - 1].id}`, label: arStages[index - 1].navLabel }
    : { to: '/ar/basics', label: 'الأساسيات' }
  const next = index < arStages.length - 1
    ? { to: `/ar/stage/${arStages[index + 1].id}`, label: arStages[index + 1].navLabel }
    : { to: '/ar/war-room', label: 'غرفة الامتحان' }

  const scrollTo = (target: string) => {
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <header className="lesson-head stage-head ar-page-head" id="stage-top">
        <nav className="breadcrumb" aria-label="مسار التنقل">
          <Link to="/ar">المقرر</Link>
          <span className="sep" aria-hidden="true">/</span>
          <span>الدليل في سبع مراحل</span>
          <span className="sep" aria-hidden="true">/</span>
          <span>المرحلة {stage.id}</span>
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
            {done ? 'المرحلة مكتملة' : 'علّم المرحلة كمكتملة'}
          </button>
        </div>

        <div className="stage-outcomes">
          <div className="stage-outcomes-label">
            <Target size={14} aria-hidden="true" />
            بنهاية هذه المرحلة
          </div>
          <ul>
            {stage.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}
          </ul>
        </div>

        <div className="lesson-meta">
          <span><strong>المرحلة {stage.id}</strong> من 7</span>
          <span><strong>التركيز</strong> · {stage.focus}</span>
          <span><strong>الامتحان</strong> · {stage.examRefs.join(' · ')}</span>
        </div>

        <div className="toc-card">
          <div className="toc-label">في هذه المرحلة</div>
          <div className="toc-links">
            {stage.sections.map((section) => (
              <button type="button" key={section.id} onClick={() => scrollTo(section.id)}>
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <article className="lesson-body prose guide-body ar-body">
        {stage.sections.map((section) => (
          <ArSectionView section={section} key={section.id} />
        ))}
      </article>

      <footer className="lesson-end">
        <div className="complete-banner">
          <div>
            <p className="complete-title">{done ? 'تم تعليم المرحلة كمكتملة.' : 'أكملت هذه المرحلة؟'}</p>
            <p className="complete-copy">
              {done
                ? 'التقدم محفوظ في هذا المتصفح. انتقل عندما تصبح الأفكار تلقائية.'
                : 'علّمها كمكتملة حتى يعكس شريط التقدم ما غطّيته فعلا.'}
            </p>
          </div>
          <button
            type="button"
            className={`btn ${done ? 'btn-ghost' : 'btn-primary'}`}
            aria-pressed={done}
            onClick={() => toggle(key)}
          >
            <CircleCheck size={16} aria-hidden="true" />
            {done ? 'إلغاء التعليم' : 'علّم المرحلة كمكتملة'}
          </button>
        </div>

        <nav className="lesson-nav" aria-label="المرحلة السابقة والتالية">
          <Link className="lesson-nav-link previous" to={previous.to}>
            <span className="lesson-nav-dir"><ChevronRight size={14} aria-hidden="true" /> السابق</span>
            <span className="lesson-nav-title">{previous.label}</span>
          </Link>
          <Link className="lesson-nav-link next" to={next.to}>
            <span className="lesson-nav-dir">التالي <ChevronLeft size={14} aria-hidden="true" /></span>
            <span className="lesson-nav-title">{next.label}</span>
          </Link>
        </nav>
      </footer>

      <StageDock
        stageId={stage.id}
        stageLabel={stage.title}
        sections={stage.sections}
        previous={previous}
        next={next}
        locale="ar"
      />
    </>
  )
}
