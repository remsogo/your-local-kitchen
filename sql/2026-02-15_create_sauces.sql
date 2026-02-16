-- Safe migration for sauces management (no drop, no destructive change)
create table if not exists public.sauces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_order int4 not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists sauces_sort_order_idx on public.sauces (sort_order);
create index if not exists sauces_is_active_idx on public.sauces (is_active);

alter table public.sauces enable row level security;

drop policy if exists "Public can read sauces" on public.sauces;
create policy "Public can read sauces"
on public.sauces
for select
using (true);

drop policy if exists "Admins can manage sauces" on public.sauces;
create policy "Admins can manage sauces"
on public.sauces
for all
to authenticated
using (
  exists (
    select 1
    from public.user_roles ur
    where ur.user_id = auth.uid()
      and ur.role = 'admin'::app_role
  )
)
with check (
  exists (
    select 1
    from public.user_roles ur
    where ur.user_id = auth.uid()
      and ur.role = 'admin'::app_role
  )
);
