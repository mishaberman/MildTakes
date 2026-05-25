create extension if not exists pgcrypto;

create or replace function public.is_owner()
returns boolean
language sql
stable
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = 'mishaberman@gmail.com';
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz
);

alter table public.profiles enable row level security;

drop policy if exists "profiles readable" on public.profiles;
create policy "profiles readable"
on public.profiles for select
using (true);

drop policy if exists "users insert own profile" on public.profiles;
create policy "users insert own profile"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile"
on public.profiles for update
using (auth.uid() = id or public.is_owner())
with check (auth.uid() = id or public.is_owner());

create table if not exists public.local_lists (
  id text primary key,
  city text not null,
  category text not null,
  title text not null,
  creator text not null,
  platform text not null,
  source_url text not null,
  summary text not null,
  vibe text,
  color text,
  saves integer not null default 0,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists local_lists_city_category_idx
on public.local_lists(city, category, is_published);

alter table public.local_lists enable row level security;

drop policy if exists "published local lists readable" on public.local_lists;
create policy "published local lists readable"
on public.local_lists for select
using (is_published = true or public.is_owner());

drop policy if exists "owner writes local lists" on public.local_lists;
create policy "owner writes local lists"
on public.local_lists for all
using (public.is_owner())
with check (public.is_owner());

create table if not exists public.local_list_picks (
  id uuid primary key default gen_random_uuid(),
  list_id text not null references public.local_lists(id) on delete cascade,
  rank integer not null check (rank between 1 and 5),
  name text not null,
  neighborhood text,
  note text,
  created_at timestamptz not null default now(),
  unique (list_id, rank)
);

create index if not exists local_list_picks_list_idx
on public.local_list_picks(list_id, rank);

alter table public.local_list_picks enable row level security;

drop policy if exists "published picks readable" on public.local_list_picks;
create policy "published picks readable"
on public.local_list_picks for select
using (
  exists (
    select 1
    from public.local_lists
    where local_lists.id = local_list_picks.list_id
      and (local_lists.is_published = true or public.is_owner())
  )
);

drop policy if exists "owner writes picks" on public.local_list_picks;
create policy "owner writes picks"
on public.local_list_picks for all
using (public.is_owner())
with check (public.is_owner());

create table if not exists public.source_submissions (
  id uuid primary key default gen_random_uuid(),
  creator text not null,
  source_url text not null,
  city text not null,
  category text not null,
  notes text,
  status text not null default 'new' check (status in ('new', 'reviewing', 'approved', 'rejected')),
  submitted_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create index if not exists source_submissions_status_idx
on public.source_submissions(status, created_at desc);

alter table public.source_submissions enable row level security;

drop policy if exists "anyone submits sources" on public.source_submissions;
create policy "anyone submits sources"
on public.source_submissions for insert
with check (true);

drop policy if exists "owner reads submissions" on public.source_submissions;
create policy "owner reads submissions"
on public.source_submissions for select
using (public.is_owner());

drop policy if exists "owner updates submissions" on public.source_submissions;
create policy "owner updates submissions"
on public.source_submissions for update
using (public.is_owner())
with check (public.is_owner());

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  city text,
  category text,
  list_id text references public.local_lists(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists events_created_idx on public.events(created_at desc);
create index if not exists events_name_idx on public.events(event_name, city, category);

alter table public.events enable row level security;

drop policy if exists "anyone can add events" on public.events;
create policy "anyone can add events"
on public.events for insert
with check (true);

drop policy if exists "owner reads events" on public.events;
create policy "owner reads events"
on public.events for select
using (public.is_owner());
