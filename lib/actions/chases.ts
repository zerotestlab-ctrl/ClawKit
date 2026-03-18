"use server";

import { createClient } from "@/lib/supabase/server";
import { generateChaseSequence } from "@/lib/openai";
import { revalidatePath } from "next/cache";
import { daysOverdue, FREE_CHASE_LIMIT } from "@/lib/utils";
import type { Chase, Invoice, UserSettings } from "@/lib/types";

export async function getChases(): Promise<(Chase & { invoice?: Invoice })[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("chases")
    .select("*, invoice:invoices(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (data as (Chase & { invoice?: Invoice })[]) || [];
}

export async function generateChase(invoiceId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // check limits
  const { data: settings } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const s = settings as UserSettings | null;
  if (
    s?.subscription_status === "free" &&
    (s?.monthly_chases_used ?? 0) >= FREE_CHASE_LIMIT
  ) {
    return {
      error: "Free limit reached! Upgrade to Pro for unlimited chases.",
    };
  }

  // get invoice
  const { data: inv } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", invoiceId)
    .eq("user_id", user.id)
    .single();
  if (!inv) return { error: "Invoice not found" };
  const invoice = inv as Invoice;

  // gather previous feedback
  const { data: fb } = await supabase
    .from("chases")
    .select("step, feedback")
    .eq("user_id", user.id)
    .not("feedback", "is", null)
    .order("created_at", { ascending: false })
    .limit(10);

  const paymentLink =
    process.env.NEXT_PUBLIC_PAYMENT_LINK || `https://pay.vibechase.com/${invoiceId}`;

  try {
    const seq = await generateChaseSequence({
      clientName: invoice.client_name,
      amount: invoice.amount,
      dueDate: invoice.due_date,
      daysOverdue: daysOverdue(invoice.due_date),
      vibeTone: s?.vibe_tone || "Warm but firm, professional",
      paymentLink,
      previousFeedback: fb?.map((c) => ({
        step: c.step as number,
        feedback: c.feedback as string,
      })),
      clientNotes: invoice.notes || undefined,
    });

    const rows = [
      { step: 1, message_text: seq.step1 },
      { step: 2, message_text: seq.step2 },
      { step: 3, message_text: seq.step3 },
    ].map((c) => ({
      invoice_id: invoiceId,
      user_id: user.id,
      step: c.step,
      message_text: c.message_text,
      channel: "whatsapp" as const,
      status: "draft" as const,
      payment_link: paymentLink,
    }));

    const { data: created, error } = await supabase
      .from("chases")
      .insert(rows)
      .select();
    if (error) return { error: error.message };

    await supabase
      .from("user_settings")
      .update({
        monthly_chases_used: (s?.monthly_chases_used ?? 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    revalidatePath("/chases");
    revalidatePath("/dashboard");
    return { success: true, chases: created as Chase[] };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return { error: `AI generation failed: ${msg}` };
  }
}

export async function markChaseSent(chaseId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("chases")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("id", chaseId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/chases");
  return { success: true };
}

export async function updateChaseStatus(
  chaseId: string,
  status: Chase["status"],
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("chases")
    .update({ status })
    .eq("id", chaseId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/chases");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function submitFeedback(
  chaseId: string,
  feedback: "too_soft" | "perfect" | "too_firm",
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("chases")
    .update({ feedback })
    .eq("id", chaseId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/chases");
  return { success: true };
}

export async function getPredictiveTiming(invoiceId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: paid } = await supabase
    .from("chases")
    .select("sent_at")
    .eq("user_id", user.id)
    .eq("status", "paid")
    .not("sent_at", "is", null)
    .order("sent_at", { ascending: false })
    .limit(20);

  if (!paid?.length) {
    return {
      suggestedDay: "Tuesday",
      suggestedTime: "10:00 AM",
      reason: "Tuesday mornings have the highest open rates for payment reminders.",
    };
  }

  const counts: Record<string, number> = {};
  paid.forEach((c) => {
    if (c.sent_at) {
      const day = new Date(c.sent_at).toLocaleDateString("en-US", {
        weekday: "long",
      });
      counts[day] = (counts[day] || 0) + 1;
    }
  });
  const best =
    Object.entries(counts).sort(([, a], [, b]) => b - a)[0]?.[0] || "Tuesday";

  return {
    suggestedDay: best,
    suggestedTime: "10:00 AM",
    reason: `Clients respond best on ${best}s based on your data.`,
  };
}
