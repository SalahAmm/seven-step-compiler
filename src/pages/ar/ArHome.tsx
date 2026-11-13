import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowUpLeft,
  Check,
  Languages,
  Scissors,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react'
import { arMethod, arPipeline, arSkip, arStages } from '../../data/arabic'
import { useProgress } from '../../context/ProgressContext'

export function ArHome() {
  const { isComplete, count } = useProgress()
  const nextStage = arStages.find((stage) => !isComplete(`stage-${stage.id}`)) ?? arStages[0]

  return (
    <>
      <section className="ar-hero">
        <div className="ar-hero-copy">
          <div className="hero-kicker">
            <Sparkles size={14} aria-hidden="true" />
            تجميع · السنة الثالثة إعلام آلي · جامعة يحيى فارس – المدية
          </div>
          <h1 className="page-title">انجح في التجميع عبر سبع مراحل.</h1>
          <p className="lede">
            لا تحتاج إلى خلفية مسبقة. دليل عملي مبني على سلاسل التمارين والامتحانات السابقة وحلولها،
            ويركّز فقط على ما تطلبه الورقة فعلا.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to={`/ar/stage/${nextStage.id}`}>
              {count === 0 ? 'ابدأ المرحلة 1' : `واصل المرحلة ${nextStage.id}`}
              <ArrowLeft size={16} aria-hidden="true" />
            </Link>
            <Link className="btn btn-ghost" to="/ar/basics">
              أنا مبتدئ تماما — ابدأ بالأساسيات
            </Link>
          </div>
          <div className="hero-meta">
            <span>7 مراحل، طريقة واحدة</span>
            <span>6 أنماط امتحانية متكررة</span>
            <span>كل الصيغ مرسومة بوضوح</span>
          </div>
        </div>

        <div className="ar-pipeline-card" aria-label="خط أنابيب الترجمة">
          <div className="ar-pipeline-head">
            <span>من النص إلى الكود</span>
            <span className="ar-pipeline-badge">6 مراحل</span>
          </div>
          <ol className="ar-pipeline">
            {arPipeline.map((phase, index) => (
              <li key={phase.en}>
                <span className="ar-pipeline-num">{String(index + 1).padStart(2, '0')}</span>
                <span className="ar-pipeline-copy">
                  <strong>{phase.name}</strong>
                  <small>{phase.en}</small>
                </span>
              </li>
            ))}
          </ol>
          <div className="ar-pipeline-foot">
            <span>المحلل المعجمي يبدأ الرحلة</span>
            <span className="ar-pipeline-arrow" aria-hidden="true">←</span>
            <span>الكود النهائي</span>
          </div>
        </div>
      </section>

      <section className="exam-map reveal">
        <div className="section-head">
          <div>
            <span className="eyebrow">خريطة 80/20</span>
            <h2>الامتحان يعيد ستة أنماط من المسائل.</h2>
          </div>
          <p>
            الأستاذ لا يختبر المقياس كله. يختبر قدرتك على تمييز هذه الأشكال الستة وتطبيق الوصفة
            المناسبة تحت ضغط الوقت.
          </p>
        </div>
        <div className="exam-pattern-grid">
          {arStages.slice(0, 6).map((stage) => (
            <Link className="exam-pattern" to={`/ar/stage/${stage.id}`} key={stage.id}>
              <div className="exam-pattern-top">
                <span className="exam-pattern-num">0{stage.id}</span>
                <span className="exam-pattern-focus">{stage.focus}</span>
              </div>
              <h3>{stage.navLabel}</h3>
              <p>{stage.outcome}</p>
              <span className="exam-pattern-ref">{stage.examRefs[0]}</span>
              <span className="exam-pattern-arrow" aria-hidden="true">
                <ArrowUpLeft size={17} />
              </span>
            </Link>
          ))}
          <Link className="exam-pattern exam-pattern-final" to="/ar/stage/7">
            <div className="exam-pattern-top">
              <span className="exam-pattern-num">07</span>
              <span className="exam-pattern-focus">المرحلة الأخيرة</span>
            </div>
            <h3>PDA + QCM</h3>
            <p>ابنِ آلة المكدس، اقرأ لغتها، وثبّت إجابات الصواب والخطأ الخمس.</p>
            <span className="exam-pattern-ref">الفرض 2 · تمرين 1</span>
            <span className="exam-pattern-arrow" aria-hidden="true">
              <ArrowUpLeft size={17} />
            </span>
          </Link>
        </div>
      </section>

      <section className="section reveal" id="plan">
        <div className="section-head">
          <div>
            <span className="eyebrow">الخطة</span>
            <h2>سبع مراحل، مرسومة.</h2>
          </div>
          <p>
            اتبع الترتيب. كل مرحلة تنتهي بتمرين ونتيجة واضحة: «تستطيع الآن أن تفعل هذا». شريط التقدم
            في القائمة يحفظ ما أكملته.
          </p>
        </div>
        <div className="plan plan-guide">
          {arStages.map((stage) => {
            const done = isComplete(`stage-${stage.id}`)
            return (
              <Link
                className={`plan-row${done ? ' is-done' : ''}${stage.id === nextStage.id ? ' is-next' : ''}`}
                to={`/ar/stage/${stage.id}`}
                key={stage.id}
              >
                <span className="plan-time">المرحلة {stage.id}<small>{stage.focus}</small></span>
                <span className="plan-focus">{stage.navLabel}</span>
                <span className="plan-goal">{stage.outcome}</span>
                {done ? (
                  <Check className="plan-check" size={17} aria-label="مكتملة" />
                ) : (
                  <ArrowUpLeft className="plan-arrow" size={17} aria-hidden="true" />
                )}
              </Link>
            )
          })}
        </div>
        <div className="plan-note">
          <Zap size={15} aria-hidden="true" />
          <span>
            تريد أقصر طريق؟ ادرس المراحل <bdi dir="ltr">1–3</bdi> ثم <bdi dir="ltr">6–7</bdi>. هذا يغطي الأنماط الأعلى نقاطا: التعبيرات
            النمطية، الأتمتات، التحويلات، LL(1) وQCM.
          </span>
        </div>
      </section>

      <section className="skip-panel reveal">
        <div className="skip-panel-copy">
          <span className="eyebrow">
            <Scissors size={14} aria-hidden="true" /> اقطع الضجيج
          </span>
          <h2>ما يمكنك تجاهله بأمان.</h2>
          <p>
            الشرائح تحتوي مواد كثيرة لا تساوي نقطة واحدة في الامتحان. لا تضيّع ليلتك على أي مما يلي:
          </p>
          <ul className="skip-list">
            {arSkip.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div className="skip-panel-card">
          <Target size={22} aria-hidden="true" />
          <h3>ما الذي يعوّضه</h3>
          <p>
            أربع وصفات، ثلاث خوارزميات تحويل، جدول LL(1) واحد، وآلة مكدس واحدة. هذا هو المقرر الحقيقي.
          </p>
          <Link className="text-link" to="/ar/cheatsheet">
            شاهد المقرر كله في صفحة واحدة <ArrowLeft size={15} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="ar-language-note">
        <Languages size={20} aria-hidden="true" />
        <div>
          <strong>هذه طبعة عربية كاملة للمسار الأساسي.</strong>
          <p>
            الملاحظات الموسّعة التسع بقيت بالإنجليزية لأنها تحتوي تفاصيل المخططات والبراهين. يمكنك
            فتح فهرسها العربي في أي وقت.
          </p>
        </div>
        <Link className="btn btn-small btn-ghost" to="/ar/reference">فهرس الملاحظات</Link>
      </section>

      <section className="section method-section reveal">
        <div className="section-head">
          <div>
            <span className="eyebrow">كيف تدرس</span>
            <h2>اقرأ أقل. استرجع أكثر.</h2>
          </div>
          <p>
            كل مرحلة قصيرة عمدا. التعلم يحدث عندما تغلق الصفحة وتعيد إنتاج الطريقة من الذاكرة.
          </p>
        </div>
        <div className="method-grid">
          {arMethod.map((item) => (
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
          <span className="eyebrow">الهدف</span>
          <h2>لا تحتاج إلى مزيد من النظرية. تحتاج إلى السهم الصحيح التالي.</h2>
          <p>
            ابدأ بالمفردات، انسخ الوصفات، وشغّل التمارين. في المرحلة 7 ستملك طريقة لكل سؤال في الورقة.
          </p>
        </div>
        <div className="cta-actions">
          <Link className="btn btn-accent" to={`/ar/stage/${nextStage.id}`}>
            {count === 0 ? 'ابدأ المرحلة 1' : `واصل المرحلة ${nextStage.id}`}
            <ArrowLeft size={16} aria-hidden="true" />
          </Link>
          <Link className="btn btn-outline" to="/ar/cheatsheet">ورقة المراجعة</Link>
        </div>
      </section>
    </>
  )
}
