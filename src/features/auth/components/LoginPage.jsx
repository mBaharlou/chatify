import { useState } from 'react'
import { Logo } from '@/components/ui/Logo'
import { cn } from '@/lib/cn'
import { validateContact } from '@/lib/validateContact'

const METHODS = {
  email: { label: 'Email', type: 'email', autoComplete: 'email', placeholder: 'you@example.com' },
  phone: { label: 'Phone number', type: 'tel', autoComplete: 'tel', placeholder: '+90 555 123 45 67' },
}

/**
 * Sign in with an email or a phone number (the visitor picks which).
 * shortcut: no password or code check - there is no backend yet; add verification when the backend lands.
 */
export function LoginPage({ onLogin }) {
  const [method, setMethod] = useState('email')
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const field = METHODS[method]

  function pick(next) {
    setMethod(next)
    setValue('')
    setError('')
  }

  function submit(e) {
    e.preventDefault()
    const problem = validateContact(method, value)
    if (problem) return setError(problem)
    onLogin({ method, value: value.trim() })
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="flex w-full max-w-sm flex-col gap-5 rounded-2xl border border-bubble bg-surface p-6 shadow-sm sm:p-8"
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <Logo className="text-4xl" />
        <h1 className="mt-2 text-xl font-semibold">Welcome to Chatify</h1>
        <p className="text-sm text-muted">Sign in with your email or phone number</p>
      </div>

      <div role="radiogroup" aria-label="Sign in with" className="grid grid-cols-2 gap-1 rounded-full bg-bubble p-1">
        {Object.entries(METHODS).map(([key, m]) => (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={method === key}
            onClick={() => pick(key)}
            className={cn(
              'cursor-pointer rounded-full py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-primary',
              method === key ? 'bg-surface text-fg shadow-sm' : 'text-muted hover:text-fg',
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        {field.label}
        <input
          key={method}
          type={field.type}
          autoComplete={field.autoComplete}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setError('')
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'login-error' : undefined}
          autoFocus
          className="rounded-xl border border-bubble bg-bg px-4 py-3 text-base font-normal text-fg placeholder:text-muted focus:border-primary focus:outline-none aria-invalid:border-red-500"
        />
      </label>
      {error && (
        <p id="login-error" role="alert" className="-mt-3 text-sm text-red-500">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="cursor-pointer rounded-xl bg-primary py-3 font-semibold text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.98]"
      >
        Continue
      </button>
    </form>
  )
}
