/**
 * Small inline SVG icons. All are decorative (aria-hidden).
 * @module components/Icons
 */

/**
 * Tick icon for correct tiles.
 * @returns {JSX.Element}
 */
export function TickIcon() {
  return (
    <svg className="icon icon-tick" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M2.5 8.5l3.5 3.5 7.5-8" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * Cross icon for wrong tiles.
 * @returns {JSX.Element}
 */
export function CrossIcon() {
  return (
    <svg className="icon icon-cross" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" fill="none" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

/**
 * Coloured dot for the legend.
 * @param {{ tone: 'unanswered' | 'you' | 'provider' }} props
 * @returns {JSX.Element}
 */
export function Dot({ tone }) {
  return (
    <svg className={`dot dot-${tone}`} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <circle cx="8" cy="8" r="7" />
    </svg>
  )
}