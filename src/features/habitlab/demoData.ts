import type { DailyCheckin, Habit, HabitLog } from './types'

export const demoToday = '2026-05-12'

export const demoHabits: Habit[] = [
  {
    id: 'hydrate',
    name: 'Hydrate before coffee',
    cadence: 'daily',
    color: 'sky',
    icon: 'Droplets',
    createdAt: '2026-05-01',
    archivedAt: null,
  },
  {
    id: 'deep-work',
    name: 'One focused work block',
    cadence: 'weekdays',
    color: 'blue',
    icon: 'Timer',
    createdAt: '2026-05-01',
    archivedAt: null,
  },
  {
    id: 'walk',
    name: 'Walk outside',
    cadence: 'daily',
    color: 'cyan',
    icon: 'Footprints',
    createdAt: '2026-05-01',
    archivedAt: null,
  },
  {
    id: 'reflect',
    name: 'Evening reflection',
    cadence: 'daily',
    color: 'violet',
    icon: 'BookOpen',
    createdAt: '2026-05-01',
    archivedAt: null,
  },
]

export const demoLogs: HabitLog[] = [
  { id: '1', habitId: 'hydrate', date: '2026-05-12', status: 'complete' },
  { id: '2', habitId: 'deep-work', date: '2026-05-12', status: 'pending' },
  { id: '3', habitId: 'walk', date: '2026-05-12', status: 'pending' },
  { id: '4', habitId: 'reflect', date: '2026-05-12', status: 'pending' },
  { id: '5', habitId: 'hydrate', date: '2026-05-11', status: 'complete' },
  { id: '6', habitId: 'deep-work', date: '2026-05-11', status: 'complete' },
  { id: '7', habitId: 'walk', date: '2026-05-11', status: 'complete' },
  { id: '8', habitId: 'reflect', date: '2026-05-11', status: 'complete' },
  { id: '9', habitId: 'hydrate', date: '2026-05-10', status: 'complete' },
  { id: '10', habitId: 'walk', date: '2026-05-10', status: 'complete' },
  { id: '11', habitId: 'reflect', date: '2026-05-10', status: 'complete' },
  { id: '12', habitId: 'hydrate', date: '2026-05-09', status: 'complete' },
  { id: '13', habitId: 'deep-work', date: '2026-05-09', status: 'skip' },
  { id: '14', habitId: 'walk', date: '2026-05-09', status: 'complete' },
  { id: '15', habitId: 'reflect', date: '2026-05-09', status: 'complete' },
]

export const demoCheckins: DailyCheckin[] = [
  {
    id: 'c1',
    date: '2026-05-12',
    mood: 'clear',
    energy: 4,
    reflection: 'I want today to feel light, focused, and intentional.',
  },
  {
    id: 'c2',
    date: '2026-05-11',
    mood: 'steady',
    energy: 4,
    reflection: 'A focused block early in the day made everything easier.',
  },
  {
    id: 'c3',
    date: '2026-05-10',
    mood: 'bright',
    energy: 5,
    reflection: 'Walking outside reset my head better than scrolling did.',
  },
  {
    id: 'c4',
    date: '2026-05-09',
    mood: 'tired',
    energy: 2,
    reflection: 'Lower energy, but still showed up gently.',
  },
]
