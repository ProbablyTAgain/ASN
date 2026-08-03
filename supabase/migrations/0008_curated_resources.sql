-- Curated/database-owned resources imported from the team's research spreadsheet
-- (city/county programs, utilities, grants, etc.) — distinct from business_profiles,
-- which is self-submitted by business owners. These are publicly readable by
-- everyone but not editable through the app; manage them directly in Supabase.
create table if not exists public.curated_resources (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  resource_name text not null,
  link text,
  county text,
  city text,
  industry text,
  tag text,
  created_at timestamptz not null default now()
);

alter table public.curated_resources enable row level security;

drop policy if exists "Curated resources are viewable by everyone" on public.curated_resources;
create policy "Curated resources are viewable by everyone"
  on public.curated_resources
  for select
  to anon, authenticated
  using (true);

create index if not exists curated_resources_category_idx on public.curated_resources (category);
create index if not exists curated_resources_city_idx on public.curated_resources (city);
create index if not exists curated_resources_county_idx on public.curated_resources (county);
