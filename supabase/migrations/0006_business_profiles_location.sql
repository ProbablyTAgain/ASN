-- Lets a business describe itself as a physical location or an online/virtual
-- service, and gives physical locations a street address + city to show
-- alongside the existing zip code.

alter table public.business_profiles
  add column if not exists location_type text not null default 'physical';

alter table public.business_profiles
  drop constraint if exists business_profiles_location_type_check;

alter table public.business_profiles
  add constraint business_profiles_location_type_check
  check (location_type in ('physical', 'online'));

alter table public.business_profiles add column if not exists address text;
alter table public.business_profiles add column if not exists city text;
