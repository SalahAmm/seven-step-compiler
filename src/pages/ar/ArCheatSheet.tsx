import { Link } from 'react-router-dom'
import { ArrowLeft, BookMarked, ExternalLink } from 'lucide-react'
import { M } from '../../components/Math'
import { BidiText } from '../../components/BidiText'
import { arFormulaGroups } from '../../data/arabic'

export function ArCheatSheet() {
  return (
    <>
      <header className="lesson-head ar-page-head">
        <nav className="breadcrumb" aria-label="مسار التنقل">
          <Link to="/ar">المقرر</Link>
          <span className="sep" aria-hidden="true">/</span>
          <span>ورقة المراجعة</span>
        </nav>
        <div className="stage-kicker">
          <BookMarked size={14} aria-hidden="true" />
          ورقة المراجعة الشاملة
          <span className="stage-kicker-focus">كل الصيغ في مكان واحد</span>
        </div>
        <h1 className="lesson-title">المقرر كله على صفحة واحدة.</h1>
        <p className="lesson-intro">
          الصيغ التي تحتاجها في الامتحان، مرتبة حسب المرحلة. اطبعها أو أبقها مفتوحة على الهاتف أثناء
          المراجعة الأخيرة.
        </p>
        <div className="lesson-meta">
          <span><strong>التغطية</strong> · المراحل <bdi dir="ltr">1–7</bdi></span>
          <span><strong>الصيغ</strong> · {arFormulaGroups.reduce((total, group) => total + group.items.length, 0)}</span>
          <span><strong>الاستعمال</strong> · مراجعة سريعة</span>
        </div>
      </header>

      <article className="lesson-body prose guide-body ar-body">
        <p className="lead-in">
          لا تحفظ كل سطر. احفظ <strong>متى</strong> تستعمل الصيغة، ثم اشتق الباقي. الصيغة بلا سياق
          تصبح ضجيجا في الامتحان.
        </p>

        {arFormulaGroups.map((group) => (
          <section id={group.id} className="ar-cheat-group" key={group.id}>
            <div className="ar-cheat-head">
              <h2>{group.title}</h2>
              <span>{group.items.length} عناصر</span>
            </div>
            <div className="ar-cheat-grid">
              {group.items.map((item) => (
                <article className="ar-formula-card" key={item.label}>
                  <h3>{item.label}</h3>
                  {'tex' in item && item.tex ? (
                    <div className="ar-formula" dir="ltr"><M block>{item.tex}</M></div>
                  ) : (
                    <p><BidiText>{'text' in item ? item.text : ''}</BidiText></p>
                  )}
                </article>
              ))}
            </div>
          </section>
        ))}

        <div className="ar-next-card">
          <div>
            <span className="eyebrow">الخطوة التالية</span>
            <h2>اختبر نفسك تحت ضغط الوقت.</h2>
            <p>غرفة الامتحان تحتوي على خطة الدقائق الستين، اختبار QCM، وقائمة تحقق قبل التسليم.</p>
          </div>
          <div className="ar-next-actions">
            <Link className="btn btn-primary" to="/ar/war-room">
              افتح غرفة الامتحان <ArrowLeft size={16} aria-hidden="true" />
            </Link>
            <a className="btn btn-ghost" href="#/cheatsheet" target="_blank" rel="noreferrer">
              النسخة الإنجليزية <ExternalLink size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </article>
    </>
  )
}
