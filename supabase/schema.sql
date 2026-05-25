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
  description text,
  why_local_five text,
  verification_status text not null default 'seed_candidate_verify_with_places_api'
    check (
      verification_status in (
        'seed_candidate_verify_with_places_api',
        'needs_places_api_verification',
        'needs_manual_verification',
        'review_for_current_concept',
        'exclude_closed',
        'verified_active',
        'creator_submitted',
        'business_claimed'
      )
    ),
  safe_to_publish_copy text not null default 'yes' check (safe_to_publish_copy in ('yes', 'needs_review')),
  source_note text,
  external_seed_id text,
  image_url text,
  is_chain boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (city_id, slug)
);

create index if not exists places_city_active_idx on public.places(city_id, is_active);
create index if not exists places_tags_idx on public.places using gin(category_tags);

alter table public.places add column if not exists description text;
alter table public.places add column if not exists why_local_five text;
alter table public.places add column if not exists verification_status text not null default 'seed_candidate_verify_with_places_api';
alter table public.places add column if not exists safe_to_publish_copy text not null default 'yes';
alter table public.places add column if not exists source_note text;
alter table public.places add column if not exists external_seed_id text;

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

create table if not exists public.seed_sources (
  id uuid primary key default gen_random_uuid(),
  source_key text not null unique,
  source_name text not null,
  url text,
  recommended_refresh_frequency text,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.seed_sources enable row level security;

drop policy if exists "seed sources readable" on public.seed_sources;
create policy "seed sources readable"
on public.seed_sources for select
using (true);

drop policy if exists "owner writes seed sources" on public.seed_sources;
create policy "owner writes seed sources"
on public.seed_sources for all
using (public.is_owner())
with check (public.is_owner());

create table if not exists public.place_sources (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places(id) on delete cascade,
  seed_source_id uuid references public.seed_sources(id) on delete set null,
  source_url text,
  source_label text,
  source_note text,
  created_at timestamptz not null default now(),
  unique (place_id, source_url)
);

alter table public.place_sources enable row level security;

drop policy if exists "public place sources readable" on public.place_sources;
create policy "public place sources readable"
on public.place_sources for select
using (
  exists (
    select 1
    from public.places
    where places.id = place_sources.place_id
      and (places.is_active = true or public.is_owner())
  )
);

drop policy if exists "owner writes place sources" on public.place_sources;
create policy "owner writes place sources"
on public.place_sources for all
using (public.is_owner())
with check (public.is_owner());

create table if not exists public.place_attributes (
  place_id uuid primary key references public.places(id) on delete cascade,
  cuisine_tags text[] not null default '{}',
  item_tags text[] not null default '{}',
  style_tags text[] not null default '{}',
  texture_tags text[] not null default '{}',
  vibe_tags text[] not null default '{}',
  best_for text[] not null default '{}',
  avoid_if text[] not null default '{}',
  price_tier text check (price_tier in ('$', '$$', '$$$')),
  updated_at timestamptz not null default now()
);

alter table public.place_attributes enable row level security;

drop policy if exists "public place attributes readable" on public.place_attributes;
create policy "public place attributes readable"
on public.place_attributes for select
using (
  exists (
    select 1
    from public.places
    where places.id = place_attributes.place_id
      and (places.is_active = true or public.is_owner())
  )
);

drop policy if exists "owner writes place attributes" on public.place_attributes;
create policy "owner writes place attributes"
on public.place_attributes for all
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
    check (opt_in_status in ('not_contacted', 'invited', 'opted_in', 'declined', 'mock', 'not_verified_user_uploaded_data')),
  public_attribution_enabled boolean not null default false,
  display_fallback text,
  contact_method text,
  created_at timestamptz not null default now()
);

alter table public.creators add column if not exists public_attribution_enabled boolean not null default false;
alter table public.creators add column if not exists display_fallback text;
alter table public.creators drop constraint if exists creators_opt_in_status_check;
alter table public.creators add constraint creators_opt_in_status_check
check (opt_in_status in ('not_contacted', 'invited', 'opted_in', 'declined', 'mock', 'not_verified_user_uploaded_data'));

alter table public.creators enable row level security;

drop policy if exists "opted in creators readable" on public.creators;
create policy "opted in creators readable"
on public.creators for select
using (public_attribution_enabled = true or opt_in_status in ('opted_in', 'mock') or public.is_owner());

drop policy if exists "owner writes creators" on public.creators;
create policy "owner writes creators"
on public.creators for all
using (public.is_owner())
with check (public.is_owner());

create table if not exists public.creator_rankings (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references public.creators(id) on delete set null,
  city_id uuid not null references public.cities(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  source_label text not null default 'creator_seed_imported',
  source_url text,
  opt_in_status text not null default 'not_verified_user_uploaded_data',
  public_label text not null default 'Curated local foodie list',
  is_public boolean not null default true,
  imported_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists creator_rankings_category_idx
on public.creator_rankings(category_id, created_at desc);

alter table public.creator_rankings enable row level security;

drop policy if exists "public creator rankings readable" on public.creator_rankings;
create policy "public creator rankings readable"
on public.creator_rankings for select
using (is_public = true or public.is_owner());

drop policy if exists "owner writes creator rankings" on public.creator_rankings;
create policy "owner writes creator rankings"
on public.creator_rankings for all
using (public.is_owner())
with check (public.is_owner());

create table if not exists public.creator_ranking_items (
  id uuid primary key default gen_random_uuid(),
  creator_ranking_id uuid not null references public.creator_rankings(id) on delete cascade,
  place_id uuid references public.places(id) on delete set null,
  place_name text not null,
  rank_position integer check (rank_position between 1 and 5),
  rank_status text,
  creator_note text,
  place_summary text,
  tags text[] not null default '{}',
  unique (creator_ranking_id, rank_position)
);

create index if not exists creator_ranking_items_ranking_idx
on public.creator_ranking_items(creator_ranking_id, rank_position);

alter table public.creator_ranking_items enable row level security;

drop policy if exists "public creator ranking items readable" on public.creator_ranking_items;
create policy "public creator ranking items readable"
on public.creator_ranking_items for select
using (
  exists (
    select 1
    from public.creator_rankings
    where creator_rankings.id = creator_ranking_items.creator_ranking_id
      and (creator_rankings.is_public = true or public.is_owner())
  )
);

drop policy if exists "owner writes creator ranking items" on public.creator_ranking_items;
create policy "owner writes creator ranking items"
on public.creator_ranking_items for all
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
