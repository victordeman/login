'use client'

import { useEffect, useState, useRef } from 'react'
import QRCode from 'qrcode'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

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
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to init QR login')
      }

      const data = await response.json()
      setToken(data.token)

      const confirmUrl = `${window.location.origin}/confirm?token=${data.token}`
      const qrDataUrl = await QRCode.toDataURL(confirmUrl, { 
        width: 300, 
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      })
      setQrCodeUrl(qrDataUrl)
      setStatus('waiting')
    } catch (err: unknown) {
      console.error(err)
      setStatus('error')
      const message = err instanceof Error ? err.message : 'Something went wrong'
      toast.error(message)
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50 dark:bg-slate-950">
      <Card className="w-full max-w-md border-none shadow-2xl bg-white dark:bg-slate-900">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Welcome back</CardTitle>
          <CardDescription className="text-base">
            Scan the QR code to sign in securely
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-6 pb-8">
          <div className="relative flex items-center justify-center w-64 h-64 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-500">
            {status === 'loading' && (
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm font-medium text-muted-foreground">Generating token...</p>
              </div>
            )}

            {status === 'waiting' && qrCodeUrl && (
              <div className="relative group p-2 bg-white rounded-lg shadow-sm">
                <img 
                  src={qrCodeUrl} 
                  alt="Login QR Code" 
                  className="w-full h-full object-contain transition-opacity duration-300 group-hover:opacity-90" 
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-primary/10 backdrop-blur-[2px] p-2 rounded-full">
                    <RefreshCw className="h-6 w-6 text-primary animate-spin-slow" />
                  </div>
                </div>
              </div>
            )}

            {status === 'authenticated' && (
              <div className="flex flex-col items-center space-y-4 text-emerald-600 animate-in zoom-in duration-300">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-full">
                  <CheckCircle2 className="h-12 w-12" />
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold">Success!</p>
                  <p className="text-sm text-emerald-600/80">Taking you to your dashboard</p>
                </div>
              </div>
            )}

            {status === 'expired' && (
              <div className="flex flex-col items-center space-y-4 text-amber-600 animate-in fade-in duration-300">
                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-full">
                  <AlertCircle className="h-12 w-12" />
                </div>
                <div className="text-center space-y-4">
                  <p className="text-sm font-medium">Session expired</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={initQrLogin}
                    className="border-amber-200 hover:bg-amber-50 text-amber-700"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    New QR Code
                  </Button>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center space-y-4 text-destructive animate-in shake duration-300">
                <div className="p-4 bg-destructive/10 rounded-full">
                  <AlertCircle className="h-12 w-12" />
                </div>
                <div className="text-center space-y-4 px-6">
                  <p className="text-sm font-medium">Initialization failed</p>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={initQrLogin}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center space-y-2 text-center">
            {status === 'waiting' && (
              <div className="flex items-center space-y-2 flex-col">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 animate-pulse">
                  Live connection established
                </span>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Open your app and scan to authorize
                </p>
              </div>
            )}
            
            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-semibold pt-4">
              Secure QR Login Flow
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
