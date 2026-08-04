-- Redefines curated_resources_grouped (from 0012) to also expose the new
-- `tags` column (added in 0013). Tags are assigned per category, so every
-- row in a group shares the same tags — just carry one copy through.
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
  (array_agg(tags))[1] as tags,
  array_agg(distinct city order by city) filter (where city is not null and city <> '') as cities,
  array_agg(distinct county order by county) filter (where county is not null and county <> '') as counties,
  string_agg(distinct city, ', ') filter (where city is not null and city <> '') as city_text,
  string_agg(distinct county, ', ') filter (where county is not null and county <> '') as county_text,
  count(*) as location_count
from public.curated_resources
group by category, resource_name, link, industry, tag, phone, email;

grant select on public.curated_resources_grouped to anon, authenticated;
