import { Sidebar } from "@/components/Sidebar";
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-zinc-900">
        <Sidebar user={user} />
      </div>
      <main className="md:pl-72 h-full">
        <div className="h-full bg-zinc-50 dark:bg-black overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
