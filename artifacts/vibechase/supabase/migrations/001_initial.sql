-- VibeChase Database Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Invoices table
create table if not exists invoices (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_name text not null,
  amount numeric(12, 2) not null,
  due_date date not null,
  phone text,
  email text,
  status text not null default 'unpaid' check (status in ('unpaid', 'sent', 'partial', 'paid', 'overdue')),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Chases table
create table if not exists chases (
  id uuid primary key default uuid_generate_v4(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  step integer not null default 1,
  message_text text not null,
  channel text not null default 'whatsapp' check (channel in ('whatsapp', 'email', 'sms')),
  sent_at timestamptz,
  status text not null default 'draft' check (status in ('draft', 'sent', 'opened', 'replied', 'paid')),
  feedback text check (feedback in ('too_soft', 'perfect', 'too_firm', null)),
  payment_link text,
  created_at timestamptz default now()
);

-- User settings table
create table if not exists user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  vibe_tone text not null default 'Warm but firm, professional, friendly',
  monthly_chases_used integer not null default 0,
  subscription_status text not null default 'free' check (subscription_status in ('free', 'active', 'cancelled')),
  stripe_customer_id text,
  stripe_subscription_id text,
  preferred_send_time text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Row Level Security
alter table invoices enable row level security;
alter table chases enable row level security;
alter table user_settings enable row level security;

-- Policies: users can only see/modify their own data
create policy "Users can view own invoices"
  on invoices for select using (auth.uid() = user_id);
create policy "Users can insert own invoices"
  on invoices for insert with check (auth.uid() = user_id);
create policy "Users can update own invoices"
  on invoices for update using (auth.uid() = user_id);
create policy "Users can delete own invoices"
  on invoices for delete using (auth.uid() = user_id);

create policy "Users can view own chases"
  on chases for select using (auth.uid() = user_id);
create policy "Users can insert own chases"
  on chases for insert with check (auth.uid() = user_id);
create policy "Users can update own chases"
  on chases for update using (auth.uid() = user_id);
create policy "Users can delete own chases"
  on chases for delete using (auth.uid() = user_id);

create policy "Users can view own settings"
  on user_settings for select using (auth.uid() = user_id);
create policy "Users can insert own settings"
  on user_settings for insert with check (auth.uid() = user_id);
create policy "Users can update own settings"
  on user_settings for update using (auth.uid() = user_id);

-- Index for performance
create index if not exists idx_invoices_user_id on invoices(user_id);
create index if not exists idx_invoices_status on invoices(status);
create index if not exists idx_chases_invoice_id on chases(invoice_id);
create index if not exists idx_chases_user_id on chases(user_id);

-- Function to auto-create user settings on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_settings (user_id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to reset monthly chase counts (run via cron)
create or replace function public.reset_monthly_chases()
returns void as $$
begin
  update user_settings set monthly_chases_used = 0;
end;
$$ language plpgsql security definer;
