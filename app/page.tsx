import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Zap,
  MessageSquare,
  TrendingUp,
  Shield,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "AI-Powered Reminders",
    desc: "3-step WhatsApp chase sequences in your exact tone and vibe.",
  },
  {
    icon: TrendingUp,
    title: "Track Recovery",
    desc: "Real-time dashboard showing how much you've recovered.",
  },
  {
    icon: Shield,
    title: "Stay Professional",
    desc: "Firm but friendly — no threats, just vibes that get paid.",
  },
  {
    icon: Zap,
    title: "One-Click Send",
    desc: "Copy to WhatsApp, scan QR, or send via email. Done in seconds.",
  },
];

const steps = [
  { n: "01", title: "Upload Invoices", desc: "CSV or manual — we handle it." },
  { n: "02", title: "Set Your Vibe", desc: "Warm? Firm? Yoruba sprinkles? You decide." },
  { n: "03", title: "Chase Now", desc: "AI generates personalized reminders." },
  { n: "04", title: "Get Paid", desc: "Track status, celebrate with confetti 🎉" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* nav */}
      <header className="fixed top-0 inset-x-0 z-50 glass border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-lg tracking-tight">VibeChase</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="glow" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* hero */}
      <section className="relative pt-36 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-primary)_0%,transparent_60%)] opacity-[0.06]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground mb-8">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Now in Beta — 15 free chases / month
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.08]">
            Chase Payments,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">
              Your Vibe
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            AI-powered WhatsApp reminders that sound exactly like you. Upload
            invoices, set your tone, and let VibeChase handle the awkward
            &quot;please pay me&quot; conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login">
              <Button variant="glow" size="xl" className="w-full sm:w-auto">
                Start Chasing Free <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="#how">
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                See How It Works
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" /> No credit card
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" /> 15 free chases
            </span>
          </div>
        </div>
      </section>

      {/* features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need to get paid faster
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-colors"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* how it works */}
      <section id="how" className="py-20 px-4 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Four steps to get paid
          </h2>
          <div className="grid sm:grid-cols-2 gap-8">
            {steps.map((s) => (
              <div key={s.n} className="flex gap-4">
                <span className="text-4xl font-bold text-primary/20 leading-none">
                  {s.n}
                </span>
                <div>
                  <h3 className="font-semibold mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* pricing */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Simple pricing</h2>
          <p className="text-muted-foreground mb-12">
            Start free. Upgrade when you&apos;re ready.
          </p>
          <div className="grid sm:grid-cols-2 gap-8 max-w-xl mx-auto text-left">
            <div className="rounded-xl border border-border bg-card p-7">
              <h3 className="font-semibold text-lg mb-1">Free</h3>
              <p className="text-3xl font-bold mb-5">
                $0<span className="text-sm font-normal text-muted-foreground">/mo</span>
              </p>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {["15 chases / month", "AI reminders", "WhatsApp + Email", "Dashboard"].map(
                  (t) => (
                    <li key={t} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      {t}
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div className="rounded-xl border-2 border-primary bg-card p-7 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                Popular
              </span>
              <h3 className="font-semibold text-lg mb-1">Pro</h3>
              <p className="text-3xl font-bold mb-5">
                $19<span className="text-sm font-normal text-muted-foreground">/mo</span>
              </p>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {[
                  "Unlimited chases",
                  "Priority AI",
                  "Predictive timing",
                  "Advanced analytics",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="py-10 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">VibeChase</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} VibeChase. Built with vibes in Lagos.
          </p>
        </div>
      </footer>
    </div>
  );
}
