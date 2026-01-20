"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, History, Settings, Music2 } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming utils exists, if not I'll standardly use a local helper or clsx/tailwind-merge

export export const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "History", href: "/history", icon: History },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-64 flex-col border-r bg-card text-card-foreground lg:flex">
      {/* Logo Area */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Music2 className="h-6 w-6" />
          <span>Cadence</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer/Extra (Optional) */}
      <div className="border-t p-4">
        <div className="rounded-xl bg-secondary/50 p-4 text-xs text-secondary-foreground">
          <p className="font-semibold">Beta Access</p>
          <p className="mt-1 opacity-70">Cadence is currently in early access.</p>
        </div>
      </div>
    </aside>
  );
}
