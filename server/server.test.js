import assert from 'node:assert/strict'
import { test } from 'node:test'
import { bingUrl, googleUrl, mergeStories, parseBing, parseGoogle } from './news.js'
import { validateMessage } from './validate.js'

const GOOGLE_XML = `<?xml version="1.0"?><rss><channel>
<item><title>Oil jumps &amp; markets wobble - Reuters</title><link>https://news.google.com/a1</link>
<pubDate>Tue, 27 Oct 2026 18:00:00 GMT</pubDate><source url="https://reuters.com">Reuters</source></item>
<item><title>Only one item has no source</title><link>https://news.google.com/a2</link><pubDate>nonsense</pubDate></item>
</channel></rss>`

const BING_XML = `<?xml version="1.0"?><rss xmlns:News="x"><channel>
<item><title>Oil Jumps, Markets Wobble!</title>
<link>http://www.bing.com/news/apiclick.aspx?ref=FexRss&amp;url=https%3a%2f%2fwww.cbsnews.com%2fstory%2f&amp;c=1</link>
<description>Prices rose 4% after &lt;b&gt;talks&lt;/b&gt; stalled.</description>
<pubDate>Mon, 26 Oct 2026 09:28:00 GMT</pubDate><News:Source>CBS News</News:Source>
<News:Image>http://www.bing.com/th?id=ABC&amp;pid=News</News:Image></item>
</channel></rss>`

test('parseGoogle', () => {
  const [a, b] = parseGoogle(GOOGLE_XML)
  assert.equal(a.title, 'Oil jumps & markets wobble')
  assert.equal(a.source, 'Reuters')
  assert.equal(a.publishedAt, '2026-10-27T18:00:00.000Z')
  assert.match(a.id, /^[a-f0-9]{16}$/)
  assert.equal(a.summary, '')
  assert.equal(b.publishedAt, null)
  assert.equal(parseGoogle('<rss><channel></channel></rss>').length, 0)
})

test('parseBing', () => {
  const [a] = parseBing(BING_XML)
  assert.equal(a.url, 'https://www.cbsnews.com/story/')
  assert.equal(a.source, 'CBS News')
  assert.equal(a.summary, 'Prices rose 4% after talks stalled.')
  assert.equal(a.image, 'https://www.bing.com/th?id=ABC&pid=News')
})

test('mergeStories puts rich first and drops duplicates', () => {
  const merged = mergeStories(parseBing(BING_XML), parseGoogle(GOOGLE_XML))
  assert.deepEqual(
    merged.map((s) => s.source),
    ['CBS News', ''],
  )
})

test('feed urls', () => {
  assert.match(googleUrl('IR', 'energy'), /q=Iran%20oil%20price%20energy%20when%3A7d/)
  assert.equal(googleUrl('', 'all'), 'https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en')
  assert.match(bingUrl('', 'all', 11), /q=global%20news&.*first=11/)
  assert.match(bingUrl('US', 'entertainment', 1), /q=United%20States%20entertainment&/)
})

test('validateMessage', () => {
  const ok = { newsId: '0123456789abcdef', author: ' ayse ', text: ' hi ' }
  assert.deepEqual(validateMessage(ok), { newsId: '0123456789abcdef', author: 'ayse', text: 'hi' })
  assert.equal(validateMessage({ ...ok, text: '   ' }), null)
  assert.equal(validateMessage({ ...ok, text: 'x'.repeat(501) }), null)
  assert.equal(validateMessage({ ...ok, newsId: '../etc' }), null)
  assert.equal(validateMessage(null), null)
})
