import { useCallback, useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { NLogo } from '@/components/ui/NLogo'
import { ChatSidebar } from '@/features/chat/components/ChatSidebar'
import { ChatWindow } from '@/features/chat/components/ChatWindow'
import { NewChatMenu } from '@/features/chat/components/NewChatMenu'
import { MOCK_CONVERSATIONS } from '@/features/chat/mockConversations'
import { SettingsDialog } from '@/features/settings/components/SettingsDialog'
import { useSettings } from '@/features/settings/useSettings'

const clock = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

/** The "/" route: top bar (N, +), the chat list and the open chat. */
export function ChatsPage({ onOpenNews }) {
  // shortcut: chats live in memory only, so changes vanish on reload; persist them once 1:1 chat has a backend.
  const [chats, setChats] = useState(MOCK_CONVERSATIONS)
  const [activeId, setActiveId] = useState(null)
  const [menuId, setMenuId] = useState(null)
  const closeMenu = useCallback(() => setMenuId(null), [])
  const [settings, updateSettings] = useSettings()
  const [settingsOpen, setSettingsOpen] = useState(false)

  const active = chats.find((c) => c.id === activeId)
  const ordered = [...chats.filter((c) => c.pinned), ...chats.filter((c) => !c.pinned)]
  const update = (id, change) => setChats((list) => list.map((c) => (c.id === id ? change(c) : c)))

  function select(id) {
    if (id === activeId) return setMenuId((open) => (open === id ? null : id))
    setActiveId(id)
    setMenuId(null)
  }

  function create({ name, isGroup }) {
    const chat = { id: crypto.randomUUID(), name, isGroup, messages: [] }
    setChats((list) => [chat, ...list])
    setActiveId(chat.id)
    setMenuId(null)
  }

  // A new message ({ text } or { text: '', attachment }) moves the chat to the top of the (unpinned) list.
  function send(content) {
    const msg = { id: crypto.randomUUID(), author: 'me', ...content, time: clock() }
    setChats((list) => {
      const chat = list.find((c) => c.id === activeId)
      return [{ ...chat, messages: [...chat.messages, msg] }, ...list.filter((c) => c !== chat)]
    })
  }

  function remove(id) {
    setChats((list) => list.filter((c) => c.id !== id))
    if (id === activeId) setActiveId(null)
    setMenuId(null)
  }

  return (
    <>
      <TopBar>
        <button
          type="button"
          onClick={onOpenNews}
          aria-label="Open N news"
          title="N news"
          className="grid h-12 cursor-pointer place-items-center rounded-full px-2 text-xl leading-none transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-95"
        >
          <NLogo className="drop-shadow-[0_5px_6px_rgb(0_0_0/0.25)]" />
        </button>
        <NewChatMenu onCreate={create} />
      </TopBar>

      <main className="flex min-h-0 flex-1 border-t border-bubble">
        <ChatSidebar
          chats={ordered}
          activeId={activeId}
          menuId={menuId}
          onSelect={select}
          onCloseMenu={closeMenu}
          onTogglePin={(id) => {
            update(id, (c) => ({ ...c, pinned: !c.pinned }))
            setMenuId(null)
          }}
          onClear={(id) => {
            update(id, (c) => ({ ...c, messages: [] }))
            setMenuId(null)
          }}
          onDelete={remove}
          showPreviews={settings.showPreviews}
          onOpenSettings={() => setSettingsOpen(true)}
          className={active ? 'hidden md:flex' : 'flex'}
        />
        {active ? (
          <ChatWindow key={active.id} chat={active} settings={settings} onSend={send} onBack={() => setActiveId(null)} />
        ) : (
          <section data-chat-theme={settings.chatTheme} className="hidden flex-1 items-center justify-center bg-bg text-muted md:flex">
            Select a chat to start messaging
          </section>
        )}
      </main>
      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} settings={settings} onChange={updateSettings} />
    </>
  )
}
