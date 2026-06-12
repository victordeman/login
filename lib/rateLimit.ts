import redis from "./redis"

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/**
 * Simple fixed-window rate limiter using Redis.
 * @param identifier Unique identifier for the client (e.g., IP address, user ID).
 * @param limit Maximum number of requests allowed in the window.
 * @param window Window size in seconds.
 */
export async function rateLimit(
  identifier: string,
  limit: number = 10,
  window: number = 60
): Promise<RateLimitResult> {
  const key = `ratelimit:${identifier}`
  const now = Math.floor(Date.now() / 1000)

  // Use a multi/pipeline to ensure atomicity
  const [count] = await redis.pipeline()
    .incr(key)
    .expire(key, window)
    .exec() as [number, number]

  const success = count <= limit
  const remaining = Math.max(0, limit - count)
  const reset = now + window // Simplified reset time

  return {
    success,
    limit,
    remaining,
    reset
  }
}
