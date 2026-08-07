-- Automatic tag classification for curated_resources. Two lookup tables
-- instead of a hardcoded CASE statement, so retagging a whole category or
-- fixing a keyword later is a single UPDATE, not a new migration.
-- A BEFORE INSERT OR UPDATE trigger recomputes `tags` on every write, so
-- it keeps working through every future Google Sheets sync (which does a
-- full delete + reinsert every 15 minutes via Apps Script) without anyone
-- needing to remember to re-run anything.
--
-- Classification is category default tags (what a whole spreadsheet tab
-- fundamentally is, e.g. every Transportation-tab row is Transportation
-- even if the resource name has no matching keyword) unioned with
-- resource-name keyword matches (for the ~15 generic catch-all categories
-- where the category label alone doesn't say what a given row is, and
-- for cross-cutting concepts like grants/rebates that show up inside
-- otherwise-unrelated categories).

create table if not exists public.curated_resource_category_tags (
  category text primary key,
  tags text[] not null default '{}'
);

alter table public.curated_resource_category_tags enable row level security;

create table if not exists public.curated_resource_tag_keywords (
  keyword text primary key,
  tag text not null
);

alter table public.curated_resource_tag_keywords enable row level security;

insert into public.curated_resource_category_tags (category, tags) values
  ('Air Quality & Emissions Reducti', array['Chemicals']),
  ('Building envelope', array['Electricity']),
  ('Carbon emissions reduction', array['Electricity']),
  ('Circular Economy & Materials In', array['Recycling']),
  ('Compost Directory', array['Waste','Recycling']),
  ('EV Charging', array['Transportation']),
  ('EV charging or alternative tran', array['Transportation']),
  ('Energy efficiency', array['Electricity']),
  ('Environmental Health & Pollutio', array['Chemicals']),
  ('Fleet efficiency', array['Transportation']),
  ('Food Systems & Agriculture', array['Food']),
  ('Food Systems & Local Agricultur', array['Food']),
  ('Grants  local', array['Grants']),
  ('Grants national', array['Grants']),
  ('Green Building & Sustainable Co', array['Electricity']),
  ('Green Financing & Incentives', array['Grants','Rebates']),
  ('HVAC', array['Electricity']),
  ('LED lighting or energy-efficien', array['Electricity']),
  ('Paperless office', array['Paper']),
  ('Pollution Prevention', array['Chemicals']),
  ('Rainwater resources', array['Water']),
  ('Recycling or composting', array['Recycling','Waste']),
  ('Renewable Energy & Solar Resour', array['Electricity']),
  ('Solar or renewable energy', array['Electricity']),
  ('Supply costs', array['Electricity']),
  ('Tax credits', array['Rebates']),
  ('Transportation', array['Transportation']),
  ('Transportation & Fleet Sustaina', array['Transportation']),
  ('Transportation & Mobility Beyon', array['Transportation']),
  ('Waste Facilities', array['Waste']),
  ('Waste disposal', array['Waste']),
  ('Waste reduction & recycling', array['Waste','Recycling']),
  ('Water Efficiency', array['Water']),
  ('Water Stewardship Beyond Conser', array['Water']),
  ('Water conservation', array['Water']),
  ('Water-saving fixtures', array['Water']),
  ('Weatherization resources', array['Electricity'])
on conflict (category) do update set tags = excluded.tags;

insert into public.curated_resource_tag_keywords (keyword, tag) values
  ('energy', 'Electricity'),
  ('electric', 'Electricity'),
  ('solar', 'Electricity'),
  ('renewable', 'Electricity'),
  ('power', 'Electricity'),
  ('hvac', 'Electricity'),
  ('weatheriz', 'Electricity'),
  ('electrif', 'Electricity'),
  ('water', 'Water'),
  ('rainwater', 'Water'),
  ('greywater', 'Water'),
  ('irrigation', 'Water'),
  ('drought', 'Water'),
  ('watersense', 'Water'),
  ('waste', 'Waste'),
  ('disposal', 'Waste'),
  ('landfill', 'Waste'),
  ('dumpster', 'Waste'),
  ('transfer station', 'Waste'),
  ('sanitation', 'Waste'),
  ('e-waste', 'Waste'),
  ('recycl', 'Recycling'),
  ('compost', 'Recycling'),
  ('circular economy', 'Recycling'),
  ('materials reuse', 'Recycling'),
  ('materials management', 'Recycling'),
  ('transport', 'Transportation'),
  ('ev charg', 'Transportation'),
  ('fleet', 'Transportation'),
  ('mobility', 'Transportation'),
  ('transit', 'Transportation'),
  ('bike', 'Transportation'),
  ('pedestrian', 'Transportation'),
  ('food', 'Food'),
  ('agricultur', 'Food'),
  ('farm', 'Food'),
  ('garden', 'Food'),
  ('paper', 'Paper'),
  ('paperless', 'Paper'),
  ('digital', 'Paper'),
  ('e-filing', 'Paper'),
  ('electronic filing', 'Paper'),
  ('chemical', 'Chemicals'),
  ('hazardous', 'Chemicals'),
  ('pollut', 'Chemicals'),
  ('air quality', 'Chemicals'),
  ('emission', 'Chemicals'),
  ('spill', 'Chemicals'),
  ('toxic', 'Chemicals'),
  ('pfas', 'Chemicals'),
  ('rebate', 'Rebates'),
  ('incentive', 'Rebates'),
  ('tax credit', 'Rebates'),
  ('grant', 'Grants'),
  ('funding', 'Grants'),
  ('cprg', 'Grants')
