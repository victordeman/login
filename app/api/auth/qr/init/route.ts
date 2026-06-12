import { NextRequest, NextResponse } from "next/server"
import { createLoginToken } from "@/lib/loginToken"
import { rateLimit } from "@/lib/rateLimit"

export async function POST(request: NextRequest) {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return NextResponse.json({ error: "Redis configuration is missing" }, { status: 500 })
  }

  const ip = request.headers.get("x-forwarded-for") || "anonymous"
  const ratelimit = await rateLimit(`init:${ip}`, 5, 60) // 5 per minute

  if (!ratelimit.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  try {
    const { token, data } = await createLoginToken()
    return NextResponse.json({ token, expiresAt: data.expiresAt })
  } catch (error) {
    console.error("Failed to initialize QR login:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
