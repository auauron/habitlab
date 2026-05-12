import type {
  DailyCheckin,
  Habit,
  HabitLog,
  HabitLogStatus,
  TodayHabitRow,
  WeeklySummaryDay,
} from './types'

type TodayHabitRowsInput = {
  date: string
  habits: Habit[]
  logs: HabitLog[]
}

type CurrentStreakInput = {
  habitId: string
  throughDate: string
  logs: HabitLog[]
}

type WeeklySummaryInput = {
  endDate: string
  habits: Habit[]
  logs: HabitLog[]
  checkins: DailyCheckin[]
}

export function getTodayHabitRows({
  date,
  habits,
  logs,
}: TodayHabitRowsInput): TodayHabitRow[] {
  return habits
    .filter((habit) => isHabitActiveOn(habit, date))
    .map((habit) => {
      const log =
        logs.find((entry) => entry.habitId === habit.id && entry.date === date) ??
        null

      return {
        habit,
        log,
        status: log?.status ?? 'pending',
      }
    })
}

export function calculateCompletionPercent(rows: TodayHabitRow[]): number {
  if (rows.length === 0) {
    return 0
  }

  const completed = rows.filter((row) => row.status === 'complete').length
  return Math.round((completed / rows.length) * 100)
}

export function calculateCurrentStreak({
  habitId,
  throughDate,
  logs,
}: CurrentStreakInput): number {
  let streak = 0
  let cursor = parseDate(throughDate)

  while (true) {
    const date = formatDate(cursor)
    const log = logs.find((entry) => entry.habitId === habitId && entry.date === date)

    if (log?.status !== 'complete') {
      return streak
    }

    streak += 1
    cursor = addDays(cursor, -1)
  }
}

export function buildWeeklySummary({
  endDate,
  habits,
  logs,
  checkins,
}: WeeklySummaryInput): WeeklySummaryDay[] {
  const end = parseDate(endDate)

  return Array.from({ length: 7 }, (_, index) => {
    const date = formatDate(addDays(end, index - 6))
    const rows = getTodayHabitRows({ date, habits, logs })
    const checkin = checkins.find((entry) => entry.date === date)

    return {
      date,
      completionPercent: calculateCompletionPercent(rows),
      completedCount: rows.filter((row) => row.status === 'complete').length,
      totalCount: rows.length,
      mood: checkin?.mood ?? null,
      energy: checkin?.energy ?? null,
    }
  })
}

function isHabitActiveOn(habit: Habit, date: string): boolean {
  if (habit.createdAt > date) {
    return false
  }

  if (habit.archivedAt && habit.archivedAt <= date) {
    return false
  }

  if (habit.cadence === 'weekdays') {
    const day = parseDate(date).getUTCDay()
    return day >= 1 && day <= 5
  }

  return true
}

function parseDate(date: string): Date {
  return new Date(`${date}T00:00:00.000Z`)
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setUTCDate(next.getUTCDate() + days)
  return next
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}
