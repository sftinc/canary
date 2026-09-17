import './style.css'
import { MARKER } from './version'

const FORTNIGHT_HOURS = 14 * 24
const BUILT_AT = new Date(__BUILT_AT__)

function element(id: string): HTMLElement {
  const node = document.getElementById(id)
  if (!node) throw new Error(`The page is missing #${id}`)
  return node
}

/** 1 for the first hour after a build, easing to 0 once it is a fortnight old. */
function freshness(hours: number): number {
  if (hours <= 1) return 1
  return Math.max(0, 1 - (hours - 1) / (FORTNIGHT_HOURS - 1))
}

function phrase(hours: number): string {
  const minutes = Math.round(hours * 60)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  if (hours < 48) {
    const whole = Math.round(hours)
    return `${whole} hour${whole === 1 ? '' : 's'} ago`
  }
  const days = Math.round(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

/**
 * A line breaks at a hyphen, which tears a dated marker across two lines
 * mid-date. Each word goes in its own nowrap span so the marker still wraps
 * between words but never inside one.
 */
function setMarker(target: HTMLElement, marker: string): void {
  const words = marker.split(' ').filter((word) => word.length > 0)
  target.replaceChildren(
    ...words.flatMap((word, index) => {
      const span = document.createElement('span')
      span.style.whiteSpace = 'nowrap'
      span.textContent = word
      return index === 0 ? [span] : [document.createTextNode(' '), span]
    }),
  )
}

function formatBuiltAt(date: Date): string {
  return `${date.toISOString().slice(0, 16).replace('T', ' ')} UTC`
}

const ageLine = element('age')

function render(): void {
  const hours = (Date.now() - BUILT_AT.getTime()) / 3_600_000
  document.documentElement.style.setProperty('--freshness', String(freshness(hours)))
  ageLine.textContent = phrase(hours)
}

setMarker(element('marker'), MARKER)
element('commit').textContent = __DEPLOY_SHA__ ? __DEPLOY_SHA__.slice(0, 7) : 'built by hand'
element('built').textContent = formatBuiltAt(BUILT_AT)
document.title = `${MARKER} — canary`

render()
setInterval(render, 30_000)
