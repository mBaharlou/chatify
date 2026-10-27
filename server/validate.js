export const NEWS_ID = /^[a-f0-9]{16}$/

/** Checks a chat message from the browser. Returns { newsId, author, text } or null. */
export function validateMessage(payload) {
  if (!payload || typeof payload !== 'object') return null
  const { newsId, author, text } = payload
  if (typeof newsId !== 'string' || !NEWS_ID.test(newsId)) return null
  if (typeof author !== 'string' || typeof text !== 'string') return null
  const a = author.trim()
  const t = text.trim()
  if (!a || a.length > 40 || !t || t.length > 500) return null
  return { newsId, author: a, text: t }
}
