/**
 * The dark panel holding the four model columns.
 * @module components/ServiceModelGrid
 */
import { MODELS } from '../data/serviceModels.js'
import ModelColumn from './ModelColumn.jsx'

/**
 * @param {{
 *   answers: Record<string, import('../data/serviceModels.js').Owner>,
 *   phase: 'editing' | 'checked',
 *   revealed: boolean,
 *   onCycle: (key: string) => void,
 *   gridRef: import('react').Ref<HTMLDivElement>
 * }} props
 * @returns {JSX.Element}
 */
export default function ServiceModelGrid({ answers, phase, revealed, onCycle, gridRef }) {
  return (
    <div className="panel" ref={gridRef}>
      <div className="columns">
        {MODELS.map((model) => (
          <ModelColumn
            key={model.id}
            model={model}
            answers={answers}
            phase={phase}
            revealed={revealed}
            onCycle={onCycle}
          />
        ))}
      </div>
    </div>
  )
}