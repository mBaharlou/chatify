import { useState } from 'react'
import { validateContact } from '@/lib/validateContact'

const LOOKS_LIKE_PHONE = /^[+\d(][\d\s()+-]*$/

const MODES = {
  chat: { label: 'Start a chat with', placeholder: 'Name or phone number', submit: 'Start chat' },
  group: { label: 'Group name', placeholder: 'e.g. Weekend Hikers', submit: 'Create group' },
}

/** Error for the field, or '' when valid: chats take a phone number or a name, groups a name. */
function check(mode, value) {
  const v = value.trim()
  if (!v) return mode === 'group' ? 'Enter a group name' : 'Enter a name or phone number'
  if (mode === 'chat' && LOOKS_LIKE_PHONE.test(v)) return validateContact('phone', v)
  return v.length < 2 || v.length > 40 ? 'Names must be 2-40 characters' : ''
}

/** Asks who to chat with (`mode` 'chat') or what to call a new group (`mode` 'group'). */
export function NewChatForm({ mode, onCreate, onCancel }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const text = MODES[mode]

  function submit(e) {
    e.preventDefault()
    const problem = check(mode, value)
    if (problem) return setError(problem)
    onCreate(value.trim())
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-2 rounded-xl border border-bubble bg-surface p-3 shadow-lg">
      <label className="text-sm font-medium" htmlFor="new-chat-name">
        {text.label}
      </label>
      <input
        id="new-chat-name"
        autoFocus
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          setError('')
        }}
        placeholder={text.placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'new-chat-error' : undefined}
        className="rounded-lg border border-bubble bg-bg px-3 py-2 text-fg placeholder:text-muted focus:border-primary focus:outline-none aria-invalid:border-red-500"
      />
      {error && (
        <p id="new-chat-error" role="alert" className="text-sm text-red-500">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="cursor-pointer rounded-lg px-3 py-1.5 text-sm text-muted hover:text-fg">
          Cancel
        </button>
        <button type="submit" className="cursor-pointer rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white hover:brightness-110">
          {text.submit}
        </button>
      </div>
    </form>
  )
}
