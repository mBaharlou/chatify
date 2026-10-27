import { LogoMark } from '@/components/ui/Logo'

/**
 * Full-screen intro that pops its content in, holds, then zooms it away. Calls `onDone` when faded out.
 * Shows the winking mascot unless `children` are given (the N page passes its own welcome).
 */
export function Splash({ onDone, children }) {
  return (
    <div
      aria-hidden="true"
      className="splash fixed inset-0 z-50 grid place-items-center bg-bg"
      // Child animations (the wink) bubble up too, so wait for the container's own fade.
      onAnimationEnd={(e) => e.animationName === 'splash-out' && onDone()}
    >
      <div className="splash-logo">
        {children ?? <LogoMark className="mascot-wink h-40 w-auto drop-shadow-[0_12px_16px_rgb(0_0_0/0.25)]" />}
      </div>
    </div>
  )
}
