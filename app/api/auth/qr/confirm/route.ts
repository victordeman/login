import { NextRequest, NextResponse } from "next/server"
import { markLoginTokenAuthenticated } from "@/lib/loginToken"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get("token")

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 })
  }

  try {
    // In a real app, you would verify the user's session here
    const mockUserId = "user_123"
    const result = await markLoginTokenAuthenticated(token, mockUserId)

    if (!result) {
      return NextResponse.json({ error: "Token expired or not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Authenticated successfully" })
  } catch (error) {
    console.error("Failed to confirm QR login:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
