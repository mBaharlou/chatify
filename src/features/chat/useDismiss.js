import { useEffect, useRef } from 'react'

/** While `active`, calls `onDismiss` on Escape or on a click outside the element the returned ref is attached to. */
export function useDismiss(active, onDismiss) {
  const ref = useRef(null)
  useEffect(() => {
    if (!active) return
    const onDown = (e) => !ref.current?.contains(e.target) && onDismiss()
    const onKey = (e) => e.key === 'Escape' && onDismiss()
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [active, onDismiss])
  return ref
}
