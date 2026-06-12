'use client'

import { useEffect, useState, useRef } from 'react'
import QRCode from 'qrcode'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [token, setToken] = useState<string | null>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<'loading' | 'waiting' | 'authenticated' | 'expired' | 'error'>('loading')
  const router = useRouter()
  const pollingInterval = useRef<NodeJS.Timeout | null>(null)

  const initQrLogin = async () => {
    try {
      setStatus('loading')
      const response = await fetch('/api/auth/qr/init', { method: 'POST' })
      if (!response.ok) throw new Error('Failed to init QR login')

      const data = await response.json()
      setToken(data.token)

      const confirmUrl = `${window.location.origin}/api/auth/qr/confirm?token=${data.token}`
      const qrDataUrl = await QRCode.toDataURL(confirmUrl, { width: 300, margin: 2 })
      setQrCodeUrl(qrDataUrl)
      setStatus('waiting')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  useEffect(() => {
    const init = async () => {
      await initQrLogin()
    }
    init()
    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current)
    }
  }, [])

  useEffect(() => {
    if (status === 'waiting' && token) {
      pollingInterval.current = setInterval(async () => {
        try {
          const response = await fetch(`/api/auth/qr/status?token=${token}`)
          if (response.status === 404) {
            setStatus('expired')
            if (pollingInterval.current) clearInterval(pollingInterval.current)
            return
          }
          if (!response.ok) throw new Error('Polling failed')

          const data = await response.json()
          if (data.status === 'authenticated') {
            setStatus('authenticated')
            if (pollingInterval.current) clearInterval(pollingInterval.current)
            setTimeout(() => router.push('/dashboard'), 2000)
          }
        } catch (err) {
          console.error(err)
        }
      }, 2000)
    }

    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current)
    }
  }, [status, token, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-6">Login with QR Code</h1>

        <div className="flex flex-col items-center justify-center mb-6 min-h-[300px]">
          {status === 'loading' && <p className="text-gray-500">Initializing...</p>}

          {status === 'waiting' && qrCodeUrl && (
            <>
              <img src={qrCodeUrl} alt="Login QR Code" className="mb-4" />
              <p className="text-sm text-gray-600 animate-pulse">Waiting for scan...</p>
            </>
          )}

          {status === 'authenticated' && (
            <div className="text-green-600">
              <p className="text-xl font-semibold mb-2">Login successful!</p>
              <p className="text-sm">Redirecting to dashboard...</p>
            </div>
          )}

          {status === 'expired' && (
            <div className="text-amber-600">
              <p className="text-lg font-medium mb-4">QR Code expired</p>
              <button
                onClick={initQrLogin}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Refresh QR Code
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="text-red-600">
              <p className="text-lg font-medium mb-4">Something went wrong</p>
              <button
                onClick={initQrLogin}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400">
          Scan the QR code with your mobile device to log in securely.
        </p>
      </div>
    </div>
  )
}
