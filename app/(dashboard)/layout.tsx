import { NavSidebar } from "@/components/nav-sidebar";
import { getUserSettings } from "@/lib/actions/settings";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getUserSettings();

  return (
    <div className="min-h-screen bg-background">
      <NavSidebar settings={settings} />
      <main className="lg:pl-64 pt-14 lg:pt-0">
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
