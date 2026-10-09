/**
 * State management for the activity.
 * @module hooks/useActivity
 */
import { useReducer } from 'react'
import { isComplete } from '../lib/scoring.js'

/**
 * @typedef {{
 *   answers: Record<string, import('../data/serviceModels.js').Owner>,
 *   phase: 'editing' | 'checked',
 *   revealed: boolean
 * }} ActivityState
 */

/** @type {ActivityState} */
export const initialState = { answers: {}, phase: 'editing', revealed: false }

/**
 * Pure reducer for the activity. Exported for unit testing.
 * @param {ActivityState} state
 * @param {{ type: string, key?: string }} action
 * @returns {ActivityState}
 */
export function reducer(state, action) {
  switch (action.type) {
    case 'CYCLE': {
      if (state.phase !== 'editing') return state
      const current = state.answers[action.key]
      const answers = { ...state.answers }
      if (current === undefined) answers[action.key] = 'you'
      else if (current === 'you') answers[action.key] = 'provider'
      else delete answers[action.key]
      return { ...state, answers }
    }
    case 'SUBMIT':
      if (!isComplete(state.answers)) return state
      return { ...state, phase: 'checked' }
    case 'RETRY':
      return { ...state, phase: 'editing', revealed: false }
    case 'TOGGLE_REVEAL':
      if (state.phase !== 'checked') return state
      return { ...state, revealed: !state.revealed }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

/**
 * Hook wrapping the reducer with named action dispatchers.
 * @returns {{
 *   state: ActivityState,
 *   cycle: (key: string) => void,
 *   submit: () => void,
 *   retry: () => void,
 *   toggleReveal: () => void,
 *   reset: () => void
 * }}
 */
export default function useActivity() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return {
    state,
    cycle: (key) => dispatch({ type: 'CYCLE', key }),
    submit: () => dispatch({ type: 'SUBMIT' }),
    retry: () => dispatch({ type: 'RETRY' }),
    toggleReveal: () => dispatch({ type: 'TOGGLE_REVEAL' }),
    reset: () => dispatch({ type: 'RESET' }),
  }
}