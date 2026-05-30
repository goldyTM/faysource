-- Supabase SQL schema for user management and payment flow

-- Payment and access plans
create table if not exists public.plans (
  id text primary key,
  name text not null,
  description text,
  price_cents integer not null check (price_cents >= 0),
  interval text not null default 'one_time',
  max_unlocks integer,
  created_at timestamptz not null default now()
);

insert into public.plans (id, name, description, price_cents, interval, max_unlocks)
values
  ('single_supplier', 'Single Supplier Unlock', 'Unlock one supplier contact for a single purchase.', 500, 'one_time', 1),
  ('full_access', 'Full Access', 'Unlimited supplier unlocks for 30 days.', 15000, 'monthly', null)
on conflict (id) do nothing;

create table if not exists public.suppliers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  niche text,
  category text,
  tags text[],
  moq text,
  quality text,
  ships text,
  speed text,
  verified boolean not null default false,
  whatsapp text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger suppliers_updated_at
  before update on public.suppliers
  for each row execute function public.set_updated_at();

-- Use Supabase Auth for user sign-up / login, then extend with a profiles table.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  plan_id text references public.plans(id),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

alter table if exists public.profiles add column if not exists is_admin boolean not null default false;

-- Store completed payment events
create table if not exists public.payments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id text references public.plans(id),
  amount_cents integer not null,
  currency text not null default 'USD',
  payment_provider text not null,
  provider_payment_id text,
  status text not null default 'pending',
  receipt_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger payments_updated_at
  before update on public.payments
  for each row execute function public.set_updated_at();

-- Track individual supplier unlock purchases
create table if not exists public.supplier_unlocks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  supplier_name text not null,
  supplier_id text,
  amount_cents integer not null,
  currency text not null default 'USD',
  status text not null default 'completed',
  purchased_at timestamptz not null default now()
);

-- Optional access control table for subscription state
create table if not exists public.user_access (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id text not null references public.plans(id),
  active boolean not null default true,
  started_at timestamptz not null default now(),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger user_access_updated_at
  before update on public.user_access
  for each row execute function public.set_updated_at();

alter table if exists public.profiles enable row level security;
alter table if exists public.suppliers enable row level security;

create policy if not exists "Authenticated can select profiles" on public.profiles
  for select using (auth.role() in ('authenticated', 'anon'));

create policy if not exists "Authenticated can select suppliers" on public.suppliers
  for select using (auth.role() in ('authenticated', 'anon'));

create policy if not exists "Admins can insert suppliers" on public.suppliers
  for insert with check (exists(select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy if not exists "Admins can update suppliers" on public.suppliers
  for update using (exists(select 1 from public.profiles where id = auth.uid() and is_admin = true))
  with check (exists(select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy if not exists "Admins can delete suppliers" on public.suppliers
  for delete using (exists(select 1 from public.profiles where id = auth.uid() and is_admin = true));
