-- Arizona city -> zip code -> county lookup, imported from the "Cities
-- Counties zip codes" reference sheet. Used to resolve a searched zip code
-- to a city name, so curated resources (which are stored by city/county,
-- not zip) can be matched against a zip search.
create table if not exists public.az_city_zip_lookup (
  id uuid primary key default gen_random_uuid(),
  city text not null,
  zip_code text not null,
  county text,
  created_at timestamptz not null default now()
);

alter table public.az_city_zip_lookup enable row level security;

drop policy if exists "AZ city/zip lookup is viewable by everyone" on public.az_city_zip_lookup;
create policy "AZ city/zip lookup is viewable by everyone"
  on public.az_city_zip_lookup
  for select
  to anon, authenticated
  using (true);

create index if not exists az_city_zip_lookup_zip_idx on public.az_city_zip_lookup (zip_code);
