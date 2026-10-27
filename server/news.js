import { createHash } from 'node:crypto'
import { XMLParser } from 'fast-xml-parser'
import { countryName } from '../shared/countries.js'
import { NEWS_CATEGORIES } from '../shared/newsCategories.js'

// Google News RSS: free, no key, any search term. Its terms allow personal, non-commercial use only.
const FEED = 'https://news.google.com/rss'
const LOCALE = 'hl=en-US&gl=US&ceid=US:en'
const CACHE_MS = 5 * 60 * 1000
const MAX_ITEMS = 40

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', parseTagValue: false, htmlEntities: true })
const cache = new Map()

/** Feed URL for a country code ('' = worldwide) and a category id. */
export function feedUrl(country, category) {
  const words = [countryName(country), NEWS_CATEGORIES.find((c) => c.id === category)?.query].filter(Boolean).join(' ')
  return words ? `${FEED}/search?q=${encodeURIComponent(`${words} when:7d`)}&${LOCALE}` : `${FEED}?${LOCALE}`
}

/** RSS XML -> [{ id, title, source, url, publishedAt }]. */
export function parseFeed(xml) {
  const items = [].concat(parser.parse(xml)?.rss?.channel?.item ?? [])
  return items.slice(0, MAX_ITEMS).map((item) => {
    const source = String(item.source?.['#text'] ?? item.source ?? '')
    const raw = String(item.title ?? '')
    // Google appends " - Source" to every headline; the source is shown separately.
    const title = source && raw.endsWith(` - ${source}`) ? raw.slice(0, -source.length - 3) : raw
    const date = new Date(item.pubDate)
    return {
      id: createHash('sha1').update(String(item.link)).digest('hex').slice(0, 16),
      title,
      source,
      url: String(item.link),
      publishedAt: Number.isNaN(date.getTime()) ? null : date.toISOString(),
    }
  })
}

/** News for a country + category, cached for a few minutes. Throws { status: 400 } on bad input. */
export async function getNews(country, category) {
  if ((country && !countryName(country)) || !NEWS_CATEGORIES.some((c) => c.id === category)) {
    throw Object.assign(new Error('Unknown country or category'), { status: 400 })
  }
  const key = `${country}|${category}`
  const hit = cache.get(key)
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.items

  const res = await fetch(feedUrl(country, category), { signal: AbortSignal.timeout(8000) })
  if (!res.ok) throw new Error(`News feed answered ${res.status}`)
  const items = parseFeed(await res.text())
  cache.set(key, { at: Date.now(), items })
  return items
}
