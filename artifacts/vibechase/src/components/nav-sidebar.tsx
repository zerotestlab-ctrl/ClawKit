"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
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
import { signOut } from "@/actions/auth";
import { useState } from "react";
import type { UserSettings } from "@/lib/types";
import { FREE_CHASE_LIMIT } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/chases", label: "Chases", icon: MessageSquare },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function NavSidebar({ settings }: { settings: UserSettings | null }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const chasesUsed = settings?.monthly_chases_used ?? 0;
  const isPro = settings?.subscription_status === "active";
  const chaseLimit = isPro ? "∞" : FREE_CHASE_LIMIT;

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-50 glass h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <span className="font-bold">VibeChase</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center gap-2 px-6 border-b border-border">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <span className="font-bold text-lg">VibeChase</span>
          {isPro && (
            <span className="ml-auto text-[10px] font-bold bg-primary/20 text-primary px-1.5 py-0.5 rounded">
              PRO
            </span>
          )}
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-border space-y-3">
          <div className="rounded-lg bg-muted p-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">Chases used</span>
              <span className="font-semibold">{chasesUsed}/{chaseLimit}</span>
            </div>
            <div className="h-1.5 rounded-full bg-background overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{
                  width: isPro ? "10%" : `${Math.min(100, (chasesUsed / FREE_CHASE_LIMIT) * 100)}%`,
                }}
              />
            </div>
            {!isPro && chasesUsed >= FREE_CHASE_LIMIT && (
              <Link href="/settings" className="text-xs text-primary hover:underline mt-2 block">
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
