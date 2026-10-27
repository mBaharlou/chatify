import { ThemeToggle } from '@/components/ui/ThemeToggle'

/** Row under the live tape: page actions on the left (`children`), the theme toggle on the right. */
export function TopBar({ children }) {
  return (
    <header className="relative z-20 flex items-center gap-2 px-4 py-2">
      {children}
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </header>
  )
}
