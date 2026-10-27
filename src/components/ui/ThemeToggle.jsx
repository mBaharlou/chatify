import { useState } from 'react'
import { LogoMark } from '@/components/ui/Logo'

/** Light/dark switch drawn as the mascot: awake in light mode, asleep in dark mode. */
export function ThemeToggle() {
  // index.html already set data-theme before React started.
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme)
  const dark = theme === 'dark'

  function toggle() {
    const next = dark ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('theme', next)
    } catch {
      // Storage can be blocked (private mode); the switch still works for this visit.
    }
    setTheme(next)
  }

  const label = dark ? 'Wake up (switch to light mode)' : 'Go to sleep (switch to dark mode)'
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="grid size-12 cursor-pointer place-items-center rounded-full transition-transform hover:-rotate-6 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-95"
    >
      <LogoMark sleeping={dark} className="h-7 w-auto drop-shadow-[0_5px_6px_rgb(0_0_0/0.25)]" />
    </button>
  )
}
