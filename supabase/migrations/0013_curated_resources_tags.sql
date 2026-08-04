-- Waste-type tags (matching the same WASTE_TYPES vocabulary used on
-- business profiles: Electricity, Water, Waste, Recycling, Transportation,
-- Food, Paper, Chemicals) assigned per resource category, so curated cards
-- can show the same kind of pill badges business cards do.
alter table public.curated_resources add column if not exists tags text[];
