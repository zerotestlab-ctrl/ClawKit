import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Zap,
  MessageSquare,
  TrendingUp,
  Shield,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "AI-Powered Reminders",
    description: "Generate 3-step WhatsApp chase sequences in your exact tone and vibe.",
  },
  {
    icon: TrendingUp,
    title: "Track Recovery",
    description: "See how much you've recovered this week with real-time dashboards.",
  },
  {
    icon: Shield,
    title: "Stay Professional",
    description: "Firm but friendly — your clients get paid reminders, not threats.",
  },
  {
    icon: Zap,
    title: "One-Click Send",
    description: "Copy to WhatsApp, send via email, or scan QR codes. Fast and easy.",
  },
];

const steps = [
  { num: "01", title: "Upload Invoices", desc: "CSV or manual entry. We handle the rest." },
  { num: "02", title: "Set Your Vibe", desc: "Warm but firm? Lagos designer? English + Yoruba? You decide." },
  { num: "03", title: "Chase Now", desc: "AI generates personalized reminders. One click to send." },
  { num: "04", title: "Get Paid", desc: "Track responses and celebrate with confetti when they pay." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-lg">VibeChase</span>
          </div>
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

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-primary)_0%,_transparent_50%)] opacity-[0.07]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground mb-8">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Now in Beta — 15 free chases/month
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Chase Payments,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">
              Your Vibe
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            AI-powered WhatsApp reminders that sound exactly like you.
            Upload invoices, set your tone, and let VibeChase handle the awkward
            &quot;please pay me&quot; conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login">
              <Button variant="glow" size="xl" className="w-full sm:w-auto">
                Start Chasing Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                See How It Works
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-primary" />
              No credit card needed
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-primary" />
              15 free chases/month
            </span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need to get paid faster
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Four steps to get paid
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {steps.map((s) => (
              <div key={s.num} className="flex gap-4">
                <div className="text-4xl font-bold text-primary/20">{s.num}</div>
                <div>
                  <h3 className="font-semibold mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Simple pricing</h2>
          <p className="text-muted-foreground mb-12">Start free, upgrade when you&apos;re ready.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="rounded-xl border border-border bg-card p-8 text-left">
              <h3 className="font-semibold text-lg mb-2">Free</h3>
              <div className="text-3xl font-bold mb-4">$0<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" />15 chases per month</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" />AI-generated reminders</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" />WhatsApp + Email</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" />Dashboard analytics</li>
              </ul>
            </div>
            <div className="rounded-xl border-2 border-primary bg-card p-8 text-left relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                Popular
              </div>
              <h3 className="font-semibold text-lg mb-2">Pro</h3>
              <div className="text-3xl font-bold mb-4">$19<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" />Unlimited chases</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" />Priority AI generation</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" />Predictive timing</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" />Advanced analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">VibeChase</span>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} VibeChase. Built with vibes in Lagos.
          </p>
        </div>
      </footer>
    </div>
  );
}
