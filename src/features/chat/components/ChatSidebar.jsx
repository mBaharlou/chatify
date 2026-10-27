import { cn } from '@/lib/cn'
import { useDismiss } from '@/features/chat/useDismiss'

const ATTACHMENT_LABEL = { photo: '📷 Photo', video: '🎬 Video', file: '📎 File' }
const GITHUB = 'https://github.com/mBaharlou'

const menuItem ='flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-bubble focus-visible:bg-bubble focus-visible:outline-none'

/** Preview line under a chat's name: the last message (with the sender in groups). */
function preview(chat) {
  const last = chat.messages.at(-1)
  if (!last) return 'No messages yet'
  const what = last.attachment ? ATTACHMENT_LABEL[last.attachment.kind] : last.text
  if (last.author === 'me') return `You: ${what}`
  return chat.isGroup ? `${last.author}: ${what}` : what
}

/**
 * Left column listing chats. Clicking the open chat again shows its options (pin, clear, delete).
 * `menuId` is the chat whose options are showing; `onCloseMenu` hides them.
 */
export function ChatSidebar({ chats, activeId, menuId, onSelect, onCloseMenu, onTogglePin, onClear, onDelete, className }) {
  // The ref goes on the whole row, so clicking the chat itself toggles the menu instead of dismissing it.
  const menuRef = useDismiss(menuId !== null, onCloseMenu)

  return (
    <aside className={cn('w-full flex-col border-r border-bubble bg-surface md:w-72 lg:w-80', className)}>
      <h2 className="px-5 pt-4 pb-3 text-lg font-semibold">Chats</h2>
      {chats.length === 0 && <p className="px-5 text-sm text-muted">No chats yet. Start one with +.</p>}
      <ul className="flex-1 overflow-y-auto px-2 pb-2">
        {chats.map((chat) => (
          <li key={chat.id} ref={chat.id === menuId ? menuRef : undefined}>
            <button
              type="button"
              onClick={() => onSelect(chat.id)}
              aria-current={chat.id === activeId || undefined}
              aria-haspopup={chat.id === activeId ? 'menu' : undefined}
              aria-expanded={chat.id === activeId ? chat.id === menuId : undefined}
              title={chat.id === activeId ? 'Click again for options' : undefined}
              className={cn(
                'flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-primary',
                chat.id === activeId ? 'bg-bubble' : 'hover:bg-bubble/60',
              )}
            >
              <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full bg-primary font-semibold text-white">
                {chat.isGroup ? '👥' : chat.name[0].toUpperCase()}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="truncate font-medium">{chat.name}</span>
                  <span className="flex shrink-0 items-center gap-1 text-xs text-muted">
                    {chat.pinned && <span aria-label="Pinned">📌</span>}
                    {chat.messages.at(-1)?.time}
                  </span>
                </span>
                <span className="block truncate text-sm text-muted">{preview(chat)}</span>
              </span>
            </button>

            {chat.id === menuId && (
              <div
                role="menu"
                aria-label={`Options for ${chat.name}`}
                // On the last chats the menu would open below the fold; bring all three options into view.
                ref={(el) => el?.scrollIntoView({ block: 'nearest' })}
                className="mx-2 mt-1 mb-2 overflow-hidden rounded-xl border border-bubble bg-surface py-1 shadow-lg">
                <button type="button" role="menuitem" autoFocus onClick={() => onTogglePin(chat.id)} className={menuItem}>
                  📌 {chat.pinned ? 'Unpin chat' : 'Pin to top'}
                </button>
                <button type="button" role="menuitem" onClick={() => onClear(chat.id)} className={menuItem}>
                  🧹 Clear conversation
                </button>
                <button type="button" role="menuitem" onClick={() => onDelete(chat.id)} className={cn(menuItem, 'text-red-500')}>
                  🗑️ Delete chat
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <a
        href={GITHUB}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-2 border-t border-bubble px-5 py-3 text-sm font-medium text-muted transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-primary"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" className="size-5 fill-current">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
        mBaharlou
      </a>
    </aside>
  )
}
