import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * WhatsApp API Placeholder
 *
 * Phase 1: This endpoint is a stub. Messages are sent via clipboard + QR.
 *
 * Phase 2: Swap this with your preferred WhatsApp API:
 *
 * Option A — Twilio WhatsApp:
 *   const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
 *   await twilio.messages.create({
 *     from: process.env.TWILIO_WHATSAPP_FROM,  // 'whatsapp:+14155238886'
 *     to: `whatsapp:${phone}`,
 *     body: message,
 *   });
 *
 * Option B — Wati API:
 *   await fetch(`${process.env.WATI_API_URL}/api/v1/sendSessionMessage/${phone}`, {
 *     method: 'POST',
 *     headers: { Authorization: `Bearer ${process.env.WATI_API_TOKEN}` },
 *     body: JSON.stringify({ messageText: message }),
 *   });
 *
 * Option C — Paystack payment + WhatsApp (for Nigerian businesses):
 *   // Create Paystack payment link, embed in WhatsApp message
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { phone, message, chaseId } = await request.json();

  if (!phone || !message) {
    return NextResponse.json(
      { error: "Phone and message are required" },
      { status: 400 }
    );
  }

  // --- PLACEHOLDER ---
  // Replace this block with actual WhatsApp API call (see options above)
  console.log(`[WhatsApp Placeholder] Would send to ${phone}: ${message.slice(0, 50)}...`);

  // Mark chase as sent
  if (chaseId) {
    await supabase
      .from("chases")
      .update({ status: "sent", sent_at: new Date().toISOString() })
      .eq("id", chaseId)
      .eq("user_id", user.id);
  }

  return NextResponse.json({
    success: true,
    message: "Message queued (placeholder — swap with real WhatsApp API)",
  });
}
