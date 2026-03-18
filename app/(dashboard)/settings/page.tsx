import { getUserSettings } from "@/lib/actions/settings";
import { getUser } from "@/lib/actions/auth";
import { VibeSettings } from "@/components/vibe-settings";
import { BillingSection } from "@/components/billing-section";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default async function SettingsPage() {
  const [settings, user] = await Promise.all([
    getUserSettings(),
    getUser(),
  ]);

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Customize your vibe and manage your account.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
          <CardDescription>Signed in as {user?.email}</CardDescription>
        </CardHeader>
      </Card>

      <VibeSettings currentTone={settings?.vibe_tone || ""} />

      <BillingSection settings={settings} />
    </div>
  );
}
