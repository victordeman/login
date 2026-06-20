'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2 } from "lucide-react"

interface QRConfirmButtonProps {
  token: string
}

export default function QRConfirmButton({ token }: QRConfirmButtonProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleConfirm = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/auth/qr/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to confirm login")
      }

      setSuccess(true)
      toast.success("Login confirmed successfully!")
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("An unknown error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 py-4 animate-in zoom-in duration-300">
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-full">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>
        <div className="text-center">
          <p className="text-emerald-600 font-bold text-lg">Identity Verified!</p>
          <p className="text-sm text-slate-500">Redirecting you back...</p>
        </div>
      </div>
    )
  }

  return (
    <Button
      onClick={handleConfirm}
      disabled={loading}
      className="w-full h-12 text-base font-semibold shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
      size="lg"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Verifying request...
        </>
      ) : (
        "Approve Sign-in"
      )}
    </Button>
  )
}
