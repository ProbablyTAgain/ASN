-- Never used by the app. Zip search (see src/pages/Resource.jsx) was
-- already solved with the zipcodes npm package's full US zip database
-- before this table was created, so it was dead from day one - confirmed
-- via a repo-wide search finding zero references outside its own
-- creation migration (0011).
drop table if exists public.az_city_zip_lookup;
