"use client";

import { createSubscription, openBillingPortal } from "@/actions/billing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, CheckCircle, Zap } from "lucide-react";
import { FREE_CHASE_LIMIT, PRO_PRICE_MONTHLY } from "@/lib/utils";
import type { UserSettings } from "@/lib/types";

export function BillingSection({ settings }: { settings: UserSettings | null }) {
  const isPro = settings?.subscription_status === "active";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Billing
        </CardTitle>
        <CardDescription>
          {isPro ? "You're on the Pro plan" : "You're on the Free plan"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Badge variant={isPro ? "success" : "outline"} className="text-sm">
            {isPro ? "Pro" : "Free"}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {isPro
              ? "Unlimited chases per month"
              : `${settings?.monthly_chases_used ?? 0}/${FREE_CHASE_LIMIT} chases used this month`}
          </span>
        </div>

        {isPro ? (
          <form action={openBillingPortal}>
            <Button variant="outline" type="submit">
              Manage Subscription
            </Button>
          </form>
        ) : (
          <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold">Upgrade to Pro</h4>
                <p className="text-sm text-muted-foreground">
                  ${PRO_PRICE_MONTHLY}/month for unlimited chases
                </p>
              </div>
            </div>
            <ul className="space-y-2 mb-4">
              {[
                "Unlimited chase messages",
                "Priority AI generation",
                "Predictive timing suggestions",
                "Advanced analytics",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-3.5 w-3.5 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
            <form action={createSubscription}>
              <Button variant="glow" type="submit" className="w-full">
                Upgrade Now — ${PRO_PRICE_MONTHLY}/mo
              </Button>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
