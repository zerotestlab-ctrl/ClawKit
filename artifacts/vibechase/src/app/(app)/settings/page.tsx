import { getUserSettings } from "@/actions/settings";
import { getUser } from "@/actions/auth";
import { VibeSettings } from "@/components/vibe-settings";
import { BillingSection } from "@/components/billing-section";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function SettingsPage() {
  const [settings, user] = await Promise.all([getUserSettings(), getUser()]);

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Customize your vibe and manage your account.
        </p>
      </div>

      {/* Account */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
          <CardDescription>Signed in as {user?.email}</CardDescription>
        </CardHeader>
      </Card>

      {/* Vibe Tone */}
      <VibeSettings currentTone={settings?.vibe_tone || ""} />

      {/* Billing */}
      <BillingSection settings={settings} />
    </div>
  );
}
