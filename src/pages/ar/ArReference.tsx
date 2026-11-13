import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, ExternalLink, Languages } from 'lucide-react'
import { arLessonIndex } from '../../data/arabic'

export function ArReference() {
  return (
    <>
      <header className="lesson-head ar-page-head">
        <nav className="breadcrumb" aria-label="مسار التنقل">
          <Link to="/ar">المقرر</Link>
          <span className="sep" aria-hidden="true">/</span>
          <span>الملاحظات الموسّعة</span>
        </nav>
        <div className="stage-kicker">
          <BookOpen size={14} aria-hidden="true" />
          رفّ المراجع
          <span className="stage-kicker-focus">اختياري · بالإنجليزية</span>
        </div>
        <h1 className="lesson-title">الملاحظات الموسّعة.</h1>
        <p className="lesson-intro">
          الدروس التسعة الأصلية بقيت بالإنجليزية لأنها تحتوي المخططات الكاملة والبراهين خطوة بخطوة.
          هذه فهرسة عربية لها، مع بيان المرحلة التي تخدمها.
        </p>
        <div className="lesson-meta">
          <span><strong>الدروس</strong> · 9 ملاحظات</span>
          <span><strong>المستوى</strong> · أعمق من المسار الأساسي</span>
          <span><strong>اللغة</strong> · إنجليزية</span>
        </div>
      </header>

      <article className="lesson-body prose guide-body ar-body">
        <div className="ar-reference-note">
          <Languages size={18} aria-hidden="true" />
          <p>
            المسار العربي يكفي للامتحان. افتح هذه الدروس فقط إذا أردت اشتقاقا كاملا أو مخططا إضافيا.
            كل رابط يفتح صفحة إنجليزية أصلية.
          </p>
        </div>

        <div className="ar-reference-grid">
          {arLessonIndex.map((lesson) => (
            <Link className="ar-reference-card" to={`/lessons/${lesson.id}`} key={lesson.id}>
              <div className="ar-reference-top">
                <span className="ar-reference-num">L{String(lesson.id).padStart(2, '0')}</span>
                <span className="ar-reference-stage">{lesson.stage}</span>
              </div>
              <h3>{lesson.title}</h3>
              <span className="ar-reference-open">
                افتح الدرس <ExternalLink size={13} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>

        <div className="ar-next-card">
          <div>
            <span className="eyebrow">عودة</span>
            <h2>المسار الأساسي أقصر.</h2>
            <p>إذا أردت إنهاء المراجعة بسرعة، ارجع إلى المراحل السبع أو ورقة المراجعة.</p>
          </div>
          <div className="ar-next-actions">
            <Link className="btn btn-primary" to="/ar/stage/1">
              المرحلة 1 <ArrowLeft size={16} aria-hidden="true" />
            </Link>
            <Link className="btn btn-ghost" to="/ar/cheatsheet">ورقة المراجعة</Link>
          </div>
        </div>
      </article>
    </>
  )
}
