import { NextRequest, NextResponse } from "next/server"
import { markLoginTokenAuthenticated } from "@/lib/loginToken"
import { rateLimit } from "@/lib/rateLimit"

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "anonymous"
  const ratelimit = await rateLimit(`confirm:${ip}`, 5, 60) // 5 per minute

  if (!ratelimit.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  try {
    const body = await request.json()
    const { token, userId } = body

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const result = await markLoginTokenAuthenticated(token, userId)

    if (!result) {
      return NextResponse.json({ error: "Token expired, not found, or already authenticated" }, { status: 404 })
    }

    return NextResponse.json({ message: "Authenticated successfully" })
  } catch (error) {
    console.error("Failed to confirm QR login:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
