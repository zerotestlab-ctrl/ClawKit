import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  Upload, Shield, BarChart3, Download, Eye, Cpu, Globe, Terminal,
  Loader2, ArrowRight, Menu, X, Zap, FileText, Layers,
  ChevronRight, Sparkles, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useJoinWaitlist } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ClawKitLogo } from "@/components/ClawKitLogo";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export function Landing() {
  const [email, setEmail] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const waitlistMutation = useJoinWaitlist({
    mutation: {
      onSuccess: () => {
        toast({ title: "You're on the list!", description: "We'll notify you when ClawKit is ready." });
        setEmail("");
      },
      onError: (err: any) => {
        toast({ variant: "destructive", title: "Error", description: err.message || "Failed to join waitlist" });
      },
    },
  });

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    waitlistMutation.mutate({ data: { email } });
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">

      {/* ─── STICKY NAV ─── */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px]">
          <Link href="/">
            <ClawKitLogo size="sm" />
          </Link>

          <div className="hidden sm:flex items-center gap-5 lg:gap-8">
            <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
              Sign In
            </Link>
            <Button size="sm" className="rounded-full px-5 shadow-lg shadow-primary/20 text-sm font-semibold" asChild>
              <Link href="/register">
                Get Started <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </div>

          <button
            className="sm:hidden p-2 -mr-2 text-muted-foreground hover:text-white transition-colors"
            onClick={() => setMobileNav(!mobileNav)}
            aria-label="Toggle menu"
            aria-expanded={mobileNav}
          >
            {mobileNav ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileNav && (
          <div className="sm:hidden bg-background/95 backdrop-blur-xl border-b border-white/5 px-4 pb-5 pt-1 space-y-1">
            <Link href="/pricing" onClick={() => setMobileNav(false)} className="block text-sm font-medium text-muted-foreground hover:text-white py-2.5 px-3 rounded-lg hover:bg-white/5 transition-colors">
              Pricing
            </Link>
            <Link href="/login" onClick={() => setMobileNav(false)} className="block text-sm font-medium text-muted-foreground hover:text-white py-2.5 px-3 rounded-lg hover:bg-white/5 transition-colors">
              Sign In
            </Link>
            <Button className="w-full rounded-full shadow-lg shadow-primary/20 mt-2" asChild>
              <Link href="/register" onClick={() => setMobileNav(false)}>
                Get Started <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </div>
        )}
      </nav>

      {/* ─── BG EFFECTS ─── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-primary/[0.07] blur-[160px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/[0.04] blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,195,255,0.06),transparent)]" />
      </div>

      {/* ─── HERO ─── */}
      <section className="relative z-10 pt-28 sm:pt-36 lg:pt-44 pb-16 sm:pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp(0)} className="flex justify-center mb-8 sm:mb-10">
            <ClawKitLogo size="xl" showText={false} />
          </motion.div>

          <motion.div {...fadeUp(0.05)} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm mb-6 sm:mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground tracking-wide">The 2026 standard for agent distribution</span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.1)}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-display font-bold tracking-tight text-white leading-[1.08] max-w-4xl mx-auto"
          >
            One upload.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C3FF] via-[#00D4FF] to-[#0090CC] drop-shadow-[0_0_20px_rgba(0,195,255,0.4)]">
              Invoked everywhere.
            </span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.15)}
            className="mt-5 sm:mt-7 text-base sm:text-lg md:text-xl text-primary/90 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            While 90% of AI agents are free and stay invisible, ClawKit makes yours discoverable, trusted, and used across every major agent runtime.
          </motion.p>

          <motion.p
            {...fadeUp(0.2)}
            className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed"
          >
            The open distribution layer for developer tools and coding agents in 2026. MCP, CLI, REST API — no lock-in.
          </motion.p>

          <motion.div {...fadeUp(0.25)} className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md mx-auto px-2">
            <form onSubmit={handleWaitlist} className="w-full sm:flex-1 relative">
              <Input
                type="email"
                placeholder="Enter your email"
                aria-label="Email address for waitlist"
                className="h-12 sm:h-13 pl-4 pr-[7.5rem] rounded-xl bg-white/[0.04] border-white/10 backdrop-blur-sm text-sm sm:text-base focus-visible:ring-primary/40 focus-visible:border-primary/40"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1.5 top-1.5 bottom-1.5 rounded-lg px-4 text-xs sm:text-sm font-semibold shadow-lg shadow-primary/20"
                disabled={waitlistMutation.isPending}
              >
                {waitlistMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Join Waitlist"}
              </Button>
            </form>
          </motion.div>

          <motion.div {...fadeUp(0.3)} className="mt-4">
            <Button variant="outline" className="rounded-xl border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-white text-sm px-6 h-11" asChild>
              <Link href="/register">
                Get Started Free <ChevronRight className="w-4 h-4 ml-1 text-primary" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ─── TRUST BAR ─── */}
      <section className="relative z-10 border-y border-white/[0.04] bg-white/[0.01]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-10 md:gap-x-14">
            {[
              { icon: Cpu, label: "Works with MCP" },
              { icon: Terminal, label: "Native CLI Support" },
              { icon: Globe, label: "REST API" },
              { icon: Layers, label: "Moltbook & OpenClaw" },
              { icon: Lock, label: "No lock-in" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-muted-foreground/70">
                <Icon className="w-3.5 h-3.5 text-primary/60" />
                <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="relative z-10 py-20 sm:py-28 lg:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="text-center mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" /> How it works
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight">
              Four steps to everywhere
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[
              {
                step: "01",
                icon: Upload,
                title: "Upload Once",
                desc: "Bring your dev tool or coding agent. Name it, describe it, drop your API spec — done.",
              },
              {
                step: "02",
                icon: Shield,
                title: "Instant MCP Kit",
                desc: "Get a production MCP manifest, AGENTS.md, and a full Safety Auditor PDF report — all generated automatically.",
              },
              {
                step: "03",
                icon: BarChart3,
                title: "Simulate Reach",
                desc: "Run realistic agent invocation simulations and see projected reach across ChatGPT, Claude, Grok, and more.",
              },
              {
                step: "04",
                icon: Download,
                title: "Export & Distribute",
                desc: "Export everything forever. Or let agents discover, trust, and promote your tool on their own.",
              },
            ].map(({ step, icon: Icon, title, desc }, i) => (
              <motion.div
                key={step}
                {...fadeUp(i * 0.08)}
                className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] p-6 sm:p-7 transition-all duration-300 hover:border-primary/20 hover:shadow-[0_0_30px_rgba(0,195,255,0.06)]"
              >
                <span className="text-[11px] font-bold text-primary/40 tracking-widest uppercase">{step}</span>
                <div className="mt-4 w-11 h-11 rounded-xl bg-primary/[0.08] border border-primary/[0.15] flex items-center justify-center mb-5 group-hover:shadow-[0_0_20px_rgba(0,195,255,0.15)] transition-shadow">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VALUE PROPOSITION ─── */}
      <section className="relative z-10 py-20 sm:py-28 lg:py-32 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight">
              Built for the 2026 reality
            </h2>
            <p className="mt-4 text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              The agent economy is exploding. Most tools drown in noise. Yours doesn't have to.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {[
              {
                icon: Zap,
                headline: "Agents flood the market daily",
                body: "Thousands of free dev tools and coding agents launch every week. Without distribution, they're invisible from day one.",
                accent: "text-amber-400",
                accentBg: "bg-amber-400/[0.08] border-amber-400/[0.15]",
              },
              {
                icon: Eye,
                headline: "Most stay invisible forever",
                body: "No discoverability. No trust signal. No safety audit. 90% of agents never get a single real invocation from another AI.",
                accent: "text-red-400",
                accentBg: "bg-red-400/[0.08] border-red-400/[0.15]",
              },
              {
                icon: Sparkles,
                headline: "ClawKit gives you the edge",
                body: "Instant trust via Safety Auditor. Cross-platform reach. Real simulation data. Your agent gets discovered — not buried.",
                accent: "text-primary",
                accentBg: "bg-primary/[0.08] border-primary/[0.15]",
              },
            ].map(({ icon: Icon, headline, body, accent, accentBg }, i) => (
              <motion.div
                key={headline}
                {...fadeUp(i * 0.1)}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8 flex flex-col"
              >
                <div className={`w-11 h-11 rounded-xl ${accentBg} border flex items-center justify-center mb-5`}>
                  <Icon className={`w-5 h-5 ${accent}`} />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">{headline}</h3>
                <p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed flex-1">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES GRID ─── */}
      <section className="relative z-10 py-20 sm:py-28 lg:py-32 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="text-center mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold uppercase tracking-widest mb-3">
              <Layers className="w-3.5 h-3.5" /> Platform features
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight">
              Everything you need to ship
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {[
              {
                icon: Shield,
                title: "Real Safety Auditor",
                desc: "AI-powered safety scoring with downloadable PDF report. Give every agent runtime a reason to trust your tool.",
                highlight: true,
              },
              {
                icon: Globe,
                title: "Cross-platform compatible",
                desc: "Works with ChatGPT, Claude, Grok, Moltbook, and OpenClaw out of the box. One upload, every runtime.",
                highlight: false,
              },
              {
                icon: BarChart3,
                title: "Analytics & Simulate",
                desc: "Simulate realistic agent invocations. Track reach, platform breakdown, and projected revenue in real time.",
                highlight: false,
              },
              {
                icon: FileText,
                title: "Export All My Data Forever",
                desc: "Full data ownership. Export your MCP manifests, AGENTS.md, safety reports, and analytics — forever. No lock-in.",
                highlight: true,
              },
            ].map(({ icon: Icon, title, desc, highlight }, i) => (
              <motion.div
                key={title}
                {...fadeUp(i * 0.08)}
                className={`relative rounded-2xl border p-6 sm:p-8 transition-all duration-300 ${
                  highlight
                    ? "border-primary/20 bg-primary/[0.03] hover:bg-primary/[0.05] hover:shadow-[0_0_40px_rgba(0,195,255,0.08)]"
                    : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10"
                }`}
              >
                {highlight && (
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                )}
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-5 ${
                  highlight ? "bg-primary/[0.1] border-primary/20" : "bg-white/[0.04] border-white/[0.08]"
                }`}>
                  <Icon className={`w-5 h-5 ${highlight ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA ─── */}
      <section className="relative z-10 py-20 sm:py-28 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp()}>
            <ClawKitLogo size="lg" showText={false} className="justify-center mb-6" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight mb-4">
              Ready to be discovered?
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto mb-8">
              Join the developers shipping agent tools that actually get used. Start distributing in minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <form onSubmit={handleWaitlist} className="w-full sm:w-auto sm:flex-1 sm:max-w-sm relative">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  aria-label="Email address for waitlist"
                  className="h-12 pl-4 pr-[7.5rem] rounded-xl bg-white/[0.04] border-white/10 text-sm focus-visible:ring-primary/40"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-1.5 top-1.5 bottom-1.5 rounded-lg px-4 text-sm font-semibold shadow-lg shadow-primary/20"
                  disabled={waitlistMutation.isPending}
                >
                  {waitlistMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Join Waitlist"}
                </Button>
              </form>
            </div>
            <p className="text-xs text-muted-foreground/50 mt-4">No spam. Cancel anytime. Built for the 2026 agent economy.</p>
          </motion.div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="h-16 sm:h-20" />
    </div>
  );
}
