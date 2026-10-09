/**
 * One clickable tile in the grid.
 * @module components/LayerTile
 */
import { TickIcon, CrossIcon } from './Icons.jsx'

const STATE_TEXT = {
  unanswered: 'not chosen yet',
  you: 'you manage',
  provider: 'provider manages',
}
const TAG_TEXT = { you: 'You', provider: 'Provider' }

/**
 * @param {{
 *   cellId: string,
 *   modelTitle: string,
 *   layerLabel: string,
 *   value: 'unanswered' | 'you' | 'provider',
 *   result: 'correct' | 'wrong' | 'unanswered',
 *   locked: boolean,
 *   revealedOwner: 'you' | 'provider' | null,
 *   onCycle: () => void
 * }} props
 * revealedOwner is set only when the correct answer should be shown on this tile.
 * @returns {JSX.Element}
 */
export default function LayerTile({
  cellId,
  modelTitle,
  layerLabel,
  value,
  result,
  locked,
  revealedOwner,
  onCycle,
}) {
  const checked = locked && result !== 'unanswered'
  const label = `${modelTitle}, ${layerLabel}: ${STATE_TEXT[value]}${checked ? `, ${result}` : ''}`

  return (
    <button
      type="button"
      className="tile"
      data-cell={cellId}
      data-state={value}
      data-result={checked ? result : undefined}
      aria-label={label}
      aria-disabled={locked ? 'true' : undefined}
      onClick={() => {
        if (!locked) onCycle()
      }}
    >
      <span className="tile-label">{layerLabel}</span>
      {value !== 'unanswered' && <span className="tile-tag">{TAG_TEXT[value]}</span>}
      {checked && result === 'correct' && <TickIcon />}
      {checked && result === 'wrong' && <CrossIcon />}
      {revealedOwner && <span className="tile-hint">Should be: {TAG_TEXT[revealedOwner]}</span>}
    </button>
  )
}