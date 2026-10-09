import { describe, it, expect } from 'vitest'
import { reducer, initialState } from './useActivity.js'
import { LAYERS, MODELS } from '../data/serviceModels.js'
import { cellKey } from '../lib/cells.js'

/** Build an answers object with every tile set to a value. */
const full = (owner) =>
  Object.fromEntries(MODELS.flatMap((m) => LAYERS.map((l) => [cellKey(m.id, l.id), owner])))

describe('reducer', () => {
  it('cycles grey, you, provider, grey', () => {
    let s = reducer(initialState, { type: 'CYCLE', key: 'iaas.runtime' })
    expect(s.answers['iaas.runtime']).toBe('you')
    s = reducer(s, { type: 'CYCLE', key: 'iaas.runtime' })
    expect(s.answers['iaas.runtime']).toBe('provider')
    s = reducer(s, { type: 'CYCLE', key: 'iaas.runtime' })
    expect(s.answers['iaas.runtime']).toBeUndefined()
  })

  it('does not cycle while checked', () => {
    const checked = { answers: full('you'), phase: 'checked', revealed: false }
    expect(reducer(checked, { type: 'CYCLE', key: 'iaas.runtime' })).toBe(checked)
  })

  it('blocks submit when incomplete', () => {
    const s = { ...initialState, answers: { 'iaas.runtime': 'you' } }
    expect(reducer(s, { type: 'SUBMIT' }).phase).toBe('editing')
  })

  it('submits when complete', () => {
    const s = { ...initialState, answers: full('you') }
    expect(reducer(s, { type: 'SUBMIT' }).phase).toBe('checked')
  })

  it('retry keeps answers and clears reveal', () => {
    const s = { answers: full('you'), phase: 'checked', revealed: true }
    const next = reducer(s, { type: 'RETRY' })
    expect(next.phase).toBe('editing')
    expect(next.revealed).toBe(false)
    expect(next.answers).toBe(s.answers)
  })

  it('reveal toggles only when checked', () => {
    expect(reducer(initialState, { type: 'TOGGLE_REVEAL' }).revealed).toBe(false)
    const s = { answers: full('you'), phase: 'checked', revealed: false }
    expect(reducer(s, { type: 'TOGGLE_REVEAL' }).revealed).toBe(true)
  })

  it('reset clears everything', () => {
    const s = { answers: full('you'), phase: 'checked', revealed: true }
    expect(reducer(s, { type: 'RESET' })).toEqual(initialState)
  })
})