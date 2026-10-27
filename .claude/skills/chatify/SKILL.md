---
name: chatify
description: Project guide for Chatify, a real-time chat app with an "N" news page (real news + a chat per story). Use whenever working on Chatify code - adding features, fixing bugs, changing the UI, the Node/Socket.io server, running or testing the app, or committing/pushing (see the git workflow rule). Covers the stack, folder layout, conventions and commands. Keep this file up to date as the project changes.
---

# Chatify

Chatify is a real-time chat application. This file is the single source of truth
for how the project is built. Read it before changing code, and update it in the
same change whenever the stack, layout, conventions or commands change.

## Status

Built so far: the intro, the login page, the chats page (sample chats, new chat
and new group, a chat window, and pin/clear/delete), and **N**, the news page,
which has real news and a live chat per story (see App flow). 1:1 and group
chats are in-browser only (no backend yet). It runs locally only; the user has no
plan to publish yet.

## Stack

- Framework / build: Vite 8 (React SPA)
- UI: React 19 in plain JavaScript (`.jsx` / `.js`). **No TypeScript** - the
  user chose this; do not add `.ts`/`.tsx` files, tsconfig or `@types/*`.
- Styling: Tailwind CSS v4 via `@tailwindcss/vite` (no `tailwind.config.js`;
  theme tokens live in `@theme` in `src/styles/index.css`)
- Lint: oxlint (`.oxlintrc.json`)
- Backend: Node 24 + Express 5 in `server/`, on `127.0.0.1:3001` (env `API_PORT`;
  never `PORT`, because dev tools give that to Vite). In dev, Vite proxies `/api`
  and `/socket.io` to it.
- Real-time transport: Socket.io (server `socket.io`, browser `socket.io-client`
  via `src/services/socket.js`). Each news story is a room named by its id.
- Database: Node's built-in `node:sqlite`, with the file at `server/data/chatify.db`
  (git-ignored). Table `news_messages`.
- News sources: two free RSS feeds with no keys, parsed with `fast-xml-parser`,
  merged and cached for 5 minutes (`server/news.js`):
  - **Bing News**, 2 pages: gives a summary and often an image, so these become
    the rich cards and are listed first. Its RSS returns nothing for broad or
    long searches, so `bingUrl` always sends `<country or "global"> <first
    category word>`.
  - **Google News**: up to 100 headlines only, for volume.
  - Duplicates are dropped by normalized title. Both feeds allow personal,
    non-commercial use only, so switch to a licensed news API before any public
    launch. Full article text is never copied: cards show the headline, summary,
    image and a "Read the full story" link.
- Auth: none yet. Login only checks the email/phone format, the display name
  comes from it, and the server trusts the author name it's sent.
- Package manager: npm

## Folder layout

```
public/                  # static files served as-is (favicon)
server/                  # Node API + Socket.io (index.js), news feed (news.js), sqlite (db.js), checks (validate.js)
shared/                  # used by BOTH server and browser: countries, news categories, socket event names
src/
  main.jsx               # entry: mounts <App /> and loads global styles
  app/App.jsx            # root component: stages + the two routes
  components/ui/         # reusable, app-agnostic primitives (Button, Input, Avatar...)
  components/layout/     # page shells (Sidebar, Header, ChatLayout...)
  features/chat/         # chat feature: components/, hooks, logic for conversations & messages
  features/auth/         # sign-in / sign-up feature
  features/news/         # N: news feed, filters, per-story chat
  hooks/                 # shared hooks used by more than one feature
  lib/                   # small pure helpers (e.g. cn() for class names)
  services/              # API and real-time clients (talk to the backend)
  styles/index.css       # Tailwind import + @theme tokens + global CSS
  assets/                # images / svgs imported from code
```

- Import from `src` with the `@/` alias (e.g. `import { cn } from '@/lib/cn'`)
  and from `shared/` with `#shared/` (browser only; the server uses relative
  `../shared/x.js` paths). Both are set in `vite.config.js`, and `jsconfig.json`
  mirrors them for the editor.
- Components go in `.jsx` files, plain logic in `.js` files.
- Code used by one feature stays inside that feature folder; move it to
  `components/`, `hooks/` or `lib/` only once a second feature needs it.
- Style with Tailwind utility classes; avoid separate `.css` files per component.
- Empty folders hold a `.gitkeep`; delete it once the folder has real files.

## Commands

