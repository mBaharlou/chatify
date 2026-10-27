import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'

/** The open conversation: header, messages, and the box to write a new one. */
export function ChatWindow({ chat, onSend, onBack }) {
  const [text, setText] = useState('')
  const listRef = useRef(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [chat.messages.length])

  function send(e) {
    e.preventDefault()
    const t = text.trim()
    if (!t) return
    onSend(t.slice(0, 2000))
    setText('')
  }

  return (
    <section className="flex min-w-0 flex-1 flex-col bg-bg">
      <div className="flex items-center gap-3 border-b border-bubble bg-surface px-4 py-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to chats"
          className="grid size-9 cursor-pointer place-items-center rounded-full text-xl hover:bg-bubble md:hidden"
        >
          ←
        </button>
        <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-primary font-semibold text-white">
          {chat.isGroup ? '👥' : chat.name[0].toUpperCase()}
        </span>
        <div className="min-w-0">
          <h2 className="truncate font-semibold">{chat.name}</h2>
          <p className="text-xs text-muted">{chat.isGroup ? 'Group' : 'Chat'}</p>
        </div>
      </div>

      <ul ref={listRef} className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-4" aria-live="polite">
        {chat.messages.length === 0 && <li className="m-auto text-sm text-muted">No messages yet - say hi 👋</li>}
        {chat.messages.map((msg) => {
          const mine = msg.author === 'me'
          return (
            <li
              key={msg.id}
              className={cn(
                'max-w-[75%] rounded-2xl px-4 py-2 break-words',
                mine ? 'self-end rounded-br-md bg-primary text-white' : 'self-start rounded-bl-md bg-surface',
              )}
            >
              {chat.isGroup && !mine && <span className="block text-xs font-semibold text-primary">{msg.author}</span>}
              {msg.text}
              <span className={cn('mt-0.5 block text-right text-[11px]', mine ? 'text-white/75' : 'text-muted')}>{msg.time}</span>
            </li>
          )
        })}
      </ul>

      <form onSubmit={send} className="flex gap-2 border-t border-bubble bg-surface p-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={2000}
          placeholder="Write a message…"
          aria-label={`Message ${chat.name}`}
          autoFocus
          className="min-w-0 flex-1 rounded-full border border-bubble bg-bg px-4 py-2.5 text-fg placeholder:text-muted focus:border-primary focus:outline-none"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="cursor-pointer rounded-full bg-primary px-5 font-semibold text-white hover:brightness-110 disabled:cursor-default disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </section>
  )
}
