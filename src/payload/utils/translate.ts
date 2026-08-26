/**
 * Hebrew -> English translation via the Claude API (Anthropic), used by
 * ../hooks/autoTranslate.ts to fill in an empty English field automatically
 * whenever an editor saves Hebrew content through the dashboard. Plain
 * `fetch` against the Messages API — no SDK dependency needed for this.
 *
 * Every function here is defensive by design: on any failure (missing API
 * key, network error, a malformed response), it returns the ORIGINAL
 * Hebrew text/richText unchanged rather than throwing or losing content.
 * Auto-translation is a convenience layered on top of real content, not
 * something that should ever be able to corrupt or delete it.
 */

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-5'

const SYSTEM_PROMPT =
  'You translate Hebrew text into natural, professional English for the website of Nivcharot, a Haredi (ultra-Orthodox) Jewish feminist advocacy nonprofit in Israel. ' +
  'The audience includes English-speaking supporters, press, and researchers. Preserve tone, nuance, and religious/political terminology accurately ' +
  '(e.g. "לא נבחרות לא בוחרות" is idiomatically "No Voice, No Vote", not a literal translation). Keep names of people and organizations as commonly ' +
  'rendered in English press coverage where you recognize them. Do not add commentary, explanations, or quotation marks around the output.'

/**
 * Translates a batch of independent Hebrew strings to English in a single
 * API call (cheaper and much faster than one call per field). Returns
 * english[i] corresponding to hebrew[i] — always the same length as the
 * input, falling back to the original Hebrew string per-item if the
 * response is malformed or missing an entry.
 */
export async function translateBatch(hebrewTexts: string[]): Promise<string[]> {
  const nonEmpty = hebrewTexts.map((t) => (typeof t === 'string' ? t : ''))
  if (nonEmpty.every((t) => !t.trim())) return nonEmpty

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return nonEmpty

  try {
    const res = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content:
              'Translate each string in this JSON array from Hebrew to English. ' +
              'Respond with ONLY a JSON array of the same length, same order, translated strings only — no markdown code fences, no other text.\n\n' +
              JSON.stringify(nonEmpty),
          },
        ],
      }),
    })

    if (!res.ok) {
      console.error(`translateBatch: Anthropic API error ${res.status}: ${await res.text()}`)
      return nonEmpty
    }

    const json = (await res.json()) as { content?: { type: string; text?: string }[] }
    const textBlock = json.content?.find((b) => b.type === 'text')?.text ?? ''
    const cleaned = textBlock.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '')
    const parsed = JSON.parse(cleaned)

    if (!Array.isArray(parsed) || parsed.length !== nonEmpty.length) {
      console.error('translateBatch: response array shape mismatch, keeping original text')
      return nonEmpty
    }

    return parsed.map((v, i) => (typeof v === 'string' && v.trim() ? v : nonEmpty[i]))
  } catch (err) {
    console.error('translateBatch failed, keeping original text:', err)
    return nonEmpty
  }
}

type LexicalNode = { type?: string; text?: string; direction?: string; children?: LexicalNode[]; [key: string]: unknown }
type LexicalDoc = { root?: LexicalNode } | null | undefined

/** True when a Lexical richText document has no real (non-whitespace) text content. */
export function isRichTextEmpty(doc: LexicalDoc): boolean {
  if (!doc?.root) return true
  let hasText = false
  const walk = (node: LexicalNode | undefined) => {
    if (!node) return
    if (node.type === 'text' && typeof node.text === 'string' && node.text.trim()) hasText = true
    if (Array.isArray(node.children)) node.children.forEach(walk)
  }
  walk(doc.root)
  return !hasText
}

/** Collects every non-empty text-leaf string from a Lexical doc, in document order. */
export function extractRichTextLeaves(doc: LexicalDoc): string[] {
  if (!doc?.root) return []
  const texts: string[] = []
  const walk = (node: LexicalNode | undefined) => {
    if (!node) return
    if (node.type === 'text' && typeof node.text === 'string' && node.text.trim()) texts.push(node.text)
    if (Array.isArray(node.children)) node.children.forEach(walk)
  }
  walk(doc.root)
  return texts
}

/**
 * Returns a deep-cloned copy of `doc` with every text-leaf replaced by the
 * corresponding entry in `translatedTexts` (same order as
 * `extractRichTextLeaves` would produce) and every `direction: 'rtl'`
 * flipped to `'ltr'`. Structure/formatting (paragraphs, bold, links) is
 * preserved untouched.
 */
export function applyRichTextLeaves<T extends LexicalDoc>(doc: T, translatedTexts: string[]): T {
  if (!doc?.root) return doc
  const clone = JSON.parse(JSON.stringify(doc)) as LexicalDoc
  let i = 0
  const walk = (node: LexicalNode | undefined) => {
    if (!node) return
    if (node.direction === 'rtl') node.direction = 'ltr'
    if (node.type === 'text' && typeof node.text === 'string' && node.text.trim()) {
      if (i < translatedTexts.length) node.text = translatedTexts[i]
      i += 1
    }
    if (Array.isArray(node.children)) node.children.forEach(walk)
  }
  walk(clone?.root)
  return clone as T
}
