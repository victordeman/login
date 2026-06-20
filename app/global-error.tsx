'use client'

import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center space-y-4">
          <h2 className="text-2xl font-bold">Critical Application Error</h2>
          <p className="text-muted-foreground max-w-md">
            The application has encountered a critical error and cannot continue.
          </p>
          <Button onClick={() => reset()}>Restart Application</Button>
        </div>
      </body>
    </html>
  )
}
