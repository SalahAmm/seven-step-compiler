import { useState } from 'react'
import { Automaton, AutomatonLegend } from './Automaton'
import { BoardFigure } from './ui'
import { dfaEdges, dfaStates } from '../data/automata'

const original = ['B', 'C', 'D']
const complement = ['A', 'S']

export function ComplementLab() {
  const [mode, setMode] = useState<'original' | 'complement'>('original')
  const accepting = mode === 'original' ? original : complement
  const acceptingLabel = accepting.map((state) => (state === 'S' ? '∅' : state)).join(', ')

  return (
    <div className="complement-lab">
      <div className="segmented" role="tablist" aria-label="Original or complement automaton">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'original'}
          className={mode === 'original' ? 'is-active' : ''}
          onClick={() => setMode('original')}
        >
          Original DFA
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'complement'}
          className={mode === 'complement' ? 'is-active' : ''}
          onClick={() => setMode('complement')}
        >
          Complement
        </button>
      </div>

      <BoardFigure
        title={mode === 'original' ? 'A — accepting states B, C, D' : 'Ā — accepting states A and ∅'}
        note="Transitions never move. Only the double circles change."
        caption={
          <>
            <strong>{mode === 'original' ? 'Original.' : 'Complement.'}</strong>{' '}
            The accepting states are now <strong>{acceptingLabel}</strong>. Every transition is identical to the original
            complete DFA — including the sink state ∅.
          </>
        }
        credit="Interro 1, Ex 04 (Q4)"
      >
        <div className="figure-scroll">
          <Automaton
            states={dfaStates}
            edges={dfaEdges}
            width={760}
            height={490}
            radius={26}
            acceptingIds={accepting}
            ariaLabel={
              mode === 'original'
                ? 'Complete DFA accepting states B, C and D, with sink state empty set.'
                : 'Complement DFA accepting states A and the sink state.'
            }
          />
        </div>
        <div className="state-pills">
          {['A', 'B', 'C', 'D', 'S'].map((state) => (
            <span className={`state-pill${accepting.includes(state) ? ' is-accepting' : ''}`} key={state}>
              {state === 'S' ? '∅' : state}
              {accepting.includes(state) ? ' · accepting' : ' · rejecting'}
            </span>
          ))}
        </div>
        <AutomatonLegend
          items={[
            { label: 'start', kind: 'start' },
            { label: 'accepting', kind: 'accept' },
            { label: 'dead / sink', kind: 'dead' },
          ]}
        />
      </BoardFigure>
      <p className="complement-note">
        The complement is only correct after making the automaton <strong>complete</strong>. If the sink state were missing,
        words that fall off the automaton would be silently rejected in both machines.
      </p>
    </div>
  )
}
