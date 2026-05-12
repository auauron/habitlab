import {
  BookOpen,
  Check,
  Circle,
  Droplets,
  Footprints,
  Moon,
  Sparkles,
  Timer,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  calculateCompletionPercent,
  getTodayHabitRows,
} from '../domain'
import { formatLongDate } from '../backend'
import { useHabitLab } from '../HabitLabProvider'
import type { HabitLogStatus, Mood } from '../types'
import AppShell from './AppShell'
import AuthPanel from './AuthPanel'
import GlassCard from './GlassCard'

const iconMap = {
  BookOpen,
  Droplets,
  Footprints,
  Sparkles,
  Timer,
}

const moods: Array<{ value: Mood; label: string }> = [
  { value: 'clear', label: 'Clear' },
  { value: 'steady', label: 'Steady' },
  { value: 'bright', label: 'Bright' },
  { value: 'tired', label: 'Tired' },
  { value: 'heavy', label: 'Heavy' },
]

export default function TodayView() {
  const {
    checkins,
    error,
    habits,
    isLoading,
    isSignedIn,
    logs,
    notice,
    saveCheckin,
    setHabitStatus,
    today,
  } = useHabitLab()
  const [mood, setMood] = useState<Mood>('clear')
  const [energy, setEnergy] = useState(4)
  const [reflection, setReflection] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const currentCheckin = checkins.find((entry) => entry.date === today)

  const rows = getTodayHabitRows({
    date: today,
    habits,
    logs,
  })
  const completion = calculateCompletionPercent(rows)
  const completed = rows.filter((row) => row.status === 'complete').length

  useEffect(() => {
    setMood(currentCheckin?.mood ?? 'clear')
    setEnergy(currentCheckin?.energy ?? 4)
    setReflection(currentCheckin?.reflection ?? '')
  }, [currentCheckin])

  async function cycleStatus(habitId: string, status: HabitLogStatus) {
    const next =
      status === 'pending'
        ? 'complete'
        : status === 'complete'
          ? 'skip'
          : 'pending'

    await setHabitStatus(habitId, today, next)
  }

  async function handleSave() {
    setIsSaving(true)
    await saveCheckin(today, { mood, energy, reflection })
    setIsSaving(false)
  }

  return (
    <AppShell
      eyebrow="Today check-in"
      title="Good morning"
      subtitle="Move through the day gently: complete what matters, notice your energy, and leave one honest note."
    >
      {!isSignedIn ? <AuthPanel /> : null}
      {isSignedIn && isLoading ? (
        <GlassCard className="state-card p-5 sm:p-6">Loading your Supabase workspace...</GlassCard>
      ) : null}
      {isSignedIn && error ? (
        <GlassCard className="state-card p-5 sm:p-6 error-state">{error}</GlassCard>
      ) : null}
      {isSignedIn && notice ? (
        <p className="status-message is-ok app-notice">{notice}</p>
      ) : null}
      {isSignedIn && !isLoading ? (
        <div className="today-grid">
        <GlassCard className="hero-checkin p-6 sm:p-8" tone="blue">
          <div className="hero-copy">
            <p className="eyebrow">{formatLongDate(today)}</p>
            <h2>{completion}% complete</h2>
            <p>
              {rows.length > 0
                ? `${completed} of ${rows.length} habits are complete. Keep the pace calm; consistency counts more than intensity.`
                : 'No active habits yet. Add your first real habit in Supabase from the Habits screen.'}
            </p>
          </div>
          <div
            className="progress-orb"
            style={{
              background: `conic-gradient(var(--blue) ${completion}%, rgba(255,255,255,.44) 0)`,
            }}
          >
            <div>
              <strong>{completed}</strong>
              <span>done</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5 sm:p-6">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Habits</p>
              <h2>Today&apos;s rhythm</h2>
            </div>
            <span className="soft-badge">{rows.length} active</span>
          </div>

          <div className="habit-list">
            {rows.length === 0 ? (
              <div className="empty-state">
                <BookOpen size={22} />
                <p>Create your first habit on the Habits screen to start tracking real backend rows.</p>
              </div>
            ) : null}
            {rows.map(({ habit, status }) => {
              const Icon = iconMap[habit.icon as keyof typeof iconMap] ?? Sparkles
              return (
                <button
                  key={habit.id}
                  type="button"
                  className={`habit-row status-${status}`}
                  onClick={() => cycleStatus(habit.id, status)}
                >
                  <span className="habit-icon">
                    <Icon size={20} strokeWidth={2.15} />
                  </span>
                  <span>
                    <strong>{habit.name}</strong>
                    <small>
                      {status === 'complete'
                        ? 'Complete'
                        : status === 'skip'
                          ? 'Skipped with intention'
                          : 'Tap to complete'}
                    </small>
                  </span>
                  <span className="habit-state">
                    {status === 'complete' ? <Check size={18} /> : <Circle size={18} />}
                  </span>
                </button>
              )
            })}
          </div>
        </GlassCard>

        <GlassCard className="p-5 sm:p-6">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Mood</p>
              <h2>How are you arriving?</h2>
            </div>
            <Moon size={22} />
          </div>

          <div className="mood-grid">
            {moods.map((item) => (
              <button
                key={item.value}
                type="button"
                className={item.value === mood ? 'mood-chip is-selected' : 'mood-chip'}
                onClick={() => setMood(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <label className="energy-control">
            <span>Energy</span>
            <input
              type="range"
              min="1"
              max="5"
              value={energy}
              onChange={(event) => setEnergy(Number(event.target.value))}
            />
            <strong>{energy}/5</strong>
          </label>
        </GlassCard>

        <GlassCard className="reflection-card p-5 sm:p-6" tone="strong">
          <p className="eyebrow">Reflection</p>
          <h2>What would make today feel meaningful?</h2>
          <textarea
            value={reflection}
            onChange={(event) => setReflection(event.target.value)}
            rows={5}
          />
          <button
            type="button"
            className="primary-action"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : "Save today's check-in"}
          </button>
        </GlassCard>
        </div>
      ) : null}
    </AppShell>
  )
}
