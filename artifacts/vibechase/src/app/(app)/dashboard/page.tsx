import { getDashboardStats } from "@/actions/dashboard";
import { getUserSettings } from "@/actions/settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingDown, FileText, Clock, ArrowRight } from "lucide-react";
import { formatUSD, formatDate } from "@/lib/utils";
import Link from "next/link";
import { ConfettiTrigger } from "@/components/confetti-trigger";

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

  const showUpgradeConfetti = params.upgraded === "true";

  const statCards = [
    {
      title: "Recovered This Week",
      value: formatUSD(stats?.recoveredThisWeek ?? 0),
      icon: DollarSign,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      title: "DSO Improved",
      value: `${stats?.dsoImproved ?? 0} days`,
      icon: TrendingDown,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Open Invoices",
      value: String(stats?.openInvoices ?? 0),
      icon: FileText,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Total Outstanding",
      value: formatUSD(stats?.totalOutstanding ?? 0),
      icon: Clock,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {showUpgradeConfetti && <ConfettiTrigger />}

      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back! Here&apos;s your collection overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.title}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Open Invoices */}
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
                No open invoices. Looking good! 🎉
              </p>
            ) : (
              <div className="space-y-3">
                {stats.openInvoicesList.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="font-medium text-sm">{invoice.client_name}</p>
                      <p className="text-xs text-muted-foreground">
                        Due {formatDate(invoice.due_date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">
                        {formatUSD(Number(invoice.amount))}
                      </p>
                      <Badge
                        variant={
                          invoice.status === "overdue"
                            ? "destructive"
                            : invoice.status === "sent"
                            ? "info"
                            : "warning"
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Chases */}
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
              <div className="space-y-3">
                {stats.recentChases.slice(0, 5).map((chase) => (
                  <div
                    key={chase.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {chase.invoice?.client_name ?? "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        Step {chase.step} • {chase.message_text.slice(0, 50)}...
                      </p>
                    </div>
                    <Badge
                      variant={
                        chase.status === "paid"
                          ? "success"
                          : chase.status === "sent"
                          ? "info"
                          : "outline"
                      }
                    >
                      {chase.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      {!settings?.vibe_tone || settings.vibe_tone === "Warm but firm, professional, friendly" ? (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Set up your vibe first!</h3>
              <p className="text-sm text-muted-foreground">
                Tell us your tone — warm, firm, Lagos designer, English + Yoruba...
                whatever makes your chases feel like <em>you</em>.
              </p>
            </div>
            <Link href="/settings">
              <Button variant="glow" size="sm">
                Set My Vibe <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
