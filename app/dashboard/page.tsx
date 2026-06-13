import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground text-zinc-500">
            Welcome back to your account overview.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-x-4 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.image || ""} />
                <AvatarFallback>
                  {user.name?.charAt(0) || user.email.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <p className="text-base font-semibold">{user.name || "User"}</p>
                <p className="text-sm text-zinc-500">{user.email}</p>
              </div>
            </div>
            <div className="text-xs font-semibold uppercase text-zinc-400">
              Role: <span className="text-zinc-900 dark:text-zinc-100">{user.role}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-500">No recent activity found.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-x-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <p className="text-sm text-zinc-500">All systems operational</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
