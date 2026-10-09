import { describe, it, expect } from 'vitest'
import { LAYERS, MODELS, correctOwner } from '../data/serviceModels.js'
import { cellKey } from './cells.js'
import { answeredCount, cellResult, isComplete, scoreByModel, totalScore } from './scoring.js'

/** Build answers from a function of model and layer index. */
const build = (fn) =>
  Object.fromEntries(
    MODELS.flatMap((m) => LAYERS.map((l, i) => [cellKey(m.id, l.id), fn(m, i)])),
  )

describe('scoring', () => {
  it('all correct scores 32', () => {
    const a = build((m, i) => correctOwner(m, i))
    expect(totalScore(a)).toBe(32)
    expect(isComplete(a)).toBe(true)
  })

  it('all inverted scores 0', () => {
    const a = build((m, i) => (correctOwner(m, i) === 'you' ? 'provider' : 'you'))
    expect(totalScore(a)).toBe(0)
  })

  it('scores per model', () => {
    const a = build((m, i) => correctOwner(m, i))
    expect(scoreByModel(a)).toEqual({ onprem: 8, iaas: 8, paas: 8, saas: 8 })
  })

  it('counts answers and reports unanswered', () => {
    expect(answeredCount({ 'iaas.runtime': 'you' })).toBe(1)
    expect(cellResult(MODELS[1], 2, {})).toBe('unanswered')
  })

  it('correctOwner follows the youLayers boundary', () => {
    const boundaries = { onprem: 8, iaas: 5, paas: 2, saas: 1 }
    for (const m of MODELS) {
      const n = boundaries[m.id]
      expect(m.youLayers).toBe(n)
      LAYERS.forEach((_, i) => {
        expect(correctOwner(m, i)).toBe(i < n ? 'you' : 'provider')
      })
    }
  })
})