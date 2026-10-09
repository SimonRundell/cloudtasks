/**
 * Cloud responsibility grid: root component.
 * Owns focus management and screen reader announcements.
 * @module App
 */
import { useEffect, useRef, useState } from 'react'
import useActivity from './hooks/useActivity.js'
import { LAYERS, MODELS } from './data/serviceModels.js'
import { cellKey } from './lib/cells.js'
import { TOTAL_CELLS, answeredCount, cellResult, isComplete, scoreByModel, totalScore } from './lib/scoring.js'
import Header from './components/Header.jsx'
import Instructions from './components/Instructions.jsx'
import ProgressBar from './components/ProgressBar.jsx'
import ServiceModelGrid from './components/ServiceModelGrid.jsx'
import Legend from './components/Legend.jsx'
import ControlBar from './components/ControlBar.jsx'
import ResultSummary from './components/ResultSummary.jsx'
import LiveRegion from './components/LiveRegion.jsx'
import Footer from './components/Footer.jsx'
import CMFloatAd from './components/CMFloatAd.jsx'

const OWNER_TEXT = { you: 'You manage', provider: 'Provider manages' }
const MILESTONES = [8, 16, 24, 32]

/**
 * @returns {JSX.Element}
 */
export default function App() {
  const { state, cycle, submit, retry, toggleReveal, reset } = useActivity()
  const [announcement, setAnnouncement] = useState('')
  const gridRef = useRef(null)
  const headingRef = useRef(null)

  const { answers, phase, revealed } = state
  const answered = answeredCount(answers)
  const complete = isComplete(answers)
  const total = totalScore(answers)

  // After submitting, move focus to the results heading.
  useEffect(() => {
    if (phase === 'checked') headingRef.current?.focus()
  }, [phase])

  /**
   * Focus a tile by its cell key.
   * @param {string} key
   */
  function focusTile(key) {
    gridRef.current?.querySelector(`[data-cell="${key}"]`)?.focus()
  }

  /**
   * Cycle a tile and announce the change and any progress milestone.
   * @param {string} key
   */
  function handleCycle(key) {
    const layerId = key.split('.')[1]
    const layer = LAYERS.find((l) => l.id === layerId)
    const next = { you: 'provider', provider: undefined }[answers[key]] ?? 'you'
    const nextCount = answered + (answers[key] === undefined ? 1 : next === undefined ? -1 : 0)
    let message = `${layer.label} set to ${next ? OWNER_TEXT[next] : 'not chosen'}`
    if (nextCount !== answered && MILESTONES.includes(nextCount)) {
      message += `. ${nextCount} of ${TOTAL_CELLS} answered`
    }
    setAnnouncement(message)
    cycle(key)
  }

  /** Submit and announce the score. */
  function handleSubmit() {
    setAnnouncement(`Checked. You got ${total} of ${TOTAL_CELLS} correct`)
    submit()
  }

  /** Unlock the grid and focus the first wrong tile. */
  function handleRetry() {
    let firstWrong = null
    for (const model of MODELS) {
      LAYERS.forEach((layer, i) => {
        if (!firstWrong && cellResult(model, i, answers) === 'wrong') firstWrong = cellKey(model.id, layer.id)
      })
    }
    retry()
    setAnnouncement('Try again. Fix the red tiles')
    if (firstWrong) focusTile(firstWrong)
  }

  /** Clear everything and focus the first tile. */
  function handleReset() {
    reset()
    setAnnouncement('Activity reset')
    focusTile(cellKey(MODELS[0].id, LAYERS[0].id))
  }

  return (
    <div className="page">
      <Header />
      <Instructions />
      <ProgressBar answered={answered} total={TOTAL_CELLS} />
      <ServiceModelGrid
        answers={answers}
        phase={phase}
        revealed={revealed}
        onCycle={handleCycle}
        gridRef={gridRef}
      />
      <Legend />
      <ControlBar
        canSubmit={complete}
        remaining={TOTAL_CELLS - answered}
        phase={phase}
        revealed={revealed}
        perfect={total === TOTAL_CELLS}
        onSubmit={handleSubmit}
        onReset={handleReset}
        onRetry={handleRetry}
        onToggleReveal={toggleReveal}
      />
      {phase === 'checked' && (
        <ResultSummary total={total} scores={scoreByModel(answers)} headingRef={headingRef} />
      )}
      <LiveRegion message={announcement} />
      <Footer />
      <CMFloatAd />
    </div>
  )
}