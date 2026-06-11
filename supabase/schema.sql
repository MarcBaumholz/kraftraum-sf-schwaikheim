begin;

create extension if not exists pgcrypto;

create table if not exists public.equipment_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  external_url text,
  image_url text,
  estimated_price_cents integer,
  is_seeded boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint equipment_title_length
    check (char_length(trim(title)) between 1 and 80),
  constraint equipment_description_length
    check (description is null or char_length(description) <= 500),
  constraint equipment_external_url_http
    check (external_url is null or external_url ~* '^https?://'),
  constraint equipment_image_url_http
    check (image_url is null or image_url ~* '^https?://'),
  constraint equipment_price_positive
    check (estimated_price_cents is null or estimated_price_cents > 0),
  constraint community_suggestion_has_source
    check (is_seeded or external_url is not null or image_url is not null)
);

create table if not exists public.votes (
  item_id uuid not null references public.equipment_items(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  value smallint not null check (value in (-1, 1)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (item_id, user_id)
);

create index if not exists equipment_items_created_at_idx
  on public.equipment_items (created_at desc);

create index if not exists votes_item_id_idx
  on public.votes (item_id);

alter table public.equipment_items enable row level security;
alter table public.votes enable row level security;

drop policy if exists "equipment is publicly readable"
  on public.equipment_items;
create policy "equipment is publicly readable"
  on public.equipment_items
  for select
  to anon, authenticated
  using (true);

drop policy if exists "votes are publicly readable" on public.votes;
create policy "votes are publicly readable"
  on public.votes
  for select
  to anon, authenticated
  using (true);

create or replace function public.can_create_equipment()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select auth.uid() is not null
    and not exists (
      select 1
      from public.equipment_items
      where created_by = auth.uid()
        and created_at > now() - interval '60 seconds'
    );
$$;

revoke all on function public.can_create_equipment() from public;
grant execute on function public.can_create_equipment() to authenticated;

drop policy if exists "authenticated users create community equipment"
  on public.equipment_items;
create policy "authenticated users create community equipment"
  on public.equipment_items
  for insert
  to authenticated
  with check (
    created_by = auth.uid()
    and is_seeded = false
    and public.can_create_equipment()
  );

drop policy if exists "users insert their own votes" on public.votes;
create policy "users insert their own votes"
  on public.votes
  for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "users update their own votes" on public.votes;
create policy "users update their own votes"
  on public.votes
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "users delete their own votes" on public.votes;
create policy "users delete their own votes"
  on public.votes
  for delete
  to authenticated
  using (user_id = auth.uid());

revoke insert, update, delete on public.equipment_items from anon;
revoke insert, update, delete on public.equipment_items from authenticated;
grant insert (
  title,
  description,
  external_url,
  image_url,
  is_seeded,
  created_by
) on public.equipment_items to authenticated;

revoke insert, update, delete on public.votes from anon;
revoke insert, update, delete on public.votes from authenticated;

create or replace function public.list_equipment()
returns table (
  id uuid,
  title text,
  description text,
  external_url text,
  image_url text,
  estimated_price_cents integer,
  is_seeded boolean,
  created_at timestamptz,
  upvotes integer,
  downvotes integer,
  score integer,
  user_vote smallint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    equipment.id,
    equipment.title,
    equipment.description,
    equipment.external_url,
    equipment.image_url,
    equipment.estimated_price_cents,
    equipment.is_seeded,
    equipment.created_at,
    count(votes.*) filter (where votes.value = 1)::integer as upvotes,
    count(votes.*) filter (where votes.value = -1)::integer as downvotes,
    coalesce(sum(votes.value), 0)::integer as score,
    (
      select own_vote.value
      from public.votes own_vote
      where own_vote.item_id = equipment.id
        and own_vote.user_id = auth.uid()
    ) as user_vote
  from public.equipment_items equipment
  left join public.votes votes on votes.item_id = equipment.id
  group by equipment.id
  order by
    coalesce(sum(votes.value), 0) desc,
    equipment.created_at desc;
$$;

revoke all on function public.list_equipment() from public;
grant execute on function public.list_equipment() to authenticated;

create or replace function public.set_equipment_vote(
  p_item_id uuid,
  p_value smallint
)
returns smallint
language plpgsql
security definer
set search_path = public
as $$
declare
  current_value smallint;
begin
  if auth.uid() is null then
    raise exception 'authentication required';
  end if;

  if p_value not in (-1, 1) then
    raise exception 'vote must be -1 or 1';
  end if;

  if not exists (
    select 1 from public.equipment_items where id = p_item_id
  ) then
    raise exception 'equipment item not found';
  end if;

  select value
  into current_value
  from public.votes
  where item_id = p_item_id
    and user_id = auth.uid()
  for update;

  if current_value = p_value then
    delete from public.votes
    where item_id = p_item_id
      and user_id = auth.uid();
    return null;
  end if;

  insert into public.votes (item_id, user_id, value)
  values (p_item_id, auth.uid(), p_value)
  on conflict (item_id, user_id)
  do update set
    value = excluded.value,
    updated_at = now();

  return p_value;
end;
$$;

revoke all on function public.set_equipment_vote(uuid, smallint) from public;
grant execute on function public.set_equipment_vote(uuid, smallint)
  to authenticated;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'suggestion-images',
  'suggestion-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "suggestion images are publicly readable"
  on storage.objects;
create policy "suggestion images are publicly readable"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'suggestion-images');

drop policy if exists "users upload suggestion images in own folder"
  on storage.objects;
create policy "users upload suggestion images in own folder"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'suggestion-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

insert into public.equipment_items (
  id,
  title,
  description,
  estimated_price_cents,
  is_seeded,
  created_at
)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'Rückenstrecker',
    'Für gezieltes Training der unteren Rücken- und Rumpfmuskulatur.',
    34900,
    true,
    '2026-06-01T08:00:00Z'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    '5-kg-Hanteln',
    'Leichtere Gewichte für Reha, Schultertraining und Warm-up.',
    4900,
    true,
    '2026-06-02T08:00:00Z'
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    'Digitale Wanduhr',
    'Große Trainingszeit für Intervalle, Pausen und Zirkel.',
    8900,
    true,
    '2026-06-03T08:00:00Z'
  )
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  estimated_price_cents = excluded.estimated_price_cents,
  is_seeded = true;

commit;
