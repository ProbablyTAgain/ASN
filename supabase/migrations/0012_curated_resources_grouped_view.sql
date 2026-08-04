-- Many rows in curated_resources are the same statewide/regional resource
-- (same name + link) repeated once per city in the source spreadsheet
-- (e.g. "ADOT Maps ArcGIS" listed separately for every city it applies to).
-- This view collapses those into one row per distinct resource, combining
-- all its cities/counties into arrays (plus flattened text versions for
-- free-text search, since PostgREST can't ILIKE into an array directly).
create or replace view public.curated_resources_grouped as
select
  (array_agg(id))[1] as id,
  category,
  resource_name,
  link,
  industry,
  tag,
  phone,
  email,
  array_agg(distinct city order by city) filter (where city is not null and city <> '') as cities,
  array_agg(distinct county order by county) filter (where county is not null and county <> '') as counties,
  string_agg(distinct city, ', ') filter (where city is not null and city <> '') as city_text,
  string_agg(distinct county, ', ') filter (where county is not null and county <> '') as county_text,
  count(*) as location_count
from public.curated_resources
group by category, resource_name, link, industry, tag, phone, email;

grant select on public.curated_resources_grouped to anon, authenticated;
