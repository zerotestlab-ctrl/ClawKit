"use client";

import { useState, useEffect } from "react";
import { getPredictiveTiming } from "@/actions/chases";
import { Clock } from "lucide-react";
import type { PredictiveTiming } from "@/lib/types";

export function TimingBadge({ invoiceId }: { invoiceId: string }) {
  const [timing, setTiming] = useState<PredictiveTiming | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getPredictiveTiming(invoiceId).then((t) => {
      setTiming(t);
      setLoading(false);
    });
  }, [invoiceId]);

  if (loading || !timing) return null;

  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 text-purple-400 px-2.5 py-1 text-xs">
      <Clock className="h-3 w-3" />
      Best time: {timing.suggestedDay} {timing.suggestedTime}
    </div>
  );
}
