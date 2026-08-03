-- Optional email address for curated resources, shown as an Email button
-- on the resource card/detail panel when present (like phone, most rows
-- won't have one since the source spreadsheet has no email column, but
-- this supports it if that data becomes available later).
alter table public.curated_resources add column if not exists email text;
