import { NextRequest, NextResponse } from "next/server"
import { getLoginTokenStatus } from "@/lib/loginToken"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get("token")

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 })
  }

  try {
    const status = await getLoginTokenStatus(token)
    if (!status) {
      return NextResponse.json({ error: "Token expired or not found" }, { status: 404 })
    }
    return NextResponse.json(status)
  } catch (error) {
    console.error("Failed to get QR login status:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
