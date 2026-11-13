import { useEffect, useMemo, useState } from 'react'
import { Pause, Play, RotateCcw, StepForward } from 'lucide-react'
import { M } from './Math'

type PdaKind = 'anbn' | 'anbm' | 'nested'

type PdaStep = {
  state: string
  stack: string[]
  index: number
  action: string
  delta: string
}

type Language = {
  key: PdaKind
  name: string
  formula: string
  description: string
  states: string[]
}

const languages: Language[] = [
  {
    key: 'anbn',
    name: 'Equal counts',
    formula: '\\{ a^n b^n \\mid n \\ge 0 \\}',
    description: 'Push one A for every a; pop one A for every b. If the stack returns to #, accept.',
    states: ['q0', 'q1', 'qf'],
  },
  {
    key: 'anbm',
    name: 'At least as many a’s',
    formula: '\\{ a^n b^m \\mid n \\ge m \\ge 0 \\}',
    description: 'Read all a’s, pop for each b, then throw away any leftover A’s with free ε-moves.',
    states: ['q0', 'q1', 'qf'],
  },
  {
    key: 'nested',
    name: 'Nested counts',
    formula: '\\{ a^n b^m c\\, d^m e^n \\mid n,m \\ge 0 \\}',
    description: 'The stack has two layers: A’s wrap around the outside, B’s around the inside.',
    states: ['q0', 'q1', 'q2', 'q3', 'q4'],
  },
]

