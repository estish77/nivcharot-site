'use client'

import { useState } from 'react'
import type { DefaultCellComponentProps } from 'payload'

/**
 * Interactive "Featured" toggle for the Press Archive list view — the site
 * owner asked to flip which items show on the home page's 4-item media
 * strip (getPressArchiveItems() in src/lib/cms.ts) without opening each
 * document individually. Payload's default checkbox cell only ever renders
 * "true"/"false" as inert text (see @payloadcms/ui's CheckboxCell), so this
 * is a real custom Cell component: a clickable star that PATCHes just this
 * one field via Payload's own REST API and updates itself immediately,
 * without navigating into the document editor.
 */
export function FeaturedCell({ cellData, rowData, collectionSlug }: DefaultCellComponentProps) {
  const [featured, setFeatured] = useState(Boolean(cellData))
  const [pending, setPending] = useState(false)

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (pending) return

    const next = !featured
    setFeatured(next)
    setPending(true)
    try {
      const res = await fetch(`/api/${collectionSlug}/${rowData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ featured: next }),
      })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    } catch {
      setFeatured(!next) // revert on failure
    } finally {
      setPending(false)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={featured}
      aria-label={featured ? 'Featured on home page — click to remove' : 'Not featured — click to show on home page'}
      title={featured ? 'Featured on home page' : 'Not featured'}
      style={{
        background: 'none',
        border: 'none',
        cursor: pending ? 'default' : 'pointer',
        fontSize: '18px',
        lineHeight: 1,
        padding: '4px',
        opacity: pending ? 0.5 : 1,
        color: featured ? '#d4a017' : '#ccc',
      }}
    >
      {featured ? '★' : '☆'}
    </button>
  )
}
