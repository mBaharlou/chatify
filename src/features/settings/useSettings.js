import { useEffect, useState } from 'react'

/** Chat themes; the colours live in index.css under [data-chat-theme]. */
export const CHAT_THEMES = [
  { id: 'emerald', label: 'Emerald' },
  { id: 'ocean', label: 'Ocean' },
  { id: 'sunset', label: 'Sunset' },
  { id: 'lavender', label: 'Lavender' },
  { id: 'graphite', label: 'Graphite' },
]

export const TEXT_SIZES = [
  { id: 'sm', label: 'Small', className: 'text-sm' },
  { id: 'md', label: 'Medium', className: 'text-base' },
  { id: 'lg', label: 'Large', className: 'text-lg' },
]

export const DEFAULT_SETTINGS = { chatTheme: 'emerald', textSize: 'md', showTimes: true, showPreviews: true }

const KEY = 'settings'

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY))
    // Keep only known keys, so an old or edited value can't break the page.
    return Object.fromEntries(Object.entries(DEFAULT_SETTINGS).map(([k, v]) => [k, typeof saved?.[k] === typeof v ? saved[k] : v]))
  } catch {
    return DEFAULT_SETTINGS
  }
}

/** Chat settings, saved in this browser. Returns [settings, update(change)]. */
export function useSettings() {
  const [settings, setSettings] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(settings))
    } catch {
      // Storage can be blocked (private mode); settings still work for this visit.
    }
  }, [settings])

  return [settings, (change) => setSettings((s) => ({ ...s, ...change }))]
}
