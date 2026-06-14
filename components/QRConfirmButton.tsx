'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

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
      <div className="text-center">
        <p className="text-green-600 font-medium mb-2">Authenticated!</p>
        <p className="text-sm text-gray-500">You can now close this window or wait to be redirected.</p>
      </div>
    )
  }

  return (
    <button
      onClick={handleConfirm}
      disabled={loading}
      className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      {loading ? "Confirming..." : "Confirm Login"}
    </button>
  )
}
