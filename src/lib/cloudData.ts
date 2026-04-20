import type { SupabaseClient } from '@supabase/supabase-js'
import type { AppState, Habit } from './storage'

export async function ensureDefaultHabits(
  sb: SupabaseClient,
  userId: string,
): Promise<void> {
  const { count, error: cErr } = await sb
    .from('habits')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('archived', false)
  if (cErr) throw cErr
  if (count && count > 0) return

  const { error } = await sb.from('habits').insert([
    { user_id: userId, name: 'Exercise', sort_order: 0 },
    { user_id: userId, name: 'Read', sort_order: 1 },
    { user_id: userId, name: 'Learn / build', sort_order: 2 },
  ])
  if (error) throw error
}

export async function fetchHabitsFromCloud(
  sb: SupabaseClient,
  userId: string,
): Promise<Habit[]> {
  const { data, error } = await sb
    .from('habits')
    .select('id, name, sort_order')
    .eq('user_id', userId)
    .eq('archived', false)
    .order('sort_order', { ascending: true })
  if (error) throw error
  return (data ?? []).map((r) => ({
    id: r.id as string,
    name: r.name as string,
    sortOrder: r.sort_order as number,
  }))
}

export async function fetchEntriesFromCloud(
  sb: SupabaseClient,
  userId: string,
  fromDate: string,
  toDate: string,
): Promise<AppState['entries']> {
  const { data, error } = await sb
    .from('day_entries')
    .select('habit_id, entry_date, completed')
    .eq('user_id', userId)
    .gte('entry_date', fromDate)
    .lte('entry_date', toDate)
  if (error) throw error

  const entries: AppState['entries'] = {}
  for (const row of data ?? []) {
    if (!row.completed) continue
    const hid = row.habit_id as string
    const d = String(row.entry_date)
    if (!entries[hid]) entries[hid] = {}
    entries[hid][d] = true
  }
  return entries
}

export async function upsertDayEntry(
  sb: SupabaseClient,
  userId: string,
  habitId: string,
  entryDate: string,
  completed: boolean,
): Promise<void> {
  const { error } = await sb.from('day_entries').upsert(
    {
      user_id: userId,
      habit_id: habitId,
      entry_date: entryDate,
      completed,
    },
    { onConflict: 'user_id,habit_id,entry_date' },
  )
  if (error) throw error
}

export async function insertHabitCloud(
  sb: SupabaseClient,
  userId: string,
  name: string,
  sortOrder: number,
): Promise<Habit> {
  const { data, error } = await sb
    .from('habits')
    .insert({ user_id: userId, name, sort_order: sortOrder })
    .select('id, name, sort_order')
    .single()
  if (error) throw error
  return {
    id: data.id as string,
    name: data.name as string,
    sortOrder: data.sort_order as number,
  }
}
