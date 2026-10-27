import { useState } from 'react'
import { validateContact } from '@/lib/validateContact'

const LOOKS_LIKE_PHONE = /^[+\d(][\d\s()+-]*$/

/** Error for the new-chat field, or '' when it's a valid phone number or a 2-40 character name. */
function checkPerson(value) {
  const v = value.trim()
  if (!v) return 'Enter a name or phone number'
  if (LOOKS_LIKE_PHONE.test(v)) return validateContact('phone', v)
  return v.length < 2 || v.length > 40 ? 'Names must be 2-40 characters' : ''
}

/** Inline form at the top of the sidebar: asks who to chat with. */
export function NewChatForm({ onCreate, onCancel }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  function submit(e) {
    e.preventDefault()
    const problem = checkPerson(value)
    if (problem) return setError(problem)
    onCreate(value.trim())
  }

  return (
    <form
      onSubmit={submit}
      onKeyDown={(e) => e.key === 'Escape' && onCancel()}
      noValidate
      className="mx-3 mb-3 flex flex-col gap-2 rounded-xl border border-bubble bg-bg p-3"
    >
      <label className="text-sm font-medium" htmlFor="new-chat-person">
        Start a chat with
      </label>
      <input
        id="new-chat-person"
        autoFocus
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          setError('')
        }}
        placeholder="Name or phone number"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'new-chat-error' : undefined}
        className="rounded-lg border border-bubble bg-surface px-3 py-2 text-fg placeholder:text-muted focus:border-primary focus:outline-none aria-invalid:border-red-500"
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
          Start chat
        </button>
      </div>
    </form>
  )
}
