import { useEffect, useMemo, useState } from 'react'
import { Pause, Play, RotateCcw, StepForward } from 'lucide-react'

type Rule = {
  id: string
  nt: string
  rhs: string[]
}

const ruleList: Rule[] = [
  { id: 'S-XY', nt: 'S', rhs: ['X', 'Y'] },
  { id: 'X-aXb', nt: 'X', rhs: ['a', 'X', 'b'] },
  { id: 'X-eps', nt: 'X', rhs: [] },
  { id: 'Y-cZ', nt: 'Y', rhs: ['c', 'Z'] },
  { id: 'Y-Ze', nt: 'Y', rhs: ['Z', 'e'] },
  { id: 'Z-dcZ', nt: 'Z', rhs: ['d', 'c', 'Z'] },
  { id: 'Z-eps', nt: 'Z', rhs: [] },
]

const ruleById = new Map(ruleList.map((rule) => [rule.id, rule]))

const table: Record<string, Record<string, string>> = {
  S: { a: 'S-XY', c: 'S-XY', d: 'S-XY', e: 'S-XY' },
  X: { a: 'X-aXb', b: 'X-eps', c: 'X-eps', d: 'X-eps', e: 'X-eps' },
  Y: { c: 'Y-cZ', d: 'Y-Ze', e: 'Y-Ze' },
  Z: { d: 'Z-dcZ', e: 'Z-eps', $: 'Z-eps' },
}

type Step = {
  stack: string[]
  index: number
  action: string
  detail: string
  form: string
  kind: 'start' | 'expand' | 'match' | 'accept' | 'reject'
}

const nonterminal = (symbol: string) => /^[A-Z]$/.test(symbol)
const displayRhs = (rhs: string[]) => (rhs.length === 0 ? 'ε' : rhs.join(''))

function simulate(word: string): Step[] {
  let stack = ['$', 'S']
  let index = 0
  let formTokens = ['S']
  const trace: Step[] = [
    {
      stack: [...stack],
      index,
      action: 'Start',
      detail: 'Read the top of the stack and the current input symbol.',
      form: formTokens.join(' '),
      kind: 'start',
    },
  ]

  for (let guard = 0; guard < 240; guard += 1) {
    const top = stack[stack.length - 1]
    const current = word[index] ?? '$'

    if (top === '$' && current === '$') {
      trace.push({
        stack: [...stack],
        index,
        action: 'Accept',
        detail: 'Stack and input both reach $. The word is in L(G).',
        form: formTokens.join(' '),
        kind: 'accept',
      })
      break
    }

    if (nonterminal(top)) {
      const ruleId = table[top]?.[current]
      if (!ruleId) {
        trace.push({
          stack: [...stack],
          index,
          action: `No rule for [${top}, ${current}]`,
          detail: 'The table cell is empty, so the word is rejected.',
          form: formTokens.join(' '),
          kind: 'reject',
        })
        break
      }
      const rule = ruleById.get(ruleId)
      if (!rule) break
      stack = stack.slice(0, -1)
      for (let i = rule.rhs.length - 1; i >= 0; i -= 1) stack.push(rule.rhs[i])
      const formIndex = formTokens.indexOf(top)
      if (formIndex >= 0) {
        formTokens = [
          ...formTokens.slice(0, formIndex),
          ...rule.rhs,
          ...formTokens.slice(formIndex + 1),
        ]
      }
      trace.push({
        stack: [...stack],
        index,
        action: `${top} → ${displayRhs(rule.rhs)}`,
        detail: rule.rhs.length
          ? `pop ${top}, push ${rule.rhs.slice().reverse().join(' ')} so ${rule.rhs[0]} sits on top`
          : `pop ${top}, push nothing`,
        form: formTokens.join(' '),
        kind: 'expand',
      })
      continue
    }

    if (top === current) {
      stack = stack.slice(0, -1)
      index += 1
      trace.push({
        stack: [...stack],
        index,
        action: `Match ${current}`,
        detail: 'Pop the terminal and advance the input pointer.',
        form: formTokens.join(' '),
        kind: 'match',
      })
      continue
    }

    trace.push({
      stack: [...stack],
      index,
      action: `Mismatch: expected ${top}, found ${current}`,
      detail: 'The top terminal does not match the input. Reject.',
      form: formTokens.join(' '),
      kind: 'reject',
    })
    break
  }

  return trace
}

function StackView({ stack }: { stack: string[] }) {
  return (
    <div className="ll-stack" aria-label={`Stack, top on the right: ${stack.join(' ')}`}>
      {stack.map((symbol, index) => (
        <span
          className={`ll-stack-cell${index === stack.length - 1 ? ' is-top' : ''}${symbol === '$' ? ' is-dollar' : ''}`}
          key={`${symbol}-${index}`}
        >
          {symbol}
        </span>
      ))}
      <span className="ll-top-marker" aria-hidden="true">top</span>
    </div>
  )
}

function InputTape({ word, index }: { word: string; index: number }) {
  const tape = [...word, '$']
  return (
    <div className="ll-tape" aria-label={`Input: ${word}$`}>
      {tape.map((symbol, position) => {
        const consumed = position < index
        const current = position === index
        return (
          <span
            className={`ll-tape-cell${consumed ? ' is-consumed' : ''}${current ? ' is-current' : ''}${symbol === '$' ? ' is-dollar' : ''}`}
            key={`${symbol}-${position}`}
          >
            {symbol}
          </span>
        )
      })}
    </div>
  )
}

