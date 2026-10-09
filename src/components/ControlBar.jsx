/**
 * Submit, Reset and (after checking) Try again and reveal buttons.
 * @module components/ControlBar
 */

/**
 * @param {{
 *   canSubmit: boolean,
 *   remaining: number,
 *   phase: 'editing' | 'checked',
 *   revealed: boolean,
 *   perfect: boolean,
 *   onSubmit: () => void,
 *   onReset: () => void,
 *   onRetry: () => void,
 *   onToggleReveal: () => void
 * }} props
 * @returns {JSX.Element}
 */
export default function ControlBar({
  canSubmit,
  remaining,
  phase,
  revealed,
  perfect,
  onSubmit,
  onReset,
  onRetry,
  onToggleReveal,
}) {
  return (
    <div className="controls">
      {phase === 'editing' ? (
        <>
          <button
            type="button"
            className="btn btn-primary"
            aria-disabled={canSubmit ? undefined : 'true'}
            aria-describedby="submit-help"
            onClick={() => {
              if (canSubmit) onSubmit()
            }}
          >
            Submit
          </button>
          <p id="submit-help" className="help">
            {canSubmit ? 'Ready to submit' : `Answer every tile to submit (${remaining} to go)`}
          </p>
        </>
      ) : (
        !perfect && (
          <>
            <button type="button" className="btn btn-primary" onClick={onRetry}>
              Try again
            </button>
            <button type="button" className="btn btn-secondary" onClick={onToggleReveal}>
              {revealed ? 'Hide correct answers' : 'Show correct answers'}
            </button>
          </>
        )
      )}
      <button type="button" className="btn btn-secondary" onClick={onReset}>
        Reset
      </button>
    </div>
  )
}