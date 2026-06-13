"use client";

import { useActionState } from "react";
import { updateProfile } from "@/lib/actions";
import { Button } from "@/components/ui/button";

interface User {
  name: string | null;
}

export default function ProfileForm({ user }: { user: User }) {
  const [state, action, isPending] = useActionState(updateProfile, null);

  return (
    <form action={action} className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1"
        >
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={user.name || ""}
          required
          className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 text-sm ring-offset-white dark:ring-offset-black focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 transition-all disabled:opacity-50"
          placeholder="Enter your name"
          disabled={isPending}
        />
      </div>

      {state?.error && (
        <p className="text-sm font-medium text-red-600 dark:text-red-400 ml-1">
          {state.error}
        </p>
      )}

      {state?.success && (
        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 ml-1">
          {state.success}
        </p>
      )}

      <div className="pt-2 flex flex-col gap-3">
        <Button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl py-6 h-auto text-base font-semibold shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
