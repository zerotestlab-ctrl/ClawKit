"use server";

import { createClient } from "@/lib/supabase/server";
import type { DashboardStats, Invoice, Chase } from "@/lib/types";

export async function getDashboardStats(): Promise<DashboardStats | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString();

  const [invRes, paidRes, chaseRes] = await Promise.all([
    supabase
      .from("invoices")
      .select("*")
      .eq("user_id", user.id)
      .order("due_date", { ascending: true }),
    supabase
      .from("invoices")
      .select("amount")
      .eq("user_id", user.id)
      .eq("status", "paid")
      .gte("updated_at", weekAgo),
    supabase
      .from("chases")
      .select("*, invoice:invoices(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const allInv = (invRes.data as Invoice[]) || [];
  const paidWeek = (paidRes.data as { amount: number }[]) || [];
  const chases = (chaseRes.data as (Chase & { invoice?: Invoice })[]) || [];

  const open = allInv.filter((i) => i.status !== "paid");
  const recoveredThisWeek = paidWeek.reduce(
    (s, i) => s + Number(i.amount),
    0,
  );
  const totalOutstanding = open.reduce((s, i) => s + Number(i.amount), 0);

  const paid = allInv.filter((i) => i.status === "paid");
  let dsoImproved = 0;
  if (paid.length) {
    const avg =
      paid.reduce((s, i) => {
        const ms =
          new Date(i.updated_at).getTime() - new Date(i.created_at).getTime();
        return s + ms / 86_400_000;
      }, 0) / paid.length;
    dsoImproved = Math.max(0, Math.round(30 - avg));
  }

  return {
    recoveredThisWeek,
    dsoImproved,
    openInvoices: open.length,
    totalOutstanding,
    recentChases: chases,
    openInvoicesList: open.slice(0, 5),
  };
}
