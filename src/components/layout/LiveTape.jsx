import { LogoMark } from '@/components/ui/Logo'

const WORDS = ['Chat', 'Connect', 'Share', 'Private', 'Friendly', 'Fast', 'Say hi']

/** Full-width "live tape": a row of words sliding right to left forever. Decorative only. */
export function LiveTape() {
  // Two copies so the -50% loop has no seam.
  const words = [...WORDS, ...WORDS]
  return (
    <div aria-hidden="true" dir="ltr" className="live-tape overflow-hidden border-y border-bubble bg-surface pt-1 pb-2">
      <div className="live-tape-track gap-8 pe-8">
        {words.map((word, i) => (
          <span key={i} className="flex items-center gap-8 whitespace-nowrap text-lg leading-none font-black tracking-[-0.02em] sm:text-xl">
            <span className={i % 3 === 0 ? 'text-primary' : 'text-fg'}>{word}</span>
            <LogoMark className="h-[1em] w-auto" />
          </span>
        ))}
      </div>
    </div>
  )
}
