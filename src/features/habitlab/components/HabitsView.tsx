import { Archive, Bell, Plus, Sparkles } from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { calculateCurrentStreak } from '../domain'
import { useHabitLab } from '../HabitLabProvider'
import type { HabitCadence } from '../types'
import AppShell from './AppShell'
import AuthPanel from './AuthPanel'
import GlassCard from './GlassCard'

const iconOptions = ['Sparkles', 'Droplets', 'Footprints', 'BookOpen', 'Timer']
const colorOptions = ['sky', 'blue', 'cyan', 'violet']

export default function HabitsView() {
  const {
    addHabit,
    archiveHabit,
    error,
    habits,
    isLoading,
    isSignedIn,
    logs,
    today,
  } = useHabitLab()
  const [name, setName] = useState('')
  const [cadence, setCadence] = useState<HabitCadence>('daily')
  const [icon, setIcon] = useState('Sparkles')
  const [color, setColor] = useState('sky')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)
    await addHabit({
      name: name.trim(),
      cadence,
      icon,
      color,
    })
    setName('')
    setIsSubmitting(false)
  }

  return (
    <AppShell
      eyebrow="Habit design"
      title="Habits"
      subtitle="Shape the rituals that make your day feel lighter, clearer, and more intentional."
    >
      {!isSignedIn ? <AuthPanel /> : null}
      {isSignedIn && isLoading ? (
        <GlassCard className="state-card p-5 sm:p-6">Loading habits from Supabase...</GlassCard>
      ) : null}
      {isSignedIn && error ? (
        <GlassCard className="state-card p-5 sm:p-6 error-state">{error}</GlassCard>
      ) : null}
      {isSignedIn && !isLoading ? (
      <div className="content-grid">
        <GlassCard className="p-5 sm:p-6" tone="blue">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Active habits</p>
              <h2>Your rhythm</h2>
            </div>
            <span className="soft-badge">{habits.length} habits</span>
          </div>
          <div className="management-list">
            {habits.length === 0 ? (
              <div className="empty-state">
                <Sparkles size={22} />
                <p>No backend habits yet. Add one and it will be inserted into Supabase.</p>
              </div>
            ) : null}
            {habits.map((habit) => (
              <article key={habit.id} className="management-row">
                <span className={`color-well color-${habit.color}`} />
                <div>
                  <h3>{habit.name}</h3>
                  <p>
                    {habit.cadence} cadence ·{' '}
                    {calculateCurrentStreak({
                      habitId: habit.id,
                      throughDate: today,
                      logs,
                    })}{' '}
                    day streak
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={`Archive ${habit.name}`}
                  onClick={() => archiveHabit(habit.id)}
                >
                  <Archive size={18} />
                </button>
              </article>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5 sm:p-6">
          <p className="eyebrow">Create</p>
          <h2 className="panel-title">New habit</h2>
          <form className="habit-form" onSubmit={handleSubmit}>
            <label>
              Name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Evening screen sunset"
                maxLength={120}
              />
            </label>
            <label>
              Frequency
              <select
                value={cadence}
                onChange={(event) => setCadence(event.target.value as HabitCadence)}
              >
                <option value="daily">Daily</option>
                <option value="weekdays">Weekdays</option>
                <option value="weekly">Weekly</option>
              </select>
            </label>
            <label>
              Icon
              <select value={icon} onChange={(event) => setIcon(event.target.value)}>
                {iconOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Color
              <select value={color} onChange={(event) => setColor(event.target.value)}>
                {colorOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="primary-action" disabled={isSubmitting}>
              <Plus size={18} />
              {isSubmitting ? 'Adding...' : 'Add habit'}
            </button>
          </form>
        </GlassCard>

        <GlassCard className="p-5 sm:p-6" tone="strong">
          <div className="mini-panel">
            <Bell size={24} />
            <div>
              <h2>Gentle reminders</h2>
              <p>
                HabitLab will favor quiet nudges and forgiving language over
                pressure, guilt, or noisy streak chasing.
              </p>
            </div>
          </div>
          <div className="mini-panel">
            <Sparkles size={24} />
            <div>
              <h2>Personal tuning</h2>
              <p>
                Every habit can have its own icon, color, cadence, and archive
                state. Changes are now persisted in Supabase.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
      ) : null}
    </AppShell>
  )
}
