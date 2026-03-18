"use server";

import { createClient } from "@/lib/supabase/server";
import { generateChaseSequence } from "@/lib/openai";
import { revalidatePath } from "next/cache";
import { daysOverdue, FREE_CHASE_LIMIT } from "@/lib/utils";
import type { Chase, Invoice, UserSettings } from "@/lib/types";

export async function generateChase(invoiceId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: settings } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const userSettings = settings as UserSettings | null;
  if (
    userSettings?.subscription_status === "free" &&
    (userSettings?.monthly_chases_used ?? 0) >= FREE_CHASE_LIMIT
  ) {
    return { error: "Free chase limit reached. Upgrade to Pro for unlimited chases!" };
  }

  const { data: invoice } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", invoiceId)
    .eq("user_id", user.id)
    .single();

  if (!invoice) return { error: "Invoice not found" };
  const inv = invoice as Invoice;

  const { data: previousChases } = await supabase
    .from("chases")
    .select("step, feedback")
    .eq("user_id", user.id)
    .not("feedback", "is", null)
    .order("created_at", { ascending: false })
    .limit(10);

  const paymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ||
    `https://pay.vibechase.com/${invoiceId}`;

  try {
    const sequence = await generateChaseSequence({
      clientName: inv.client_name,
      amount: inv.amount,
      dueDate: inv.due_date,
      daysOverdue: daysOverdue(inv.due_date),
      vibeTone: userSettings?.vibe_tone || "Warm but firm, professional",
      paymentLink,
      previousFeedback: previousChases?.map((c) => ({
        step: c.step as number,
        feedback: c.feedback as string,
      })),
      clientNotes: inv.notes || undefined,
    });

    const chaseRows = [
      { step: 1, message_text: sequence.step1 },
      { step: 2, message_text: sequence.step2 },
      { step: 3, message_text: sequence.step3 },
    ].map((c) => ({
      invoice_id: invoiceId,
      user_id: user.id,
      step: c.step,
      message_text: c.message_text,
      channel: "whatsapp" as const,
      status: "draft" as const,
      payment_link: paymentLink,
    }));

    const { data: newChases, error } = await supabase
      .from("chases")
      .insert(chaseRows)
      .select();

    if (error) return { error: error.message };

    await supabase
      .from("user_settings")
      .update({
        monthly_chases_used: (userSettings?.monthly_chases_used ?? 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    revalidatePath("/chases");
    revalidatePath("/dashboard");
    return { success: true, chases: newChases as Chase[] };
  } catch (err) {
    return { error: `AI generation failed: ${err instanceof Error ? err.message : "Unknown error"}` };
  }
}

export async function getChases(): Promise<(Chase & { invoice?: Invoice })[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("chases")
    .select("*, invoice:invoices(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (data as (Chase & { invoice?: Invoice })[]) || [];
}

export async function markChaseSent(chaseId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
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

export async function updateChaseStatus(chaseId: string, status: Chase["status"]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
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

export async function submitFeedback(chaseId: string, feedback: "too_soft" | "perfect" | "too_firm") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: invoice } = await supabase
    .from("invoices")
    .select("client_name")
    .eq("id", invoiceId)
    .single();

  if (!invoice) return null;

  const { data: paidChases } = await supabase
    .from("chases")
    .select("sent_at")
    .eq("user_id", user.id)
    .eq("status", "paid")
    .not("sent_at", "is", null)
    .order("sent_at", { ascending: false })
    .limit(20);

  if (!paidChases?.length) {
    return {
      suggestedDay: "Tuesday",
      suggestedTime: "10:00 AM",
      reason: "Tuesday mornings have the highest open rates for payment reminders.",
    };
  }

  const dayCount: Record<string, number> = {};
  paidChases.forEach((chase) => {
    if (chase.sent_at) {
      const day = new Date(chase.sent_at).toLocaleDateString("en-US", { weekday: "long" });
      dayCount[day] = (dayCount[day] || 0) + 1;
    }
  });

  const bestDay = Object.entries(dayCount).sort(([, a], [, b]) => b - a)[0]?.[0] || "Tuesday";

  return {
    suggestedDay: bestDay,
    suggestedTime: "10:00 AM",
    reason: `Clients have historically responded best on ${bestDay}s based on your payment data.`,
  };
}
