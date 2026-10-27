import { useEffect, useState } from 'react'
import { COUNTRIES } from '#shared/countries'
import { NEWS_CATEGORIES } from '#shared/newsCategories'
import { NLogo } from '@/components/ui/NLogo'
import { navigate } from '@/hooks/usePath'
import { cn } from '@/lib/cn'
import { NewsCard } from '@/features/news/components/NewsCard'

/** N: an X-style feed of real news, filtered by country and category, each story with its own chat. */
export function NewsPage({ me }) {
  const [country, setCountry] = useState('')
  const [category, setCategory] = useState('all')
  const [state, setState] = useState({ status: 'loading', items: [] })

  // Show "loading" right when a filter changes; the effect below does the fetch.
  const filterBy = (setter) => (value) => {
    setState((s) => ({ ...s, status: 'loading' }))
    setter(value)
  }
  const pickCountry = filterBy(setCountry)
  const pickCategory = filterBy(setCategory)

  useEffect(() => {
    const ctrl = new AbortController()
    fetch(`/api/news?${new URLSearchParams({ country, category })}`, { signal: ctrl.signal })
      // A down API makes Vite's proxy answer 502 with an empty body, so don't parse error bodies blindly.
      .then(async (r) => {
        if (r.ok) return r.json()
        const body = await r.json().catch(() => null)
        throw new Error(body?.error ?? 'The news server is not running. Start the app with "npm run dev".')
      })
      .then((items) => setState({ status: 'ready', items }))
      .catch((err) => err.name !== 'AbortError' && setState({ status: 'error', items: [], error: err.message }))
    return () => ctrl.abort()
  }, [country, category])

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto min-h-full max-w-3xl border-x border-bubble bg-surface">
        {/* Not pinned on short screens (phones held sideways), where it would cover most of the feed. */}
        <div className="sticky top-0 z-10 border-b [@media(max-height:500px)]:static border-bubble bg-surface/90 backdrop-blur">
          <div className="flex items-center justify-between px-4 pt-3">
            <NLogo className="text-2xl" />
            <button
              type="button"
              onClick={() => navigate('/')}
              className="cursor-pointer rounded-full border border-bubble px-4 py-1.5 text-sm font-semibold hover:bg-bubble focus-visible:outline-2 focus-visible:outline-primary"
            >
              ← Chats
            </button>
          </div>

          <div className="flex flex-col gap-2 px-4 py-3">
            <label className="flex items-center gap-2 text-sm">
              <span className="text-muted">Country</span>
              <select
                value={country}
                onChange={(e) => pickCountry(e.target.value)}
                className="min-w-0 flex-1 cursor-pointer rounded-lg border border-bubble bg-bg px-3 py-1.5 text-fg focus:border-primary focus:outline-none"
              >
                <option value="">🌍 Worldwide</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <div role="radiogroup" aria-label="Category" className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
              {NEWS_CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={category === c.id}
                  onClick={() => pickCategory(c.id)}
                  className={cn(
                    'shrink-0 cursor-pointer rounded-full px-3 py-1 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-primary',
                    category === c.id ? 'bg-primary text-white' : 'bg-bubble text-fg hover:brightness-95',
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {state.status === 'loading' && <p className="p-6 text-center text-muted">Loading the latest news…</p>}
        {state.status === 'error' && (
          <p role="alert" className="p-6 text-center text-red-500">
            {state.error || 'Could not load the news'}
          </p>
        )}
        {state.status === 'ready' && state.items.length === 0 && (
          <p className="p-6 text-center text-muted">No news found for this filter in the last 7 days.</p>
        )}
        {state.status === 'ready' && state.items.map((item) => <NewsCard key={item.id} item={item} me={me} />)}
      </div>
    </div>
  )
}
