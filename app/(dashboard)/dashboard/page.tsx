import { getDashboardStats } from "@/lib/actions/dashboard";
import { getUserSettings } from "@/lib/actions/settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfettiTrigger } from "@/components/confetti";
import {
  DollarSign,
  TrendingDown,
  FileText,
  Clock,
  ArrowRight,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ upgraded?: string }>;
}) {
  const params = await searchParams;
  const [stats, settings] = await Promise.all([
    getDashboardStats(),
    getUserSettings(),
  ]);

  const cards = [
    {
      label: "Recovered This Week",
      value: formatCurrency(stats?.recoveredThisWeek ?? 0),
      icon: DollarSign,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "DSO Improved",
      value: `${stats?.dsoImproved ?? 0} days`,
      icon: TrendingDown,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Open Invoices",
      value: String(stats?.openInvoices ?? 0),
      icon: FileText,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      label: "Total Outstanding",
      value: formatCurrency(stats?.totalOutstanding ?? 0),
      icon: Clock,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
  ];

  const showVibeNudge =
    !settings?.vibe_tone ||
    settings.vibe_tone === "Warm but firm, professional, friendly";

  return (
    <div className="space-y-8 animate-fade-in">
      {params.upgraded === "true" && <ConfettiTrigger />}

      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back — here&apos;s your collection overview.
        </p>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="p-6">
              <div className={`inline-flex p-2.5 rounded-lg ${c.bg} mb-4`}>
                <c.icon className={`h-5 w-5 ${c.color}`} />
              </div>
              <p className="text-2xl font-bold">{c.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{c.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* open invoices */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Open Invoices</CardTitle>
            <Link href="/invoices">
              <Button variant="ghost" size="sm">
                View all <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {!stats?.openInvoicesList?.length ? (
              <p className="text-sm text-muted-foreground py-4">
                No open invoices — looking good! 🎉
              </p>
            ) : (
              <div className="space-y-2.5">
                {stats.openInvoicesList.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/40"
                  >
                    <div>
                      <p className="font-medium text-sm">{inv.client_name}</p>
                      <p className="text-xs text-muted-foreground">
                        Due {formatDate(inv.due_date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">
                        {formatCurrency(Number(inv.amount))}
                      </p>
                      <Badge
                        variant={
                          inv.status === "overdue"
                            ? "destructive"
                            : inv.status === "sent"
                              ? "info"
                              : "warning"
                        }
                      >
                        {inv.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* recent chases */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Chases</CardTitle>
            <Link href="/chases">
              <Button variant="ghost" size="sm">
                View all <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {!stats?.recentChases?.length ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground mb-3">
                  No chases yet. Time to start vibing!
                </p>
                <Link href="/invoices">
                  <Button variant="outline" size="sm">
                    Add an invoice first
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5">
                {stats.recentChases.slice(0, 5).map((ch) => (
                  <div
                    key={ch.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/40"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {ch.invoice?.client_name ?? "—"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        Step {ch.step} · {ch.message_text.slice(0, 50)}…
                      </p>
                    </div>
                    <Badge
                      variant={
                        ch.status === "paid"
                          ? "success"
                          : ch.status === "sent"
                            ? "info"
                            : "outline"
                      }
                    >
                      {ch.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* vibe nudge */}
      {showVibeNudge && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Set up your vibe first!</h3>
              <p className="text-sm text-muted-foreground">
                Tell us your tone — warm, firm, Lagos designer, English +
                Yoruba… whatever makes your chases sound like <em>you</em>.
              </p>
            </div>
            <Link href="/settings">
              <Button variant="glow" size="sm">
                Set My Vibe <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
