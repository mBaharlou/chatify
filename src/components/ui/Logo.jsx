import { cn } from '@/lib/cn'

/**
 * The Chatify mascot on its own. Sized by `className` (e.g. `h-10 w-auto`).
 * `sleeping` closes its eyes and floats z's (animated in index.css); used for dark mode.
 * Add the `mascot-wink` class to make it wink its right eye once (used by the intro).
 */
export function LogoMark({ className, sleeping = false }) {
  return (
    <svg
      viewBox="0 1 84 84"
      className={cn('overflow-visible', className)}
      role="img"
      aria-label="Chatify"
      data-sleeping={sleeping || undefined}
    >
      <path
        d="M42 10c22 0 34 14 34 34v20c0 8-6 12-12 12H20c-6 0-12-4-12-12V44c0-20 12-34 34-34z"
        fill="#059669"
      />
      <g className="mascot-eye">
        <ellipse cx="30" cy="44" rx="7" ry="9" fill="#fff" />
        <circle cx="32" cy="46" r="3.5" fill="#022C22" />
      </g>
      <g className="mascot-eye mascot-eye-r">
        <ellipse cx="54" cy="44" rx="7" ry="9" fill="#fff" />
        <circle cx="56" cy="46" r="3.5" fill="#022C22" />
      </g>
      <g fill="none" stroke="#022C22" strokeWidth="3.5" strokeLinecap="round">
        <path className="mascot-lid" d="M23 44q7 6 14 0" />
        <path className="mascot-lid mascot-lid-r" d="M47 44q7 6 14 0" />
      </g>
      <g className="text-accent" fill="currentColor" fontFamily="'Baloo 2', sans-serif" fontWeight="800">
        <text className="mascot-z" x="66" y="16" fontSize="14">z</text>
        <text className="mascot-z" x="76" y="6" fontSize="11" style={{ animationDelay: '0.8s' }}>z</text>
      </g>
    </svg>
  )
}

/** Mascot + "chatify" wordmark. Scales with the font size set in `className`. */
export function Logo({ className }) {
  return (
    <span className={cn('inline-flex items-center gap-[0.3em] font-logo font-extrabold leading-none', className)}>
      <LogoMark className="h-[1.3em] w-auto" />
      <span aria-hidden="true">chatify</span>
    </span>
  )
}
