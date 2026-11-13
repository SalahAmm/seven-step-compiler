import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  CircleCheck,
  Printer,
  ShieldCheck,
  Timer,
} from 'lucide-react'
import { ArQcmQuiz } from '../../components/ArQcmQuiz'
import { Callout } from '../../components/ui'
import { useProgress } from '../../context/ProgressContext'
import { arChecks, arExamPlan } from '../../data/arabic'

const definitions = [
  {
    term: 'Compiler · مترجم',
    copy: 'يترجم البرنامج كله إلى لغة هدف قبل التشغيل. يكتشف الأخطاء قبل التنفيذ.',
  },
  {
    term: 'Interpreter · مفسّر',
    copy: 'ينفّذ البرنامج سطرا بسطر أثناء التشغيل. الأخطاء تظهر في وقت التنفيذ.',
  },
  {
    term: 'Front-end · الواجهة',
    copy: 'التحليل المعجمي والنحوي والدلالي، وإنتاج التمثيل الوسيط. تفهم البرنامج.',
  },
  {
    term: 'Back-end · الخلفية',
    copy: 'التحسين وتوليد الكود وتخصيص السجلات. تنتج البرنامج الهدف.',
  },
  {
    term: 'AST · الشجرة المجردة',
    copy: 'تمثيل هيكلي للبرنامج يحذف التفاصيل غير الضرورية مثل الأقواس والفاصلات.',
  },
]

export function ArWarRoom() {
  const { count } = useProgress()
  const [checked, setChecked] = useState<number[]>([])

  const toggleCheck = (index: number) => {
    setChecked((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index])
  }

  const allChecked = checked.length === arChecks.length

  return (
    <>
      <header className="lesson-head ar-page-head">
        <nav className="breadcrumb" aria-label="مسار التنقل">
          <Link to="/ar">المقرر</Link>
          <span className="sep" aria-hidden="true">/</span>
          <span>غرفة الامتحان</span>
        </nav>
        <div className="stage-kicker">
          <ShieldCheck size={14} aria-hidden="true" />
          المرحلة النهائية · QCM والتعريفات والتمارين
          <span className="stage-kicker-focus">لا نظرية جديدة</span>
        </div>
        <h1 className="lesson-title">غرفة الامتحان.</h1>
        <p className="lesson-intro">
          خمس عبارات صواب/خطأ، خط أنابيب واحد، خطة دقائق، وقائمة تحقق تمنع الأخطاء التي تحذّر منها
          التصحيحات. راجعها قبل الورقة.
        </p>
        <div className="hero-actions ar-page-actions">
          <button type="button" className="btn btn-primary" onClick={() => window.print()}>
            <Printer size={15} aria-hidden="true" /> اطبع غرفة الامتحان
          </button>
          <Link className="btn btn-ghost" to="/ar/cheatsheet">أعد فتح ورقة المراجعة</Link>
        </div>
      </header>

      <div className="war-readiness ar-readiness">
        <div className="war-readiness-head">
          <span>جاهزيتك</span>
          <span className="war-readiness-value" dir="ltr">{count} / 7</span>
        </div>
        <div className="progress-track" aria-hidden="true">
          <div className="progress-fill" style={{ width: `${(count / 7) * 100}%` }} />
        </div>
        <p>{count === 7 ? 'أكملت المراحل السبع. راجع القائمة ثم نم مبكرا.' : 'كل مرحلة تكملها ترفع هذا الشريط. لا تقفز إلى الامتحان قبل المراجعة.'}</p>
      </div>

      <section className="war-section" id="plan">
        <h2><Timer size={18} aria-hidden="true" /> خطة الدقائق الستين</h2>
        <p className="war-intro">هذه خطة قاعة الامتحان فقط، وليست جدولا للدراسة اليومية.</p>
        <div className="ar-exam-plan">
          {arExamPlan.map((block) => (
            <div className="ar-exam-row" key={block.time}>
              <span className="ar-exam-time" dir="ltr">{block.time}</span>
              <span className="ar-exam-label">{block.label}</span>
              <span className="ar-exam-note">{block.note}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="war-section" id="qcm">
        <h2>خمس عبارات، بلا تردد</h2>
        <p className="war-intro">
          هذه فخاخ QCM نفسها من الفرض الثاني. الإجابة الخاطئة تخسر نقاطا، لذا احسم قبل أن تفتح
          التفسير. تذكّر: LL يستلزم عدم الغموض، والعكس غير صحيح.
        </p>
        <ArQcmQuiz />
        <Callout variant="key" title="المنطق خلف الخمس">
          <p>
            تعلّم الاتجاهات لا الجمل. <strong>LL ⇒ غير غامضة</strong>، إذن <strong>غامضة ⇒ ليست LL</strong>.
            والاستدعاء الأيسر لا يعني الغموض، وعدم الاستدعاء لا يضمن LL(1).
          </p>
        </Callout>
      </section>

      <section className="war-section" id="definitions">
        <h2>خمسة تعريفات تكفي</h2>
        <div className="ar-definition-grid">
          {definitions.map((item) => (
            <article className="ar-definition-card" key={item.term}>
              <h3>{item.term}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="war-section" id="checklist">
        <h2>قائمة التحقق قبل التسليم</h2>
        <p className="war-intro">ضع علامة فقط بعد فحص ورقة الإجابة الفعلية، لا بعد تذكّر أنك تعرف القاعدة.</p>
        <div className="ar-checklist-head">
          <span>الفحوص الخمسة</span>
          <span className={`checklist-badge${allChecked ? ' is-complete' : ''}`}>
            {allChecked ? <CircleCheck size={14} aria-hidden="true" /> : null}
            {allChecked ? 'جاهز' : 'قيد المراجعة'}
          </span>
        </div>
        <div className="progress-track checklist-track" aria-hidden="true">
          <div className="progress-fill" style={{ width: `${(checked.length / arChecks.length) * 100}%` }} />
        </div>
        <ul className="ar-checklist">
          {arChecks.map((check, index) => {
            const isChecked = checked.includes(index)
            return (
              <li key={check}>
                <button
                  type="button"
                  className={`ar-check-item${isChecked ? ' is-checked' : ''}`}
                  aria-pressed={isChecked}
                  onClick={() => toggleCheck(index)}
                >
                  <span className="checklist-box" aria-hidden="true">
                    {isChecked ? <Check size={14} strokeWidth={2.6} /> : null}
                  </span>
                  <span>{check}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="cta ar-war-cta">
        <div>
          <span className="eyebrow">النهاية</span>
          <h2>أغلقت الدفتر؟ راجع الورقة مرة واحدة بهدوء.</h2>
          <p>افحص سهم البداية، الخلايا الفارغة، وFOLLOW(S). ثم سلّم.</p>
        </div>
        <div className="cta-actions">
          <Link className="btn btn-accent" to="/ar/cheatsheet">
            ورقة المراجعة <ArrowLeft size={16} aria-hidden="true" />
          </Link>
          <Link className="btn btn-outline" to="/ar/stage/1">أعد من المرحلة 1</Link>
        </div>
      </section>
    </>
  )
}
