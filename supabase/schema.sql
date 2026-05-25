create extension if not exists pgcrypto;

create or replace function public.is_owner()
returns boolean
language sql
stable
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = 'mishaberman@gmail.com';
$$;

create table if not exists public.cities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  state text,
  country text not null default 'US',
  timezone text not null default 'America/Los_Angeles',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.cities enable row level security;

drop policy if exists "active cities readable" on public.cities;
create policy "active cities readable"
on public.cities for select
using (is_active = true or public.is_owner());

drop policy if exists "owner writes cities" on public.cities;
create policy "owner writes cities"
on public.cities for all
using (public.is_owner())
with check (public.is_owner());

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  type text not null default 'food',
  status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  featured_start_at timestamptz,
  featured_end_at timestamptz,
  created_at timestamptz not null default now(),
  unique (city_id, slug)
);

alter table public.categories enable row level security;

drop policy if exists "active categories readable" on public.categories;
create policy "active categories readable"
on public.categories for select
using (status = 'active' or public.is_owner());

drop policy if exists "owner writes categories" on public.categories;
create policy "owner writes categories"
on public.categories for all
using (public.is_owner())
with check (public.is_owner());

create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete cascade,
  name text not null,
  slug text not null,
  address text,
  neighborhood text,
  latitude double precision,
  longitude double precision,
  google_place_id text,
  website_url text,
  instagram_handle text,
  category_tags text[] not null default '{}',
  image_url text,
  is_chain boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (city_id, slug)
);

create index if not exists places_city_active_idx on public.places(city_id, is_active);
create index if not exists places_tags_idx on public.places using gin(category_tags);

alter table public.places enable row level security;

drop policy if exists "active places readable" on public.places;
create policy "active places readable"
on public.places for select
using (is_active = true or public.is_owner());

drop policy if exists "owner writes places" on public.places;
create policy "owner writes places"
on public.places for all
using (public.is_owner())
with check (public.is_owner());

create table if not exists public.creators (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  slug text not null unique,
  handles_json jsonb not null default '{}'::jsonb,
  city_id uuid references public.cities(id) on delete set null,
  bio text,
  avatar_url text,
  is_verified boolean not null default false,
  opt_in_status text not null default 'not_contacted'
    check (opt_in_status in ('not_contacted', 'invited', 'opted_in', 'declined', 'mock')),
  contact_method text,
  created_at timestamptz not null default now()
);

alter table public.creators enable row level security;

drop policy if exists "opted in creators readable" on public.creators;
create policy "opted in creators readable"
on public.creators for select
using (opt_in_status in ('opted_in', 'mock') or public.is_owner());

drop policy if exists "owner writes creators" on public.creators;
create policy "owner writes creators"
on public.creators for all
using (public.is_owner())
with check (public.is_owner());

create table if not exists public.rank_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  anonymous_session_id text,
  city_id uuid not null references public.cities(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  creator_id uuid references public.creators(id) on delete set null,
  submitted_at timestamptz not null default now(),
  source text not null default 'user' check (source in ('user', 'creator', 'admin_seed')),
  visibility text not null default 'public' check (visibility in ('public', 'private', 'unlisted')),
  share_slug text not null unique default encode(gen_random_bytes(8), 'hex')
);

create index if not exists rank_submissions_category_idx
on public.rank_submissions(category_id, submitted_at desc);

alter table public.rank_submissions enable row level security;

drop policy if exists "public rank submissions readable" on public.rank_submissions;
create policy "public rank submissions readable"
on public.rank_submissions for select
using (visibility = 'public' or public.is_owner() or auth.uid() = user_id);

drop policy if exists "anyone inserts rank submissions" on public.rank_submissions;
create policy "anyone inserts rank submissions"
on public.rank_submissions for insert
with check (true);

drop policy if exists "owner updates rank submissions" on public.rank_submissions;
create policy "owner updates rank submissions"
on public.rank_submissions for update
using (public.is_owner())
with check (public.is_owner());

create table if not exists public.rank_items (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.rank_submissions(id) on delete cascade,
  place_id uuid not null references public.places(id) on delete cascade,
  rank_position integer not null check (rank_position between 1 and 5),
  note text,
  unique (submission_id, rank_position),
  unique (submission_id, place_id)
);

create index if not exists rank_items_submission_idx
on public.rank_items(submission_id, rank_position);

alter table public.rank_items enable row level security;

drop policy if exists "rank items follow submissions" on public.rank_items;
create policy "rank items follow submissions"
on public.rank_items for select
using (
  exists (
    select 1
    from public.rank_submissions
    where rank_submissions.id = rank_items.submission_id
      and (rank_submissions.visibility = 'public' or public.is_owner() or auth.uid() = rank_submissions.user_id)
  )
);

drop policy if exists "anyone inserts rank items" on public.rank_items;
create policy "anyone inserts rank items"
on public.rank_items for insert
with check (true);

create table if not exists public.place_suggestions (
  id uuid primary key default gen_random_uuid(),
  city_id uuid references public.cities(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  notes text,
  status text not null default 'new' check (status in ('new', 'reviewing', 'added', 'rejected')),
  submitted_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

alter table public.place_suggestions enable row level security;

drop policy if exists "anyone inserts place suggestions" on public.place_suggestions;
create policy "anyone inserts place suggestions"
on public.place_suggestions for insert
with check (true);

drop policy if exists "owner reads place suggestions" on public.place_suggestions;
create policy "owner reads place suggestions"
on public.place_suggestions for select
using (public.is_owner());

drop policy if exists "owner updates place suggestions" on public.place_suggestions;
create policy "owner updates place suggestions"
on public.place_suggestions for update
using (public.is_owner())
with check (public.is_owner());

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  city_id uuid references public.cities(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  submission_id uuid references public.rank_submissions(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  anonymous_session_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists events_created_idx on public.events(created_at desc);
create index if not exists events_name_idx on public.events(event_name, created_at desc);

alter table public.events enable row level security;

drop policy if exists "anyone inserts events" on public.events;
create policy "anyone inserts events"
on public.events for insert
with check (true);

drop policy if exists "owner reads events" on public.events;
create policy "owner reads events"
on public.events for select
using (public.is_owner());

create or replace view public.aggregate_rankings as
select
  rank_submissions.city_id,
  rank_submissions.category_id,
  rank_items.place_id,
  sum(6 - rank_items.rank_position) as total_points,
  count(*) as rank_count,
  count(*) filter (where rank_items.rank_position = 1) as first_place_count,
  avg(rank_items.rank_position)::numeric(10, 2) as average_rank,
  dense_rank() over (
    partition by rank_submissions.city_id, rank_submissions.category_id
    order by sum(6 - rank_items.rank_position) desc,
      count(*) filter (where rank_items.rank_position = 1) desc,
      avg(rank_items.rank_position) asc
  ) as city_rank,
  (
    count(*) filter (where rank_items.rank_position = 1) +
    count(*) filter (where rank_items.rank_position <= 3) -
    (count(*)::numeric / 2)
  )::numeric(10, 2) as controversy_score
from public.rank_items
join public.rank_submissions on rank_submissions.id = rank_items.submission_id
where rank_submissions.visibility = 'public'
group by rank_submissions.city_id, rank_submissions.category_id, rank_items.place_id;
