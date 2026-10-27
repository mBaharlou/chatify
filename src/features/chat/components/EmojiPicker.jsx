import { useCallback, useState } from 'react'
import { useDismiss } from '@/features/chat/useDismiss'

const EMOJIS = [
  '😀', '😂', '🤣', '😊', '😍', '🥰', '😘', '😎', '🤩', '🥳', '😇', '🙂',
  '😉', '😋', '🤔', '🤗', '🤭', '😴', '😅', '😢', '😭', '😡', '😱', '🥺',
  '👍', '👎', '👏', '🙌', '🙏', '💪', '👋', '🤝', '✌️', '👌', '🤞', '👀',
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '💔', '🔥', '✨', '⭐', '🎉',
  '🎂', '🎁', '☕', '🍕', '🍔', '🍫', '⚽', '🎮', '🎵', '📚', '💯', '✅',
]

/** Smiley button that opens a grid of emojis; `onPick(emoji)` adds one to the message. Stays open for several picks. */
export function EmojiPicker({ onPick }) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const ref = useDismiss(open, close)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Emoji"
        aria-haspopup="dialog"
        aria-expanded={open}
        title="Emoji"
        className="grid size-10 cursor-pointer place-items-center rounded-full text-xl transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-primary"
      >
        😊
      </button>
      {open && (
        <div
          role="dialog"
          aria-label="Pick an emoji"
          className="absolute bottom-full left-0 z-10 mb-2 grid w-72 grid-cols-8 gap-0.5 rounded-xl border border-bubble bg-surface p-2 shadow-lg"
        >
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => onPick(emoji)}
              aria-label={emoji}
              className="grid aspect-square cursor-pointer place-items-center rounded-lg text-xl hover:bg-bubble focus-visible:bg-bubble focus-visible:outline-none"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
