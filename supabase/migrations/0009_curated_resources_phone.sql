-- Optional phone number for curated resources, shown as a Call button on
-- the resource card/detail panel when present (most rows won't have one,
-- since the source spreadsheet has no phone column, but this supports it
-- if that data becomes available later).
alter table public.curated_resources add column if not exists phone text;
