import type { ServerFunctionClient } from 'payload'
import type { ReactNode } from 'react'

import config from '@payload-config'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'

import '@payloadcms/next/css'

import { importMap } from './admin/importMap.js'

/**
 * Root layout for the Payload admin panel.
 *
 * This is a second root layout, living in its own `(payload)` route group
 * alongside `(site)`: it renders its own `<html>`/`<body>`, so the admin is
 * fully isolated from the public site's fonts, tokens and RTL direction.
 *
 * Note the admin UI itself runs in English — Payload's own RTL support for
 * the admin chrome is still incomplete upstream. That affects only the
 * editing interface; the Hebrew/English *content* localization is unaffected.
 */

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({ ...args, config, importMap })
}

export default function PayloadLayout({ children }: { children: ReactNode }) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  )
}
