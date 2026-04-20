-- daily-rings-pwa v1: habits + per-day completion, RLS by auth.uid()
-- Run once in Supabase SQL Editor (or via supabase db push).

-- Habits per user (extend with more rows from the app)
create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  sort_order int not null default 0,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- One row per user per calendar date per habit (client sends date in user's TZ as YYYY-MM-DD)
create table if not exists public.day_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  habit_id uuid not null references public.habits (id) on delete cascade,
  entry_date date not null,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (user_id, habit_id, entry_date)
);

create index if not exists day_entries_user_date_idx
  on public.day_entries (user_id, entry_date desc);

create index if not exists habits_user_sort_idx
  on public.habits (user_id, sort_order);

alter table public.habits enable row level security;
alter table public.day_entries enable row level security;

create policy "habits_select_own"
  on public.habits for select
  using (auth.uid() = user_id);

create policy "habits_insert_own"
  on public.habits for insert
  with check (auth.uid() = user_id);

create policy "habits_update_own"
  on public.habits for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "habits_delete_own"
  on public.habits for delete
  using (auth.uid() = user_id);

create policy "day_entries_select_own"
  on public.day_entries for select
  using (auth.uid() = user_id);

create policy "day_entries_insert_own"
  on public.day_entries for insert
  with check (auth.uid() = user_id);

create policy "day_entries_update_own"
  on public.day_entries for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "day_entries_delete_own"
  on public.day_entries for delete
  using (auth.uid() = user_id);

-- Optional: seed default habits when a new user signs up (run from app or use a trigger).
-- Example trigger is omitted here to keep migration simple; the app can insert three habits on first login.
