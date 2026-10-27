import { useEffect, useRef, useState } from 'react'
import { EVENTS } from '#shared/events'
import { cn } from '@/lib/cn'
import { socket } from '@/services/socket'

/** Live discussion under one news story. `me` is the signed-in display name. */
export function NewsChat({ newsId, me, onCount }) {
  const [messages, setMessages] = useState(null)
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const listRef = useRef(null)

  useEffect(() => {
    let alive = true
    fetch(`/api/news/${newsId}/messages`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((rows) => alive && setMessages(rows))
      .catch(() => alive && setError('Could not load the discussion'))

    const onMessage = (msg) => msg.newsId === newsId && setMessages((list) => [...(list ?? []), msg])
    socket.emit(EVENTS.join, newsId)
    socket.on(EVENTS.message, onMessage)
    return () => {
      alive = false
      socket.emit(EVENTS.leave, newsId)
      socket.off(EVENTS.message, onMessage)
    }
  }, [newsId])

  useEffect(() => {
    if (messages) onCount(messages.length)
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [messages, onCount])

  function send(e) {
    e.preventDefault()
    if (!text.trim()) return
    socket.emit(EVENTS.send, { newsId, author: me, text }, (reply) => {
      if (reply?.error) return setError(reply.error)
      setText('')
      setError('')
    })
  }

  return (
    <div className="mt-3 rounded-xl border border-bubble bg-bg">
      <ul ref={listRef} className="flex max-h-64 flex-col gap-2 overflow-y-auto p-3" aria-live="polite">
        {messages === null && !error && <li className="text-sm text-muted">Loading the discussion…</li>}
        {messages?.length === 0 && <li className="text-sm text-muted">No messages yet - start the discussion.</li>}
        {messages?.map((m) => (
          <li key={m.id} className={cn('max-w-[85%] rounded-2xl px-3 py-2 text-sm', m.author === me ? 'self-end bg-primary text-white' : 'bg-bubble')}>
            <span className="block text-xs font-semibold opacity-80">
              {m.author === me ? 'You' : m.author} ·{' '}
              {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {m.text}
          </li>
        ))}
      </ul>
      <form onSubmit={send} className="flex gap-2 border-t border-bubble p-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={500}
          placeholder="Share your thoughts…"
          aria-label="Message about this story"
          className="min-w-0 flex-1 rounded-full border border-bubble bg-surface px-4 py-2 text-sm text-fg placeholder:text-muted focus:border-primary focus:outline-none"
        />
        <button type="submit" className="cursor-pointer rounded-full bg-primary px-4 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50" disabled={!text.trim()}>
          Send
        </button>
      </form>
      {error && (
        <p role="alert" className="px-3 pb-2 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}
