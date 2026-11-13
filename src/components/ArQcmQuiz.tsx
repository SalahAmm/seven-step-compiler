import { useMemo, useState } from 'react'
import { CircleCheck, RotateCcw, TriangleAlert } from 'lucide-react'
import { arQcm } from '../data/arabic'

export function ArQcmQuiz() {
  const [answers, setAnswers] = useState<(boolean | null)[]>(Array(arQcm.length).fill(null))
  const answered = answers.filter((answer) => answer !== null).length
  const score = useMemo(
    () => answers.reduce((total, answer, index) => total + (answer === arQcm[index].answer ? 1 : 0), 0),
    [answers],
  )

  return (
    <div className="quiz ar-quiz">
      <div className="quiz-head">
        <div>
          <div className="quiz-title">خمس عبارات. صواب أم خطأ؟</div>
          <div className="quiz-sub">الإجابة الخاطئة تخسر نقاطا في الورقة الحقيقية. احسم قبل أن تفتح التفسير.</div>
        </div>
        <div className="quiz-score">
          <span className="quiz-score-number">{score}</span>
          <span className="quiz-score-label">صحيحة<br />من 5</span>
        </div>
      </div>

      <div className="quiz-progress">
        <div className="progress-track" aria-hidden="true">
          <div className="progress-fill" style={{ width: `${(answered / arQcm.length) * 100}%` }} />
        </div>
        <span><bdi dir="ltr">{answered} / {arQcm.length}</bdi> تمت الإجابة</span>
      </div>

      <ol className="quiz-list">
        {arQcm.map((question, index) => {
          const selected = answers[index]
          const isAnswered = selected !== null
          const isCorrect = selected === question.answer
          return (
            <li className="quiz-item" key={question.statement}>
              <div className="quiz-statement">
                <span className="quiz-number">س{index + 1}</span>
                <span>{question.statement}</span>
              </div>
              <div className="quiz-actions">
                <button
                  type="button"
                  className={`quiz-btn${selected === true ? (question.answer ? ' is-correct' : ' is-wrong') : ''}${isAnswered && question.answer ? ' is-answer' : ''}`}
                  aria-pressed={selected === true}
                  onClick={() => setAnswers((current) => current.map((item, i) => (i === index ? true : item)))}
                >
                  صواب
                </button>
                <button
                  type="button"
                  className={`quiz-btn${selected === false ? (!question.answer ? ' is-correct' : ' is-wrong') : ''}${isAnswered && !question.answer ? ' is-answer' : ''}`}
                  aria-pressed={selected === false}
                  onClick={() => setAnswers((current) => current.map((item, i) => (i === index ? false : item)))}
                >
                  خطأ
                </button>
              </div>
              {isAnswered ? (
                <div className={`quiz-feedback ${isCorrect ? 'is-correct' : 'is-wrong'}`} aria-live="polite">
                  {isCorrect ? <CircleCheck size={16} aria-hidden="true" /> : <TriangleAlert size={16} aria-hidden="true" />}
                  <div>
                    <strong>{isCorrect ? 'صحيح.' : `ليست الإجابة الصحيحة — الجواب هو ${question.answer ? 'صواب' : 'خطأ'}.`}</strong>
                    {' '}{question.why}
                  </div>
                </div>
              ) : null}
            </li>
          )
        })}
      </ol>

      <div className="quiz-foot">
        <span>{answered === arQcm.length ? 'أكملت الخمس. راجع قائمة التحقق الآن.' : 'أجب عن عبارة لتظهر لك التفسير مباشرة.'}</span>
        <button type="button" className="btn btn-small btn-ghost" onClick={() => setAnswers(Array(arQcm.length).fill(null))}>
          <RotateCcw size={14} aria-hidden="true" /> إعادة الاختبار
        </button>
      </div>
    </div>
  )
}
