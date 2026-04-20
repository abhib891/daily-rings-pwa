-- Idempotent default habits: avoids duplicate inserts when the client calls
-- ensure logic twice in parallel (e.g. React Strict dev / fast remounts).

create or replace function public.ensure_default_habits()
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if exists (
    select 1
    from public.habits h
    where h.user_id = auth.uid()
      and h.archived = false
  ) then
    return;
  end if;

  insert into public.habits (user_id, name, sort_order)
  values
    (auth.uid(), 'Exercise', 0),
    (auth.uid(), 'Read', 1),
    (auth.uid(), 'Learn / build', 2);
end;
$$;

grant execute on function public.ensure_default_habits() to authenticated;
