import { useState } from 'react'
import { NLogo } from '@/components/ui/NLogo'
import { cn } from '@/lib/cn'
import { NewChatForm } from '@/features/chat/components/NewChatForm'
import { MOCK_CONVERSATIONS } from '@/features/chat/mockConversations'

const iconButton =
  'grid size-9 cursor-pointer place-items-center rounded-full text-fg transition hover:bg-bubble focus-visible:outline-2 focus-visible:outline-primary'

/** Left column listing the user's conversations, with "N" (news) and "+" (new chat) buttons on top. */
export function ChatSidebar({ onOpenNews }) {
  // shortcut: chats live in memory only, so new ones vanish on reload; persist them once the backend has users.
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS)
  const [activeId, setActiveId] = useState(null)
  const [creating, setCreating] = useState(false)

  function createChat(name) {
    const chat = { id: crypto.randomUUID(), name, lastMessage: 'New chat - say hi 👋', time: 'now' }
    setConversations((list) => [chat, ...list])
    setActiveId(chat.id)
    setCreating(false)
  }

  return (
    <aside className="flex w-full flex-col border-r border-bubble bg-surface md:w-80">
      <div className="flex items-center gap-1 px-5 pt-4 pb-3">
        <h2 className="flex-1 text-lg font-semibold">Chats</h2>
        <button type="button" onClick={onOpenNews} aria-label="Open N news" title="N news" className={cn(iconButton, 'text-sm')}>
          <NLogo />
        </button>
        <button
          type="button"
          onClick={() => setCreating((open) => !open)}
          aria-label="New chat"
          aria-expanded={creating}
          title="New chat"
          className={cn(iconButton, 'text-2xl leading-none', creating && 'bg-bubble')}
        >
          +
        </button>
      </div>

      {creating && <NewChatForm onCreate={createChat} onCancel={() => setCreating(false)} />}

      <ul className="flex-1 overflow-y-auto px-2 pb-2">
        {conversations.map((chat) => (
          <li key={chat.id}>
            <button
              type="button"
              onClick={() => setActiveId(chat.id)}
              aria-current={chat.id === activeId || undefined}
              className={cn(
                'flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-primary',
                chat.id === activeId ? 'bg-bubble' : 'hover:bg-bubble/60',
              )}
            >
              <span
                aria-hidden="true"
                className="grid size-11 shrink-0 place-items-center rounded-full bg-primary font-semibold text-white"
              >
                {chat.name[0].toUpperCase()}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="truncate font-medium">{chat.name}</span>
                  <span className="shrink-0 text-xs text-muted">{chat.time}</span>
                </span>
                <span className="block truncate text-sm text-muted">{chat.lastMessage}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
