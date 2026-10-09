/**
 * Helpers for identifying grid cells.
 * @module lib/cells
 */

/**
 * Build the key for a grid cell, for example `iaas.runtime`.
 * @param {string} modelId
 * @param {string} layerId
 * @returns {string}
 */
export function cellKey(modelId, layerId) {
  return `${modelId}.${layerId}`
}