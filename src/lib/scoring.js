/**
 * Pure selectors that derive progress and scores from the answers.
 * @module lib/scoring
 */
import { LAYERS, MODELS, correctOwner } from '../data/serviceModels.js'
import { cellKey } from './cells.js'

/** Total number of tiles in the grid. */
export const TOTAL_CELLS = LAYERS.length * MODELS.length

/**
 * Count how many tiles have an answer.
 * @param {Record<string, import('../data/serviceModels.js').Owner>} answers
 * @returns {number} 0 to 32.
 */
export function answeredCount(answers) {
  return Object.keys(answers).length
}

/**
 * Whether every tile has been answered.
 * @param {Record<string, import('../data/serviceModels.js').Owner>} answers
 * @returns {boolean}
 */
export function isComplete(answers) {
  return answeredCount(answers) === TOTAL_CELLS
}

/**
 * Mark a single tile.
 * @param {import('../data/serviceModels.js').ServiceModel} model
 * @param {number} layerIndex Zero-based index into LAYERS.
 * @param {Record<string, import('../data/serviceModels.js').Owner>} answers
 * @returns {'correct' | 'wrong' | 'unanswered'}
 */
export function cellResult(model, layerIndex, answers) {
  const given = answers[cellKey(model.id, LAYERS[layerIndex].id)]
  if (!given) return 'unanswered'
  return given === correctOwner(model, layerIndex) ? 'correct' : 'wrong'
}

/**
 * Count correct tiles per model.
 * @param {Record<string, import('../data/serviceModels.js').Owner>} answers
 * @returns {Record<string, number>} Model id to correct count, each out of 8.
 */
export function scoreByModel(answers) {
  /** @type {Record<string, number>} */
  const scores = {}
  for (const model of MODELS) {
    scores[model.id] = LAYERS.filter(
      (_, i) => cellResult(model, i, answers) === 'correct',
    ).length
  }
  return scores
}

/**
 * Total correct tiles.
 * @param {Record<string, import('../data/serviceModels.js').Owner>} answers
 * @returns {number} 0 to 32.
 */
export function totalScore(answers) {
  return Object.values(scoreByModel(answers)).reduce((a, b) => a + b, 0)
}