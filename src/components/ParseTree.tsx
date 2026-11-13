import type { ReactNode } from 'react'

export type ParseNode = {
  label: string
  children?: ParseNode[]
  terminal?: boolean
  epsilon?: boolean
  highlight?: boolean
}

type LayoutNode = {
  node: ParseNode
  x: number
  y: number
  depth: number
  parent?: LayoutNode
}

function countLeaves(node: ParseNode): number {
  if (!node.children || node.children.length === 0) return 1
  return node.children.reduce((total, child) => total + countLeaves(child), 0)
}

function depthOf(node: ParseNode): number {
  if (!node.children || node.children.length === 0) return 0
  return 1 + Math.max(...node.children.map(depthOf))
}

export function ParseTree({
  tree,
  ariaLabel,
  maxWidth = 620,
}: {
  tree: ParseNode
  ariaLabel: string
  maxWidth?: number
}) {
  const xStep = 58
  const yStep = 70
  const padX = 42
  const padY = 38

  const leaves = countLeaves(tree)
  const depth = depthOf(tree)
  const width = Math.max(280, leaves * xStep + padX * 2)
  const height = depth * yStep + padY * 2 + 16

  const nodes: LayoutNode[] = []
  let leafIndex = 0

  /* Place children first, then patch parent references while returning. */
  const build = (node: ParseNode, level: number): LayoutNode => {
    let x: number
    let layout: LayoutNode
    if (!node.children || node.children.length === 0) {
      x = padX + leafIndex * xStep
      leafIndex += 1
      layout = { node, x, y: padY + level * yStep, depth: level }
      nodes.push(layout)
      return layout
    }
    const childLayouts = node.children.map((child) => build(child, level + 1))
    x = (childLayouts[0].x + childLayouts[childLayouts.length - 1].x) / 2
    layout = { node, x, y: padY + level * yStep, depth: level }
    nodes.push(layout)
    childLayouts.forEach((child) => {
      child.parent = layout
    })
    return layout
  }

  build(tree, 0)

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="parse-tree"
      role="img"
      aria-label={ariaLabel}
      style={{ width: '100%', maxWidth, height: 'auto', margin: '0 auto' }}
    >
      {nodes.map((layout, index) => {
        if (!layout.parent) return null
        const parent = layout.parent
        return (
          <path
            key={`edge-${index}`}
            d={`M ${parent.x} ${parent.y + 18} L ${layout.x} ${layout.y - 18}`}
            stroke="var(--board-ink)"
            strokeWidth="1.2"
            opacity="0.58"
            fill="none"
          />
        )
      })}

      {nodes.map((layout, index) => {
        const { node } = layout
        const isLeaf = !node.children || node.children.length === 0
        if (isLeaf) {
          const w = node.epsilon ? 28 : Math.max(30, node.label.length * 10 + 16)
          return (
            <g key={`node-${index}`} className="pt-term">
              <rect
                x={layout.x - w / 2}
                y={layout.y - 14}
                width={w}
                height={28}
                rx={2}
                fill="var(--board-2)"
                stroke={node.highlight ? 'var(--lime)' : 'rgba(238,242,227,0.26)'}
                strokeWidth={node.highlight ? 1.6 : 1}
              />
              <text
                x={layout.x}
                y={layout.y + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fill={node.epsilon ? 'var(--board-muted)' : 'var(--lime)'}
                fontSize="13"
                fontFamily="var(--font-mono)"
              >
                {node.label}
              </text>
            </g>
          )
        }
        return (
          <g key={`node-${index}`} className="pt-nt">
            <circle
              cx={layout.x}
              cy={layout.y}
              r={18}
              fill="var(--board-2)"
              stroke={node.highlight ? 'var(--lime)' : 'var(--board-ink)'}
              strokeWidth={node.highlight ? 2 : 1.5}
            />
            <text
              x={layout.x}
              y={layout.y + 1}
              textAnchor="middle"
              dominantBaseline="central"
              fill="var(--board-ink)"
              fontSize="13"
              fontFamily="var(--font-mono)"
            >
              {node.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Tree presets used by the lessons                                    */
/* ------------------------------------------------------------------ */
const cert = (label: string): ParseNode => ({ label, terminal: true })

export const acbbTreeOne: ParseNode = {
  label: 'S',
  children: [
    cert('a'),
    {
      label: 'T',
      children: [
        {
          label: 'S',
          children: [
            {
              label: 'T',
              children: [cert('c')],
            },
            cert('b'),
          ],
        },
      ],
    },
    cert('b'),
  ],
}

export const acbbTreeTwo: ParseNode = {
  label: 'S',
  children: [
    {
      label: 'T',
      children: [
        {
          label: 'S',
          children: [
            cert('a'),
            {
              label: 'T',
              children: [cert('c')],
            },
            cert('b'),
          ],
        },
      ],
    },
    cert('b'),
  ],
}

const cdaTail = (first: ParseNode): ParseNode => ({
  label: 'A',
  children: [
    {
      label: 'B',
      children: [
        {
          label: 'D',
          children: [first],
        },
        {
          label: 'E',
          children: [
            first.label === 'c'
              ? { label: 'ε', terminal: true, epsilon: true }
              : cert('c'),
          ],
        },
        {
          label: 'F',
          children: [cert('d')],
        },
      ],
    },
    {
      label: 'C',
      children: [cert('a')],
    },
  ],
})

export const cdaTreeOne = cdaTail(cert('c'))
export const cdaTreeTwo = cdaTail({
  label: 'ε',
  terminal: true,
  epsilon: true,
})

/* ------------------------------------------------------------------ */
/* LL(1) parse tree for abdce                                          */
/* ------------------------------------------------------------------ */
export const abdceTree: ParseNode = {
  label: 'S',
  children: [
    {
      label: 'X',
      children: [
        cert('a'),
        {
          label: 'X',
          children: [{ label: 'ε', terminal: true, epsilon: true }],
        },
        cert('b'),
      ],
    },
    {
      label: 'Y',
      children: [
        {
          label: 'Z',
          children: [
            cert('d'),
            cert('c'),
            {
              label: 'Z',
              children: [{ label: 'ε', terminal: true, epsilon: true }],
            },
          ],
        },
        cert('e'),
      ],
    },
  ],
}

export function TreePair({
  left,
  right,
  leftLabel,
  rightLabel,
}: {
  left: ParseNode
  right: ParseNode
  leftLabel: ReactNode
  rightLabel: ReactNode
}) {
  return (
    <div className="tree-pair">
      <div className="tree-pane">
        <div className="tree-pane-label">{leftLabel}</div>
        <ParseTree tree={left} ariaLabel="First parse tree" maxWidth={440} />
      </div>
      <div className="tree-pane">
        <div className="tree-pane-label">{rightLabel}</div>
        <ParseTree tree={right} ariaLabel="Second parse tree" maxWidth={440} />
      </div>
    </div>
  )
}
