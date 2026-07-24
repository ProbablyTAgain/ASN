-- Community events, posted by authenticated users. Publicly viewable by anyone.
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users(id) on delete cascade,
  title text not null,
  organization text,
  date timestamptz not null,
  time text,
  location text,
  categories text[] not null default '{}',
  waste_types text[] not null default '{}',
  description text,
  contact_email text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.events enable row level security;

-- Anyone (signed in or not) can browse events on the public calendar.
create policy "Events are viewable by everyone"
  on public.events for select
  to anon, authenticated
  using (true);

-- You can only post an event under your own account.
create policy "Users can insert their own events"
  on public.events for insert
  to authenticated
  with check (auth.uid() = created_by);

-- You can only edit your own events.
create policy "Users can update their own events"
  on public.events for update
  to authenticated
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

-- You can only delete your own events.
create policy "Users can delete their own events"
  on public.events for delete
  to authenticated
  using (auth.uid() = created_by);
