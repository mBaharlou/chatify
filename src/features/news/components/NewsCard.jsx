import { useCallback, useState } from 'react'
import { NewsChat } from '@/features/news/components/NewsChat'
import { timeAgo } from '@/features/news/timeAgo'

/** One story in the N feed: source, photo, headline, summary, and its own discussion underneath. */
export function NewsCard({ item, me }) {
  const [open, setOpen] = useState(false)
  const [count, setCount] = useState(item.messageCount)
  const [imageOk, setImageOk] = useState(Boolean(item.image))
  const onCount = useCallback((n) => setCount(n), [])

  return (
    <article className="border-b border-bubble px-5 py-6">
      <p className="flex items-center gap-3 text-sm">
        <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-bubble font-bold text-primary">
          {(item.source || '?')[0].toUpperCase()}
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate font-semibold">{item.source || 'Unknown source'}</span>
          <span className="text-xs text-muted">{timeAgo(item.publishedAt)}</span>
        </span>
      </p>

      <h3 className="mt-3 text-xl leading-snug font-bold">{item.title}</h3>

      {imageOk && (
        <img
          src={item.image}
          alt=""
          loading="lazy"
          onError={() => setImageOk(false)}
          className="mt-3 aspect-[1.91/1] w-full rounded-2xl border border-bubble object-cover"
        />
      )}

      {item.summary && <p className="mt-3 text-[15px] leading-relaxed text-fg/85">{item.summary}</p>}

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="cursor-pointer rounded-full bg-bubble px-4 py-2 font-semibold text-primary hover:brightness-95 focus-visible:outline-2 focus-visible:outline-primary"
        >
          💬 {open ? 'Hide discussion' : 'Discuss'} {count > 0 && `(${count})`}
        </button>
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-fg hover:underline">
          Read the full story at {item.source || 'the source'} ↗
        </a>
      </div>

      {open && <NewsChat newsId={item.id} me={me} onCount={onCount} />}
    </article>
  )
}
