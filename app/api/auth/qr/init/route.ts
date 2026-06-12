import { NextResponse } from "next/server"
import { createLoginToken } from "@/lib/loginToken"

export async function POST() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return NextResponse.json({ error: "Redis configuration is missing" }, { status: 500 })
  }
  try {
    const { token, data } = await createLoginToken()
    return NextResponse.json({ token, expiresAt: data.expiresAt })
  } catch (error) {
    console.error("Failed to initialize QR login:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
