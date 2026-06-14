"use server"

import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import { Role } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function updateUserRole(userId: number, newRole: Role) {
  const adminUser = await getCurrentUser()

  if (!adminUser || adminUser.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  // Prevent self-demotion
  if (adminUser.id === userId && newRole !== "ADMIN") {
    throw new Error("You cannot demote yourself")
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  })

  revalidatePath("/admin")
}
