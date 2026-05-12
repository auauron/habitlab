export type HabitCadence = 'daily' | 'weekdays' | 'weekly'

export type HabitLogStatus = 'complete' | 'skip' | 'pending'

export type Mood = 'clear' | 'tired' | 'bright' | 'heavy' | 'steady'

export type Habit = {
  id: string
  name: string
  cadence: HabitCadence
  color: string
  icon: string
  createdAt: string
  archivedAt: string | null
}

export type HabitLog = {
  id: string
  habitId: string
  date: string
  status: HabitLogStatus
}

export type DailyCheckin = {
  id: string
  date: string
  mood: Mood
  energy: number
  reflection: string
}

export type TodayHabitRow = {
  habit: Habit
  status: HabitLogStatus
  log: HabitLog | null
}

export type WeeklySummaryDay = {
  date: string
  completionPercent: number
  completedCount: number
  totalCount: number
  mood: Mood | null
  energy: number | null
}
