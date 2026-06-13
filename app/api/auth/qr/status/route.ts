import { NextRequest, NextResponse } from "next/server"
import { getLoginTokenStatus, deleteLoginToken } from "@/lib/loginToken"
import { rateLimit } from "@/lib/rateLimit"
import { setSession } from "@/lib/session"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get("token")

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 })
  }

  const ratelimit = await rateLimit(`status:${token}`, 100, 60) // 100 per minute per token
  if (!ratelimit.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  try {
    const status = await getLoginTokenStatus(token)
    if (!status) {
      return NextResponse.json({ error: "Token expired or not found" }, { status: 404 })
    }

    if (status.status === "authenticated" && status.userId) {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(status.userId) },
        select: { role: true }
      })

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      await setSession(status.userId, user.role)
      await deleteLoginToken(token)
    }

    return NextResponse.json(status)
  } catch (error) {
    console.error("Failed to get QR login status:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
