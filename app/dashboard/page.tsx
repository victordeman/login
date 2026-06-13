import { getCurrentUser } from "@/lib/session"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="mt-4 text-xl">
        Welcome back, <span className="font-semibold">{user.email}</span>!
      </p>
      <div className="mt-2 text-lg">
        Your role is: <span className="px-2 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">{user.role}</span>
      </div>
      {user.role === "ADMIN" && (
        <Link
          href="/admin"
          className="mt-6 text-blue-600 hover:underline"
        >
          Go to Admin Panel
        </Link>
      )}
    </div>
  )
}
