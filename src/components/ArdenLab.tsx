import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { M } from './Math'

const steps = [
  {
    title: 'One equation per state',
    note: 'R is accepting, so its equation ends with + ε. Q has an ε-arrow to R, so it contributes Xr with no letter in front.',
    equations: [
      'X_p = aX_p + aX_q',
      'X_q = bX_p + X_r',
      'X_r = bX_r + cX_q + bX_p + \\varepsilon',
    ],
  },
  {
    title: 'Substitute Xq',
    note: 'Take Xq = bXp + Xr and put it into the two places where Xq appears. Group the Xp terms as you go.',
    equations: [
      'X_p = aX_p + a(bX_p + X_r) = (a + ab)X_p + aX_r',
      'X_r = bX_r + c(bX_p + X_r) + bX_p + \\varepsilon = (b + c)X_r + (cb + b)X_p + \\varepsilon',
    ],
  },
  {
    title: 'Apply Arden to Xr',
    note: 'The shape is Xr = A·Xr + B with A = (b+c) and B = (cb+b)Xp + ε. Arden gives A*B.',
    equations: [
      'X_r = (b+c)^*\\big((cb + b)X_p + \\varepsilon\\big)',
      'X_r = (b+c)^*(cb+b)X_p + (b+c)^*',
    ],
  },
  {
    title: 'Apply Arden to Xp',
    note: 'Plug Xr into Xp, factor Xp on the left, then apply X = AX + B → X = A*B one last time.',
    equations: [
      'X_p = \\Big(a + ab + a(b+c)^*(cb+b)\\Big)X_p + a(b+c)^*',
      'X_p = \\Big(a + ab + a(b+c)^*(cb+b)\\Big)^* a(b+c)^*',
    ],
  },
]

export function ArdenLab() {
  const [index, setIndex] = useState(0)
  const step = steps[index]
  const last = index === steps.length - 1

  return (
    <div className="arden-lab">
      <div className="arden-head">
        <div className="arden-step-label">Step {index + 1} of {steps.length}</div>
        <div className="arden-rule"><M>{'X = AX + B \\;\\Longrightarrow\\; X = A^*B'}</M></div>
      </div>
      <div className="arden-body" aria-live="polite">
        <h3>{step.title}</h3>
        <p className="arden-note">{step.note}</p>
        <div className="arden-equations">
          {step.equations.map((equation) => (
            <M block key={equation}>{equation}</M>
          ))}
        </div>
      </div>
      <div className="arden-controls">
        <div className="arden-dots" aria-hidden="true">
          {steps.map((item, dotIndex) => (
            <span className={`arden-dot${dotIndex === index ? ' is-current' : ''}${dotIndex < index ? ' is-past' : ''}`} key={item.title} />
          ))}
        </div>
        <div className="arden-buttons">
          <button
            type="button"
            className="btn btn-small"
            onClick={() => setIndex((value) => Math.max(0, value - 1))}
            disabled={index === 0}
          >
            <ChevronLeft size={14} aria-hidden="true" /> Back
          </button>
          <button
            type="button"
            className="btn btn-small btn-primary"
            onClick={() => setIndex((value) => Math.min(steps.length - 1, value + 1))}
            disabled={last}
          >
            Next <ChevronRight size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
      {last ? (
        <div className="arden-final">
          <span className="arden-final-label">Final regular expression</span>
          <M block>{'\\boxed{X_p = \\big(a + ab + a(b+c)^*(cb+b)\\big)^*\\, a(b+c)^*}'}</M>
        </div>
      ) : null}
    </div>
  )
}
