import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Scissors,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react'
import { HeroMachine } from '../components/Machine'
import { guideStages } from '../data/guide'
import { useProgress } from '../context/ProgressContext'

const skipItems = [
  'Compiler history, FORTRAN and the first compilers',
  'C++ templates, Python indentation and language wars',
  'Long lecture slides that never appear in the exercises',
  'Proofs the professor has never asked you to reproduce',
]

const method = [
  {
    step: '01',
    title: 'Read the plain-English version',
    copy: 'Every stage opens with the idea in one sentence. If a word is unfamiliar, the absolute-basics page defines it.',
  },
  {
    step: '02',
    title: 'Copy the recipe once',
    copy: 'Write the numbered steps by hand. The exam rewards the method even when the final expression has a small slip.',
  },
  {
    step: '03',
    title: 'Redo the worked example',
    copy: 'Cover the answer and solve the same exercise. Check every line against the correction before moving on.',
  },
  {
    step: '04',
    title: 'Close the page and drill',
    copy: 'Use the quick-check drills at the end of each stage. If you can explain the answer aloud, you own it.',
  },
]

export function Home() {
  const { isComplete, count } = useProgress()
  const nextStage = guideStages.find((stage) => !isComplete(`stage-${stage.id}`)) ?? guideStages[0]

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="hero-kicker">
            <Sparkles size={14} aria-hidden="true" />
            Compilation · L3 Computer Science · Université Yahia Fares – Médéa
          </div>
          <h1 className="page-title">Pass compilation in seven stages.</h1>
          <p className="lede">
            No CS background needed. A plain-English survival guide built from your professor’s exercise sets,
            past exams and official corrections — focused only on what the assessment actually asks.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to={`/guide/${nextStage.id}`}>
              {count === 0 ? 'Start Stage 1' : `Continue Stage ${nextStage.id}`}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link className="btn btn-ghost" to="/basics">
              I’m completely new — start with basics
            </Link>
          </div>
          <div className="hero-meta">
            <span>7 stages, one method</span>
            <span>6 repeating exam patterns</span>
            <span>Every formula rendered properly</span>
          </div>
        </div>
        <HeroMachine />
      </section>

      <section className="exam-map reveal">
        <div className="section-head">
          <div>
            <span className="eyebrow">The 80/20 map</span>
            <h2>The exam repeats six problem patterns.</h2>
          </div>
          <p>
            Your professor is not testing the whole module. He is testing whether you can recognise these six
            shapes and apply the matching recipe under time pressure.
          </p>
        </div>
        <div className="exam-pattern-grid">
          {guideStages.slice(0, 6).map((stage) => (
            <Link className="exam-pattern" to={`/guide/${stage.id}`} key={stage.id}>
              <div className="exam-pattern-top">
                <span className="exam-pattern-num">0{stage.id}</span>
                <span className="exam-pattern-focus">{stage.focus}</span>
              </div>
              <h3>{stage.navLabel}</h3>
              <p>{stage.outcome}</p>
              <span className="exam-pattern-ref">{stage.examRefs[0]}</span>
              <span className="exam-pattern-arrow" aria-hidden="true">
                <ArrowUpRight size={17} />
              </span>
            </Link>
          ))}
          <Link className="exam-pattern exam-pattern-final" to="/guide/7">
            <div className="exam-pattern-top">
              <span className="exam-pattern-num">07</span>
              <span className="exam-pattern-focus">Final stage</span>
            </div>
            <h3>PDA + QCM</h3>
            <p>Build the stack machine, read its language, and lock in the five true/false answers.</p>
            <span className="exam-pattern-ref">Interro 2 · Ex 1</span>
            <span className="exam-pattern-arrow" aria-hidden="true">
              <ArrowUpRight size={17} />
            </span>
          </Link>
        </div>
      </section>

      <section className="section reveal" id="plan">
        <div className="section-head">
          <div>
            <span className="eyebrow">The plan</span>
            <h2>Seven stages, mapped.</h2>
          </div>
          <p>
            Follow the order. Each stage ends with a drill and a clear “you can now do this” outcome. The bar in the
            sidebar keeps score.
          </p>
        </div>
        <div className="plan plan-guide">
          {guideStages.map((stage) => {
            const done = isComplete(`stage-${stage.id}`)
            return (
              <Link
                className={`plan-row${done ? ' is-done' : ''}${stage.id === nextStage.id ? ' is-next' : ''}`}
                to={`/guide/${stage.id}`}
                key={stage.id}
              >
                <span className="plan-time">Stage {stage.id}<small>{stage.focus}</small></span>
                <span className="plan-focus">{stage.navLabel}</span>
                <span className="plan-goal">{stage.outcome}</span>
                {done ? (
                  <Check className="plan-check" size={17} aria-label="Complete" />
                ) : (
                  <ArrowUpRight className="plan-arrow" size={17} aria-hidden="true" />
                )}
              </Link>
            )
          })}
        </div>
        <div className="plan-note">
          <Zap size={15} aria-hidden="true" />
          <span>
            Need the shortest path? Do Stages 1–3, then 6–7. That covers the highest-point patterns: regex,
            automata, conversions, LL(1) and the QCM.
          </span>
        </div>
      </section>

      <section className="skip-panel reveal">
        <div className="skip-panel-copy">
          <span className="eyebrow">
            <Scissors size={14} aria-hidden="true" /> Cut the noise
          </span>
          <h2>What you can safely skip.</h2>
          <p>
            The lecture slides contain a lot of material with zero points on the assessment. Do not spend the night
            on any of this:
          </p>
          <ul className="skip-list">
            {skipItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="skip-panel-card">
          <Target size={22} aria-hidden="true" />
          <h3>What replaces it</h3>
          <p>
            Four recipes, three conversion algorithms, one LL(1) table and one stack machine. That is the actual
            syllabus.
          </p>
          <Link className="text-link" to="/cheatsheet">
            See the whole course on one page <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="section method-section reveal">
        <div className="section-head">
          <div>
            <span className="eyebrow">How to study</span>
            <h2>Read less. Retrieve more.</h2>
          </div>
          <p>
            Each stage is short by design. The learning happens when you close the page and reproduce the method
            from memory.
          </p>
        </div>
        <div className="method-grid">
          {method.map((item) => (
            <article className="method-card" key={item.step}>
              <span className="method-step">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta reveal">
        <div>
          <span className="eyebrow">The goal</span>
          <h2>You do not need more theory. You need the next correct arrow.</h2>
          <p>
            Start with the vocabulary, copy the recipes, and run the drills. By Stage 7 you will have a method for
            every question on the paper.
          </p>
        </div>
        <div className="cta-actions">
          <Link className="btn btn-accent" to={`/guide/${nextStage.id}`}>
            {count === 0 ? 'Start Stage 1' : `Continue Stage ${nextStage.id}`} <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link className="btn btn-outline" to="/cheatsheet">
            Cheat sheet
          </Link>
        </div>
      </section>
    </>
  )
}