| Task          | Command           |
| ------------- | ----------------- |
| Install       | `npm install`     |
| Dev (web + API) | `npm run dev` (runs Vite and `npm run server` together via `concurrently`) |
| API only      | `npm run server` (`node --watch server/index.js`) |
| Build         | `npm run build`   |
| Preview build | `npm run preview` |
| Tests         | `npm test` (Node's built-in `node --test`, runs `*.test.js`) |
| Lint          | `npm run lint`    |

## Responsive rules

Checked at 320, 375, 740×360 (phone sideways), 768, 1024 and 1920 wide; keep
these working when changing layouts:

- No page may scroll sideways (only the live tape and the N category chips
  scroll inside themselves).
- `#root` is `100dvh` so mobile address bars don't hide the bottom (the input bar).
- Touch screens get 16px text in fields (`@media (pointer: coarse)` in
  `index.css`), or iOS zooms in on tap.
- Chat input bar: below `lg` the photo/video/file buttons fold into one 📎
  menu, and below `sm` Send is a ➤ icon, so the text box stays wide.
- Chats: below `md` the list and the open chat take turns full screen; the
  list is `md:w-72 lg:w-80`.
- Short screens (`max-height: 500px`): the N filter header stops being sticky;
  login centres with `my-auto` so a tall card scrolls instead of losing its top.

## Conventions

- Code, comments, commit messages, PR descriptions and file names are in English.
  UI text may be translated (e.g. Turkish, Persian) through the i18n setup.
- Plain JavaScript only (no TypeScript). Use a short JSDoc comment where a
  function's arguments or return value aren't obvious.
- Keep the shape of messages / users / rooms consistent between client and
  server (see Core domain) instead of inventing new field names on each side.
- Keep real-time event names in one place (a constants file), never as inline
  string literals scattered across the code.
- Validate every message and payload on the server; never trust the client.
- Never commit secrets. Keep them in `.env` (git-ignored) and document each
  variable in `.env.example`.

## Brand

- Logo: the "mascot buddy" - a rounded emerald body (`#059669`) with two white
  oval eyes and dark pupils (`#022C22`) looking slightly right, next to the
  lowercase wordmark "chatify" in Baloo 2 ExtraBold (800).
- Use the `Logo` (mascot + wordmark) and `LogoMark` (mascot only) components
  from `src/components/ui/Logo.jsx`; don't redraw the logo elsewhere.
- Files: `public/favicon.svg` and `src/assets/logo-mark.svg` (mascot only).
- Fonts: Baloo 2 800 is loaded from Google Fonts in `index.html` and exposed as
  the Tailwind `font-logo` class. Use it for the logo only, not for UI text.
- Colours live in `@theme` in `src/styles/index.css`. Light mode is palette P4
  "Ocean breeze". Dark mode is palette P13 "Deep teal ink", which overrides the same
  variables under `:root[data-theme='dark']`. A small inline script in `index.html`
  sets `data-theme` before first paint, from `localStorage.theme` or, failing that,
  the OS setting. `ThemeToggle` (`src/components/ui/ThemeToggle.jsx`) is the
  switch: the mascot is awake in light mode, and in dark mode it falls asleep
  (`LogoMark sleeping`: eyes close and z's float up). Always use these tokens, never
  raw hex or `slate-*`-style colours:

  | Token     | Use                              | Light     | Dark      |
  | --------- | -------------------------------- | --------- | --------- |
  | `bg`      | page background                  | `#F0FDFA` | `#042F2E` |
  | `surface` | header, cards, input bar         | `#FFFFFF` | `#063B3A` |
  | `fg`      | main text                        | `#134E4A` | `#E6FFFA` |
  | `muted`   | secondary text, placeholders     | `#4F7A76` | `#7FB8B0` |
  | `primary` | own bubbles, buttons (white text)| `#047857` | `#059669` |
  | `bubble`  | other people's bubbles, borders  | `#CCFBF1` | `#0B4B49` |
  | `accent`  | badges, highlights               | `#0EA5E9` | `#FDA4AF` |
  | `brand`   | logo only                        | `#059669` | `#059669` |

  Example: `bg-surface text-fg`, `bg-primary text-white`, `text-muted`.
- Live tape ("canlı tape"): `LiveTape` in `src/components/layout/LiveTape.jsx`
  sits at the very top of the page. It's a full-width band that slides the `WORDS`
  list from right to left forever, with a 34px thin band. Every 3rd word is
  `primary`, and the mascot `LogoMark` sits between words. Do not use stars
  there: the user replaced them with the logo. The user removed "Real-time" from
  `WORDS` on purpose, so don't add it back. Each half holds 4 rounds of `WORDS` (wider than any screen, or the tape
  runs dry before looping; the 160s duration scales with that), and it renders two halves so the loop has no seam, pauses on
  hover and stops under reduced motion (CSS `.live-tape-track` in `index.css`). To
  change the text, edit `WORDS`.

## App flow (built so far)

`App.jsx` holds a `stage`: `intro` -> `login` -> `main`.

1. **Intro** (`components/layout/Splash.jsx`): the mascot grows in, winks its right
   eye (`mascot-wink` class), then zooms away while the screen fades. It's skipped
   under reduced motion.
2. **Login** (`features/auth/components/LoginPage.jsx`): the visitor picks Email
   or Phone number. `lib/validateContact.js` checks the format and is tested in
   `validateContact.test.js`. There's no password or code yet. The login isn't
   remembered, so a reload starts at the intro again. The display name is the
   part of the email before @, or `user-` plus the last 4 digits of the phone.
3. **Main**, with only two routes (`hooks/usePath.js` uses the History API; there's
   no router library, so don't add one for two pages):
   - `/` chats (`ChatsPage` owns the chat state, kept in memory only):
     - **Top bar** (`components/layout/TopBar.jsx`, the row with the theme toggle
       on the right): **N** on the far left, then **+**. The user wants them
       there, NOT next to the "Chats" title.
     - **+** (`NewChatMenu`) opens a menu with "New chat" or "New group", then
       `NewChatForm` asks for a name or phone number (chat) or a group name.
     - Clicking a chat opens `ChatWindow`: header, bubbles (mine on the right in
       `primary`; groups show the sender), and an input. Sending moves the chat to
       the top. On phones the window replaces the list, with a ← back button.
       The input bar has a 😊 `EmojiPicker` on the left (adds the emoji at the
       cursor, stays open for several picks) and 📷 photo, 🎬 video and 📎 file
       buttons beside Send. A message is `{ text }` or `{ text: '', attachment:
       { kind, name, url } }`; files are blob URLs in the tab, never uploaded.
     - The bottom of the sidebar links to the user's GitHub (`mBaharlou`), with a
       ⚙️ **Settings** button beside it. It opens `SettingsDialog`
       (`features/settings/`), a native `<dialog>` modal styled like the login
       card but wider, with these settings:
       - **Chat theme:** 5 themes (Emerald, Ocean, Sunset, Lavender, Graphite).
       - **Messages:** text size and show message times.
       - **Privacy:** show message previews.
       - **About**, plus **Reset to defaults**.
     - `useSettings` keeps the settings in `localStorage.settings`. A chat theme
       recolours ONLY the open chat (the user's rule): `data-chat-theme` on the chat
       `<section>` overrides the colour tokens there. Each theme has a light and a
       dark set in `index.css`. Emerald is the app palette, so it has no CSS block.
     - Clicking the **already open** chat again shows its options: Pin to top /
       Unpin (pinned chats are listed first, with 📌), Clear conversation (empties
       the messages, keeps the chat), and Delete chat.
   - `/n` **N**: clicking N shows a "Welcome to N" splash (one line: "Welcome to"
     plus the N logo, not the logo twice), then `NewsPage`. That
     page has a country `<select>` (all 250 ISO countries, named via Intl) and
     category chips (`shared/newsCategories.js`), and fetches
     `/api/news?country&category`. Each `NewsCard` (the user wants large,
     detailed cards) shows the source and time, a big headline, the photo and
     summary when available, a "Discuss" button that opens `NewsChat` (history
     from `/api/news/:id/messages`, plus live Socket.io messages) and a "Read the
     full story at …" link. "← Chats" goes back to `/`.

The live tape and the theme toggle stay visible on every stage.

### N brand

"N" is set in **Unbounded 800** (`font-n`), with a tall four-point star in the
`accent` colour next to it (`components/ui/NLogo.jsx`). Use `NLogo` and don't
redraw it.

## Git workflow (user's rule)

- Repo: https://github.com/mBaharlou/chatify. **`main` is the most important
  branch.**
- The first push went straight to `main`, with the user's OK. From now on, put
  **every big or new change on a new branch** and push that branch. Then **ask
  the user** before merging into `main`, and merge only after they say yes.

## Core domain

The main concepts, to be refined as they are built:

- **User** - an account that can sign in and send messages.
- **Conversation / Room** - a direct chat or a group chat with members.
- **Message** - text (later media) sent by a user to a conversation, with a
  timestamp and delivery / read state.

## Workflow for a change

1. Read this file and the code around the change.
2. Make the change following the conventions above.
3. Run the tests and lint commands from the table.
4. If the change affects the stack, layout, commands or conventions, update this
   file in the same change.
