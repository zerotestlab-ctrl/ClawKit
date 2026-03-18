"use client";

import { useState } from "react";
import { updateVibeTone } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, CheckCircle } from "lucide-react";

const vibeExamples = [
  "Warm but firm, professional, friendly",
  "Lagos designer energy — English with Yoruba sprinkles, casual but clear",
  "Corporate and polished, always courteous",
  "Direct and no-nonsense, get to the point fast",
  "Friendly neighborhood accountant — warm, patient, understanding",
  "British politeness with Nigerian directness",
];

export function VibeSettings({ currentTone }: { currentTone: string }) {
  const [tone, setTone] = useState(currentTone);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaved(false);

    const formData = new FormData();
    formData.set("vibe_tone", tone);
    const result = await updateVibeTone(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Your Vibe
        </CardTitle>
        <CardDescription>
          Describe how you want your chase messages to sound. The AI will match your exact tone.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          placeholder="Describe your tone... e.g., 'Warm but firm, Lagos designer, English + Yoruba'"
          rows={4}
          className="text-base"
        />

        <div>
          <p className="text-xs text-muted-foreground mb-2">Try one of these:</p>
          <div className="flex flex-wrap gap-2">
            {vibeExamples.map((example) => (
              <button
                key={example}
                onClick={() => setTone(example)}
                className="text-xs px-2.5 py-1 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-destructive text-sm">{error}</p>}

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={saving} variant="glow">
            {saving ? "Saving..." : "Save Vibe"}
          </Button>
          {saved && (
            <span className="flex items-center gap-1 text-green-400 text-sm animate-fade-in">
              <CheckCircle className="h-4 w-4" />
              Saved!
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
