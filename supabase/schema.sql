-- ChocoSite veritabanı kurulumu.
-- Supabase panelinde SQL Editor'e yapıştırıp bir kez çalıştırın; tekrar çalıştırmak zararsızdır.

-- 1) Yönetici listesi: yalnızca burada e-postası olan kullanıcılar içerik değiştirebilir.
--    Yönetici eklemek için:  insert into public.admins (email) values ('ornek@eposta.com');
create table if not exists public.admins (
  email text primary key
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where lower(email) = lower(auth.jwt() ->> 'email')
  );
$$;

-- 2) Site içeriği: ürünler, kategoriler, metinler tek satırda JSON olarak durur.
create table if not exists public.site_content (
  id int primary key default 1 check (id = 1),
  data jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.site_content enable row level security;

drop policy if exists "site_content herkes okur" on public.site_content;
create policy "site_content herkes okur"
  on public.site_content for select
  using (true);

drop policy if exists "site_content yonetici ekler" on public.site_content;
create policy "site_content yonetici ekler"
  on public.site_content for insert to authenticated
  with check (public.is_admin());

drop policy if exists "site_content yonetici gunceller" on public.site_content;
create policy "site_content yonetici gunceller"
  on public.site_content for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 3) Ürün fotoğrafları: herkes görür, yalnızca yöneticiler yükler veya siler.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "urun gorseli yonetici yukler" on storage.objects;
create policy "urun gorseli yonetici yukler"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "urun gorseli yonetici gunceller" on storage.objects;
create policy "urun gorseli yonetici gunceller"
  on storage.objects for update to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "urun gorseli yonetici siler" on storage.objects;
create policy "urun gorseli yonetici siler"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-images' and public.is_admin());
