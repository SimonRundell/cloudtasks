/**
 * Visually hidden aria-live region for screen reader announcements.
 * @module components/LiveRegion
 */

/**
 * @param {{ message: string }} props
 * @returns {JSX.Element}
 */
export default function LiveRegion({ message }) {
  return (
    <div className="visually-hidden" role="status" aria-live="polite">
      {message}
    </div>
  )
}