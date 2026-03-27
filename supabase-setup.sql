-- Run this in Supabase SQL Editor

-- Posts / News
create table if not exists posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  content text default '',
  excerpt text default '',
  cover_url text default '',
  published boolean default false,
  published_at timestamptz default now(),
  created_at timestamptz default now()
);
alter table posts enable row level security;
create policy "Public read published posts" on posts for select using (published = true);
create policy "Anon write posts" on posts for all using (true) with check (true);

-- Audition applications
create table if not exists applications (
  id uuid default gen_random_uuid() primary key,
  audition_id uuid references auditions(id) on delete cascade,
  name text,
  email text,
  phone text default '',
  dob text default '',
  city text default '',
  talent text default '',
  message text default '',
  video_url text default '',
  created_at timestamptz default now()
);
alter table applications enable row level security;
create policy "Anon insert applications" on applications for insert with check (true);
create policy "Anon read applications" on applications for select using (true);
