import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

type ProgressContextValue = {
  completed: string[]
  isComplete: (key: string) => boolean
  toggle: (key: string) => void
  reset: () => void
  count: number
}

const STORAGE_KEY = 'seven-step-compiler/progress/v3'

const ProgressContext = createContext<ProgressContextValue | null>(null)

function readStored(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((value): value is string => typeof value === 'string')
  } catch {
    return []
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [completed, setCompleted] = useState<string[]>(readStored)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completed))
    } catch {
      // Progress is a convenience; private mode can reject storage writes.
    }
  }, [completed])

  const toggle = useCallback((key: string) => {
    setCompleted((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
    )
  }, [])

  const reset = useCallback(() => setCompleted([]), [])

  const value = useMemo<ProgressContextValue>(
    () => ({
      completed,
      isComplete: (key) => completed.includes(key),
      toggle,
      reset,
      // Only the seven guide stages count toward the study plan. Deep-dive
      // notes can be marked too, but they are optional reference material.
      count: completed.filter((key) => key.startsWith('stage-')).length,
    }),
    [completed, reset, toggle],
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const value = useContext(ProgressContext)
  if (!value) throw new Error('useProgress must be used inside ProgressProvider')
  return value
}
