/**
 * One service model: heading, eight tiles and (after checking) a score badge.
 * @module components/ModelColumn
 */
import { LAYERS, correctOwner } from '../data/serviceModels.js'
import { cellKey } from '../lib/cells.js'
import { cellResult, scoreByModel } from '../lib/scoring.js'
import LayerTile from './LayerTile.jsx'

/**
 * @param {{
 *   model: import('../data/serviceModels.js').ServiceModel,
 *   answers: Record<string, import('../data/serviceModels.js').Owner>,
 *   phase: 'editing' | 'checked',
 *   revealed: boolean,
 *   onCycle: (key: string) => void
 * }} props
 * @returns {JSX.Element}
 */
export default function ModelColumn({ model, answers, phase, revealed, onCycle }) {
  const checked = phase === 'checked'
  const score = scoreByModel(answers)[model.id]
  const modelTitle = `${model.title} ${model.subtitle.toLowerCase()}`
  const isOnPrem = model.id === 'onprem'

  return (
    <section className="column" data-model={model.id} aria-label={modelTitle}>
      <div className="column-head">
        <h2 className="column-title">{model.title}</h2>
        <p className="column-subtitle">{model.subtitle}</p>
        {checked && (
          <p className="score-badge" aria-label={`${score} out of ${LAYERS.length} correct`}>
            {score} / {LAYERS.length}
          </p>
        )}
        {isOnPrem && (
          <p className="column-note">
            With a private cloud there is no outside provider, so every layer is yours.
          </p>
        )}
      </div>
      <div className="column-tiles">
        {LAYERS.map((layer, i) => {
          const key = cellKey(model.id, layer.id)
          const result = cellResult(model, i, answers)
          return (
            <LayerTile
              key={key}
              cellId={key}
              modelTitle={modelTitle}
              layerLabel={layer.label}
              value={answers[key] ?? 'unanswered'}
              result={result}
              locked={checked}
              revealedOwner={checked && revealed && result === 'wrong' ? correctOwner(model, i) : null}
              onCycle={() => onCycle(key)}
            />
          )
        })}
      </div>
    </section>
  )
}