export function Ll1Lab() {
  const [word, setWord] = useState('abdce')
  const [step, setStep] = useState(0)
  const [running, setRunning] = useState(false)

  const valid = /^[abcde]*$/.test(word)
  const trace = useMemo(() => simulate(word), [word])
  const current = trace[Math.min(step, trace.length - 1)]
  const finished = step >= trace.length - 1 && (current.kind === 'accept' || current.kind === 'reject')
  const status = step === 0
    ? 'ready'
    : current.kind === 'accept'
      ? 'accepted'
      : current.kind === 'reject'
        ? 'rejected'
        : `step ${step}`

  useEffect(() => {
    if (!running) return
    if (step >= trace.length - 1) {
      setRunning(false)
      return
    }
    const timer = window.setTimeout(() => setStep((value) => Math.min(value + 1, trace.length - 1)), 760)
    return () => window.clearTimeout(timer)
  }, [running, step, trace.length])

  const reset = () => {
    setStep(0)
    setRunning(false)
  }

  const changeWord = (value: string) => {
    setWord(value.toLowerCase())
    setStep(0)
    setRunning(false)
  }

  const play = () => {
    if (!valid) return
    if (step >= trace.length - 1) {
      setStep(0)
      setRunning(true)
      return
    }
    setRunning((value) => !value)
  }

  const forms = trace
    .slice(0, step + 1)
    .map((entry) => entry.form)
    .filter((form, index, list) => index === 0 || form !== list[index - 1])

  return (
    <div className="ll-lab">
      <div className="ll-lab-head">
        <div>
          <div className="ll-lab-title">The analyzer, one cell at a time</div>
          <div className="ll-lab-sub">Grammar: S → XY, X → aXb | ε, Y → cZ | Ze, Z → dcZ | ε</div>
        </div>
        <div
          className={`ll-status${status === 'accepted' ? ' is-accept' : ''}${status === 'rejected' ? ' is-reject' : ''}`}
          aria-live="polite"
        >
          {status}
        </div>
      </div>

      <div className="ll-input-row">
        <label htmlFor="ll-word" className="ll-label">Input word</label>
        <input
          id="ll-word"
          className={`ll-input${valid ? '' : ' is-invalid'}`}
          value={word}
          onChange={(event) => changeWord(event.target.value)}
          maxLength={12}
          spellCheck={false}
          autoComplete="off"
          aria-invalid={!valid}
          aria-describedby="ll-help"
        />
        <span className="ll-alphabet">alphabet a–e</span>
        <div className="ll-controls">
          <button
            type="button"
            className="btn btn-small"
            onClick={() => setStep((value) => Math.min(value + 1, trace.length - 1))}
            disabled={!valid || step >= trace.length - 1}
          >
            <StepForward size={14} aria-hidden="true" /> Step
          </button>
          <button
            type="button"
            className="btn btn-small btn-primary"
            onClick={play}
            disabled={!valid}
          >
            {running ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
            {running ? 'Pause' : finished ? 'Replay' : 'Run'}
          </button>
          <button type="button" className="btn btn-small btn-ghost" onClick={reset}>
            <RotateCcw size={14} aria-hidden="true" /> Reset
          </button>
        </div>
      </div>
      <p className={`ll-help${valid ? '' : ' is-invalid'}`} id="ll-help">
        {valid ? 'Try abdce (accepted), abc (accepted), or ab (rejected).' : 'Only letters a–e are in this grammar.'}
      </p>

      <div className="ll-stage">
        <div className="ll-stage-left">
          <div className="ll-panel">
            <div className="ll-panel-label">Stack <span>(top on the right)</span></div>
            <StackView stack={current.stack} />
          </div>
          <div className="ll-panel">
            <div className="ll-panel-label">Input tape</div>
            <InputTape word={word} index={current.index} />
          </div>
        </div>
        <div className="ll-action">
          <div className="ll-action-label">Current action</div>
          <div className="ll-action-main">{current.action}</div>
          <p className="ll-action-detail">{current.detail}</p>
          {current.kind === 'accept' ? (
            <p className="ll-verdict ok">The source word is accepted.</p>
          ) : null}
          {current.kind === 'reject' ? (
            <p className="ll-verdict bad">No accepting path for this word.</p>
          ) : null}
        </div>
      </div>

      <div className="ll-derivation">
        <div className="ll-panel-label">Leftmost derivation so far</div>
        <div className="ll-derivation-line">
          {forms.map((form, index) => (
            <span key={`${form}-${index}`}>
              {index > 0 ? <span className="ll-arrow" aria-hidden="true"> ⇒ </span> : null}
              <span className={index === forms.length - 1 ? 'is-current' : ''}>{form}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="table-wrap ll-trace-wrap">
        <table className="data-table ll-trace">
          <caption>Every row is one action. The table fills in as you step.</caption>
          <thead>
            <tr>
              <th scope="col">Stack (top on right)</th>
              <th scope="col">Input</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {trace.slice(0, step + 1).map((entry, index) => (
              <tr key={index} className={index === step ? 'is-current' : ''}>
                <td className="mono">{entry.stack.join('')}</td>
                <td>
                  <span className="ll-trace-input">
                    {[...word].slice(0, entry.index).join('')}
                    <strong>{word[entry.index] ?? '$'}</strong>
                    {[...word].slice(entry.index + 1).join('')}$
                  </span>
                </td>
                <td>{entry.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
