import { useId } from 'react'
import type { ReactNode } from 'react'

export type AutoState = {
  id: string
  label: ReactNode
  x: number
  y: number
  start?: boolean
  accepting?: boolean
  dead?: boolean
}

export type AutoEdge = {
  id?: string
  from: string
  to: string
  label: string
  bend?: number
  loop?: 'above' | 'below' | 'left' | 'right'
  dashed?: boolean
  bidirectional?: boolean
  labelDx?: number
  labelDy?: number
  muted?: boolean
}

export function autoEdgeId(edge: AutoEdge) {
  return edge.id ?? `${edge.from}->${edge.to}:${edge.label}`
}

type AutomatonProps = {
  states: AutoState[]
  edges: AutoEdge[]
  width: number
  height: number
  radius?: number
  activeState?: string
  activeStates?: string[]
  activeEdge?: string
  acceptingIds?: string[]
  ariaLabel: string
  className?: string
}

function loopPath(cx: number, cy: number, r: number, side: NonNullable<AutoEdge['loop']>) {
  if (side === 'above' || side === 'below') {
    const sign = side === 'above' ? -1 : 1
    const shoulder = r * 0.64
    const lift = r * 1.92
    const bulge = r * 0.98
    const sx = cx - shoulder
    const sy = cy + sign * r * 0.74
    const ex = cx + shoulder
    const ey = sy
    const c1x = cx - bulge
    const c1y = cy + sign * lift
    const c2x = cx + bulge
    const c2y = cy + sign * lift
    return {
      d: `M ${sx} ${sy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey}`,
      lx: cx,
      ly: cy + sign * r * 2.12,
    }
  }

  const sign = side === 'left' ? -1 : 1
  const shoulder = r * 0.64
  const lift = r * 1.92
  const bulge = r * 0.98
  const sx = cx + sign * r * 0.74
  const sy = cy - shoulder
  const ey = cy + shoulder
  const c1x = cx + sign * lift
  const c1y = cy - bulge
  const c2x = cx + sign * lift
  const c2y = cy + bulge
  return {
    d: `M ${sx} ${sy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${sx} ${ey}`,
    lx: cx + sign * r * 2.12,
    ly: cy,
  }
}

