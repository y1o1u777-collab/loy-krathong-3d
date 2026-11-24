-- Loy Krathong 3D — run this script in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.krathongs (
  id uuid primary key default gen_random_uuid(),
  sender_name text not null check (char_length(sender_name) between 1 and 40),
  wish_message text not null check (char_length(wish_message) between 1 and 180),
  base_type text not null check (base_type in ('banana', 'lotus', 'coconut')),
  flower_type text not null check (flower_type in ('marigold', 'orchid', 'gomphrena')),
  created_at timestamptz not null default now()
);

create index if not exists krathongs_created_at_idx
  on public.krathongs (created_at desc);

alter table public.krathongs enable row level security;

grant select, insert on table public.krathongs to anon, authenticated;

drop policy if exists "Anyone can read krathongs" on public.krathongs;
create policy "Anyone can read krathongs"
  on public.krathongs for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone can create krathongs" on public.krathongs;
create policy "Anyone can create krathongs"
  on public.krathongs for insert
  to anon, authenticated
  with check (
    char_length(sender_name) between 1 and 40
    and char_length(wish_message) between 1 and 180
    and base_type in ('banana', 'lotus', 'coconut')
    and flower_type in ('marigold', 'orchid', 'gomphrena')
  );

-- Supabase Realtime: add the table to the publication only when it is not already present.
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'krathongs'
  ) then
    execute 'alter publication supabase_realtime add table public.krathongs';
  end if;
end;
$$;

alter table public.krathongs replica identity full;
