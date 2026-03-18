"use server";

import { createClient } from "@/lib/supabase/server";
import type { DashboardStats, Invoice, Chase } from "@/lib/types";

export async function getDashboardStats(): Promise<DashboardStats | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const [invoicesRes, paidThisWeekRes, chasesRes] = await Promise.all([
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
      .gte("updated_at", oneWeekAgo.toISOString()),
    supabase
      .from("chases")
      .select("*, invoice:invoices(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const allInvoices = (invoicesRes.data as Invoice[]) || [];
  const paidThisWeek = (paidThisWeekRes.data as { amount: number }[]) || [];
  const recentChases = (chasesRes.data as (Chase & { invoice?: Invoice })[]) || [];

  const openInvoices = allInvoices.filter((i) => i.status !== "paid");
  const recoveredThisWeek = paidThisWeek.reduce((sum, i) => sum + Number(i.amount), 0);
  const totalOutstanding = openInvoices.reduce((sum, i) => sum + Number(i.amount), 0);

  const paidInvoices = allInvoices.filter((i) => i.status === "paid");
  let dsoImproved = 0;
  if (paidInvoices.length > 0) {
    const avgDaysToPayment = paidInvoices.reduce((sum, inv) => {
      const created = new Date(inv.created_at).getTime();
      const updated = new Date(inv.updated_at).getTime();
      return sum + (updated - created) / (1000 * 60 * 60 * 24);
    }, 0) / paidInvoices.length;
    dsoImproved = Math.max(0, Math.round(30 - avgDaysToPayment));
  }

  return {
    recoveredThisWeek,
    dsoImproved,
    openInvoices: openInvoices.length,
    totalOutstanding,
    recentChases,
    openInvoicesList: openInvoices.slice(0, 5),
  };
}
