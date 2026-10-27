import { cn } from '@/lib/cn'

/** The "N" news brand: the letter in Unbounded plus a tall four-point star. Scales with font size. */
export function NLogo({ className }) {
  return (
    <span className={cn('inline-flex items-center gap-[0.12em] font-n leading-none', className)}>
      <span>N</span>
      <svg viewBox="0 0 20 40" className="h-[1.1em] w-auto text-accent" aria-hidden="true">
        <path d="M10 0Q11.5 18 18 20Q11.5 22 10 40Q8.5 22 2 20Q8.5 18 10 0Z" fill="currentColor" />
      </svg>
    </span>
  )
}
