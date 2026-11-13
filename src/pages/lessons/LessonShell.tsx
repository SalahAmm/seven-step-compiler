import type { ReactNode } from 'react'
import { getLesson } from '../../data/course'
import { LessonFooter, LessonHeader } from '../../components/ui'

export function LessonShell({ id, children }: { id: number; children: ReactNode }) {
  const lesson = getLesson(id)
  if (!lesson) return null

  return (
    <>
      <LessonHeader lesson={lesson} />
      <article className="lesson-body prose">{children}</article>
      <LessonFooter lesson={lesson} />
    </>
  )
}
