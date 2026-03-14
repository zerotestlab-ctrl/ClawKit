import { useState, type ReactNode } from "react";
import { Link, useLocation, Redirect } from "wouter";
import {
  Home,
  Package,
  Activity,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  ChevronRight,
} from "lucide-react";
import { InvokexLogo } from "@/components/InvokexLogo";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Products", url: "/dashboard/products", icon: Package },
  { title: "Distribution", url: "/dashboard/analytics", icon: Activity },
  { title: "Pricing", url: "/pricing", icon: CreditCard },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const [location] = useLocation();
  return (
    <nav className="flex flex-col gap-1 mt-2">
      {navItems.map((item) => {
        const isActive =
          location === item.url ||
          (item.url !== "/dashboard" && location.startsWith(item.url));
        return (
          <Link
            key={item.title}
            href={item.url}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative
              ${isActive
                ? "bg-primary/15 text-primary border border-primary/20 shadow-[0_0_12px_rgba(0,195,255,0.08)]"
                : "text-muted-foreground hover:text-white hover:bg-white/5"
              }`}
          >
            <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-primary" : ""}`} />
            <span>{item.title}</span>
            {isActive && (
              <ChevronRight className="w-3 h-3 ml-auto opacity-60" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth();
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 pb-4 border-b border-white/5">
        <Link href="/dashboard" onClick={onNavigate} className="group">
          <InvokexLogo size="sm" className="group-hover:opacity-90 transition-opacity" />
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold px-3 mb-2">
          Platform
        </p>
        <NavLinks onNavigate={onNavigate} />
      </div>

      {/* User footer */}
      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/3">
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-primary uppercase">
              {user?.name?.charAt(0) || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { logout(); onNavigate?.(); }}
            className="flex-shrink-0 text-muted-foreground hover:text-white hover:bg-white/10 w-8 h-8"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[150px] pointer-events-none z-0" />

      {/* ─── Desktop Sidebar (always visible on md+) ─── */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-white/8 bg-background/60 backdrop-blur-xl relative z-20">
        <SidebarContent />
      </aside>

      {/* ─── Mobile overlay drawer ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 md:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
              className="absolute inset-y-0 left-0 z-10 w-72 bg-background border-r border-white/10 flex flex-col"
            >
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Main content area ─── */}
      <div className="flex flex-col flex-1 min-w-0 relative z-10">
        {/* Top bar */}
        <header className="flex items-center h-14 md:h-16 px-3 md:px-5 border-b border-white/5 bg-background/50 backdrop-blur-sm shrink-0 gap-3">
          {/* Hamburger — mobile only */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-muted-foreground hover:text-white hover:bg-white/10 w-9 h-9"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Mobile logo */}
          <Link href="/dashboard" className="md:hidden">
            <InvokexLogo size="sm" />
          </Link>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-2 md:gap-3">
            <div className="hidden sm:flex text-xs px-2.5 py-1.5 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20 uppercase tracking-wide">
              {user.plan}
            </div>

            {/* Desktop logout */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logout()}
              className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-white hover:bg-white/8 text-xs font-medium h-8 px-3"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </Button>

            {/* Mobile user avatar */}
            <div className="md:hidden w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <span className="text-xs font-bold text-primary uppercase">
                {user?.name?.charAt(0) || "U"}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
