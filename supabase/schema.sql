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

drop policy if exists "users upsert own profile" on public.profiles;
create policy "users upsert own profile"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile"
on public.profiles for update
using (auth.uid() = id or public.is_owner())
with check (auth.uid() = id or public.is_owner());

create table if not exists public.rounds (
  id text primary key,
  day_number integer not null,
  play_date date not null unique,
  category text not null,
  prompt text not null,
  axis_left text not null,
  axis_right text not null,
  sponsor text,
  cards jsonb not null,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.rounds enable row level security;

drop policy if exists "published rounds readable" on public.rounds;
create policy "published rounds readable"
on public.rounds for select
using (is_published = true or public.is_owner());

drop policy if exists "owner writes rounds" on public.rounds;
create policy "owner writes rounds"
on public.rounds for all
using (public.is_owner())
with check (public.is_owner());

create table if not exists public.plays (
  id uuid primary key default gen_random_uuid(),
  round_id text not null,
  play_date date not null,
  user_id uuid references auth.users(id) on delete set null,
  anon_id text,
  score integer not null check (score between 0 and 100),
  exact integer not null check (exact between 0 and 5),
  order_ids text[] not null,
  target_ids text[] not null,
  diffs integer[] not null,
  source text not null default 'web',
  created_at timestamptz not null default now()
);

create index if not exists plays_play_date_idx on public.plays(play_date);
create index if not exists plays_round_id_idx on public.plays(round_id);
create index if not exists plays_score_idx on public.plays(score desc, exact desc, created_at asc);

alter table public.plays enable row level security;

drop policy if exists "anyone can add plays" on public.plays;
create policy "anyone can add plays"
on public.plays for insert
with check (true);

drop policy if exists "owner reads plays" on public.plays;
create policy "owner reads plays"
on public.plays for select
using (public.is_owner());

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  round_id text,
  play_date date,
  user_id uuid references auth.users(id) on delete set null,
  anon_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists events_created_idx on public.events(created_at desc);
create index if not exists events_name_idx on public.events(event_name, play_date);

alter table public.events enable row level security;

drop policy if exists "anyone can add events" on public.events;
create policy "anyone can add events"
on public.events for insert
with check (true);

drop policy if exists "owner reads events" on public.events;
create policy "owner reads events"
on public.events for select
using (public.is_owner());

create or replace function public.get_daily_leaderboard(p_play_date date)
returns table (
  rank bigint,
  display_name text,
  score integer,
  exact integer,
  played_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  with best_plays as (
    select distinct on (coalesce(plays.user_id::text, plays.anon_id, plays.id::text))
      plays.score,
      plays.exact,
      plays.created_at,
      coalesce(nullif(profiles.display_name, ''), split_part(profiles.email, '@', 1), 'Guest') as display_name
    from public.plays
    left join public.profiles on profiles.id = plays.user_id
    where plays.play_date = p_play_date
    order by coalesce(plays.user_id::text, plays.anon_id, plays.id::text), plays.score desc, plays.exact desc, plays.created_at asc
  ),
  ordered as (
    select *
    from best_plays
    order by score desc, exact desc, created_at asc
    limit 25
  )
  select
    row_number() over () as rank,
    ordered.display_name,
    ordered.score,
    ordered.exact,
    ordered.created_at as played_at
  from ordered;
$$;

create or replace function public.get_public_round_stats(p_play_date date)
returns table (
  plays bigint,
  avg_score numeric,
  best_score integer,
  perfects bigint,
  shares bigint
)
language sql
security definer
set search_path = public
as $$
  select
    (select count(*) from public.plays where play_date = p_play_date) as plays,
    (select round(avg(score), 1) from public.plays where play_date = p_play_date) as avg_score,
    (select max(score) from public.plays where play_date = p_play_date) as best_score,
    (select count(*) from public.plays where play_date = p_play_date and score = 100) as perfects,
    (select count(*) from public.events where play_date = p_play_date and event_name = 'share_result') as shares;
$$;
