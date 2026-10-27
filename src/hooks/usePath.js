import { useSyncExternalStore } from 'react'

// Two routes only ('/' and '/n'), so the History API is enough - no router library.
const subscribe = (onChange) => {
  addEventListener('popstate', onChange)
  return () => removeEventListener('popstate', onChange)
}

/** The current URL path; re-renders on navigate() and on back/forward. */
export const usePath = () => useSyncExternalStore(subscribe, () => location.pathname)

export function navigate(to) {
  if (location.pathname === to) return
  history.pushState(null, '', to)
  dispatchEvent(new PopStateEvent('popstate'))
}
