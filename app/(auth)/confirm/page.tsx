import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import QRConfirmButton from "@/components/QRConfirmButton"

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const session = await getSession()
  const params = await searchParams
  const token = params.token

  if (!session) {
    const callbackUrl = token ? `/confirm?token=${token}` : "/confirm"
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)
  }

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Invalid Token</h1>
          <p className="text-gray-600">No token provided in the URL.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Confirm QR Login</h1>
        <p className="text-gray-600 mb-8 text-center">
          You are about to authorize a login on another device.
        </p>
        <QRConfirmButton token={token} />
      </div>
    </div>
  )
}
