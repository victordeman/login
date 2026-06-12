import { Redis } from '@upstash/redis'

const redisClientSingleton = () => {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url) {
    throw new Error('UPSTASH_REDIS_REST_URL is not defined')
  }
  if (!token) {
    throw new Error('UPSTASH_REDIS_REST_TOKEN is not defined')
  }

  return new Redis({
    url,
    token,
  })
}

declare global {
  var redisGlobal: undefined | ReturnType<typeof redisClientSingleton>
}

const redis = globalThis.redisGlobal ?? redisClientSingleton()

export default redis

if (process.env.NODE_ENV !== 'production') globalThis.redisGlobal = redis
