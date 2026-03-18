import { getStripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  let event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("Stripe webhook signature failed:", err);
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  const db = admin();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      await db
        .from("user_settings")
        .update({
          subscription_status: "active",
          stripe_subscription_id: session.subscription as string,
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_customer_id", session.customer as string);
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object;
      await db
        .from("user_settings")
        .update({
          subscription_status: sub.status === "active" ? "active" : "cancelled",
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_customer_id", sub.customer as string);
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object;
      await db
        .from("user_settings")
        .update({
          subscription_status: "free",
          stripe_subscription_id: null,
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_customer_id", sub.customer as string);
      break;
    }

    case "invoice.payment_failed": {
      console.warn(
        `Payment failed for customer: ${event.data.object.customer}`,
      );
      break;
    }
  }

  return NextResponse.json({ received: true });
}
