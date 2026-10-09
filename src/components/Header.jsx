/**
 * Page title and one-line instruction.
 * @module components/Header
 */

/**
 * @returns {JSX.Element}
 */
export default function Header() {
  return (
    <header className="header">
      <h1>Who manages what? Cloud responsibility grid</h1>
      <p className="lead">
        Click each tile to decide who is responsible for that layer. Click once for green (you),
        twice for blue (the cloud provider), three times to clear it. Answer all 32 tiles, then
        press Submit.
      </p>
    </header>
  )
}