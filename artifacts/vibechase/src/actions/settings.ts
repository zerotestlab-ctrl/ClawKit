"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { UserSettings } from "@/lib/types";

export async function getUserSettings(): Promise<UserSettings | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!data) {
    const { data: newSettings } = await supabase
      .from("user_settings")
      .insert({ user_id: user.id })
      .select()
      .single();
    return newSettings as UserSettings | null;
  }

  return data as UserSettings;
}

export async function updateVibeTone(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const vibeTone = formData.get("vibe_tone") as string;
  if (!vibeTone?.trim()) return { error: "Vibe tone cannot be empty" };

  const { error } = await supabase
    .from("user_settings")
    .update({
      vibe_tone: vibeTone.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/settings");
  return { success: true };
}

export async function updatePreferredSendTime(time: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("user_settings")
    .update({
      preferred_send_time: time,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/settings");
  return { success: true };
}
