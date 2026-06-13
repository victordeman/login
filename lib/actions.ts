"use server";

import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(_prevState: unknown, formData: FormData) {
  const session = await getSession();

  if (!session) {
    return { error: "Not authenticated" };
  }

  const name = formData.get("name") as string;

  if (!name || name.trim().length === 0) {
    return { error: "Name is required" };
  }

  try {
    await prisma.user.update({
      where: { id: parseInt(session.userId) },
      data: { name: name.trim() },
    });

    revalidatePath("/dashboard");
    revalidatePath("/profile");

    return { success: "Profile updated successfully" };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { error: "Failed to update profile" };
  }
}
