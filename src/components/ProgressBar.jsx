/**
 * Native progress element showing how many tiles are answered.
 * @module components/ProgressBar
 */

/**
 * @param {{ answered: number, total: number }} props
 * @returns {JSX.Element}
 */
export default function ProgressBar({ answered, total }) {
  return (
    <div className="progress">
      <label htmlFor="progress-bar">
        {answered} of {total} answered
      </label>
      <progress id="progress-bar" value={answered} max={total} />
    </div>
  )
}