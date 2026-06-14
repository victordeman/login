import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import QRConfirmButton from "@/components/QRConfirmButton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, AlertCircle } from "lucide-react"

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
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50 dark:bg-slate-950">
        <Card className="w-full max-w-md border-none shadow-2xl bg-white dark:bg-slate-900">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-full">
                <AlertCircle className="h-10 w-10 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-red-600">Invalid Token</CardTitle>
            <CardDescription>
              No authentication token was found in your request.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-slate-500">
              Please try scanning the QR code again from the login page.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50 dark:bg-slate-950">
      <Card className="w-full max-w-md border-none shadow-2xl bg-white dark:bg-slate-900">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-full">
              <ShieldCheck className="h-10 w-10 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Confirm Login</CardTitle>
          <CardDescription>
            Authorize this sign-in request for your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-slate-500 text-center">
            You are about to authorize a secure login on another device.
            Only confirm this if you initiated the request yourself.
          </p>
          <QRConfirmButton token={token} />
        </CardContent>
      </Card>
    </div>
  )
}
