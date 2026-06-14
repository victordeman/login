"use client"

import { useTransition } from "react"
import { updateUserRole } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { Role } from "@prisma/client"
import { toast } from "sonner"

interface UserRoleToggleProps {
  userId: number
  currentRole: Role
  isSelf: boolean
}

export function UserRoleToggle({ userId, currentRole, isSelf }: UserRoleToggleProps) {
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN"
    
    startTransition(async () => {
      try {
        await updateUserRole(userId, newRole)
        toast.success(`User role updated to ${newRole}`)
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update role"
        toast.error(message)
      }
    })
  }

  if (isSelf) {
    return (
      <span className="text-sm text-muted-foreground italic">
        (Current User)
      </span>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      disabled={isPending}
    >
      {isPending ? "Updating..." : `Make ${currentRole === "ADMIN" ? "User" : "Admin"}`}
    </Button>
  )
}
