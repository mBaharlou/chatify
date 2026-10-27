import { useCallback, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { cn } from '@/lib/cn'
import { EmojiPicker } from '@/features/chat/components/EmojiPicker'
import { useDismiss } from '@/features/chat/useDismiss'
import { TEXT_SIZES } from '@/features/settings/useSettings'

// The three attach buttons next to Send: what each one accepts and how a message shows it.
const ATTACH = [
  { kind: 'photo', icon: '📷', label: 'Send a photo', accept: 'image/*' },
  { kind: 'video', icon: '🎬', label: 'Send a video', accept: 'video/*' },
  { kind: 'file', icon: '📎', label: 'Send a file', accept: undefined },
]
const iconButton =
  'grid size-10 shrink-0 cursor-pointer place-items-center rounded-full text-xl transition-transform hover:scale-110 has-focus-visible:outline-2 has-focus-visible:outline-primary'

/** A photo, video or file inside a bubble. */
function Attachment({ attachment: a, mine }) {
  if (a.kind === 'photo') return <img src={a.url} alt={a.name} className="max-h-72 rounded-xl" />
  if (a.kind === 'video') return <video src={a.url} controls className="max-h-72 rounded-xl" />
  return (
    <a href={a.url} download={a.name} className={cn('flex items-center gap-2 font-medium underline-offset-2 hover:underline', mine ? 'text-white' : 'text-primary')}>
      📎 <span className="truncate">{a.name}</span>
    </a>
  )
}

/** The open conversation: header, messages, and the box to write a new one. `settings` sets its theme, text size and times. */
export function ChatWindow({ chat, settings, onSend, onBack }) {
  const [text, setText] = useState('')
  const listRef = useRef(null)
  const inputRef = useRef(null)
  // Phones and tablets: the three attach buttons fold into one 📎 menu so the text box keeps its width.
  const [attachOpen, setAttachOpen] = useState(false)
  const closeAttach = useCallback(() => setAttachOpen(false), [])
  const attachRef = useDismiss(attachOpen, closeAttach)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [chat.messages.length])

  function send(e) {
    e.preventDefault()
    const t = text.trim()
    if (!t) return
    onSend({ text: t.slice(0, 2000) })
    setText('')
  }

  // Put the emoji where the cursor is, then keep typing after it.
  function addEmoji(emoji) {
    const input = inputRef.current
    const start = input.selectionStart ?? text.length
    const end = input.selectionEnd ?? text.length
    // flushSync writes the new value into the input first, so the cursor can be placed after the emoji.
    flushSync(() => setText(text.slice(0, start) + emoji + text.slice(end)))
    input.focus()
    input.setSelectionRange(start + emoji.length, start + emoji.length)
  }

  function attach(kind, e) {
    const file = e.target.files[0]
    e.target.value = '' // so picking the same file again still fires onChange
    setAttachOpen(false)
    if (!file) return
    // shortcut: the file stays in this tab as a blob URL and is never uploaded; send it to a server once 1:1 chat has a backend.
    onSend({ text: '', attachment: { kind, name: file.name, url: URL.createObjectURL(file) } })
  }

  return (
    <section data-chat-theme={settings.chatTheme} className="flex min-w-0 flex-1 flex-col bg-bg text-fg">
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
                TEXT_SIZES.find((s) => s.id === settings.textSize)?.className,
                mine ? 'self-end rounded-br-md bg-primary text-white' : 'self-start rounded-bl-md bg-surface',
              )}
            >
              {chat.isGroup && !mine && <span className="block text-xs font-semibold text-primary">{msg.author}</span>}
              {msg.attachment && <Attachment attachment={msg.attachment} mine={mine} />}
              {msg.text}
              {settings.showTimes && (
                <span className={cn('mt-0.5 block text-right text-[11px]', mine ? 'text-white/75' : 'text-muted')}>{msg.time}</span>
              )}
            </li>
          )
        })}
      </ul>

      <form onSubmit={send} className="flex items-center gap-1 border-t border-bubble bg-surface p-3 sm:gap-2">
        <EmojiPicker onPick={addEmoji} />
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={2000}
          placeholder="Write a message…"
          aria-label={`Message ${chat.name}`}
          autoFocus
          className="min-w-0 flex-1 rounded-full border border-bubble bg-bg px-4 py-2.5 text-fg placeholder:text-muted focus:border-primary focus:outline-none"
        />
        <div ref={attachRef} className="relative">
          <button
            type="button"
            onClick={() => setAttachOpen((o) => !o)}
            aria-label="Attach a photo, video or file"
            aria-expanded={attachOpen}
            className={cn(iconButton, 'lg:hidden')}
          >
            📎
          </button>
          <div
            className={cn(
              'gap-2 lg:flex',
              attachOpen
                ? 'absolute right-0 bottom-full z-10 mb-2 flex flex-col rounded-xl border border-bubble bg-surface p-1 shadow-lg lg:static lg:mb-0 lg:flex-row lg:border-0 lg:p-0 lg:shadow-none'
                : 'hidden',
            )}
          >
            {ATTACH.map((a) => (
              <label key={a.kind} title={a.label} className={iconButton}>
                <span aria-hidden="true">{a.icon}</span>
                <input type="file" accept={a.accept} aria-label={a.label} onChange={(e) => attach(a.kind, e)} className="sr-only" />
              </label>
            ))}
          </div>
        </div>
        <button
          type="submit"
          disabled={!text.trim()}
          aria-label="Send"
          className="h-10 shrink-0 cursor-pointer rounded-full bg-primary px-4 font-semibold text-white hover:brightness-110 disabled:cursor-default disabled:opacity-50 sm:px-5"
        >
          <span aria-hidden="true" className="sm:hidden">
            ➤
          </span>
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </section>
  )
}
