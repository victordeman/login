import { getCurrentUser } from "@/lib/session"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function AdminPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold text-red-600">Admin Panel</h1>
      <p className="mt-4 text-xl">
        Hello Admin, <span className="font-semibold">{user.email}</span>!
      </p>
      <p className="mt-2 text-lg">
        Access restricted to Administrators only.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 text-blue-600 hover:underline"
      >
        Back to Dashboard
      </Link>
    </div>
  )
}
