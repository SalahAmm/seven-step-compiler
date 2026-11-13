import { useMemo, useState } from 'react'
import { CircleCheck, RotateCcw, TriangleAlert } from 'lucide-react'

type Question = {
  statement: string
  answer: boolean
  why: string
}

const questions: Question[] = [
  {
    statement: 'LL grammars are not ambiguous.',
    answer: true,
    why: 'Every LL grammar is guaranteed unambiguous: a leftmost derivation is forced at every step.',
  },
  {
    statement: 'For every context-free language, there exists a PDA that recognizes it.',
    answer: true,
    why: 'Non-deterministic pushdown automata recognize exactly the context-free languages.',
  },
  {
    statement: 'Left-recursive CFGs are ambiguous.',
    answer: false,
    why: 'A → Aa | a is left-recursive yet generates a⁺ with a single parse tree per word. Left recursion breaks LL(1), not unambiguity.',
  },
  {
    statement: 'Every grammar that is non-left-recursive and left-factored is LL.',
    answer: false,
    why: 'FIRST–FOLLOW conflicts can survive both transformations. Example: S → Aa, A → a | ε has a conflict on a.',
  },
  {
    statement: 'Ambiguous grammars are not LL.',
    answer: true,
    why: 'LL implies unambiguous, so its contrapositive holds: ambiguous implies not LL.',
  },
]

export function QcmQuiz() {
  const [answers, setAnswers] = useState<(boolean | null)[]>(Array(questions.length).fill(null))

  const answered = answers.filter((answer) => answer !== null).length
  const score = useMemo(
    () => answers.reduce((total, answer, index) => total + (answer === questions[index].answer ? 1 : 0), 0),
    [answers],
  )

  const answerQuestion = (index: number, value: boolean) => {
    setAnswers((current) => current.map((item, itemIndex) => (itemIndex === index ? value : item)))
  }

  const reset = () => setAnswers(Array(questions.length).fill(null))

  return (
    <div className="quiz">
      <div className="quiz-head">
        <div>
          <div className="quiz-title">Five statements. Vrai or Faux.</div>
          <div className="quiz-sub">Wrong answers lose points on the real sheet. Commit before you reveal the explanation.</div>
        </div>
        <div className="quiz-score">
          <span className="quiz-score-number">{score}</span>
          <span className="quiz-score-label">correct<br />of 5</span>
        </div>
      </div>

      <div className="quiz-progress">
        <div className="progress-track" aria-hidden="true">
          <div className="progress-fill" style={{ width: `${(answered / questions.length) * 100}%` }} />
        </div>
        <span>{answered} / {questions.length} answered</span>
      </div>

      <ol className="quiz-list">
        {questions.map((question, index) => {
          const selected = answers[index]
          const isAnswered = selected !== null
          const isCorrect = selected === question.answer
          return (
            <li className="quiz-item" key={question.statement}>
              <div className="quiz-statement">
                <span className="quiz-number">Q{index + 1}</span>
                <span>{question.statement}</span>
              </div>
              <div className="quiz-actions">
                <button
                  type="button"
                  className={`quiz-btn${selected === true ? (question.answer ? ' is-correct' : ' is-wrong') : ''}${isAnswered && question.answer ? ' is-answer' : ''}`}
                  aria-pressed={selected === true}
                  onClick={() => answerQuestion(index, true)}
                >
                  Vrai <span>True</span>
                </button>
                <button
                  type="button"
                  className={`quiz-btn${selected === false ? (!question.answer ? ' is-correct' : ' is-wrong') : ''}${isAnswered && !question.answer ? ' is-answer' : ''}`}
                  aria-pressed={selected === false}
                  onClick={() => answerQuestion(index, false)}
                >
                  Faux <span>False</span>
                </button>
              </div>
              {isAnswered ? (
                <div className={`quiz-feedback ${isCorrect ? 'is-correct' : 'is-wrong'}`} aria-live="polite">
                  {isCorrect ? <CircleCheck size={16} aria-hidden="true" /> : <TriangleAlert size={16} aria-hidden="true" />}
                  <div>
                    <strong>{isCorrect ? 'Correct.' : `Not quite — the answer is ${question.answer ? 'Vrai' : 'Faux'}.`}</strong>
                    {' '}{question.why}
                  </div>
                </div>
              ) : null}
            </li>
          )
        })}
      </ol>

      <div className="quiz-foot">
        <span>{answered === questions.length ? 'All five answered. Check the war-room checklist next.' : 'Answer one to see the explanation immediately.'}</span>
        <button type="button" className="btn btn-small btn-ghost" onClick={reset}>
          <RotateCcw size={14} aria-hidden="true" /> Reset quiz
        </button>
      </div>
    </div>
  )
}
