import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, Cpu, Languages, Layers } from 'lucide-react'
import { arGlossary, arPipeline } from '../../data/arabic'
import { M } from '../../components/Math'

const symbols = [
  ['Σ', 'الأبجدية: مجموعة الرموز المسموحة'],
  ['ε', 'الكلمة الفارغة، طولها صفر'],
  ['∅', 'اللغة الفارغة: لا تحتوي أي كلمة'],
  ['∈', 'ينتمي إلى'],
  ['→', 'قاعدة إنتاج أو انتقال'],
  ['⇒', 'خطوة اشتقاق'],
  ['*', 'صفر أو أكثر (نجم)، أو إغلاق علاقة'],
  ['|', 'أو: بديلان في القاعدة'],
  ['δ', 'دالة الانتقال'],
  ['$', 'علامة نهاية المدخل في LL(1)'],
]

export function ArBasics() {
  return (
    <>
      <header className="lesson-head ar-page-head">
        <nav className="breadcrumb" aria-label="مسار التنقل">
          <Link to="/ar">المقرر</Link>
          <span className="sep" aria-hidden="true">/</span>
          <span>الأساسيات المطلقة</span>
        </nav>
        <div className="stage-kicker">
          <BookOpen size={14} aria-hidden="true" />
          البداية المطلقة
          <span className="stage-kicker-focus">لا تفترض أي خلفية</span>
        </div>
        <h1 className="lesson-title">الأساسيات المطلقة.</h1>
        <p className="lesson-intro">
          إذا لم تفتح كتاب التجميع من قبل، ابدأ هنا. عشر دقائق من المصطلحات تكفي لتفهم بقية الدليل.
          كل مصطلح له مقابل إنجليزي لأن الامتحان قد يستعمله.
        </p>
        <div className="lesson-meta">
          <span><strong>المسار</strong> · قبل المرحلة 1</span>
          <span><strong>المحتوى</strong> · 16 مصطلحا و6 مراحل</span>
          <span><strong>اللغة</strong> · عربية مع المصطلحات الإنجليزية</span>
        </div>
        <div className="toc-card">
          <div className="toc-label">في هذه الصفحة</div>
          <div className="toc-links">
            <button type="button" onClick={() => document.getElementById('what')?.scrollIntoView({ behavior: 'smooth' })}>ما هو المترجم؟</button>
            <button type="button" onClick={() => document.getElementById('pipeline')?.scrollIntoView({ behavior: 'smooth' })}>خط الأنابيب</button>
            <button type="button" onClick={() => document.getElementById('glossary')?.scrollIntoView({ behavior: 'smooth' })}>المصطلحات</button>
            <button type="button" onClick={() => document.getElementById('symbols')?.scrollIntoView({ behavior: 'smooth' })}>الرموز</button>
          </div>
        </div>
      </header>

      <article className="lesson-body prose guide-body ar-body">
        <section id="what" className="ar-section">
          <h2>ما هو المترجم؟</h2>
          <p>
            المترجم (compiler) يقرأ برنامجا كاملا مكتوبا بلغة المصدر، يترجمه إلى لغة هدف أو كود آلة،
            ثم يسلّم الناتج للتشغيل. المفسّر (interpreter) ينفّذ البرنامج سطرا بسطر دون إنتاج ملف تنفيذي
            مسبق.
          </p>
          <div className="ar-compare-grid">
            <article className="ar-compare-card">
              <span className="ar-compare-icon"><Cpu size={18} aria-hidden="true" /></span>
              <h3>Compiler · مترجم</h3>
              <p>يترجم البرنامج كله أولا. الأخطاء تظهر قبل التشغيل. أمثلة: C وC++.</p>
            </article>
            <article className="ar-compare-card">
              <span className="ar-compare-icon"><Layers size={18} aria-hidden="true" /></span>
              <h3>Interpreter · مفسّر</h3>
              <p>ينفّذ سطرا بسطر. الأخطاء تظهر أثناء التشغيل. أمثلة: Python وLisp.</p>
            </article>
          </div>
          <p>
            في الامتحان، السؤال المتكرر هو الفرق بين الواجهة (front-end) والخلفية (back-end):
            الواجهة تفهم البرنامج وتتحقق منه، والخلفية تولّد الكود وتحسّنه.
          </p>
        </section>

        <section id="pipeline" className="ar-section">
          <h2>خط أنابيب الترجمة</h2>
          <p>
            المترجم سلسلة من المحطات. كل محطة تأخذ تمثيلا وتنتج تمثيلا آخر. حفظ الترتيب يعطيك نقاط
            التعريفات في الامتحان.
          </p>
          <ol className="ar-pipeline-list">
            {arPipeline.map((phase, index) => (
              <li key={phase.en}>
                <span className="ar-pipeline-list-num">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <div className="ar-pipeline-list-title">
                    <strong>{phase.name}</strong>
                    <span>{phase.en}</span>
                  </div>
                  <p>{phase.copy}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="ar-note">
            جدول الرموز (symbol table) ومناولة الأخطاء (error handler) يعملان على طول الخط، وليسا
            محطة مستقلة.
          </p>
        </section>

        <section id="glossary" className="ar-section">
          <h2>المصطلحات التي ستراها في كل صفحة</h2>
          <div className="ar-glossary">
            {arGlossary.map((item) => (
              <article className="ar-glossary-card" key={item.en}>
                <div className="ar-glossary-head">
                  <h3>{item.term}</h3>
                  <span>{item.en}</span>
                </div>
                <p>{item.def}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="symbols" className="ar-section">
          <h2>الرموز والقراءة السريعة</h2>
          <p>هذه الرموز تتكرر في كل مرحلة. لا تحتاج إلى حفظها دفعة واحدة؛ ارجع إليها عند الحاجة.</p>
          <div className="table-wrap ar-table-wrap">
            <table className="data-table">
              <thead>
                <tr><th scope="col">الرمز</th><th scope="col">المعنى</th></tr>
              </thead>
              <tbody>
                {symbols.map(([symbol, meaning]) => (
                  <tr key={symbol}>
                    <td className="mono" dir="ltr">{symbol === '∅' ? <M>{'\\varnothing'}</M> : symbol}</td>
                    <td>{meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3>كيف تقرأ الصيغ</h3>
          <p>
            القاعدة <M>{'A \\to aB \\mid a'}</M> تعني: المتغير A يمكن أن يُستبدل بـ aB أو بـ a.
            العلامة <M>{'\\mid'}</M> تعني «أو». والانتقال <M>{'\\delta(q,a)=q\\prime'}</M> يعني:
            من الحالة q، عند قراءة a، انتقل إلى q′.
          </p>
          <p>
            الجدول <M>{'M[A,a]'}</M> يعني: الخلية عند السطر A والعمود a. وإذا كانت فارغة، فلا توجد
            قاعدة مناسبة.
          </p>
        </section>

        <section id="next" className="ar-section">
          <div className="ar-next-card">
            <div>
              <span className="eyebrow">جاهز؟</span>
              <h2>انتقل إلى المرحلة 1.</h2>
              <p>نبدأ بالأبجدية والكلمات واللغات، ثم نصل إلى التعبيرات النمطية وgrep.</p>
            </div>
            <div className="ar-next-actions">
              <Link className="btn btn-primary" to="/ar/stage/1">
                ابدأ المرحلة 1 <ArrowLeft size={16} aria-hidden="true" />
              </Link>
              <Link className="btn btn-ghost" to="/ar/cheatsheet">ورقة المراجعة</Link>
            </div>
          </div>
        </section>
      </article>

      <div className="ar-page-foot">
        <Languages size={16} aria-hidden="true" />
        <span>كل صفحة عربية تحتوي على مصطلحات إنجليزية بين قوسين. استعملها في الامتحان.</span>
      </div>
    </>
  )
}
