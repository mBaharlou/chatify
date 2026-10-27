import { useState } from 'react'
import { LiveTape } from '@/components/layout/LiveTape'
import { Splash } from '@/components/layout/Splash'
import { NLogo } from '@/components/ui/NLogo'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { navigate, usePath } from '@/hooks/usePath'
import { LoginPage } from '@/features/auth/components/LoginPage'
import { ChatSidebar } from '@/features/chat/components/ChatSidebar'
import { NewsPage } from '@/features/news/components/NewsPage'

// Without animations the intros would never fire their end event, so skip them.
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

/** Name shown in chats: the part of the email before @, or the last 4 digits of the phone. */
const displayName = ({ method, value }) => (method === 'email' ? value.split('@')[0] : `user-${value.replace(/\D/g, '').slice(-4)}`)

/** Flow: intro -> login -> app. The app has two routes: '/' (chats) and '/n' (N news). */
export default function App() {
  const [stage, setStage] = useState(reduceMotion ? 'login' : 'intro')
  const [me, setMe] = useState(null)
  const [welcomeN, setWelcomeN] = useState(false)
  const path = usePath()

  function openNews() {
    if (!reduceMotion) setWelcomeN(true)
    navigate('/n')
  }

  return (
    <div className="flex h-full flex-col">
      {stage === 'intro' && <Splash onDone={() => setStage('login')} />}
      {welcomeN && (
        <Splash onDone={() => setWelcomeN(false)}>
          <div className="flex flex-col items-center gap-4">
            <NLogo className="text-8xl" />
            <p className="font-n text-2xl">Welcome to N</p>
          </div>
        </Splash>
      )}
      <LiveTape />
      <header className="flex justify-end px-4 py-2">
        <ThemeToggle />
      </header>
      {stage !== 'main' ? (
        <main className="flex flex-1 items-center justify-center p-4">
          <LoginPage
            onLogin={(login) => {
              setMe(displayName(login))
              setStage('main')
            }}
          />
        </main>
      ) : path === '/n' ? (
        <main className="min-h-0 flex-1 border-t border-bubble">
          <NewsPage me={me} />
        </main>
      ) : (
        <main className="flex min-h-0 flex-1 border-t border-bubble">
          <ChatSidebar onOpenNews={openNews} />
          <section className="hidden flex-1 items-center justify-center text-muted md:flex">
            Select a chat to start messaging
          </section>
        </main>
      )}
    </div>
  )
}
