-- Supabase's security linter flagged curated_resources_grouped as a
-- "Security Definer View": a view runs with its creator's privileges by
-- default rather than the querying user's. security_invoker fixes that.
-- Also brings the view up to date with the `tags` column (text[]) added
-- here: it needs a non-null default and any existing NULLs backfilled to
-- '{}', since array_agg() over an all-NULL array column throws
-- "cannot accumulate null arrays" (22004). And array_agg(tags)[1] doesn't
-- work the way array_agg(id)[1] does for a plain scalar column - it
-- builds a 2D array, and single-bracket indexing that throws an array
-- subscript error (2202E). min() compares arrays directly instead, so it
-- picks one deterministic value per group without that problem.
alter table public.curated_resources add column if not exists tags text[];

update public.curated_resources set tags = '{}' where tags is null;

alter table public.curated_resources alter column tags set default '{}'::text[];

drop view if exists public.curated_resources_grouped;

create view public.curated_resources_grouped
with (security_invoker = true)
as
select
  (array_agg(id))[1] as id,
  category,
  resource_name,
  link,
  industry,
  tag,
  phone,
  email,
  min(coalesce(tags, '{}'::text[])) as tags,
  array_agg(distinct city order by city) filter (where city is not null and city <> '') as cities,
  array_agg(distinct county order by county) filter (where county is not null and county <> '') as counties,
  string_agg(distinct city, ', ') filter (where city is not null and city <> '') as city_text,
  string_agg(distinct county, ', ') filter (where county is not null and county <> '') as county_text,
  count(*) as location_count
from public.curated_resources
group by category, resource_name, link, industry, tag, phone, email;

grant select on public.curated_resources_grouped to anon, authenticated;
