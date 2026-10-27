import { useEffect, useRef } from 'react'
import { cn } from '@/lib/cn'
import { CHAT_THEMES, DEFAULT_SETTINGS, TEXT_SIZES } from '@/features/settings/useSettings'

const GITHUB = 'https://github.com/mBaharlou'

function Section({ title, children }) {
  return (
    <section className="flex flex-col gap-3 border-t border-bubble pt-4">
      <h3 className="text-xs font-semibold tracking-wider text-muted uppercase">{title}</h3>
      {children}
    </section>
  )
}

/** On/off row. */
function Toggle({ label, hint, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4">
      <span>
        <span className="block font-medium">{label}</span>
        {hint && <span className="block text-sm text-muted">{hint}</span>}
      </span>
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span
        aria-hidden="true"
        className="relative h-6 w-11 shrink-0 rounded-full bg-bubble transition-colors peer-checked:bg-primary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5"
      />
    </label>
  )
}

/** The settings window (a modal, sized like the login card but a bit wider). */
export function SettingsDialog({ open, onClose, settings, onChange }) {
  const ref = useRef(null)

  useEffect(() => {
    const dialog = ref.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      // A click on the backdrop lands on the <dialog> itself; clicks inside land on its children.
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-labelledby="settings-title"
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl border border-bubble bg-surface p-0 text-fg shadow-xl backdrop:bg-black/50"
    >
      <div className="flex flex-col gap-5 p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <h2 id="settings-title" className="text-xl font-semibold">
            Settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="grid size-9 cursor-pointer place-items-center rounded-full text-xl text-muted hover:bg-bubble hover:text-fg focus-visible:outline-2 focus-visible:outline-primary"
          >
            ✕
          </button>
        </div>

        <Section title="Chat theme">
          <p className="-mt-1 text-sm text-muted">Colours the open chat only. Each theme follows light and dark mode.</p>
          <div role="radiogroup" aria-label="Chat theme" className="grid grid-cols-3 gap-2 min-[400px]:grid-cols-5">
            {CHAT_THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={settings.chatTheme === t.id}
                onClick={() => onChange({ chatTheme: t.id })}
                className="group flex cursor-pointer flex-col items-center gap-1.5 text-xs font-medium focus-visible:outline-none"
              >
                {/* The swatch carries the theme attribute, so it shows the theme's real colours in both modes. */}
                <span
                  data-chat-theme={t.id}
                  className={cn(
                    'flex aspect-square w-full max-w-16 flex-col justify-center gap-1 rounded-xl border-2 bg-bg p-1.5 transition group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-primary',
                    settings.chatTheme === t.id ? 'border-primary' : 'border-bubble group-hover:border-muted',
                  )}
                >
                  <span className="h-2 w-3/4 rounded-full bg-surface" />
                  <span className="h-2 w-3/4 self-end rounded-full bg-primary" />
                </span>
                {t.label}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Messages">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <span className="font-medium">Text size</span>
            <div role="radiogroup" aria-label="Text size" className="grid shrink-0 grid-cols-3 gap-1 rounded-full bg-bubble p-1">
              {TEXT_SIZES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={settings.textSize === s.id}
                  onClick={() => onChange({ textSize: s.id })}
                  className={cn(
                    'cursor-pointer rounded-full px-3 py-1 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-primary',
                    settings.textSize === s.id ? 'bg-surface text-fg shadow-sm' : 'text-muted hover:text-fg',
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <Toggle label="Show message times" checked={settings.showTimes} onChange={(showTimes) => onChange({ showTimes })} />
        </Section>

        <Section title="Privacy">
          <Toggle
            label="Show message previews"
            hint="The last message under each name in the chat list"
            checked={settings.showPreviews}
            onChange={(showPreviews) => onChange({ showPreviews })}
          />
        </Section>

        <Section title="About">
          <p className="text-sm text-muted">
            Chatify · made by{' '}
            <a href={GITHUB} target="_blank" rel="noreferrer" className="font-medium text-primary hover:underline">
              mBaharlou
            </a>
          </p>
          <p className="text-sm text-muted">Settings are saved in this browser.</p>
        </Section>

        <button
          type="button"
          onClick={() => onChange(DEFAULT_SETTINGS)}
          className="cursor-pointer self-start rounded-full border border-bubble px-4 py-2 text-sm font-semibold hover:bg-bubble focus-visible:outline-2 focus-visible:outline-primary"
        >
          Reset to defaults
        </button>
      </div>
    </dialog>
  )
}
