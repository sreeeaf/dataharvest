import type { Config, Context } from '@netlify/functions'
import { getUser } from '@netlify/identity'
import { eq } from 'drizzle-orm'
import { db } from '../../db/index.js'
import { gameSaves } from '../../db/schema.js'

const MAX_BODY_BYTES = 200_000

function toFiniteNumber(value: unknown, fallback = 0): number {
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : fallback
}

function toStringArray(value: unknown): Array<string> {
  if (!Array.isArray(value)) return []
  return value.filter((v): v is string => typeof v === 'string')
}

function toGeneratorRecord(value: unknown): Record<string, number> {
  const result: Record<string, number> = {}
  if (!value || typeof value !== 'object') return result
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    result[key] = Math.max(0, Math.floor(toFiniteNumber(raw, 0)))
  }
  return result
}

// Defense in depth: never trust the client payload's shape, even though it's
// just a game save. Rebuild a plain object with only the expected fields and
// coerced types before it reaches Postgres.
function sanitizeState(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== 'object') return null
  const s = raw as Record<string, unknown>
  return {
    data: Math.max(0, toFiniteNumber(s.data)),
    totalEarned: Math.max(0, toFiniteNumber(s.totalEarned)),
    lifetimeEarned: Math.max(0, toFiniteNumber(s.lifetimeEarned)),
    manualClicks: Math.max(0, toFiniteNumber(s.manualClicks)),
    generators: toGeneratorRecord(s.generators),
    globalUpgrades: toStringArray(s.globalUpgrades),
    clickUpgradeLevel: Math.max(0, Math.floor(toFiniteNumber(s.clickUpgradeLevel))),
    fragments: Math.max(0, toFiniteNumber(s.fragments)),
    rebirths: Math.max(0, Math.floor(toFiniteNumber(s.rebirths))),
    completedQuests: toStringArray(s.completedQuests),
    lastSave: Date.now(),
  }
}

export default async (req: Request, context: Context) => {
  const user = await getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  if (req.method === 'GET') {
    const [row] = await db
      .select()
      .from(gameSaves)
      .where(eq(gameSaves.userId, user.id))
      .limit(1)
    if (!row) return new Response(null, { status: 204 })
    return Response.json({
      state: row.state,
      pseudonym: row.pseudonym,
      updatedAt: row.updatedAt,
    })
  }

  if (req.method === 'POST') {
    const contentLength = Number(req.headers.get('content-length') ?? '0')
    if (contentLength > MAX_BODY_BYTES) {
      return new Response('Payload too large', { status: 413 })
    }
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return new Response('Invalid JSON', { status: 400 })
    }
    const state = sanitizeState(
      body && typeof body === 'object' ? (body as Record<string, unknown>).state : null,
    )
    if (!state) return new Response('Invalid payload', { status: 400 })

    const pseudonym =
      typeof user.userMetadata?.pseudonym === 'string'
        ? (user.userMetadata.pseudonym as string)
        : null

    await db
      .insert(gameSaves)
      .values({ userId: user.id, pseudonym, state, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: gameSaves.userId,
        set: { pseudonym, state, updatedAt: new Date() },
      })

    return Response.json({ ok: true })
  }

  return new Response('Method not allowed', { status: 405 })
}

export const config: Config = {
  path: '/api/game-save',
  method: ['GET', 'POST'],
}
