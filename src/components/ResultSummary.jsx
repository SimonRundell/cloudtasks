/**
 * Score, message and per-model teaching notes shown after submitting.
 * @module components/ResultSummary
 */
import { MODELS } from '../data/serviceModels.js'
import { TOTAL_CELLS } from '../lib/scoring.js'

/**
 * Pick the feedback message for a score.
 * @param {number} total
 * @returns {string}
 */
function messageFor(total) {
  if (total === TOTAL_CELLS) return 'Perfect. Every layer is in the right place.'
  if (total >= 24) return 'Nearly there. Check the red tiles and try again.'
  return 'Have another go. Read the notes below, then retry the red tiles.'
}

/**
 * @param {{
 *   total: number,
 *   scores: Record<string, number>,
 *   headingRef: import('react').Ref<HTMLHeadingElement>
 * }} props
 * @returns {JSX.Element}
 */
export default function ResultSummary({ total, scores, headingRef }) {
  return (
    <section className="results" aria-labelledby="results-heading">
      <h2 id="results-heading" tabIndex={-1} ref={headingRef}>
        You got {total} of {TOTAL_CELLS} correct
      </h2>
      <p className="results-message">{messageFor(total)}</p>
      <div className="cards">
        {MODELS.map((model) => (
          <article key={model.id} className="card">
            <h3>
              {model.title} {model.subtitle.toLowerCase()}
              <span className="card-score">{scores[model.id]} / 8</span>
            </h3>
            <p>{model.explanation}</p>
            <p className="card-examples"><strong>Examples:</strong> {model.examples}</p>
          </article>
        ))}
      </div>
    </section>
  )
}