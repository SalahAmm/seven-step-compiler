import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Layers } from 'lucide-react'
import { lessons } from '../data/course'

const groups = [
  { part: 'I' as const, label: 'Part I · Lexical analysis', note: 'Regex, automata, Arden and determinization.' },
  { part: 'II' as const, label: 'Part II · Syntactic analysis', note: 'Grammars, CNF, FIRST/FOLLOW, LL(1) and PDA.' },
]

export function Reference() {
  return (
    <>
      <header className="page-head reference-head">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Course</Link>
          <span className="sep" aria-hidden="true">/</span>
          <span>Reference shelf</span>
        </nav>
        <div className="hero-kicker">
          <BookOpen size={14} aria-hidden="true" />
          Full lesson notes · optional deep dives
        </div>
        <h1 className="page-title">The reference shelf.</h1>
        <p className="lede">
          The seven-stage guide is enough for the assessment. These nine full lessons are the longer version: every
          intermediate step, every diagram and every official correction. Use them when a recipe needs more context,
          not as a second syllabus.
        </p>
        <div className="page-actions">
          <Link className="btn btn-primary" to="/guide/1">
            Back to Stage 1 <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link className="btn btn-ghost" to="/cheatsheet">
            Master cheat sheet
          </Link>
        </div>
      </header>

      {groups.map((group) => (
        <section className="reference-section" key={group.part}>
          <div className="reference-section-head">
            <div>
              <span className="eyebrow">{group.label}</span>
              <h2>{group.note}</h2>
            </div>
            <span className="reference-count">
              {lessons.filter((lesson) => lesson.part === group.part).length} notes
            </span>
          </div>

          <div className="reference-list">
            {lessons
              .filter((lesson) => lesson.part === group.part)
              .map((lesson) => (
                <Link className="reference-card" to={`/lessons/${lesson.id}`} key={lesson.id}>
                  <div className="reference-card-top">
                    <span className="reference-num">L{lesson.id}</span>
                    <span className="reference-time">
                      <Layers size={12} aria-hidden="true" /> {lesson.planSlot}
                    </span>
                  </div>
                  <h3>{lesson.title}</h3>
                  <p>{lesson.blurb}</p>
                  <div className="reference-card-foot">
                    <span>{lesson.sections.length} sections</span>
                    <span className="reference-open">
                      Read the full note <ArrowRight size={14} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      ))}

      <section className="reference-note">
        <div>
          <span className="eyebrow">Which one should I open?</span>
          <h2>Match the note to the stage you are stuck on.</h2>
        </div>
        <div className="reference-map">
          <Link to="/lessons/1">Stage 1 → Lesson 1</Link>
          <Link to="/lessons/2">Stage 2 → Lesson 2</Link>
          <Link to="/lessons/3">Stage 3 → Lessons 3–4</Link>
          <Link to="/lessons/5">Stage 4 → Lessons 5–7</Link>
          <Link to="/lessons/8">Stages 5–6 → Lesson 8</Link>
          <Link to="/lessons/9">Stage 7 → Lesson 9</Link>
        </div>
      </section>
    </>
  )
}
