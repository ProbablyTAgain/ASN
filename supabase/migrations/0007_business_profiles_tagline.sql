-- A short one-line tagline shown on compact resource cards, separate from
-- the longer description/bio shown on the expanded detail panel.
alter table public.business_profiles add column if not exists tagline text;

-- Extend the existing profanity filter (see 0005_content_filter.sql) to also
-- cover the new tagline field.
create or replace function public.business_profiles_block_banned_words()
returns trigger
language plpgsql
as $$
begin
  if public.contains_banned_word(new.business_name)
     or public.contains_banned_word(new.description)
     or public.contains_banned_word(new.tagline)
  then
    raise exception 'Please rephrase without profanity or offensive language before saving your profile.';
  end if;
  return new;
end;
$$;