function buildSteps(kind: PdaKind, n: number, m: number): { word: string; steps: PdaStep[] } {
  if (kind === 'anbn') {
    const word = 'a'.repeat(n) + 'b'.repeat(n)
    let stack = ['#']
    let index = 0
    let state = 'q0'
    const steps: PdaStep[] = [
      { state, stack: [...stack], index, action: 'Start at q0 with only the bottom marker #.', delta: 'Initial configuration' },
    ]
    for (let i = 0; i < n; i += 1) {
      stack = [...stack, 'A']
      index += 1
      steps.push({
        state,
        stack: [...stack],
        index,
        action: 'Read a — push a plate A.',
        delta: 'δ(q0, a, ε) = {⟨q0, A⟩}',
      })
    }
    state = 'q1'
    steps.push({
      state,
      stack: [...stack],
      index,
      action: 'Switch phase for free. The input pointer does not move.',
      delta: 'δ(q0, ε, ε) = {⟨q1, ε⟩}',
    })
    for (let i = 0; i < n; i += 1) {
      stack = stack.slice(0, -1)
      index += 1
      steps.push({
        state,
        stack: [...stack],
        index,
        action: 'Read b — pop the top A.',
        delta: 'δ(q1, b, A) = {⟨q1, ε⟩}',
      })
    }
    state = 'qf'
    steps.push({
      state,
      stack: [...stack],
      index,
      action: 'Only # is left. Accept.',
      delta: 'δ(q1, ε, #) = {⟨qf, ε⟩}',
    })
    return { word, steps }
  }

  if (kind === 'anbm') {
    const safeM = Math.min(m, n)
    const word = 'a'.repeat(n) + 'b'.repeat(safeM)
    let stack = ['#']
    let index = 0
    let state = 'q0'
    const steps: PdaStep[] = [
      { state, stack: [...stack], index, action: 'Start at q0 with only the bottom marker #.', delta: 'Initial configuration' },
    ]
    for (let i = 0; i < n; i += 1) {
      stack = [...stack, 'A']
      index += 1
      steps.push({
        state,
        stack: [...stack],
        index,
        action: 'Read a — push a plate A.',
        delta: 'δ(q0, a, ε) = {⟨q0, A⟩}',
      })
    }
    state = 'q1'
    steps.push({
      state,
      stack: [...stack],
      index,
      action: 'Switch phase for free.',
      delta: 'δ(q0, ε, ε) = {⟨q1, ε⟩}',
    })
    for (let i = 0; i < safeM; i += 1) {
      stack = stack.slice(0, -1)
      index += 1
      steps.push({
        state,
        stack: [...stack],
        index,
        action: 'Read b — pop one A.',
        delta: 'δ(q1, b, A) = {⟨q1, ε⟩}',
      })
    }
    while (stack[stack.length - 1] === 'A') {
      stack = stack.slice(0, -1)
      steps.push({
        state,
        stack: [...stack],
        index,
        action: 'Free pop — discard one leftover A. No input is read.',
        delta: 'δ(q1, ε, A) = {⟨q1, ε⟩}',
      })
    }
    state = 'qf'
    steps.push({
      state,
      stack: [...stack],
      index,
      action: 'Only # is left. Accept.',
      delta: 'δ(q1, ε, #) = {⟨qf, ε⟩}',
    })
    return { word, steps }
  }

  const word = 'a'.repeat(n) + 'b'.repeat(m) + 'c' + 'd'.repeat(m) + 'e'.repeat(n)
  let stack = ['#']
  let index = 0
  let state = 'q0'
  const steps: PdaStep[] = [
    { state, stack: [...stack], index, action: 'Start at q0 with only the bottom marker #.', delta: 'Initial configuration' },
  ]
  for (let i = 0; i < n; i += 1) {
    stack = [...stack, 'A']
    index += 1
    steps.push({
      state,
      stack: [...stack],
      index,
      action: 'Read a — push A on the outside layer.',
      delta: 'δ(q0, a, ε) = {⟨q0, A⟩}',
    })
  }
  state = 'q1'
  steps.push({
    state,
    stack: [...stack],
    index,
    action: 'Switch to the inner phase for free.',
    delta: 'δ(q0, ε, ε) = {⟨q1, ε⟩}',
  })
  for (let i = 0; i < m; i += 1) {
    stack = [...stack, 'B']
    index += 1
    steps.push({
      state,
      stack: [...stack],
      index,
      action: 'Read b — push B on the inside layer.',
      delta: 'δ(q1, b, ε) = {⟨q1, B⟩}',
    })
  }
  index += 1
  state = 'q2'
  steps.push({
    state,
    stack: [...stack],
    index,
    action: 'Read the centre c and change state. Nothing is pushed or popped.',
    delta: 'δ(q1, c, ε) = {⟨q2, ε⟩}',
  })
  for (let i = 0; i < m; i += 1) {
    stack = stack.slice(0, -1)
    index += 1
    steps.push({
      state,
      stack: [...stack],
      index,
      action: 'Read d — pop the inner plate B.',
      delta: 'δ(q2, d, B) = {⟨q2, ε⟩}',
    })
  }
  state = 'q3'
  steps.push({
    state,
    stack: [...stack],
    index,
    action: 'Switch back to the outer phase for free.',
    delta: 'δ(q2, ε, ε) = {⟨q3, ε⟩}',
  })
  for (let i = 0; i < n; i += 1) {
    stack = stack.slice(0, -1)
    index += 1
    steps.push({
      state,
      stack: [...stack],
      index,
      action: 'Read e — pop the outer plate A.',
      delta: 'δ(q3, e, A) = {⟨q3, ε⟩}',
    })
  }
  state = 'q4'
  steps.push({
    state,
    stack: [...stack],
    index,
    action: 'Only # is left. Accept.',
    delta: 'δ(q3, ε, #) = {⟨q4, ε⟩}',
  })
  return { word, steps }
}

