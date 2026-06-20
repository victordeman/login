import { NextRequest, NextResponse } from "next/server"
import { markLoginTokenAuthenticated, getLoginTokenStatus } from "@/lib/loginToken"
import { rateLimit } from "@/lib/rateLimit"
import { getSession } from "@/lib/session"

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const ip = request.headers.get("x-forwarded-for") || "anonymous"
  const ratelimit = await rateLimit(`confirm:${ip}`, 5, 60) // 5 per minute

  if (!ratelimit.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    const status = await getLoginTokenStatus(token)
    if (!status) {
      return NextResponse.json({ error: "Token expired or not found" }, { status: 404 })
    }

    if (status.status !== "pending") {
      return NextResponse.json({ error: "Token already used" }, { status: 400 })
    }

    const result = await markLoginTokenAuthenticated(token, session.userId)

    if (!result) {
      return NextResponse.json({ error: "Failed to confirm token" }, { status: 500 })
    }

    return NextResponse.json({ message: "Authenticated successfully" })
  } catch (error) {
    console.error("Failed to confirm QR login:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
