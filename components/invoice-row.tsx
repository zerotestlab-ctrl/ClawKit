"use client";

import { useState } from "react";
import { updateInvoiceStatus, deleteInvoice } from "@/lib/actions/invoices";
import { generateChase } from "@/lib/actions/chases";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MessageSquare, Trash2, Loader2 } from "lucide-react";
import { fireConfetti } from "@/components/confetti";
import { formatCurrency, formatDate, daysOverdue } from "@/lib/utils";
import type { Invoice } from "@/lib/types";

const variant: Record<
  string,
  "success" | "warning" | "destructive" | "info" | "outline"
> = {
  paid: "success",
  sent: "info",
  partial: "warning",
  overdue: "destructive",
  unpaid: "outline",
};

export function InvoiceRow({ invoice }: { invoice: Invoice }) {
  const [busy, setBusy] = useState(false);
  const [chasing, setChasing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");

  async function onStatus(e: React.ChangeEvent<HTMLSelectElement>) {
    const st = e.target.value as Invoice["status"];
    setBusy(true);
    await updateInvoiceStatus(invoice.id, st);
    if (st === "paid") fireConfetti();
    setBusy(false);
  }

  async function onChase() {
    setChasing(true);
    setError("");
    const res = await generateChase(invoice.id);
    if (res.error) setError(res.error);
    setChasing(false);
  }

  async function onDelete() {
    setBusy(true);
    await deleteInvoice(invoice.id);
    setConfirmDelete(false);
    setBusy(false);
  }

  const overdue = daysOverdue(invoice.due_date);

  return (
    <>
      <div className="rounded-xl border border-border bg-card p-4 sm:p-5 hover:border-primary/20 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* left */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2.5">
              <h3 className="font-semibold truncate">{invoice.client_name}</h3>
              <Badge variant={variant[invoice.status]}>{invoice.status}</Badge>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {formatCurrency(Number(invoice.amount))}
              </span>
              <span>Due {formatDate(invoice.due_date)}</span>
              {invoice.status !== "paid" && overdue > 0 && (
                <span className="text-destructive">{overdue}d overdue</span>
              )}
              {invoice.email && <span className="truncate">{invoice.email}</span>}
            </div>
            {invoice.notes && (
              <p className="text-xs text-muted-foreground truncate max-w-md">
                {invoice.notes}
              </p>
            )}
          </div>

          {/* actions */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <Select
              value={invoice.status}
              onChange={onStatus}
              disabled={busy}
              className="h-8 text-xs w-[7rem]"
            >
              <option value="unpaid">Unpaid</option>
              <option value="sent">Sent</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid ✓</option>
              <option value="overdue">Overdue</option>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={onChase}
              disabled={chasing || invoice.status === "paid"}
              className="h-8 text-xs"
            >
              {chasing ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <MessageSquare className="h-3 w-3" />
              )}
              Chase
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmDelete(true)}
              className="h-8 text-xs text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {error && (
          <p className="text-xs text-destructive mt-2">{error}</p>
        )}
      </div>

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent onClose={() => setConfirmDelete(false)} className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete invoice?</DialogTitle>
            <DialogDescription>
              This removes the invoice for {invoice.client_name} and all its
              chases. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-4">
            <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onDelete} disabled={busy}>
              {busy ? "Deleting…" : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
