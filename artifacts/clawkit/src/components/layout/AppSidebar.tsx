import { Link, useLocation } from "wouter";
import { Home, Package, Activity, CreditCard, Settings, LogOut, Zap } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

const items = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Products", url: "/dashboard/products", icon: Package },
  { title: "Distribution", url: "/dashboard/analytics", icon: Activity },
  { title: "Pricing", url: "/pricing", icon: CreditCard },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <Sidebar variant="sidebar" className="border-r border-white/10 bg-background/50 backdrop-blur-xl">
      <SidebarContent>
        <div className="p-6 pb-2">
          <Link href="/dashboard" className="flex items-center gap-2 group hover-elevate cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/50 group-hover:neon-border transition-all">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white">
              ClawKit
            </span>
          </Link>
        </div>
        
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location === item.url || (item.url !== "/dashboard" && location.startsWith(item.url))}
                    className="hover:bg-white/5 transition-colors my-0.5"
                  >
                    <Link href={item.url} className="flex items-center gap-3 py-5">
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">{user?.name}</span>
            <span className="text-xs text-muted-foreground truncate max-w-[140px]">{user?.email}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => logout()} className="text-muted-foreground hover:text-white hover:bg-white/10">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
