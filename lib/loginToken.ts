import redis from "./redis"
import { generateSecureToken } from "./utils"

export type LoginTokenStatus = "pending" | "authenticated"

export interface LoginTokenData {
  status: LoginTokenStatus
  userId?: string
  createdAt: number
  expiresAt: number
}

const DEFAULT_TTL = 300 // 5 minutes in seconds

/**
 * Creates a new ephemeral login token in Redis.
 */
export async function createLoginToken(): Promise<{ token: string; data: LoginTokenData }> {
  const token = generateSecureToken()
  const now = Math.floor(Date.now() / 1000)
  const expiresAt = now + DEFAULT_TTL

  const data: LoginTokenData = {
    status: "pending",
    createdAt: now,
    expiresAt: expiresAt,
  }

  await redis.set(`login:${token}`, data, { ex: DEFAULT_TTL })

  return { token, data }
}

/**
 * Retrieves the status and data of a login token.
 */
export async function getLoginTokenStatus(token: string): Promise<LoginTokenData | null> {
  return await redis.get<LoginTokenData>(`login:${token}`)
}

/**
 * Marks a login token as authenticated and associates it with a user ID.
 */
export async function markLoginTokenAuthenticated(token: string, userId: string): Promise<LoginTokenData | null> {
  const key = `login:${token}`
  const data = await redis.get<LoginTokenData>(key)

  if (!data || data.status !== "pending") return null

  const updatedData: LoginTokenData = {
    ...data,
    status: "authenticated",
    userId,
  }

  // Calculate remaining TTL to preserve original expiration
  const now = Math.floor(Date.now() / 1000)
  const remainingTtl = data.expiresAt - now

  if (remainingTtl <= 0) {
    await redis.del(key)
    return null
  }

  await redis.set(key, updatedData, { ex: remainingTtl })

  return updatedData
}

/**
 * Deletes a login token from Redis.
 */
export async function deleteLoginToken(token: string): Promise<void> {
  await redis.del(`login:${token}`)
}
