import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Pause, Play, RotateCcw, StepForward } from 'lucide-react'
import { Automaton, autoEdgeId } from './Automaton'
import type { AutoEdge, AutoState } from './Automaton'
import {
  decimal3Edges,
  decimal3States,
  decimal3Transitions,
  mod3Edges,
  mod3States,
  mod3Transitions,
  no110Edges,
  no110States,
  no110Transitions,
} from '../data/automata'

/* ------------------------------------------------------------------ */
/* Hero machine                                                        */
/* ------------------------------------------------------------------ */
export function HeroMachine() {
  const [current, setCurrent] = useState('0')
  const [letters, setLetters] = useState<string[]>([])
  const [lastEdge, setLastEdge] = useState<string | undefined>()
  const accepted = current === '0'
  const wordShown = letters.length === 0 ? 'ε' : letters.join('')

  const press = (letter: 'a' | 'b' | 'c') => {
    const next = mod3Transitions[current][letter]
    setCurrent(next)
    setLetters((value) => [...value, letter])
    setLastEdge(`${current}->${next}:${letter}`)
  }

  const reset = () => {
    setCurrent('0')
    setLetters([])
    setLastEdge(undefined)
  }

  return (
    <div className="hero-board">
      <div className="board">
        <div className="board-head">
          <div>
            <div className="board-kicker">DFA · MOD 3 COUNTER</div>
            <div className="board-title">Words where #a ≡ 0 (mod 3)</div>
          </div>
          <div className={`board-status${accepted ? ' is-accept' : ''}`} aria-live="polite">
            {accepted ? 'accepted' : 'not accepted'}
          </div>
        </div>
        <div className="board-body">
          <Automaton
            states={mod3States}
            edges={mod3Edges}
            width={620}
            height={356}
            activeState={current}
            activeEdge={lastEdge}
            ariaLabel="A three-state DFA counting the number of a letters modulo three. State 0 is both the start and accepting state."
          />
        </div>
        <div className="hero-trace" aria-live="polite">
          <span className="hero-trace-label">word</span>
          <span className="hero-trace-word">{wordShown}</span>
          <span className="hero-trace-label">state</span>
          <span className="hero-trace-state">{current}</span>
          {letters.length > 0 ? (
            <button type="button" className="hero-trace-reset" onClick={reset}>clear</button>
          ) : null}
        </div>
        <div className="board-foot">
          <p className="board-hint">Press a letter. Follow the arrow. Start in 0.</p>
          <div className="board-controls" aria-label="Read a letter">
            {(['a', 'b', 'c'] as const).map((letter) => (
              <button
                key={letter}
                type="button"
                className="key-btn"
                onClick={() => press(letter)}
                aria-label={`Read letter ${letter}`}
              >
                {letter}
              </button>
            ))}
            <button type="button" className="key-btn reset" onClick={reset}>
              reset
            </button>
          </div>
        </div>
      </div>
      <div className="hero-caption">
        <span><strong>A counter, not a lookup table.</strong></span>
        <span>a advances; b and c loop.</span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Configurable DFA runner                                             */
/* ------------------------------------------------------------------ */
type RunnerConfig = {
  key: 'mod3' | 'no110' | 'decimal3'
  title: string
  subtitle: string
  alphabet: string
  alphabetLabel: string
  placeholder: string
  helper: string
  states: AutoState[]
  edges: AutoEdge[]
  transitions: Record<string, Record<string, string>>
  start: string
  accepting: string[]
  radius?: number
  width?: number
  height?: number
  formatState?: (id: string) => string
}

const configs: Record<RunnerConfig['key'], RunnerConfig> = {
  mod3: {
    key: 'mod3',
    title: 'See the mod-3 counter run.',
    subtitle: 'a advances the remainder; b and c stand still.',
    alphabet: 'abc',
    alphabetLabel: 'a, b, c',
    placeholder: 'aabac',
    helper: 'Every b or c loops on the current state.',
    states: mod3States,
    edges: mod3Edges,
    transitions: mod3Transitions,
    start: '0',
    accepting: ['0'],
    width: 620,
    height: 356,
    formatState: (id) => `remainder ${id}`,
  },
  no110: {
    key: 'no110',
    title: 'Test the “no 110” machine.',
    subtitle: 'The moment 110 appears, every path falls into the dead state.',
    alphabet: '01',
    alphabetLabel: '0, 1',
    placeholder: '01101',
    helper: 'Try 110 to see the dead state take over.',
    states: no110States,
    edges: no110Edges,
    transitions: no110Transitions,
    start: '0',
    accepting: ['0', '1', '2'],
    radius: 26,
    width: 680,
    height: 402,
    formatState: (id) => (id === '3' ? 'dead' : `progress ${id}`),
  },
  decimal3: {
    key: 'decimal3',
    title: 'Test a decimal number.',
    subtitle: 'The state is the remainder of the number mod 3.',
    alphabet: '0123456789',
    alphabetLabel: 'digits 0–9',
    placeholder: '2025',
    helper: 'Digits 0, 3, 6, 9 add nothing; +1 and +2 edges come from 10 ≡ 1 (mod 3).',
    states: decimal3States,
    edges: decimal3Edges,
    transitions: decimal3Transitions,
    start: '0',
    accepting: ['0'],
    width: 620,
    height: 356,
    formatState: (id) => `remainder ${id}`,
  },
}

type DfaRunnerProps = {
  preset: RunnerConfig['key']
  caption?: ReactNode
}

export function DfaRunner({ preset, caption }: DfaRunnerProps) {
  const config = configs[preset]
  const [word, setWord] = useState('')
  const [position, setPosition] = useState(0)
  const [running, setRunning] = useState(false)
  const [started, setStarted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const chars = [...word]
  const invalid = chars.some((char) => !config.alphabet.includes(char))
  const finished = started && position >= chars.length && !invalid
  const current = useMemo(() => {
    let state = config.start
    for (let index = 0; index < Math.min(position, chars.length); index += 1) {
      const next = config.transitions[state]?.[chars[index]]
      if (!next) break
      state = next
    }
    return state
  }, [chars, config, position])

  const path = useMemo(() => {
    const states = [config.start]
    let state = config.start
    for (const char of chars) {
      const next = config.transitions[state]?.[char]
      if (!next) break
      state = next
      states.push(state)
    }
    return states
  }, [chars, config])

  const lastEdge = useMemo(() => {
    if (!started || position === 0) return undefined
    const from = path[position - 1]
    const to = path[position]
    if (!from || !to) return undefined
    return `${from}->${to}:${chars[position - 1]}`
  }, [chars, path, position, started])

  const finishedAccepted = finished && config.accepting.includes(current)

  useEffect(() => {
    if (!running) return
    if (position >= chars.length) {
      setRunning(false)
      return
    }
    const timer = window.setTimeout(() => {
      setPosition((value) => Math.min(value + 1, chars.length))
    }, 560)
    return () => window.clearTimeout(timer)
  }, [running, position, chars.length])

  useEffect(() => {
    if (position >= chars.length) setRunning(false)
  }, [position, chars.length])

  const changeWord = (value: string) => {
    setWord(value.toLowerCase())
    setPosition(0)
    setRunning(false)
    setStarted(false)
  }

  const step = () => {
    if (invalid) return
    setStarted(true)
    setPosition((value) => Math.min(value + 1, chars.length))
  }

  const run = () => {
    if (invalid) return
    if (position >= chars.length) {
      setPosition(0)
      setStarted(true)
      setRunning(true)
      return
    }
    setStarted(true)
    setRunning((value) => !value)
  }

  const reset = () => {
    setPosition(0)
    setStarted(false)
    setRunning(false)
    inputRef.current?.focus()
  }

  const status = finished
    ? finishedAccepted ? 'accepted' : 'rejected'
    : started
      ? config.formatState ? config.formatState(current) : `state ${current}`
      : 'ready'

  return (
    <figure className={`fig machine-figure${finished ? ' is-finished' : ''}`}>
      <div className="fig-board">
        <div className="fig-board-head">
          <div>
            <div className="fig-board-title">{config.title}</div>
            <div className="machine-subtitle">{config.subtitle}</div>
          </div>
          <div
            className={`board-status${finished ? (finishedAccepted ? ' is-accept' : ' is-reject') : ''}`}
            aria-live="polite"
          >
            {status}
          </div>
        </div>

        <div className="fig-board-body">
          <Automaton
            states={config.states}
            edges={config.edges}
            width={config.width ?? 620}
            height={config.height ?? 356}
            radius={config.radius}
            activeState={current}
            activeEdge={lastEdge}
            acceptingIds={config.accepting}
            ariaLabel={`${config.title} ${config.subtitle}`}
          />
        </div>

        <div className="runner">
          <div className="runner-input-row">
            <label className="runner-label" htmlFor={`word-${config.key}`}>
              Test word
            </label>
            <input
              ref={inputRef}
              id={`word-${config.key}`}
              className={`runner-input${invalid ? ' is-invalid' : ''}`}
              value={word}
              onChange={(event) => changeWord(event.target.value)}
              placeholder={config.placeholder}
              maxLength={16}
              spellCheck={false}
              autoComplete="off"
              aria-describedby={`word-help-${config.key}`}
              aria-invalid={invalid}
            />
            <span className="runner-alphabet">{config.alphabetLabel}</span>
          </div>
          <p className={`runner-help${invalid ? ' is-invalid' : ''}`} id={`word-help-${config.key}`}>
            {invalid ? `Only ${config.alphabetLabel} allowed.` : config.helper}
          </p>

          <div className="runner-controls">
            <button type="button" className="board-btn" onClick={step} disabled={invalid || finished} aria-label="Read one symbol">
              <StepForward size={14} aria-hidden="true" /> Step
            </button>
            <button type="button" className="board-btn is-primary" onClick={run} disabled={invalid}>
              {running ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
              {running ? 'Pause' : finished ? 'Run again' : 'Run'}
            </button>
            <button type="button" className="board-btn is-ghost" onClick={reset} aria-label="Reset the machine">
              <RotateCcw size={14} aria-hidden="true" /> Reset
            </button>
            <span className="runner-count">
              {Math.min(position, chars.length)} / {chars.length} read
            </span>
          </div>

          <div className="runner-path" aria-live="polite">
            <span className="runner-path-label">path</span>
            <span className="runner-path-item start">{config.start}</span>
            {path.slice(1).map((state, index) => (
              <span className="runner-path-step" key={`${state}-${index}`}>
                <span className="runner-path-char">{chars[index]}</span>
                <span className="runner-path-arrow" aria-hidden="true">→</span>
                <span className={`runner-path-item${index + 1 === position ? ' current' : ''}`}>{state}</span>
              </span>
            ))}
            {chars.length === 0 ? <span className="runner-path-empty">ε — the empty word</span> : null}
          </div>
        </div>
      </div>
      {caption ? <figcaption className="fig-caption">{caption}</figcaption> : null}
    </figure>
  )
}

/* keep this helper exported for other diagram consumers */
export const dfaEdgeId = (edge: AutoEdge) => autoEdgeId(edge)