export function PdaLab() {
  const [kind, setKind] = useState<PdaKind>('anbn')
  const [n, setN] = useState(2)
  const [m, setM] = useState(1)
  const [step, setStep] = useState(0)
  const [running, setRunning] = useState(false)

  const language = languages.find((item) => item.key === kind) ?? languages[0]
  const safeM = kind === 'anbm' ? Math.min(m, n) : m
  const { word, steps } = useMemo(() => buildSteps(kind, n, safeM), [kind, n, safeM])
  const current = steps[Math.min(step, steps.length - 1)]
  const finished = step >= steps.length - 1

  useEffect(() => {
    if (!running) return
    if (step >= steps.length - 1) {
      setRunning(false)
      return
    }
    const timer = window.setTimeout(() => setStep((value) => Math.min(value + 1, steps.length - 1)), 720)
    return () => window.clearTimeout(timer)
  }, [running, step, steps.length])

  const resetSim = () => {
    setStep(0)
    setRunning(false)
  }

  const changeKind = (next: PdaKind) => {
    setKind(next)
    resetSim()
  }

  const changeN = (value: number) => {
    setN(value)
    if (kind === 'anbm' && m > value) setM(value)
    resetSim()
  }

  const changeM = (value: number) => {
    setM(value)
    resetSim()
  }

  return (
    <div className="pda-lab">
      <div className="segmented pda-tabs" role="tablist" aria-label="PDA languages">
        {languages.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={kind === item.key}
            className={kind === item.key ? 'is-active' : ''}
            onClick={() => changeKind(item.key)}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="pda-head">
        <div>
          <div className="pda-language-name">{language.description}</div>
          <div className="pda-formula"><M>{language.formula}</M></div>
        </div>
        <div className="pda-ranges">
          <label className="pda-range">
            <span>a’s <strong>{n}</strong></span>
            <input
              type="range"
              min={0}
              max={4}
              value={n}
              onChange={(event) => changeN(Number(event.target.value))}
              aria-label="Number of a letters"
            />
          </label>
          {kind !== 'anbn' ? (
            <label className="pda-range">
              <span>{kind === 'anbm' ? 'b’s' : 'inner pairs'} <strong>{kind === 'anbm' ? safeM : m}</strong></span>
              <input
                type="range"
                min={0}
                max={kind === 'anbm' ? n : 4}
                value={kind === 'anbm' ? safeM : m}
                onChange={(event) => changeM(Number(event.target.value))}
                aria-label={kind === 'anbm' ? 'Number of b letters' : 'Number of inner c-d pairs'}
              />
            </label>
          ) : null}
        </div>
      </div>

      <div className="pda-word-row">
        <span className="pda-word-label">input</span>
        <div className="pda-word">
          {word.length === 0 ? <span className="pda-empty">ε</span> : [...word].map((char, index) => (
            <span
              className={`pda-letter${index < current.index ? ' is-read' : ''}${index === current.index ? ' is-current' : ''}`}
              key={`${char}-${index}`}
            >
              {char}
            </span>
          ))}
          <span className={`pda-letter is-dollar${current.index >= word.length ? ' is-current' : ''}`}>$</span>
        </div>
        <span className="pda-stepcount">step {step} / {steps.length - 1}</span>
      </div>

      <div className="pda-state-strip" aria-label={`Current state ${current.state}`}>
        {language.states.map((state, index) => (
          <span className="pda-state-wrap" key={state}>
            {index > 0 ? <span className="pda-state-arrow" aria-hidden="true">→</span> : null}
            <span className={`pda-state${current.state === state ? ' is-active' : ''}`}>{state}</span>
          </span>
        ))}
      </div>

      <div className="pda-stage">
        <div className="pda-stack-wrap">
          <div className="pda-stack-label">Stack <span>top first</span></div>
          <div className="pda-stack" aria-label={`Stack: ${current.stack.slice().reverse().join(', ')}`}>
            {current.stack.slice().reverse().map((plate, index) => (
              <span
                className={`pda-plate${index === 0 ? ' is-top' : ''}${plate === '#' ? ' is-bottom' : ''}${plate === 'B' ? ' is-b' : ''}`}
                key={`${plate}-${index}`}
              >
                {plate}
                {index === 0 ? <span className="pda-plate-top">top</span> : null}
              </span>
            ))}
          </div>
        </div>
        <div className="pda-action-wrap">
          <div className="pda-action-label">Current action</div>
          <div className="pda-action">{current.action}</div>
          <code className="pda-delta">{current.delta}</code>
          {finished ? <div className="pda-verdict">Accepted — the stack is back to #.</div> : null}
        </div>
      </div>

      <div className="pda-controls">
        <button
          type="button"
          className="btn btn-small"
          onClick={() => setStep((value) => Math.min(value + 1, steps.length - 1))}
          disabled={finished}
        >
          <StepForward size={14} aria-hidden="true" /> Step
        </button>
        <button
          type="button"
          className="btn btn-small btn-primary"
          onClick={() => {
            if (finished) {
              setStep(0)
              setRunning(true)
            } else {
              setRunning((value) => !value)
            }
          }}
        >
          {running ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
          {running ? 'Pause' : finished ? 'Replay' : 'Run'}
        </button>
        <button type="button" className="btn btn-small btn-ghost" onClick={resetSim}>
          <RotateCcw size={14} aria-hidden="true" /> Reset
        </button>
        <span className="pda-note">ε-moves change phase without reading a letter.</span>
      </div>
    </div>
  )
}
