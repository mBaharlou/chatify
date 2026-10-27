import { createHash } from 'node:crypto'
import { XMLParser } from 'fast-xml-parser'
import { countryName } from '../shared/countries.js'
import { NEWS_CATEGORIES } from '../shared/newsCategories.js'

// Two free RSS feeds, no keys. Bing gives a summary + image per story (rich cards);
// Google gives many more headlines (volume). Both only allow personal, non-commercial use.
const GOOGLE = 'https://news.google.com/rss'
const GOOGLE_LOCALE = 'hl=en-US&gl=US&ceid=US:en'
const BING = 'https://www.bing.com/news/search'
const BING_PAGES = [1, 11] // Bing returns ~10 per page; `first` is the 1-based offset.
const CACHE_MS = 5 * 60 * 1000
const MAX_GOOGLE = 100

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', parseTagValue: false, htmlEntities: true })
const cache = new Map()

const hashId = (link) => createHash('sha1').update(link).digest('hex').slice(0, 16)
const isoDate = (raw) => {
  const date = new Date(raw)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}
const itemsOf = (xml) => [].concat(parser.parse(xml)?.rss?.channel?.item ?? [])

/** Search words for a country code ('' = worldwide) and a category id; '' means "top stories". */
export function searchWords(country, category) {
  return [countryName(country), NEWS_CATEGORIES.find((c) => c.id === category)?.query].filter(Boolean).join(' ')
}

export function googleUrl(country, category) {
  const words = searchWords(country, category)
  return words ? `${GOOGLE}/search?q=${encodeURIComponent(`${words} when:7d`)}&${GOOGLE_LOCALE}` : `${GOOGLE}?${GOOGLE_LOCALE}`
}

// Bing's RSS returns nothing for broad or long searches ("sport", "world news",
// "United States entertainment celebrity film music") but works for a place + one word.
export function bingUrl(country, category, first) {
  const topic = NEWS_CATEGORIES.find((c) => c.id === category)?.query.split(' ')[0] || 'news'
  const words = `${countryName(country) ?? 'global'} ${topic}`
  return `${BING}?q=${encodeURIComponent(words)}&format=rss&setlang=en-us&cc=us&first=${first}`
}

/** Google News RSS -> [{ id, title, source, url, publishedAt, summary: '', image: null }]. */
export function parseGoogle(xml) {
  return itemsOf(xml)
    .slice(0, MAX_GOOGLE)
    .map((item) => {
      const source = String(item.source?.['#text'] ?? item.source ?? '')
      const raw = String(item.title ?? '')
      // Google appends " - Source" to every headline; the source is shown separately.
      const title = source && raw.endsWith(` - ${source}`) ? raw.slice(0, -source.length - 3) : raw
      const url = String(item.link)
      return { id: hashId(url), title, source, url, publishedAt: isoDate(item.pubDate), summary: '', image: null }
    })
}

/** Bing News RSS -> same shape, with a summary and an image when Bing has one. */
export function parseBing(xml) {
  return itemsOf(xml).map((item) => {
    const link = String(item.link)
    // Bing wraps links in a click tracker; the real article URL is its `url` param.
    const url = URL.canParse(link) ? (new URL(link).searchParams.get('url') ?? link) : link
    const image = item['News:Image'] ? String(item['News:Image']).replace(/^http:/, 'https:') : null
    return {
      id: hashId(url),
      title: String(item.title ?? ''),
      source: String(item['News:Source'] ?? ''),
      url,
      publishedAt: isoDate(item.pubDate),
      summary: String(item.description ?? '').replace(/<[^>]*>/g, '').trim(),
      image,
    }
  })
}

/** Rich (Bing) stories first, then Google; one entry per story even if both feeds have it. */
export function mergeStories(rich, plain) {
  const key = (s) => s.title.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 60)
  const seen = new Set()
  return [...rich, ...plain].filter((s) => s.title && !seen.has(key(s)) && seen.add(key(s)))
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 Chatify' }, signal: AbortSignal.timeout(8000) })
  if (!res.ok) throw new Error(`${new URL(url).host} answered ${res.status}`)
  return res.text()
}

/** News for a country + category, cached for a few minutes. Throws { status: 400 } on bad input. */
export async function getNews(country, category) {
  if ((country && !countryName(country)) || !NEWS_CATEGORIES.some((c) => c.id === category)) {
    throw Object.assign(new Error('Unknown country or category'), { status: 400 })
  }
  const key = `${country}|${category}`
  const hit = cache.get(key)
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.items

  // One feed failing shouldn't blank the page; only fail when nothing came back.
  const [google, ...bingPages] = await Promise.allSettled([
    fetchText(googleUrl(country, category)).then(parseGoogle),
    ...BING_PAGES.map((first) => fetchText(bingUrl(country, category, first)).then(parseBing)),
  ])
  const ok = (r) => (r.status === 'fulfilled' ? r.value : [])
  if ([google, ...bingPages].every((r) => r.status === 'rejected')) throw google.reason

  const items = mergeStories(bingPages.flatMap(ok), ok(google))
  cache.set(key, { at: Date.now(), items })
  return items
}
