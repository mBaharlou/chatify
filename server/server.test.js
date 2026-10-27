import assert from 'node:assert/strict'
import { test } from 'node:test'
import { feedUrl, parseFeed } from './news.js'
import { validateMessage } from './validate.js'

const XML = `<?xml version="1.0"?><rss><channel>
<item><title>Oil jumps &amp; markets wobble - Reuters</title><link>https://news.google.com/a1</link>
<pubDate>Tue, 27 Oct 2026 18:00:00 GMT</pubDate><source url="https://reuters.com">Reuters</source></item>
<item><title>Only one item has no source</title><link>https://news.google.com/a2</link><pubDate>nonsense</pubDate></item>
</channel></rss>`

test('parseFeed', () => {
  const [a, b] = parseFeed(XML)
  assert.equal(a.title, 'Oil jumps & markets wobble')
  assert.equal(a.source, 'Reuters')
  assert.equal(a.publishedAt, '2026-10-27T18:00:00.000Z')
  assert.match(a.id, /^[a-f0-9]{16}$/)
  assert.equal(b.title, 'Only one item has no source')
  assert.equal(b.publishedAt, null)
  assert.equal(parseFeed('<rss><channel></channel></rss>').length, 0)
})

test('feedUrl', () => {
  assert.match(feedUrl('IR', 'energy'), /q=Iran%20oil%20price%20energy%20when%3A7d/)
  assert.equal(feedUrl('', 'all'), 'https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en')
})

test('validateMessage', () => {
  const ok = { newsId: '0123456789abcdef', author: ' ayse ', text: ' hi ' }
  assert.deepEqual(validateMessage(ok), { newsId: '0123456789abcdef', author: 'ayse', text: 'hi' })
  assert.equal(validateMessage({ ...ok, text: '   ' }), null)
  assert.equal(validateMessage({ ...ok, text: 'x'.repeat(501) }), null)
  assert.equal(validateMessage({ ...ok, newsId: '../etc' }), null)
  assert.equal(validateMessage(null), null)
})
