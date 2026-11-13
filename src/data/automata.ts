import type { AutoEdge, AutoState } from '../components/Automaton'

/* ------------------------------------------------------------------ */
/* Modulo 3 — number of a's divisible by 3                             */
/* ------------------------------------------------------------------ */
export const mod3States: AutoState[] = [
  { id: '0', label: '0', x: 140, y: 180, start: true, accepting: true },
  { id: '1', label: '1', x: 330, y: 85 },
  { id: '2', label: '2', x: 330, y: 278 },
]

export const mod3Edges: AutoEdge[] = [
  { from: '0', to: '1', label: 'a', bend: -24 },
  { from: '1', to: '2', label: 'a' },
  { from: '2', to: '0', label: 'a', bend: -40 },
  { from: '0', to: '0', label: 'b, c', loop: 'left' },
  { from: '1', to: '1', label: 'b, c', loop: 'above' },
  { from: '2', to: '2', label: 'b, c', loop: 'below' },
]

export const mod3Transitions: Record<string, Record<string, string>> = {
  '0': { a: '1', b: '0', c: '0' },
  '1': { a: '2', b: '1', c: '1' },
  '2': { a: '0', b: '2', c: '2' },
}

/* ------------------------------------------------------------------ */
/* Decimal numbers divisible by 3                                      */
/* ------------------------------------------------------------------ */
export const decimal3States = mod3States

export const decimal3Edges: AutoEdge[] = [
  { from: '0', to: '1', label: '+1', bend: -26 },
  { from: '1', to: '0', label: '+2', bend: -26 },
  { from: '1', to: '2', label: '+1', bend: -26 },
  { from: '2', to: '1', label: '+2', bend: -26 },
  { from: '2', to: '0', label: '+1', bend: -46 },
  { from: '0', to: '2', label: '+2', bend: -46 },
  { from: '0', to: '0', label: '0', loop: 'left' },
  { from: '1', to: '1', label: '0', loop: 'above' },
  { from: '2', to: '2', label: '0', loop: 'below' },
]

export const decimal3Transitions: Record<string, Record<string, string>> = {
  '0': { '0': '0', '1': '1', '2': '2', '3': '0', '4': '1', '5': '2', '6': '0', '7': '1', '8': '2', '9': '0' },
  '1': { '0': '1', '1': '2', '2': '0', '3': '1', '4': '2', '5': '0', '6': '1', '7': '2', '8': '0', '9': '1' },
  '2': { '0': '2', '1': '0', '2': '1', '3': '2', '4': '0', '5': '1', '6': '2', '7': '0', '8': '1', '9': '2' },
}

/* ------------------------------------------------------------------ */
/* No 110                                                              */
/* ------------------------------------------------------------------ */
export const no110States: AutoState[] = [
  { id: '0', label: '0', x: 110, y: 170, start: true, accepting: true },
  { id: '1', label: '1', x: 300, y: 92, accepting: true },
  { id: '2', label: '2', x: 490, y: 170, accepting: true },
  { id: '3', label: 'dead', x: 490, y: 330, dead: true },
]

export const no110Edges: AutoEdge[] = [
  { from: '0', to: '0', label: '0', loop: 'below' },
  { from: '0', to: '1', label: '1', bend: -18 },
  { from: '1', to: '0', label: '0', bend: -18 },
  { from: '1', to: '2', label: '1' },
  { from: '2', to: '2', label: '1', loop: 'above' },
  { from: '2', to: '3', label: '0' },
  { from: '3', to: '3', label: '0, 1', loop: 'below' },
]

export const no110Transitions: Record<string, Record<string, string>> = {
  '0': { '0': '0', '1': '1' },
  '1': { '0': '0', '1': '2' },
  '2': { '0': '3', '1': '2' },
  '3': { '0': '3', '1': '3' },
}

/* ------------------------------------------------------------------ */
/* Product automaton — even a's × b's divisible by 3                    */
/* ------------------------------------------------------------------ */
export const productStates: AutoState[] = [
  { id: '00', label: '(0,0)', x: 150, y: 122, start: true, accepting: true },
  { id: '01', label: '(0,1)', x: 370, y: 122 },
  { id: '02', label: '(0,2)', x: 590, y: 122 },
  { id: '10', label: '(1,0)', x: 150, y: 288 },
  { id: '11', label: '(1,1)', x: 370, y: 288 },
  { id: '12', label: '(1,2)', x: 590, y: 288 },
]

export const productEdges: AutoEdge[] = [
  { from: '00', to: '10', label: 'a', bidirectional: true },
  { from: '01', to: '11', label: 'a', bidirectional: true },
  { from: '02', to: '12', label: 'a', bidirectional: true },
  { from: '00', to: '01', label: 'b' },
  { from: '01', to: '02', label: 'b' },
  { from: '02', to: '00', label: 'b', bend: -112 },
  { from: '10', to: '11', label: 'b' },
  { from: '11', to: '12', label: 'b' },
  { from: '12', to: '10', label: 'b', bend: 112 },
]

/* ------------------------------------------------------------------ */
/* NFA from Interro 1, Exercise 4                                      */
/* ------------------------------------------------------------------ */
export const pqrStates: AutoState[] = [
  { id: 'P', label: 'P', x: 120, y: 190, start: true },
  { id: 'Q', label: 'Q', x: 330, y: 190 },
  { id: 'R', label: 'R', x: 540, y: 190, accepting: true },
]

