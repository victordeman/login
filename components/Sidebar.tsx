"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, User, LogOut, Shield } from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
    image?: string | null;
  };
}

export function Sidebar({ className, user }: SidebarProps) {
  const pathname = usePathname();

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Profile",
      icon: User,
      href: "/profile",
      active: pathname === "/profile",
    },
  ];

  if (user.role === "ADMIN") {
    routes.push({
      label: "Admin",
      icon: Shield,
      href: "/admin",
      active: pathname === "/admin",
    });
  }

  return (
    <div className={cn("pb-12 h-full flex flex-col", className)}>
      <div className="space-y-4 py-4 flex-1">
        <div className="px-3 py-2 flex-1">
          <Link href="/dashboard" className="flex items-center pl-3 mb-14">
            <h1 className="text-2xl font-bold">App</h1>
          </Link>
          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                  route.active ? "text-primary bg-primary/10" : "text-zinc-400"
                )}
              >
                <div className="flex items-center flex-1">
                  <route.icon className={cn("h-5 w-5 mr-3")} />
                  {route.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="px-3 mt-auto">
        <div className="flex items-center gap-x-3 px-3 py-4 border-t border-zinc-200 dark:border-zinc-800">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image || ""} />
            <AvatarFallback>
              {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-y-0.5 overflow-hidden">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
              {user.name || "User"}
            </p>
            <p className="text-xs text-zinc-500 truncate">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
