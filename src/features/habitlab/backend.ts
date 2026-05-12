import type { User } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'
import type { HabitLabDatabase } from '../../lib/supabase'
import type { DailyCheckin, Habit, HabitLog, HabitLogStatus, Mood } from './types'

type HabitRow = HabitLabDatabase['public']['Tables']['habits']['Row']
type HabitLogRow = HabitLabDatabase['public']['Tables']['habit_logs']['Row']
type DailyCheckinRow = HabitLabDatabase['public']['Tables']['daily_checkins']['Row']

export type HabitDraft = {
  name: string
  cadence: Habit['cadence']
  icon: string
  color: string
}

export type CheckinDraft = {
  mood: Mood
  energy: number
  reflection: string
}

export type HabitLabSnapshot = {
  habits: Habit[]
  logs: HabitLog[]
  checkins: DailyCheckin[]
}

export function todayKey(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function addDaysKey(dateKey: string, days: number): string {
  const date = new Date(`${dateKey}T00:00:00.000Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

export function formatLongDate(dateKey: string): string {
  return new Date(`${dateKey}T00:00:00.000Z`).toLocaleDateString('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export async function fetchHabitLabSnapshot(user: User): Promise<HabitLabSnapshot> {
  ensureSupabase()

  const today = todayKey()
  const since = addDaysKey(today, -60)

  const [habitsResult, logsResult, checkinsResult] = await Promise.all([
    supabase!
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .is('archived_at', null)
      .order('created_at', { ascending: true }),
    supabase!
      .from('habit_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', since)
      .order('date', { ascending: false }),
    supabase!
      .from('daily_checkins')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', since)
      .order('date', { ascending: false }),
  ])

  if (habitsResult.error) throw habitsResult.error
  if (logsResult.error) throw logsResult.error
  if (checkinsResult.error) throw checkinsResult.error

  return {
    habits: (habitsResult.data ?? []).map(mapHabit),
    logs: (logsResult.data ?? []).map(mapHabitLog),
    checkins: (checkinsResult.data ?? []).map(mapDailyCheckin),
  }
}

export async function createHabit(user: User, draft: HabitDraft): Promise<Habit> {
  ensureSupabase()

  const { data, error } = await supabase!
    .from('habits')
    .insert({
      user_id: user.id,
      name: draft.name,
      cadence: draft.cadence,
      icon: draft.icon,
      color: draft.color,
    })
    .select('*')
    .single()

  if (error) throw error
  return mapHabit(data)
}

export async function archiveHabit(habitId: string): Promise<void> {
  ensureSupabase()

  const { error } = await supabase!
    .from('habits')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', habitId)

  if (error) throw error
}

export async function upsertHabitLog(
  user: User,
  habitId: string,
  date: string,
  status: HabitLogStatus,
): Promise<HabitLog> {
  ensureSupabase()

  const { data, error } = await supabase!
    .from('habit_logs')
    .upsert(
      {
        user_id: user.id,
        habit_id: habitId,
        date,
        status,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'habit_id,date' },
    )
    .select('*')
    .single()

  if (error) throw error
  return mapHabitLog(data)
}

export async function upsertDailyCheckin(
  user: User,
  date: string,
  draft: CheckinDraft,
): Promise<DailyCheckin> {
  ensureSupabase()

  const { data, error } = await supabase!
    .from('daily_checkins')
    .upsert(
      {
        user_id: user.id,
        date,
        mood: draft.mood,
        energy: draft.energy,
        reflection: draft.reflection,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,date' },
    )
    .select('*')
    .single()

  if (error) throw error
  return mapDailyCheckin(data)
}

function mapHabit(row: HabitRow): Habit {
  return {
    id: row.id,
    name: row.name,
    cadence: row.cadence,
    color: row.color,
    icon: row.icon,
    createdAt: row.created_at.slice(0, 10),
    archivedAt: row.archived_at?.slice(0, 10) ?? null,
  }
}

function mapHabitLog(row: HabitLogRow): HabitLog {
  return {
    id: row.id,
    habitId: row.habit_id,
    date: row.date,
    status: row.status,
  }
}

function mapDailyCheckin(row: DailyCheckinRow): DailyCheckin {
  return {
    id: row.id,
    date: row.date,
    mood: row.mood,
    energy: row.energy,
    reflection: row.reflection,
  }
}

function ensureSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured.')
  }
}
