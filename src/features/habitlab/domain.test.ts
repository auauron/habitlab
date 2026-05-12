import { describe, expect, it } from 'vitest'
import {
  buildWeeklySummary,
  calculateCompletionPercent,
  calculateCurrentStreak,
  getTodayHabitRows,
} from './domain'
import type { DailyCheckin, Habit, HabitLog } from './types'

const habits: Habit[] = [
  {
    id: 'water',
    name: 'Drink water',
    cadence: 'daily',
    color: 'sky',
    icon: 'Droplets',
    createdAt: '2026-05-01',
    archivedAt: null,
  },
  {
    id: 'read',
    name: 'Read',
    cadence: 'weekdays',
    color: 'indigo',
    icon: 'BookOpen',
    createdAt: '2026-05-01',
    archivedAt: null,
  },
  {
    id: 'stretch',
    name: 'Stretch',
    cadence: 'weekly',
    color: 'cyan',
    icon: 'Sparkles',
    createdAt: '2026-05-01',
    archivedAt: '2026-05-09',
  },
]

const logs: HabitLog[] = [
  {
    id: 'log-1',
    habitId: 'water',
    date: '2026-05-12',
    status: 'complete',
  },
  {
    id: 'log-2',
    habitId: 'read',
    date: '2026-05-12',
    status: 'skip',
  },
  {
    id: 'log-3',
    habitId: 'water',
    date: '2026-05-11',
    status: 'complete',
  },
  {
    id: 'log-4',
    habitId: 'water',
    date: '2026-05-10',
    status: 'complete',
  },
]

const checkins: DailyCheckin[] = [
  {
    id: 'checkin-1',
    date: '2026-05-12',
    mood: 'clear',
    energy: 4,
    reflection: 'Felt steady and focused.',
  },
  {
    id: 'checkin-2',
    date: '2026-05-11',
    mood: 'tired',
    energy: 2,
    reflection: 'Needed a slower evening.',
  },
]

describe('HabitLab domain helpers', () => {
  it('returns active habit rows for the selected day with their log status', () => {
    const rows = getTodayHabitRows({
      date: '2026-05-12',
      habits,
      logs,
    })

    expect(rows).toEqual([
      expect.objectContaining({
        habit: expect.objectContaining({ id: 'water' }),
        status: 'complete',
      }),
      expect.objectContaining({
        habit: expect.objectContaining({ id: 'read' }),
        status: 'skip',
      }),
    ])
  })

  it('calculates completion percent from complete habits only', () => {
    const rows = getTodayHabitRows({
      date: '2026-05-12',
      habits,
      logs,
    })

    expect(calculateCompletionPercent(rows)).toBe(50)
  })

  it('calculates the current streak ending on the selected date', () => {
    expect(
      calculateCurrentStreak({
        habitId: 'water',
        throughDate: '2026-05-12',
        logs,
      }),
    ).toBe(3)
  })

  it('builds a seven day summary with completion and check-in context', () => {
    const summary = buildWeeklySummary({
      endDate: '2026-05-12',
      habits,
      logs,
      checkins,
    })

    expect(summary).toHaveLength(7)
    expect(summary.at(-1)).toEqual(
      expect.objectContaining({
        date: '2026-05-12',
        completionPercent: 50,
        mood: 'clear',
        energy: 4,
      }),
    )
  })
})
