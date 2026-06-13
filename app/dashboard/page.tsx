import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: parseInt(session.userId) },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 dark:bg-black font-sans p-6">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Welcome, {user.name || "User"}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manage your account and profile settings
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2 py-2 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-sm font-medium text-zinc-500">Email</span>
            <span className="col-span-2 text-sm text-zinc-900 dark:text-zinc-100">
              {user.email}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 py-2 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-sm font-medium text-zinc-500">Name</span>
            <span className="col-span-2 text-sm text-zinc-900 dark:text-zinc-100">
              {user.name || "Not set"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 py-2 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-sm font-medium text-zinc-500">Role</span>
            <span className="col-span-2">
              <span className="inline-flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
                {user.role}
              </span>
            </span>
          </div>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <Link href="/profile" className="w-full">
            <Button className="w-full rounded-xl py-6 h-auto text-base font-semibold shadow-md transition-all hover:scale-[1.01] active:scale-[0.99]">
              Edit Profile
            </Button>
          </Link>
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full rounded-xl py-6 h-auto text-base font-semibold border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
