import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App.jsx'
import { LAYERS, MODELS, correctOwner } from './data/serviceModels.js'
import { cellKey } from './lib/cells.js'

/** Click a tile until it shows the wanted owner (1 click = you, 2 = provider). */
async function setTile(user, tile, owner) {
  await user.click(tile)
  if (owner === 'provider') await user.click(tile)
}

/** Answer every tile correctly, optionally deliberately getting one wrong. */
async function fillGrid(user, { skip = 0, wrongKey = null } = {}) {
  const tiles = document.querySelectorAll('.tile')
  let n = 0
  for (const model of MODELS) {
    for (let i = 0; i < LAYERS.length; i++) {
      const key = cellKey(model.id, LAYERS[i].id)
      const tile = document.querySelector(`[data-cell="${key}"]`)
      n++
      if (n > tiles.length - skip) return
      let owner = correctOwner(model, i)
      if (key === wrongKey) owner = owner === 'you' ? 'provider' : 'you'
      await setTile(user, tile, owner)
    }
  }
}

const submit = () => screen.getByRole('button', { name: 'Submit' })

describe('App', () => {
  it('starts with 32 grey tiles', () => {
    render(<App />)
    const tiles = document.querySelectorAll('.tile')
    expect(tiles).toHaveLength(32)
    tiles.forEach((t) => expect(t).toHaveAttribute('data-state', 'unanswered'))
  })

  it('disables submit at 31 answers and enables it at 32', async () => {
    const user = userEvent.setup()
    render(<App />)
    await fillGrid(user, { skip: 1 })
    expect(submit()).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByText(/1 to go/)).toBeInTheDocument()
    await setTile(user, document.querySelector('[data-cell="saas.storage"]'), 'provider')
    expect(submit()).not.toHaveAttribute('aria-disabled')
  })

  it('marks a deliberately wrong tile', async () => {
    const user = userEvent.setup()
    render(<App />)
    await fillGrid(user, { wrongKey: 'iaas.runtime' })
    await user.click(submit())
    const wrong = document.querySelector('[data-cell="iaas.runtime"]')
    expect(wrong).toHaveAttribute('data-result', 'wrong')
    expect(wrong.querySelector('.icon-cross')).toBeInTheDocument()
    expect(screen.getByText('You got 31 of 32 correct')).toBeInTheDocument()
  })

  it('reset returns every tile to unanswered', async () => {
    const user = userEvent.setup()
    render(<App />)
    await fillGrid(user)
    await user.click(submit())
    await user.click(screen.getByRole('button', { name: 'Reset' }))
    document
      .querySelectorAll('.tile')
      .forEach((t) => expect(t).toHaveAttribute('data-state', 'unanswered'))
  })
})