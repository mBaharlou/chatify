import { useCallback, useState } from 'react'
import { NewsChat } from '@/features/news/components/NewsChat'
import { timeAgo } from '@/features/news/timeAgo'

/** One story in the N feed, X-style, with its own discussion that opens underneath. */
export function NewsCard({ item, me }) {
  const [open, setOpen] = useState(false)
  const [count, setCount] = useState(item.messageCount)
  const onCount = useCallback((n) => setCount(n), [])

  return (
    <article className="flex gap-3 border-b border-bubble px-4 py-4">
      <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-bubble font-bold text-primary">
        {(item.source || '?')[0].toUpperCase()}
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-baseline gap-x-2 text-sm">
          <span className="font-semibold">{item.source || 'Unknown source'}</span>
          <span className="text-muted">{timeAgo(item.publishedAt)}</span>
        </p>
        <h3 className="mt-1 text-base leading-snug font-semibold">{item.title}</h3>
        <div className="mt-2 flex items-center gap-4 text-sm">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="cursor-pointer rounded-full px-2 py-1 font-medium text-primary hover:bg-bubble focus-visible:outline-2 focus-visible:outline-primary"
          >
            💬 {open ? 'Hide discussion' : 'Discuss'} {count > 0 && `(${count})`}
          </button>
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-fg hover:underline">
            Source ↗
          </a>
        </div>
        {open && <NewsChat newsId={item.id} me={me} onCount={onCount} />}
      </div>
    </article>
  )
}
