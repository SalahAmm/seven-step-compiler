import { useState } from 'react'
import { Grammar } from './ui'

type Step = {
  key: 'A' | 'B' | 'C'
  label: string
  intro: string
  before: string[]
  intermediate?: string[]
  after: string[]
  note: string
}

const steps: Step[] = [
  {
    key: 'A',
    label: 'Handle A',
    intro: 'Nothing sits before A in the order, so there is nothing to substitute.',
    before: ['A → Aa | BC'],
    after: ['A → BC A′', 'A′ → a A′ | ε'],
    note: 'α = a, β = BC. The recursive tail moves to A′ and the base case carries A′.',
  },
  {
    key: 'B',
    label: 'Handle B',
    intro: 'A comes before B, so every rule of B that starts with A must be expanded first.',
    before: ['B → AC | CC'],
    intermediate: ['B → BC A′ C | CC'],
    after: ['B → CC B′', 'B′ → C A′ C B′ | ε'],
    note: 'Only after substituting A do we see the direct recursion B → B(C A′ C). Split it.',
  },
  {
    key: 'C',
    label: 'Handle C',
    intro: 'Both A and B come before C. Substitute A first, then substitute B, and only then eliminate recursion.',
    before: ['C → BA | AC | b'],
    intermediate: ['C → BA | BC A′ C | b'],
    after: ['C → b C′', 'C′ → C B′ A C′ | C B′ C A′ C C′ | ε'],
    note: 'After substituting A, both rules start with B. Substitute B → CC B′ and split the new C-recursion.',
  },
]

export function LeftRecursionLab() {
  const [active, setActive] = useState<'A' | 'B' | 'C'>('A')
  const step = steps.find((item) => item.key === active) ?? steps[0]

  return (
    <div className="lr-lab">
      <div className="lr-head">
        <div className="segmented" role="tablist" aria-label="Left recursion steps">
          {steps.map((item) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={active === item.key}
              className={active === item.key ? 'is-active' : ''}
              onClick={() => setActive(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="lr-order">order <span>A &lt; B &lt; C</span></div>
      </div>

      <div className="lr-body" aria-live="polite">
        <p className="lr-intro">{step.intro}</p>
        <div className="lr-panes">
          <div>
            <div className="lr-pane-label">Before</div>
            <Grammar lines={step.before} label={`${step.key} productions before transformation`} />
          </div>
          {step.intermediate ? (
            <div>
              <div className="lr-pane-label">After substitution</div>
              <Grammar lines={step.intermediate} label={`${step.key} productions after substitution`} />
            </div>
          ) : null}
          <div>
            <div className="lr-pane-label">After removing direct recursion</div>
            <Grammar
              lines={step.after.map((line) => ({ text: line, tone: 'hot' as const }))}
              label={`${step.key} productions after removing recursion`}
            />
          </div>
        </div>
        <p className="lr-note">{step.note}</p>
      </div>
    </div>
  )
}
