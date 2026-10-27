import { useCallback, useState } from 'react'
import { NewChatForm } from '@/features/chat/components/NewChatForm'
import { useDismiss } from '@/features/chat/useDismiss'

const item = 'flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-bubble focus-visible:bg-bubble focus-visible:outline-none'

/** The "+" button: a small menu (new chat / new group) that then asks for a name. */
export function NewChatMenu({ onCreate }) {
  // false = closed, 'menu' = choosing, 'chat' | 'group' = filling in the form.
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const ref = useDismiss(Boolean(open), close)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => (o ? false : 'menu'))}
        aria-label="New chat or group"
        aria-haspopup="menu"
        aria-expanded={Boolean(open)}
        title="New chat or group"
        className="grid size-12 cursor-pointer place-items-center rounded-full text-fg transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-95 aria-expanded:rotate-45"
      >
        {/* An SVG plus sits in the true centre; the "+" text glyph rides high in most fonts. */}
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-7 drop-shadow-[0_5px_6px_rgb(0_0_0/0.25)]">
          <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </button>
      {open === 'menu' && (
        <div role="menu" className="absolute top-full left-0 mt-2 w-48 overflow-hidden rounded-xl border border-bubble bg-surface py-1 shadow-lg">
          <button type="button" role="menuitem" autoFocus onClick={() => setOpen('chat')} className={item}>
            💬 New chat
          </button>
          <button type="button" role="menuitem" onClick={() => setOpen('group')} className={item}>
            👥 New group
          </button>
        </div>
      )}
      {(open === 'chat' || open === 'group') && (
        <div className="absolute top-full left-0 mt-2 w-72">
          <NewChatForm
            mode={open}
            onCreate={(name) => {
              onCreate({ name, isGroup: open === 'group' })
              close()
            }}
            onCancel={close}
          />
        </div>
      )}
    </div>
  )
}
