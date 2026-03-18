export interface Invoice {
  id: string;
  user_id: string;
  client_name: string;
  amount: number;
  due_date: string;
  phone: string | null;
  email: string | null;
  status: "unpaid" | "sent" | "partial" | "paid" | "overdue";
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Chase {
  id: string;
  invoice_id: string;
  user_id: string;
  step: number;
  message_text: string;
  channel: "whatsapp" | "email" | "sms";
  sent_at: string | null;
  status: "draft" | "sent" | "opened" | "replied" | "paid";
  feedback: "too_soft" | "perfect" | "too_firm" | null;
  payment_link: string | null;
  created_at: string;
}

export interface UserSettings {
  user_id: string;
  vibe_tone: string;
  monthly_chases_used: number;
  subscription_status: "free" | "active" | "cancelled";
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  preferred_send_time: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChaseSequence {
  step1: string;
  step2: string;
  step3: string;
  paymentLink: string;
}

export interface DashboardStats {
  recoveredThisWeek: number;
  dsoImproved: number;
  openInvoices: number;
  totalOutstanding: number;
  recentChases: (Chase & { invoice?: Invoice })[];
  openInvoicesList: Invoice[];
}

export interface PredictiveTiming {
  suggestedDay: string;
  suggestedTime: string;
  reason: string;
}