on conflict (keyword) do update set tag = excluded.tag;

create or replace function public.curated_resources_set_tags()
returns trigger
language plpgsql
as $$
declare
  base_tags text[];
  computed text[] := '{}';
  kw record;
begin
  select tags into base_tags
  from public.curated_resource_category_tags
  where category = new.category;

  if base_tags is not null then
    computed := base_tags;
  end if;

  for kw in select keyword, tag from public.curated_resource_tag_keywords loop
    if new.resource_name ilike ('%' || kw.keyword || '%') and not (kw.tag = any(computed)) then
      computed := computed || kw.tag;
    end if;
  end loop;

  new.tags := computed;
  return new;
end;
$$;

drop trigger if exists curated_resources_tags_trigger on public.curated_resources;
create trigger curated_resources_tags_trigger
  before insert or update on public.curated_resources
  for each row execute function public.curated_resources_set_tags();

-- Backfill: a no-op UPDATE still fires the BEFORE UPDATE trigger, so this
-- recomputes tags for every existing row using the logic above.
update public.curated_resources set resource_name = resource_name;

-- Added Climate/Conservation/Community to the fixed tag vocabulary
-- (also added to WASTE_TYPES in src/lib/constants.js, shared with
-- business profile tagging) to cover categories that were legitimately
-- resources but had no real fit in the original 10-tag set.
insert into public.curated_resource_category_tags (category, tags) values
  ('Emergency Preparedness & Climat', array['Climate']),
  ('Heat Response & Mitigation', array['Climate']),
  ('Climate Data & Research Centers', array['Climate']),
  ('Climate action resources', array['Climate']),
  ('Environmental Justice & Communi', array['Climate']),
  ('Biodiversity & Wildlife Protect', array['Conservation']),
  ('Land Conservation & Habitat Res', array['Conservation']),
  ('Urban forestry programs', array['Conservation']),
  ('Community engagement', array['Community']),
  ('Event Resources', array['Community']),
  ('Hyper local events', array['Community']),
  ('Clubs and groups', array['Community']),
  ('Youth & School Sustainability P', array['Community'])
on conflict (category) do update set tags = excluded.tags;

insert into public.curated_resource_tag_keywords (keyword, tag) values
  ('climate', 'Climate'),
  ('emergency', 'Climate'),
  ('resilience', 'Climate'),
  ('heat relief', 'Climate'),
  ('disaster', 'Climate'),
  ('conservation', 'Conservation'),
  ('wildlife', 'Conservation'),
  ('habitat', 'Conservation'),
  ('biodiversity', 'Conservation'),
  ('forestry', 'Conservation'),
  ('community', 'Community'),
  ('workshop', 'Community'),
  ('youth', 'Community'),
  ('club', 'Community')
on conflict (keyword) do update set tag = excluded.tag;

-- Re-backfill so the new categories/keywords apply to existing rows too.
update public.curated_resources set resource_name = resource_name;

-- Added Knowledge as a 14th tag, per the boss's request while rebuilding
-- the source spreadsheet. Also added to WASTE_TYPES in
-- src/lib/constants.js, shared with business profile tagging.
insert into public.curated_resource_category_tags (category, tags) values
  ('Knowledge', array['Knowledge'])
on conflict (category) do update set tags = excluded.tags;

insert into public.curated_resource_tag_keywords (keyword, tag) values
  ('knowledge', 'Knowledge'),
  ('education', 'Knowledge'),
  ('how to', 'Knowledge'),
  ('guide', 'Knowledge')
on conflict (keyword) do update set tag = excluded.tag;

update public.curated_resources set resource_name = resource_name;
