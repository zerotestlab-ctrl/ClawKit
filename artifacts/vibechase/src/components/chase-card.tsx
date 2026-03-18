"use client";

import { useState } from "react";
import { markChaseSent, updateChaseStatus, submitFeedback } from "@/actions/chases";
import { updateInvoiceStatus } from "@/actions/invoices";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { triggerConfetti } from "@/components/confetti-trigger";
import type { Chase, Invoice } from "@/lib/types";

const statusColors: Record<string, "success" | "info" | "warning" | "outline" | "destructive"> = {
  draft: "outline",
  sent: "info",
  opened: "warning",
  replied: "warning",
  paid: "success",
};

interface ChaseCardProps {
  chase: Chase & { invoice?: Invoice };
}

export function ChaseCard({ chase }: ChaseCardProps) {
  const [copied, setCopied] = useState(false);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(chase.feedback);
  const [loading, setLoading] = useState(false);

  async function copyAndSend() {
    await navigator.clipboard.writeText(chase.message_text);
    setCopied(true);

    const phone = chase.invoice?.phone?.replace(/\D/g, "");
    const encoded = encodeURIComponent(chase.message_text);
    const whatsappUrl = phone
      ? `https://wa.me/${phone}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;

    // Generate QR code for WhatsApp URL
    try {
      const QRCode = (await import("qrcode")).default;
      const qr = await QRCode.toDataURL(whatsappUrl, {
        width: 256,
        color: { dark: "#22c55e", light: "#0a0a0a" },
      });
      setQrUrl(qr);
    } catch {
      // QR generation failed, still show dialog
    }

    setSendDialogOpen(true);
    setTimeout(() => setCopied(false), 3000);
  }

  async function handleMarkSent() {
    setLoading(true);
    await markChaseSent(chase.id);
    setSendDialogOpen(false);
    setLoading(false);
  }

  async function handleMarkPaid() {
    setLoading(true);
    if (chase.invoice_id) {
      await updateInvoiceStatus(chase.invoice_id, "paid");
    }
    await updateChaseStatus(chase.id, "paid");
    triggerConfetti();
    setLoading(false);
  }

  async function handleFeedback(feedback: "too_soft" | "perfect" | "too_firm") {
    setFeedbackSent(feedback);
    await submitFeedback(chase.id, feedback);
  }

  // --- WHATSAPP API PLACEHOLDER ---
  // To swap clipboard+QR for real WhatsApp sending via Twilio or Wati:
  //
  // async function sendViaWhatsAppAPI() {
  //   const response = await fetch('/api/send-whatsapp', {
  //     method: 'POST',
  //     body: JSON.stringify({
  //       phone: chase.invoice?.phone,
  //       message: chase.message_text,
  //       chaseId: chase.id,
  //     }),
  //   });
  //   if (response.ok) await markChaseSent(chase.id);
  // }
  //
  // Replace the copyAndSend() call with sendViaWhatsAppAPI() when ready.
  // ---

  return (
    <>
      <Card className="hover:border-border/80 transition-colors">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Badge variant={statusColors[chase.status]}>
                {chase.status}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Step {chase.step}
              </span>
              {chase.invoice && (
                <span className="text-xs font-medium">
                  • {chase.invoice.client_name}
                </span>
              )}
            </div>
            {chase.sent_at && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(chase.sent_at).toLocaleDateString()}
              </span>
            )}
          </div>

          <div className="bg-muted/50 rounded-lg p-3 mb-3 text-sm leading-relaxed whitespace-pre-wrap">
            {chase.message_text}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {chase.status === "draft" && (
              <Button variant="glow" size="sm" onClick={copyAndSend} className="h-8">
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied!" : "Copy & Send"}
              </Button>
            )}

            {chase.status === "sent" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkPaid}
                disabled={loading}
                className="h-8 text-green-400 hover:text-green-300"
              >
                <DollarSign className="h-3 w-3" />
                Mark Paid
              </Button>
            )}

            {/* Feedback */}
            {(chase.status === "sent" || chase.status === "draft") && (
              <div className="flex items-center gap-1 ml-auto">
                <span className="text-xs text-muted-foreground mr-1">Tone:</span>
                <button
                  onClick={() => handleFeedback("too_soft")}
                  className={`p-1.5 rounded-md transition-colors ${
                    feedbackSent === "too_soft"
                      ? "bg-blue-500/20 text-blue-400"
                      : "hover:bg-muted text-muted-foreground"
                  }`}
                  title="Too soft"
                >
                  <ThumbsDown className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleFeedback("perfect")}
                  className={`p-1.5 rounded-md transition-colors ${
                    feedbackSent === "perfect"
                      ? "bg-green-500/20 text-green-400"
                      : "hover:bg-muted text-muted-foreground"
                  }`}
                  title="Perfect"
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleFeedback("too_firm")}
                  className={`p-1.5 rounded-md transition-colors ${
                    feedbackSent === "too_firm"
                      ? "bg-amber-500/20 text-amber-400"
                      : "hover:bg-muted text-muted-foreground"
                  }`}
                  title="Too firm"
                >
                  <Minus className="h-3.5 w-3.5 rotate-90" />
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Send Dialog with QR */}
      <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
        <DialogContent onClose={() => setSendDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Send Chase Message</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-green-400">
              <Check className="h-4 w-4" />
              Message copied to clipboard!
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* WhatsApp */}
              <div className="rounded-lg border border-border p-4 text-center">
                <MessageSquare className="h-6 w-6 mx-auto mb-2 text-green-400" />
                <h4 className="font-medium text-sm mb-2">WhatsApp</h4>
                {qrUrl ? (
                  <img src={qrUrl} alt="WhatsApp QR" className="w-40 h-40 mx-auto rounded-lg mb-2" />
                ) : (
                  <div className="w-40 h-40 mx-auto rounded-lg bg-muted flex items-center justify-center mb-2">
                    <QrCode className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Scan QR or paste in WhatsApp
                </p>
                <a
                  href={
                    chase.invoice?.phone
                      ? `https://wa.me/${chase.invoice.phone.replace(/\D/g, "")}?text=${encodeURIComponent(chase.message_text)}`
                      : `https://wa.me/?text=${encodeURIComponent(chase.message_text)}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2"
                >
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    Open WhatsApp
                  </Button>
                </a>
              </div>

              {/* Email fallback */}
              <div className="rounded-lg border border-border p-4 text-center">
                <Mail className="h-6 w-6 mx-auto mb-2 text-blue-400" />
                <h4 className="font-medium text-sm mb-2">Email</h4>
                <p className="text-xs text-muted-foreground mb-4">
                  Send as email instead
                </p>
                {chase.invoice?.email ? (
                  <a
                    href={`mailto:${chase.invoice.email}?subject=Payment Reminder&body=${encodeURIComponent(chase.message_text)}`}
                  >
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      Open Email
                    </Button>
                  </a>
                ) : (
                  <p className="text-xs text-muted-foreground">No email on file</p>
                )}
              </div>
            </div>

            <Button onClick={handleMarkSent} disabled={loading} className="w-full" variant="glow">
              {loading ? "Marking..." : "I've Sent It — Mark as Sent"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
