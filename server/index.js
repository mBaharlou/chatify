import { createServer } from 'node:http'
import express from 'express'
import { Server } from 'socket.io'
import { EVENTS } from '../shared/events.js'
import { addMessage, countMessages, listMessages } from './db.js'
import { getNews } from './news.js'
import { NEWS_ID, validateMessage } from './validate.js'

// Not PORT: dev tools set PORT for the web server, and the API must not take that port.
const PORT = Number(process.env.API_PORT) || 3001

const app = express()

app.get('/api/news', async (req, res) => {
  try {
    const items = await getNews(String(req.query.country ?? ''), String(req.query.category ?? 'all'))
    const counts = countMessages(items.map((i) => i.id))
    res.json(items.map((i) => ({ ...i, messageCount: counts[i.id] ?? 0 })))
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message })
    console.error('news:', err.message)
    res.status(502).json({ error: 'Could not load the news right now' })
  }
})

app.get('/api/news/:id/messages', (req, res) => {
  if (!NEWS_ID.test(req.params.id)) return res.status(400).json({ error: 'Bad news id' })
  res.json(listMessages(req.params.id))
})

const server = createServer(app)
const io = new Server(server)

// Each news story is a socket.io room named by its id.
io.on('connection', (socket) => {
  socket.on(EVENTS.join, (id) => typeof id === 'string' && NEWS_ID.test(id) && socket.join(id))
  socket.on(EVENTS.leave, (id) => typeof id === 'string' && socket.leave(id))
  socket.on(EVENTS.send, (payload, ack) => {
    const reply = typeof ack === 'function' ? ack : () => {}
    const msg = validateMessage(payload)
    if (!msg) return reply({ error: 'Message must be 1-500 characters' })
    io.to(msg.newsId).emit(EVENTS.message, addMessage(msg))
    reply({ ok: true })
  })
})

// Local only: the Vite dev server proxies /api and /socket.io here.
server.listen(PORT, '127.0.0.1', () => console.log(`Chatify API on http://127.0.0.1:${PORT}`))
