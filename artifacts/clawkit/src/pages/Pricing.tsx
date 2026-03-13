import { Link } from "wouter";
import { Check, ArrowLeft, Zap, Shield, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";

export function Pricing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background py-10 sm:py-20 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <Link href={user ? "/dashboard" : "/"} className="inline-flex items-center gap-2 text-muted-foreground hover:text-white mb-8 sm:mb-12 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <motion.div className="text-center mb-10 sm:mb-20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Zap className="w-3 h-3" /> Simple, transparent pricing
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-display font-bold text-white mb-4 sm:mb-6 tracking-tight leading-tight">
            Simple pricing for<br className="hidden sm:block" /> powerful distribution
          </h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Start for free, scale when your agents start generating real revenue.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-3">
            Works with MCP, CLI, or API — no lock-in
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8 max-w-6xl mx-auto items-stretch">
          {/* FREE */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="h-full bg-card/40 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all flex flex-col">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-xl sm:text-2xl font-display text-white">Free</CardTitle>
                <div className="mt-3 sm:mt-4 flex items-baseline">
                  <span className="text-4xl sm:text-5xl font-extrabold text-white">$0</span>
                  <span className="ml-1 text-lg sm:text-xl font-medium text-muted-foreground">/mo</span>
                </div>
                <CardDescription className="pt-3 sm:pt-4 text-sm">For solo developers testing the waters.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3 sm:space-y-4 text-sm">
                  {["1 product", "Basic MCP + AGENTS.md", "Mock Simulate", "Basic export"].map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-muted-foreground">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-2">
                <Button
                  className="w-full bg-white/10 text-white hover:bg-white/20 border-0"
                  onClick={() => !user && (window.location.href = "/register")}
                >
                  {user ? "Current Plan" : "Get Started Free"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* GROWTH */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="md:scale-105 md:z-10">
            <Card className="h-full bg-card/60 backdrop-blur-xl border-primary/50 shadow-[0_0_40px_rgba(0,195,255,0.15)] relative flex flex-col">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent rounded-t-xl" />
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex justify-between items-center gap-2">
                  <CardTitle className="text-xl sm:text-2xl font-display text-white">Growth</CardTitle>
                  <span className="px-2 sm:px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] sm:text-xs font-semibold uppercase tracking-wider border border-primary/30 whitespace-nowrap">
                    Most Popular
                  </span>
                </div>
                <div className="mt-3 sm:mt-4 flex items-baseline">
                  <span className="text-4xl sm:text-5xl font-extrabold text-white">$99</span>
                  <span className="ml-1 text-lg sm:text-xl font-medium text-muted-foreground">/mo</span>
                </div>
                <p className="text-xs text-primary mt-2 font-semibold flex items-center gap-1">
                  <Shield className="w-3 h-3" /> 14-day free trial — no charge now
                </p>
                <CardDescription className="pt-2 text-sm">Unlimited power for real agent distribution.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3 sm:space-y-4 text-sm">
                  {[
                    "Unlimited products",
                    "Full ClawKit Generator (MCP + Moltbook/OpenClaw)",
                    "Real Safety Auditor + PDF report",
                    "True Simulate Distribution",
                    "Full analytics + Export All My Data Forever",
                  ].map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-white">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-2">
                <Button
                  className="w-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all"
                  asChild
                >
                  <a href="https://paystack.shop/pay/eees4kq6g7" target="_blank" rel="noopener">
                    <Zap className="w-4 h-4 mr-2" /> Upgrade to Growth
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* SCALE */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card className="h-full bg-card/40 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all flex flex-col">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl sm:text-2xl font-display text-white">Scale</CardTitle>
                  <Rocket className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="mt-3 sm:mt-4 flex items-baseline">
                  <span className="text-4xl sm:text-5xl font-extrabold text-white">$299</span>
                  <span className="ml-1 text-lg sm:text-xl font-medium text-muted-foreground">/mo</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 font-medium">14-day free trial — no charge now</p>
                <CardDescription className="pt-2 text-sm">For high-volume enterprise API layers.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3 sm:space-y-4 text-sm">
                  {[
                    "Everything in Growth",
                    "Priority Safety Auditor",
                    "Custom branding",
                    "Advanced analytics (revenue forecasts, agent insights)",
                    "Early Agent-Direct API",
                    "Priority support",
                  ].map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-muted-foreground">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-2">
                <Button
                  variant="outline"
                  className="w-full bg-transparent border-white/20 hover:bg-white/5 text-white"
                  asChild
                >
                  <a href="https://paystack.shop/pay/8g8--6-gkk" target="_blank" rel="noopener">
                    Upgrade to Scale
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        <motion.p className="text-center text-muted-foreground text-xs sm:text-sm mt-8 sm:mt-12 px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          All plans include: Works with MCP, CLI, or API — no lock-in. Cancel anytime.
        </motion.p>
      </div>
    </div>
  );
}
