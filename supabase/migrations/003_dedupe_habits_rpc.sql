-- Merge duplicate habits (same user, same name, not archived): keep smallest id,
-- OR-merge day_entries on overlapping dates, re-point remaining entries, delete extras.
-- Safe to run repeatedly (no-op when already unique).

create or replace function public.dedupe_habits()
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  canon_id uuid;
  dup_id uuid;
begin
  if uid is null then
    return;
  end if;

  for dup_id in
    select h.id
    from public.habits h
    where h.user_id = uid
      and h.archived = false
      and exists (
        select 1
        from public.habits h2
        where h2.user_id = h.user_id
          and h2.name = h.name
          and h2.archived = false
          and h2.id < h.id
      )
  loop
    select h2.id into canon_id
    from public.habits h2
    cross join public.habits hdup
    where hdup.id = dup_id
      and h2.user_id = uid
      and hdup.user_id = uid
      and h2.name = hdup.name
      and h2.archived = false
    order by h2.id
    limit 1;

    update public.day_entries as c
    set completed = c.completed or d.completed
    from public.day_entries as d
    where c.user_id = uid
      and d.user_id = uid
      and c.habit_id = canon_id
      and d.habit_id = dup_id
      and c.entry_date = d.entry_date;

    delete from public.day_entries d
    where d.user_id = uid
      and d.habit_id = dup_id
      and exists (
        select 1
        from public.day_entries c
        where c.user_id = uid
          and c.habit_id = canon_id
          and c.entry_date = d.entry_date
      );

    update public.day_entries
    set habit_id = canon_id
    where user_id = uid and habit_id = dup_id;

    delete from public.habits
    where id = dup_id and user_id = uid;
  end loop;
end;
$$;

grant execute on function public.dedupe_habits() to authenticated;
