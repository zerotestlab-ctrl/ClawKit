"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Invoice } from "@/lib/types";

export async function getInvoices(): Promise<Invoice[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("invoices")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (data as Invoice[]) || [];
}

export async function createInvoice(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("invoices").insert({
    user_id: user.id,
    client_name: formData.get("client_name") as string,
    amount: parseFloat(formData.get("amount") as string),
    due_date: formData.get("due_date") as string,
    phone: (formData.get("phone") as string) || null,
    email: (formData.get("email") as string) || null,
    notes: (formData.get("notes") as string) || null,
    status: "unpaid",
  });

  if (error) return { error: error.message };
  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function bulkCreateInvoices(
  rows: {
    client_name: string;
    amount: number;
    due_date: string;
    phone?: string;
    email?: string;
    notes?: string;
  }[],
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const mapped = rows.map((r) => ({
    user_id: user.id,
    client_name: r.client_name,
    amount: r.amount,
    due_date: r.due_date,
    phone: r.phone || null,
    email: r.email || null,
    notes: r.notes || null,
    status: "unpaid" as const,
  }));

  const { error } = await supabase.from("invoices").insert(mapped);
  if (error) return { error: error.message };

  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  return { success: true, count: mapped.length };
}

export async function updateInvoiceStatus(
  invoiceId: string,
  status: Invoice["status"],
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("invoices")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", invoiceId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  revalidatePath("/chases");
  return { success: true };
}

export async function deleteInvoice(invoiceId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", invoiceId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  return { success: true };
}
