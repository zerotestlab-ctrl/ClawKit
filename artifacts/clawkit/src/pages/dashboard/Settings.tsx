import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Key, Bell, CreditCard, AlertTriangle, Check, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  useGetSettings, 
  useUpdateSettings, 
  useGetCurrentSubscription, 
  useCancelSubscription,
  getGetSettingsQueryKey,
  getGetCurrentSubscriptionQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export function Settings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: settings, isLoading: settingsLoading } = useGetSettings();
  const { data: subscription, isLoading: subLoading } = useGetCurrentSubscription();
  
  const updateSettingsMut = useUpdateSettings({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() });
        toast({ title: "Settings saved", description: "Your preferences have been updated." });
      }
    }
  });

  const cancelSubMut = useCancelSubscription({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCurrentSubscriptionQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() });
        toast({ title: "Subscription cancelled", description: "You have been downgraded to the Free plan." });
      }
    }
  });

  const [apiKey, setApiKey] = useState("");
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    if (settings) {
      setNotifications(settings.emailNotifications);
    }
  }, [settings]);

  const handleSaveApi = () => {
    if (!apiKey) return;
    updateSettingsMut.mutate({ data: { grokApiKey: apiKey } });
    setApiKey("");
  };

  const handleToggleNotifications = (checked: boolean) => {
    setNotifications(checked);
    updateSettingsMut.mutate({ data: { emailNotifications: checked } });
  };

  if (settingsLoading || subLoading) return <div className="p-12 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
      <div>
        <h1 className="text-3xl font-display font-bold text-white tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account, plan, and API integrations.</p>
      </div>

      <Card className="bg-card/40 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl"><CreditCard className="w-5 h-5 text-primary" /> Current Plan</CardTitle>
          <CardDescription>Manage your billing and subscription.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-xl bg-black/40 border border-white/5">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-display font-bold text-white uppercase">{subscription?.plan || settings?.plan || "FREE"}</h3>
                <Badge className={subscription?.plan === 'free' ? 'bg-white/10 text-white' : 'bg-primary/20 text-primary border-primary/30'}>
                  Active
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {subscription?.plan === 'free' ? "Basic agent distribution features." : "Full Invokex distribution power enabled."}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              {subscription?.plan !== 'free' && (
                <Button 
                  variant="destructive" 
                  className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 shadow-none"
                  onClick={() => cancelSubMut.mutate()}
                  disabled={cancelSubMut.isPending}
                >
                  {cancelSubMut.isPending ? "Cancelling..." : "Cancel Plan"}
                </Button>
              )}
              <Link href="/pricing">
                <Button className="shadow-lg shadow-primary/20">Change Plan</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/40 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl"><Key className="w-5 h-5 text-primary" /> API Integrations</CardTitle>
          <CardDescription>Connect external runtimes for advanced features.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-white flex items-center gap-2">
                xAI Grok API Key 
                {settings?.grokApiKeySet && <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]"><Check className="w-3 h-3 mr-1" /> Configured</Badge>}
              </label>
            </div>
            <div className="flex gap-3">
              <Input 
                type="password" 
                placeholder={settings?.grokApiKeySet ? "••••••••••••••••••••••••" : "xai-..."} 
                className="bg-black/50 border-white/10 font-mono"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
              />
              <Button onClick={handleSaveApi} disabled={!apiKey || updateSettingsMut.isPending}>
                {updateSettingsMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Required for real Safety Auditor execution. Keys are encrypted at rest.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/40 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl"><Bell className="w-5 h-5 text-primary" /> Notifications</CardTitle>
          <CardDescription>Control how Invokex contacts you.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-white/5">
            <div>
              <p className="font-medium text-white">Email Reports</p>
              <p className="text-sm text-muted-foreground">Receive weekly distribution analytics and safety reports.</p>
            </div>
            <Switch 
              checked={notifications} 
              onCheckedChange={handleToggleNotifications}
              disabled={updateSettingsMut.isPending}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
