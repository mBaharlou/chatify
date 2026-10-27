const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto', style: 'short' })
const STEPS = [
  ['day', 86400],
  ['hour', 3600],
  ['minute', 60],
]

/** "3 hr. ago" style label for an ISO date, or '' when unknown. */
export function timeAgo(iso) {
  if (!iso) return ''
  const seconds = (new Date(iso).getTime() - Date.now()) / 1000
  for (const [unit, size] of STEPS) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit)
  }
  return 'just now'
}
