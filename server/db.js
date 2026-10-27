import { mkdirSync } from 'node:fs'
import { DatabaseSync } from 'node:sqlite'
import { fileURLToPath } from 'node:url'

const dir = fileURLToPath(new URL('./data/', import.meta.url))
mkdirSync(dir, { recursive: true })
const db = new DatabaseSync(`${dir}chatify.db`)

db.exec(`CREATE TABLE IF NOT EXISTS news_messages (
  id INTEGER PRIMARY KEY,
  news_id TEXT NOT NULL,
  author TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
)`)
db.exec('CREATE INDEX IF NOT EXISTS news_messages_news_id ON news_messages (news_id)')

const insert = db.prepare(
  'INSERT INTO news_messages (news_id, author, text) VALUES (?, ?, ?) RETURNING id, news_id AS newsId, author, text, created_at AS createdAt',
)
const list = db.prepare(
  'SELECT id, news_id AS newsId, author, text, created_at AS createdAt FROM news_messages WHERE news_id = ? ORDER BY id LIMIT 200',
)

export const addMessage = ({ newsId, author, text }) => ({ ...insert.get(newsId, author, text) })
export const listMessages = (newsId) => list.all(newsId).map((row) => ({ ...row }))

/** { newsId: count } for the given ids. */
export function countMessages(ids) {
  if (!ids.length) return {}
  const rows = db
    .prepare(
      `SELECT news_id AS id, COUNT(*) AS n FROM news_messages WHERE news_id IN (${ids.map(() => '?').join(',')}) GROUP BY news_id`,
    )
    .all(...ids)
  return Object.fromEntries(rows.map((r) => [r.id, Number(r.n)]))
}
