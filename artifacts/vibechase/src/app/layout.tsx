import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VibeChase — Chase Payments, Your Vibe",
  description:
    "AI-powered payment reminders that match your tone. Chase invoices via WhatsApp with your unique vibe.",
  keywords: ["invoice", "payment", "reminder", "whatsapp", "AI", "debt collection"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
