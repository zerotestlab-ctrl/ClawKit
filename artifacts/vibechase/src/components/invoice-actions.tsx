"use client";

import { useState } from "react";
import { updateInvoiceStatus, deleteInvoice } from "@/actions/invoices";
import { generateChase } from "@/actions/chases";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { MessageSquare, Trash2, ChevronDown, DollarSign, Loader2 } from "lucide-react";
import { triggerConfetti } from "@/components/confetti-trigger";
import type { Invoice } from "@/lib/types";

export function InvoiceActions({ invoice }: { invoice: Invoice }) {
  const [loading, setLoading] = useState(false);
  const [chaseLoading, setChaseLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [error, setError] = useState("");

  async function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const status = e.target.value as Invoice["status"];
    setLoading(true);
    await updateInvoiceStatus(invoice.id, status);
    if (status === "paid") {
      triggerConfetti();
    }
    setLoading(false);
  }

  async function handleChase() {
    setChaseLoading(true);
    setError("");
    const result = await generateChase(invoice.id);
    if (result.error) {
      setError(result.error);
    }
    setChaseLoading(false);
  }

  async function handleDelete() {
    setLoading(true);
    await deleteInvoice(invoice.id);
    setDeleteOpen(false);
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Select
        value={invoice.status}
        onChange={handleStatusChange}
        disabled={loading}
        className="h-8 text-xs w-28"
      >
        <option value="unpaid">Unpaid</option>
        <option value="sent">Sent</option>
        <option value="partial">Partial</option>
        <option value="paid">Paid</option>
        <option value="overdue">Overdue</option>
      </Select>

      <Button
        variant="outline"
        size="sm"
        onClick={handleChase}
        disabled={chaseLoading || invoice.status === "paid"}
        className="h-8 text-xs"
      >
        {chaseLoading ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <MessageSquare className="h-3 w-3" />
        )}
        Chase
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setDeleteOpen(true)}
        className="h-8 text-xs text-destructive hover:text-destructive"
      >
        <Trash2 className="h-3 w-3" />
      </Button>

      {error && (
        <span className="text-xs text-destructive">{error}</span>
      )}

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent onClose={() => setDeleteOpen(false)} className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Invoice</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this invoice for {invoice.client_name}?
              This will also delete all related chases.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-4">
            <Button variant="ghost" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
