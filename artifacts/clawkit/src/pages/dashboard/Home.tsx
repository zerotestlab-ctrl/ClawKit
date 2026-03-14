import { Link } from "wouter";
import {
  UploadCloud,
  Zap,
  Package,
  Activity,
  ArrowRight,
  Shield,
  PlayCircle,
  Download,
  Cpu,
  TrendingUp,
  Globe,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetDashboardAnalytics, useListProducts } from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const howItWorks = [
  {
    icon: UploadCloud,
    step: "01",
    title: "Upload once",
    description:
      "Drop your OpenAPI spec or describe your coding agent. Invokex ingests it in seconds — no reformat needed.",
    color: "text-primary",
    bg: "bg-primary/10 border-primary/20",
  },
  {
    icon: Shield,
    step: "02",
    title: "Generate & Audit",
    description:
      "Instantly get a production MCP manifest, AGENTS.md, ChatGPT/Claude/Grok submission copy, and a Safety Audit PDF.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: PlayCircle,
    step: "03",
    title: "Simulate & Forecast",
    description:
      "Run real agent invocations across ChatGPT, Claude, Grok, and Moltbook. See projected revenue before going live.",
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    icon: Download,
    step: "04",
    title: "Export or auto-distribute",
    description:
      "Download everything forever with one click, or let Invokex push your agent to every runtime automatically.",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
];

const runtimes = ["ChatGPT", "Claude", "Grok", "Moltbook", "OpenClaw", "MCP"];

export function DashboardHome() {
  const { user } = useAuth();
  const { data: analytics, isLoading: analyticsLoading } = useGetDashboardAnalytics();
  const { data: productsData, isLoading: productsLoading } = useListProducts();

  return (
    <motion.div
      className="space-y-10 pb-8"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* ─── Hero ─── */}
      <motion.div variants={fadeUp} className="relative rounded-2xl overflow-hidden border border-white/8 bg-gradient-to-br from-primary/8 via-background to-background p-6 sm:p-8 lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(0,195,255,0.12)_0%,_transparent_60%)] pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge className="bg-primary/15 text-primary border-primary/25 font-semibold text-xs px-3 py-1">
              <Zap className="w-3 h-3 mr-1.5" /> 2026 Agent Economy
            </Badge>
            {user?.plan && user.plan !== "free" && (
              <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/25 text-xs px-3 py-1 uppercase">
                {user.plan}
              </Badge>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight mb-3">
            Welcome back, {user?.name?.split(" ")[0]} 👋<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-primary/80">
              The ultimate distribution layer for AI agents.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed mb-6">
            While 90% of agents are free and stay invisible, Invokex makes yours{" "}
            <span className="text-white font-medium">discoverable, trusted, and invoked</span> across
            ChatGPT, Claude, Grok, Moltbook, OpenClaw and every runtime. One upload. Invoked everywhere.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/products">
              <Button size="lg" className="shadow-lg shadow-primary/20 gap-2">
                <UploadCloud className="w-4 h-4" /> Upload New Product
              </Button>
            </Link>
            <Link href="/dashboard/analytics">
              <Button size="lg" variant="outline" className="border-white/15 hover:bg-white/5 gap-2">
                <Activity className="w-4 h-4" /> View Analytics
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ─── Quick stats ─── */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Invocations",
            value: analyticsLoading ? "—" : (analytics?.totalInvocations?.toLocaleString() || "0"),
            icon: Activity,
            iconColor: "text-primary",
            sub: "across all runtimes",
          },
          {
            label: "Projected Revenue",
            value: analyticsLoading ? "—" : formatCurrency(analytics?.totalRevenue || 0),
            icon: TrendingUp,
            iconColor: "text-emerald-400",
            sub: "from agent invocations",
          },
          {
            label: "Active Products",
            value: analyticsLoading ? "—" : String(analytics?.totalProducts || 0),
            icon: Package,
            iconColor: "text-violet-400",
            sub: "distributed via Invokex",
          },
        ].map((stat) => (
          <Card
            key={stat.label}
            className="bg-card/40 border-white/8 backdrop-blur-sm hover:bg-card/60 transition-colors"
          >
            <CardHeader className="pb-2 pt-5 px-5">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* ─── How Invokex Works ─── */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">How Invokex Works</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Four steps from upload to everywhere.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {howItWorks.map((item, i) => (
            <motion.div
              key={item.step}
              variants={fadeUp}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={`h-full bg-card/30 border-white/8 hover:bg-card/50 transition-all hover:border-white/15 group`}>
                <CardContent className="p-5 flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.bg}`}>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <span className="text-2xl font-black text-white/8 group-hover:text-white/15 transition-colors font-mono">
                      {item.step}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm mb-1.5">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ─── Runtime compatibility banner ─── */}
      <motion.div variants={fadeUp} className="rounded-xl border border-white/6 bg-white/2 px-5 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2 shrink-0">
            <Globe className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Compatible with</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {runtimes.map((r) => (
              <span
                key={r}
                className="text-xs font-medium text-white/70 px-2.5 py-1 rounded-md bg-white/5 border border-white/8"
              >
                {r}
              </span>
            ))}
          </div>
          <p className="sm:ml-auto text-xs text-muted-foreground shrink-0">
            Works with MCP, CLI, or API — no lock-in
          </p>
        </div>
      </motion.div>

      {/* ─── Recent Products ─── */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Recent Products</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Your latest uploaded agents and tools.</p>
          </div>
          <Link href="/dashboard/products">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white gap-1.5 text-xs">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[0, 1].map((i) => (
              <div key={i} className="h-28 rounded-xl bg-white/4 animate-pulse" />
            ))}
          </div>
        ) : productsData?.products?.length === 0 ? (
          <div className="text-center py-14 px-4 border border-dashed border-white/10 rounded-2xl bg-card/15">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
              <Cpu className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No agents distributed yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-5">
              Upload your first tool or coding agent to generate your complete Invokex distribution package.
            </p>
            <Link href="/dashboard/products">
              <Button className="gap-2 shadow-lg shadow-primary/15">
                <UploadCloud className="w-4 h-4" /> Upload Your First Agent
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(productsData?.products ?? []).slice(0, 4).map((product) => (
              <Card
                key={product.id}
                className="bg-card/35 border-white/8 hover:bg-card/55 hover:border-white/15 transition-all group"
              >
                <CardContent className="p-5 flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-white truncate">{product.name}</h3>
                      {product.generated && (
                        <Badge className="bg-primary/15 text-primary border-primary/20 text-[10px] px-1.5 py-0.5 shrink-0">
                          Generated
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs font-semibold">
                      <span className="text-primary flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        {product.invocations.toLocaleString()} invokes
                      </span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {formatCurrency(product.revenue)}
                      </span>
                    </div>
                  </div>
                  <Link href="/dashboard/products">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-8 h-8 text-muted-foreground hover:text-white hover:bg-white/10 rounded-lg shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>

      {/* ─── Bottom CTA ─── */}
      <motion.div variants={fadeUp} className="text-center py-6 border-t border-white/5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">
          Agents are now the interface. Be where they look.
        </p>
      </motion.div>
    </motion.div>
  );
}
