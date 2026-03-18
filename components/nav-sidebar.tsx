"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, FREE_CHASE_LIMIT } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Settings,
  Zap,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import { useState } from "react";
import type { UserSettings } from "@/lib/types";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/chases", label: "Chases", icon: MessageSquare },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function NavSidebar({ settings }: { settings: UserSettings | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const used = settings?.monthly_chases_used ?? 0;
  const isPro = settings?.subscription_status === "active";

  return (
    <>
      {/* mobile bar */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-50 h-14 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <span className="font-bold">VibeChase</span>
        </Link>
        <button onClick={() => setOpen(!open)} className="p-2">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-border shrink-0">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <span className="font-bold text-lg tracking-tight">VibeChase</span>
          {isPro && (
            <span className="ml-auto text-[10px] font-bold bg-primary/20 text-primary px-1.5 py-0.5 rounded">
              PRO
            </span>
          )}
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <l.icon className="h-4 w-4 shrink-0" />
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-border space-y-3 shrink-0">
          <div className="rounded-lg bg-muted p-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">Chases this month</span>
              <span className="font-semibold">
                {used}/{isPro ? "∞" : FREE_CHASE_LIMIT}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-background overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{
                  width: isPro
                    ? "10%"
                    : `${Math.min(100, (used / FREE_CHASE_LIMIT) * 100)}%`,
                }}
              />
            </div>
            {!isPro && used >= FREE_CHASE_LIMIT && (
              <Link
                href="/settings"
                className="text-xs text-primary hover:underline mt-2 block"
              >
                Upgrade to Pro →
              </Link>
            )}
          </div>

          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
