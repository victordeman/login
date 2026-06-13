import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import prisma from "./prisma"
import { SESSION_COOKIE_NAME, SECRET_KEY } from "./constants"

export interface Session {
  userId: string
  role: string
}

export async function getCurrentUser() {
  const session = await getSession()
  if (!session) return null

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.userId) },
    })
    return user
  } catch (error) {
    return null
  }
}

export async function setSession(userId: string, role: string = "user") {
  const session: Session = { userId, role }

  const token = await new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1w")
    .sign(SECRET_KEY)

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(SESSION_COOKIE_NAME)

  if (!cookie) return null

  try {
    const { payload } = await jwtVerify(cookie.value, SECRET_KEY)
    return payload as unknown as Session
  } catch (error) {
    return null
  }
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}
