import { Link } from "wouter";
import { Check, ArrowLeft, Zap, Shield, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { useUpgradeSubscription } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

type PlanType = "growth" | "scale";

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "pk_test_placeholder";

function openPaystackCheckout({
  email,
  amount,
  plan,
  onSuccess,
  onCancel,
}: {
  email: string;
  amount: number;
  plan: PlanType;
  onSuccess: (reference: string) => void;
  onCancel: () => void;
}) {
  const PaystackPop = (window as any).PaystackPop;
  if (!PaystackPop) {
    const ref = `clawkit_${plan}_${Date.now()}_test`;
    onSuccess(ref);
    return;
  }
  const handler = PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email,
    amount: amount * 100,
    currency: "USD",
    ref: `clawkit_${plan}_${Date.now()}`,
    metadata: { plan, custom_fields: [{ display_name: "Plan", variable_name: "plan", value: plan }] },
    onClose: onCancel,
    callback: (response: any) => onSuccess(response.reference),
  });
  handler.openIframe();
}

export function Pricing() {
  const { user } = useAuth();
  const { toast } = useToast();
  const upgradeMutation = useUpgradeSubscription();

  const handleUpgrade = async (plan: PlanType) => {
    if (!user) {
      window.location.href = "/register";
      return;
    }

    const amount = plan === "growth" ? 99 : 299;

    openPaystackCheckout({
      email: user.email,
      amount,
      plan,
      onSuccess: async (reference: string) => {
        try {
          await upgradeMutation.mutateAsync({
            data: { plan: plan as any, paystackReference: reference, paystackEmail: user.email },
          });
          toast({
            title: "Upgraded Successfully!",
            description: `You are now on the ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan with a 14-day free trial.`,
          });
          window.location.href = "/dashboard/settings";
        } catch (err: any) {
          toast({ variant: "destructive", title: "Upgrade failed", description: err.message });
        }
      },
      onCancel: () => {
        toast({ title: "Payment cancelled", description: "No charge was made." });
      },
    });
  };

  return (
    <div className="min-h-screen bg-background py-20 px-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <script src="https://js.paystack.co/v1/inline.js" async />

      <div className="max-w-7xl mx-auto relative z-10">
        <Link href={user ? "/dashboard" : "/"} className="inline-flex items-center gap-2 text-muted-foreground hover:text-white mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <motion.div className="text-center mb-20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Zap className="w-3 h-3" /> Simple, transparent pricing
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight">
            Simple pricing for<br />powerful distribution
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start for free, scale when your agents start generating real revenue.
          </p>
          <p className="text-sm text-muted-foreground mt-3">
            Works with MCP, CLI, or API – no lock-in
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {/* FREE */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="h-full bg-card/40 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl font-display text-white">Free</CardTitle>
                <div className="mt-4 flex items-baseline">
                  <span className="text-5xl font-extrabold text-white">$0</span>
                  <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
                </div>
                <CardDescription className="pt-4">For solo developers testing the waters.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-4 text-sm">
                  {["1 product", "Basic MCP + AGENTS.md", "Mock Simulate", "Basic export"].map(f => (
                    <li key={f} className="flex items-center gap-3 text-muted-foreground">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <Card className="h-full bg-card/60 backdrop-blur-xl border-primary/50 shadow-[0_0_40px_rgba(0,195,255,0.15)] relative flex flex-col scale-105 z-10">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent rounded-t-xl" />
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-display text-white">Growth</CardTitle>
                  <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold uppercase tracking-wider border border-primary/30">
                    Most Popular
                  </span>
                </div>
                <div className="mt-4 flex items-baseline">
                  <span className="text-5xl font-extrabold text-white">$99</span>
                  <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
                </div>
                <p className="text-xs text-primary mt-2 font-semibold flex items-center gap-1">
                  <Shield className="w-3 h-3" /> 14-day free trial — no charge now
                </p>
                <CardDescription className="pt-2">Unlimited power for real agent distribution.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-4 text-sm">
                  {[
                    "Unlimited products",
                    "Full ClawKit Generator (MCP + Moltbook/OpenClaw)",
                    "Real Safety Auditor + PDF report",
                    "True Simulate Distribution",
                    "Full analytics + Export All My Data Forever",
                  ].map(f => (
                    <li key={f} className="flex items-center gap-3 text-white">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all"
                  onClick={() => handleUpgrade("growth")}
                  disabled={upgradeMutation.isPending}
                >
                  <Zap className="w-4 h-4 mr-2" /> Upgrade to Growth
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* SCALE */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card className="h-full bg-card/40 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-display text-white">Scale</CardTitle>
                  <Rocket className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="mt-4 flex items-baseline">
                  <span className="text-5xl font-extrabold text-white">$299</span>
                  <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 font-medium">14-day free trial — no charge now</p>
                <CardDescription className="pt-2">For high-volume enterprise API layers.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-4 text-sm">
                  {[
                    "Everything in Growth",
                    "Priority Safety Auditor",
                    "Custom branding",
                    "Advanced analytics (revenue forecasts, agent insights)",
                    "Early Agent-Direct API",
                    "Priority support",
                  ].map(f => (
                    <li key={f} className="flex items-center gap-3 text-muted-foreground">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full bg-transparent border-white/20 hover:bg-white/5 text-white"
                  onClick={() => handleUpgrade("scale")}
                  disabled={upgradeMutation.isPending}
                >
                  Upgrade to Scale
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        <motion.p className="text-center text-muted-foreground text-sm mt-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          All plans include: Works with MCP, CLI, or API – no lock-in. Cancel anytime.
        </motion.p>
      </div>
    </div>
  );
}
