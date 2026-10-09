/**
 * Vitest setup: adds jest-dom matchers and cleans up the DOM between tests.
 * @module test-setup
 */
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => cleanup())