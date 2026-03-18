"use client";

import { useState } from "react";
import {
  markChaseSent,
  updateChaseStatus,
  submitFeedback,
  getPredictiveTiming,
} from "@/lib/actions/chases";
import { updateInvoiceStatus } from "@/lib/actions/invoices";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Copy,
  Check,
  QrCode,
  Mail,
  MessageSquare,
  ThumbsDown,
  ThumbsUp,
  Minus,
  Clock,
  DollarSign,
} from "lucide-react";
import { fireConfetti } from "@/components/confetti";
import type { Chase, Invoice, PredictiveTiming } from "@/lib/types";

const statusColor: Record<
  string,
  "success" | "info" | "warning" | "outline" | "destructive"
> = {
  draft: "outline",
  sent: "info",
  opened: "warning",
  replied: "warning",
  paid: "success",
};

export function ChaseCard({
  chase,
}: {
  chase: Chase & { invoice?: Invoice };
}) {
  const [copied, setCopied] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [fb, setFb] = useState(chase.feedback);
  const [busy, setBusy] = useState(false);
  const [timing, setTiming] = useState<PredictiveTiming | null>(null);

  async function copyAndSend() {
    await navigator.clipboard.writeText(chase.message_text);
    setCopied(true);

    const phone = chase.invoice?.phone?.replace(/\D/g, "");
    const encoded = encodeURIComponent(chase.message_text);
    const waUrl = phone
      ? `https://wa.me/${phone}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;

    try {
      const QR = (await import("qrcode")).default;
      setQrUrl(
        await QR.toDataURL(waUrl, {
          width: 240,
          color: { dark: "#22c55e", light: "#0a0a0a" },
        }),
      );
    } catch {
      /* QR optional */
    }

    if (chase.step === 1) {
      const t = await getPredictiveTiming(chase.invoice_id);
      setTiming(t);
    }

    setSendOpen(true);
    setTimeout(() => setCopied(false), 3000);
  }

  // --- WATI / TWILIO PLACEHOLDER ---
  // Replace copyAndSend() with a real API call when ready:
  //
  // async function sendViaWhatsApp() {
  //   await fetch('/api/whatsapp', {
  //     method: 'POST',
  //     body: JSON.stringify({ phone: chase.invoice?.phone, message: chase.message_text, chaseId: chase.id }),
  //   });
  //   await markChaseSent(chase.id);
  // }
  // ---

  async function onMarkSent() {
    setBusy(true);
    await markChaseSent(chase.id);
    setSendOpen(false);
    setBusy(false);
  }

  async function onMarkPaid() {
    setBusy(true);
    if (chase.invoice_id)
      await updateInvoiceStatus(chase.invoice_id, "paid");
    await updateChaseStatus(chase.id, "paid");
    fireConfetti();
    setBusy(false);
  }

  async function onFeedback(val: "too_soft" | "perfect" | "too_firm") {
    setFb(val);
    await submitFeedback(chase.id, val);
  }

  const phone = chase.invoice?.phone?.replace(/\D/g, "");
  const waHref = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(chase.message_text)}`
    : `https://wa.me/?text=${encodeURIComponent(chase.message_text)}`;

  return (
    <>
      <Card className="hover:border-primary/20 transition-colors">
        <CardContent className="p-4 sm:p-5">
          {/* header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={statusColor[chase.status]}>{chase.status}</Badge>
              <span className="text-xs text-muted-foreground">
                Step {chase.step}
              </span>
              {chase.invoice && (
                <span className="text-xs font-medium">
                  · {chase.invoice.client_name}
                </span>
              )}
            </div>
            {chase.sent_at && (
              <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                <Clock className="h-3 w-3" />
                {new Date(chase.sent_at).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* body */}
          <div className="bg-muted/50 rounded-lg p-3.5 mb-3 text-sm leading-relaxed whitespace-pre-wrap">
            {chase.message_text}
          </div>

          {/* actions row */}
          <div className="flex flex-wrap items-center gap-2">
            {chase.status === "draft" && (
              <Button
                variant="glow"
                size="sm"
                onClick={copyAndSend}
                className="h-8"
              >
                {copied ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                {copied ? "Copied!" : "Copy & Send"}
              </Button>
            )}

            {chase.status === "sent" && (
              <Button
                variant="outline"
                size="sm"
                onClick={onMarkPaid}
                disabled={busy}
                className="h-8 text-emerald-400 hover:text-emerald-300"
              >
                <DollarSign className="h-3 w-3" /> Mark Paid
              </Button>
            )}

            {/* feedback */}
            {(chase.status === "sent" || chase.status === "draft") && (
              <div className="flex items-center gap-1 ml-auto">
                <span className="text-xs text-muted-foreground mr-1">
                  Tone:
                </span>
                {(
                  [
                    ["too_soft", ThumbsDown, "blue"],
                    ["perfect", ThumbsUp, "green"],
                    ["too_firm", Minus, "amber"],
                  ] as const
                ).map(([val, Icon, color]) => (
                  <button
                    key={val}
                    onClick={() => onFeedback(val)}
                    title={val.replace("_", " ")}
                    className={`p-1.5 rounded-md transition-colors ${
                      fb === val
                        ? `bg-${color}-500/20 text-${color}-400`
                        : "hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* send dialog */}
      <Dialog open={sendOpen} onOpenChange={setSendOpen}>
        <DialogContent onClose={() => setSendOpen(false)}>
          <DialogHeader>
            <DialogTitle>Send Chase Message</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="flex items-center gap-2 text-sm text-emerald-400">
              <Check className="h-4 w-4" /> Message copied to clipboard
            </p>

            {timing && (
              <div className="rounded-lg bg-purple-500/10 border border-purple-500/20 p-3 text-sm">
                <p className="font-medium text-purple-400 flex items-center gap-1.5 mb-1">
                  <Clock className="h-3.5 w-3.5" /> Suggested timing
                </p>
                <p className="text-muted-foreground">
                  {timing.suggestedDay} at {timing.suggestedTime} —{" "}
                  {timing.reason}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* WhatsApp */}
              <div className="rounded-lg border border-border p-4 text-center space-y-2">
                <MessageSquare className="h-6 w-6 mx-auto text-emerald-400" />
                <h4 className="font-medium text-sm">WhatsApp</h4>
                {qrUrl ? (
                  <img
                    src={qrUrl}
                    alt="QR"
                    className="w-36 h-36 mx-auto rounded-lg"
                  />
                ) : (
                  <div className="w-36 h-36 mx-auto rounded-lg bg-muted flex items-center justify-center">
                    <QrCode className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <a href={waHref} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="text-xs h-8">
                    Open WhatsApp
                  </Button>
                </a>
              </div>

              {/* Email */}
              <div className="rounded-lg border border-border p-4 text-center space-y-2">
                <Mail className="h-6 w-6 mx-auto text-blue-400" />
                <h4 className="font-medium text-sm">Email Fallback</h4>
                <p className="text-xs text-muted-foreground">
                  {chase.invoice?.email || "No email on file"}
                </p>
                {chase.invoice?.email && (
                  <a
                    href={`mailto:${chase.invoice.email}?subject=Payment%20Reminder&body=${encodeURIComponent(chase.message_text)}`}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8"
                    >
                      Send Email
                    </Button>
                  </a>
                )}
              </div>
            </div>

            <Button
              onClick={onMarkSent}
              disabled={busy}
              variant="glow"
              className="w-full"
            >
              {busy ? "Marking…" : "I've Sent It — Mark as Sent"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