export function Automaton({
  states,
  edges,
  width,
  height,
  radius = 27,
  activeState,
  activeStates,
  activeEdge,
  acceptingIds,
  ariaLabel,
  className,
}: AutomatonProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const stateMap = new Map(states.map((state) => [state.id, state]))
  const highlighted = new Set(activeStates ?? (activeState ? [activeState] : []))

  const isAccepting = (state: AutoState) =>
    acceptingIds ? acceptingIds.includes(state.id) : Boolean(state.accepting)

  const markers = {
    arrow: `arrow-${uid}`,
    active: `arrow-active-${uid}`,
    muted: `arrow-muted-${uid}`,
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`automaton${className ? ` ${className}` : ''}`}
      role="img"
      aria-label={ariaLabel}
      style={{ width: '100%', height: 'auto' }}
    >
      <defs>
        <marker
          id={markers.arrow}
          viewBox="0 0 10 10"
          refX="8.4"
          refY="5"
          markerWidth="9"
          markerHeight="9"
          markerUnits="userSpaceOnUse"
          orient="auto"
        >
          <path d="M 0 0.9 L 9 5 L 0 9.1 z" fill="var(--board-ink)" />
        </marker>
        <marker
          id={markers.active}
          viewBox="0 0 10 10"
          refX="8.4"
          refY="5"
          markerWidth="10"
          markerHeight="10"
          markerUnits="userSpaceOnUse"
          orient="auto"
        >
          <path d="M 0 0.9 L 9 5 L 0 9.1 z" fill="var(--lime)" />
        </marker>
        <marker
          id={markers.muted}
          viewBox="0 0 10 10"
          refX="8.4"
          refY="5"
          markerWidth="8"
          markerHeight="8"
          markerUnits="userSpaceOnUse"
          orient="auto"
        >
          <path d="M 0 0.9 L 9 5 L 0 9.1 z" fill="var(--board-muted)" />
        </marker>
      </defs>

      <g>
        {edges.map((edge) => {
          const from = stateMap.get(edge.from)
          const to = stateMap.get(edge.to)
          if (!from || !to) return null
          const id = autoEdgeId(edge)
          const active = activeEdge === id
          const muted = edge.muted
          const stroke = active
            ? 'var(--lime)'
            : muted
              ? 'var(--board-muted)'
              : 'var(--board-ink)'
          const marker = active ? markers.active : muted ? markers.muted : markers.arrow
          const strokeWidth = active ? 2.6 : 1.45

          let d = ''
          let lx = 0
          let ly = 0

          if (edge.loop) {
            const loop = loopPath(from.x, from.y, radius, edge.loop)
            d = loop.d
            lx = loop.lx + (edge.labelDx ?? 0)
            ly = loop.ly + (edge.labelDy ?? 0)
          } else {
            const dx = to.x - from.x
            const dy = to.y - from.y
            const length = Math.hypot(dx, dy)
            const nx = -dy / length
            const ny = dx / length
            const bend = edge.bend ?? 0
            const mx = (from.x + to.x) / 2 + nx * bend
            const my = (from.y + to.y) / 2 + ny * bend

            const startDx = mx - from.x
            const startDy = my - from.y
            const startLen = Math.hypot(startDx, startDy) || 1
            const endDx = mx - to.x
            const endDy = my - to.y
            const endLen = Math.hypot(endDx, endDy) || 1

            const sx = from.x + (startDx / startLen) * (radius + 3)
            const sy = from.y + (startDy / startLen) * (radius + 3)
            const ex = to.x + (endDx / endLen) * (radius + 6)
            const ey = to.y + (endDy / endLen) * (radius + 6)

            d = bend === 0
              ? `M ${sx} ${sy} L ${ex} ${ey}`
              : `M ${sx} ${sy} Q ${mx} ${my} ${ex} ${ey}`

            lx = 0.25 * sx + 0.5 * mx + 0.25 * ex + (edge.labelDx ?? 0)
            ly = 0.25 * sy + 0.5 * my + 0.25 * ey + (edge.labelDy ?? 0)
          }

          return (
            <g className="auto-edge" key={id}>
              <path
                d={d}
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeDasharray={edge.dashed ? '5 4' : undefined}
                markerEnd={`url(#${marker})`}
                markerStart={edge.bidirectional ? `url(#${marker})` : undefined}
                opacity={muted && !active ? 0.62 : 1}
              />
              <text
                x={lx}
                y={ly}
                className="auto-edge-label"
                fill={active ? 'var(--lime)' : muted ? 'var(--board-muted)' : 'var(--board-ink)'}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {edge.label}
              </text>
            </g>
          )
        })}

        {states.map((state) => {
          const active = highlighted.has(state.id)
          return (
            <g
              key={state.id}
              className={`auto-node${active ? ' is-active' : ''}${state.dead ? ' is-dead' : ''}`}
            >
              {state.start ? (
                <line
                  x1={state.x - radius - 38}
                  y1={state.y}
                  x2={state.x - radius - 7}
                  y2={state.y}
                  stroke="var(--board-ink)"
                  strokeWidth="1.4"
                  markerEnd={`url(#${markers.arrow})`}
                />
              ) : null}
              <circle
                className="node-main"
                cx={state.x}
                cy={state.y}
                r={radius}
                fill="var(--board-2)"
                stroke="var(--board-ink)"
                strokeWidth="1.6"
              />
              {isAccepting(state) ? (
                <circle
                  className="node-ring"
                  cx={state.x}
                  cy={state.y}
                  r={radius - 5}
                  fill="none"
                  stroke="var(--board-ink)"
                  strokeWidth="1.3"
                />
              ) : null}
              <text
                className="node-label"
                x={state.x}
                y={state.y + (typeof state.label === 'string' && state.label.length > 3 ? 1 : 0)}
                textAnchor="middle"
                dominantBaseline="central"
                fill="var(--board-ink)"
              >
                {state.label}
              </text>
            </g>
          )
        })}
      </g>
    </svg>
  )
}

export function AutomatonLegend({ items }: { items: { label: string; kind: 'start' | 'accept' | 'dead' | 'read' }[] }) {
  return (
    <div className="auto-legend">
      {items.map((item) => (
        <span className="auto-legend-item" key={item.label}>
          <span className={`auto-legend-mark ${item.kind}`} aria-hidden="true" />
          {item.label}
        </span>
      ))}
    </div>
  )
}
