-- In Supabase: SQL Editor -> New query -> dies hier einfügen -> Run

create table if not exists artworks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  category text not null default 'a5' check (category in ('a5', 'keilrahmen')),
  image_url text not null,
  storage_path text,
  created_at timestamptz default now()
);

alter table artworks enable row level security;

-- Jeder darf die Werke lesen (die Seite ist öffentlich sichtbar)
drop policy if exists "Öffentliches Lesen" on artworks;
create policy "Öffentliches Lesen" on artworks
  for select using (true);

-- Nur eingeloggte Nutzer (also nur du, siehe README "Admin-Login")
-- dürfen Werke einfügen oder löschen.
drop policy if exists "Öffentliches Einfügen" on artworks;
drop policy if exists "Öffentliches Löschen" on artworks;

create policy "Nur eingeloggt: Einfügen" on artworks
  for insert with check (auth.role() = 'authenticated');

create policy "Nur eingeloggt: Löschen" on artworks
  for delete using (auth.role() = 'authenticated');

-- Gleiches Prinzip für den Bildspeicher (Storage-Bucket "artworks"):
-- Lesen öffentlich, Hochladen/Löschen nur eingeloggt.
drop policy if exists "Öffentliches Lesen Storage" on storage.objects;
create policy "Öffentliches Lesen Storage" on storage.objects
  for select using (bucket_id = 'artworks');

drop policy if exists "Nur eingeloggt: Hochladen Storage" on storage.objects;
create policy "Nur eingeloggt: Hochladen Storage" on storage.objects
  for insert with check (bucket_id = 'artworks' and auth.role() = 'authenticated');

drop policy if exists "Nur eingeloggt: Löschen Storage" on storage.objects;
create policy "Nur eingeloggt: Löschen Storage" on storage.objects
  for delete using (bucket_id = 'artworks' and auth.role() = 'authenticated');

