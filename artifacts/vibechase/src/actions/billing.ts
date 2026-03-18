"use server";

import { createClient } from "@/lib/supabase/server";
import { stripe, createCheckoutSession, createCustomer, createBillingPortalSession } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function createSubscription(): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const headersList = await headers();
  const origin = headersList.get("origin") || "http://localhost:3000";

  const { data: settings } = await supabase
    .from("user_settings")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single();

  let customerId = settings?.stripe_customer_id;

  if (!customerId) {
    const customer = await createCustomer(user.email!, user.id);
    customerId = customer.id;

    await supabase
      .from("user_settings")
      .update({ stripe_customer_id: customerId })
      .eq("user_id", user.id);
  }

  const priceId = process.env.STRIPE_PRICE_ID!;

  const session = await createCheckoutSession(
    customerId,
    priceId,
    `${origin}/dashboard?upgraded=true`,
    `${origin}/settings`
  );

  if (session.url) {
    redirect(session.url);
  }

  throw new Error("Could not create checkout session");
}

export async function openBillingPortal(): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const headersList = await headers();
  const origin = headersList.get("origin") || "http://localhost:3000";

  const { data: settings } = await supabase
    .from("user_settings")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single();

  if (!settings?.stripe_customer_id) {
    throw new Error("No billing account found");
  }

  const session = await createBillingPortalSession(
    settings.stripe_customer_id,
    `${origin}/settings`
  );

  redirect(session.url);
}
