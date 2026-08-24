import config from '@payload-config'
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes'

/**
 * Payload's REST API, mounted at /api/*.
 *
 * The public site does NOT go through this — pages query Payload's Local API
 * directly inside Server Components, with no HTTP hop. This exists for the
 * admin panel and for any external integration that needs REST.
 */

export const GET = REST_GET(config)
export const POST = REST_POST(config)
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const PUT = REST_PUT(config)
export const OPTIONS = REST_OPTIONS(config)
