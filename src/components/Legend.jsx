/**
 * Key explaining the three tile colours.
 * @module components/Legend
 */
import { Dot } from './Icons.jsx'

/**
 * @returns {JSX.Element}
 */
export default function Legend() {
  return (
    <ul className="legend" aria-label="Colour key">
      <li><Dot tone="unanswered" /> Not chosen yet</li>
      <li><Dot tone="you" /> You manage</li>
      <li><Dot tone="provider" /> Cloud provider manages</li>
    </ul>
  )
}