export const pqrEdges: AutoEdge[] = [
  { from: 'P', to: 'P', label: 'a', loop: 'above' },
  { from: 'P', to: 'Q', label: 'a', bend: -32 },
  { from: 'Q', to: 'P', label: 'b', bend: -32 },
  { from: 'Q', to: 'R', label: 'ε', labelDy: -11 },
  { from: 'R', to: 'Q', label: 'c', bend: -32 },
  { from: 'R', to: 'P', label: 'b', bend: -112 },
  { from: 'R', to: 'R', label: 'b', loop: 'above' },
]

/* ------------------------------------------------------------------ */
/* ε-closure demo                                                      */
/* ------------------------------------------------------------------ */
export const ecloseStates: AutoState[] = [
  { id: 'q0', label: 'q0', x: 120, y: 150, start: true },
  { id: 'q1', label: 'q1', x: 320, y: 150 },
  { id: 'q2', label: 'q2', x: 520, y: 150 },
]

export const ecloseEdges: AutoEdge[] = [
  { from: 'q0', to: 'q0', label: 'a', loop: 'above' },
  { from: 'q0', to: 'q1', label: 'ε', dashed: true },
  { from: 'q1', to: 'q2', label: 'ε', dashed: true },
]

/* ------------------------------------------------------------------ */
/* Determinized DFA from Interro 1, Exercise 4                         */
/* ------------------------------------------------------------------ */
export const dfaStates: AutoState[] = [
  { id: 'A', label: 'A', x: 95, y: 185, start: true },
  { id: 'B', label: 'B', x: 310, y: 92, accepting: true },
  { id: 'C', label: 'C', x: 310, y: 278, accepting: true },
  { id: 'D', label: 'D', x: 535, y: 165, accepting: true },
  { id: 'S', label: '∅', x: 620, y: 382, dead: true },
]

export const dfaEdges: AutoEdge[] = [
  { from: 'A', to: 'B', label: 'a', bend: -22 },
  { from: 'A', to: 'S', label: 'b, c', bend: 78, dashed: true, muted: true },
  { from: 'B', to: 'B', label: 'a', loop: 'above' },
  { from: 'B', to: 'C', label: 'b', bend: 36 },
  { from: 'C', to: 'B', label: 'a', bend: 36 },
  { from: 'C', to: 'C', label: 'b', loop: 'right' },
  { from: 'B', to: 'D', label: 'c', bend: -22 },
  { from: 'C', to: 'D', label: 'c', bend: 22 },
  { from: 'D', to: 'C', label: 'b', bend: 26 },
  { from: 'D', to: 'S', label: 'a', dashed: true, muted: true },
  { from: 'D', to: 'D', label: 'c', loop: 'right' },
  { from: 'S', to: 'S', label: 'a, b, c', loop: 'below' },
]

/* ------------------------------------------------------------------ */
/* Minimized DFA — A3                                                  */
/* ------------------------------------------------------------------ */
export const minStates: AutoState[] = [
  { id: 'S0', label: 'S0', x: 155, y: 130, start: true },
  { id: 'G2', label: 'G2', x: 440, y: 130, accepting: true },
]

export const minEdges: AutoEdge[] = [
  { from: 'S0', to: 'G2', label: 'a' },
  { from: 'S0', to: 'S0', label: 'b', loop: 'below' },
  { from: 'G2', to: 'G2', label: 'a, b', loop: 'above' },
]

/* ------------------------------------------------------------------ */
/* NFA for numbers < 139                                               */
/* ------------------------------------------------------------------ */
export const limitStates: AutoState[] = [
  { id: 'q0', label: 'q0', x: 70, y: 220, start: true },
  { id: 'z', label: '0', x: 238, y: 68, accepting: true },
  { id: 'd1', label: '1–9', x: 238, y: 202, accepting: true },
  { id: 'o', label: '1', x: 238, y: 356 },
  { id: 'd2', label: '10–99', x: 442, y: 202, accepting: true },
  { id: 'pre1', label: '10–12', x: 442, y: 402, accepting: true },
  { id: 'p3', label: '13', x: 442, y: 306, accepting: true },
  { id: 'full1', label: '100–129', x: 690, y: 402, accepting: true },
  { id: 'full3', label: '130–138', x: 690, y: 306, accepting: true },
]

export const limitEdges: AutoEdge[] = [
  { from: 'q0', to: 'z', label: '0', bend: -26 },
  { from: 'q0', to: 'd1', label: '1–9' },
  { from: 'q0', to: 'o', label: '1', bend: 26 },
  { from: 'd1', to: 'd2', label: '0–9', bend: -20 },
  { from: 'o', to: 'pre1', label: '0–2', bend: -18 },
  { from: 'o', to: 'p3', label: '3', bend: 12 },
  { from: 'pre1', to: 'full1', label: '0–9' },
  { from: 'p3', to: 'full3', label: '0–8' },
]

/* ------------------------------------------------------------------ */
/* Optional illustration for the hero                                  */
/* ------------------------------------------------------------------ */
export const heroStates = mod3States
export const heroEdges = mod3Edges
