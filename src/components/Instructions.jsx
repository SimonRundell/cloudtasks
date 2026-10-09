/**
 * Short, collapsible how-to. Open by default.
 * @module components/Instructions
 */

/**
 * @returns {JSX.Element}
 */
export default function Instructions() {
  return (
    <details className="instructions" open>
      <summary>How it works</summary>
      <ol>
        <li>Each column is a way of running your IT: from your own server room to software you rent.</li>
        <li>Each row is a layer, from your data at the top to the physical storage at the bottom.</li>
        <li>Click a tile to choose who looks after that layer: You, or the Cloud provider.</li>
        <li>Press Submit when every tile has an answer. Red tiles are wrong. You can try again.</li>
      </ol>
    </details>
  )
}