import { Archive, Bell, Plus, Sparkles } from 'lucide-react'
import { calculateCurrentStreak } from '../domain'
import { demoHabits, demoLogs, demoToday } from '../demoData'
import AppShell from './AppShell'
import GlassCard from './GlassCard'

export default function HabitsView() {
  return (
    <AppShell
      eyebrow="Habit design"
      title="Habits"
      subtitle="Shape the rituals that make your day feel lighter, clearer, and more intentional."
    >
      <div className="content-grid">
        <GlassCard className="p-5 sm:p-6" tone="blue">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Active habits</p>
              <h2>Your rhythm</h2>
            </div>
            <span className="soft-badge">{demoHabits.length} habits</span>
          </div>
          <div className="management-list">
            {demoHabits.map((habit) => (
              <article key={habit.id} className="management-row">
                <span className={`color-well color-${habit.color}`} />
                <div>
                  <h3>{habit.name}</h3>
                  <p>
                    {habit.cadence} cadence ·{' '}
                    {calculateCurrentStreak({
                      habitId: habit.id,
                      throughDate: demoToday,
                      logs: demoLogs,
                    })}{' '}
                    day streak
                  </p>
                </div>
                <button type="button" aria-label={`Archive ${habit.name}`}>
                  <Archive size={18} />
                </button>
              </article>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5 sm:p-6">
          <p className="eyebrow">Create</p>
          <h2 className="panel-title">New habit</h2>
          <div className="mock-form">
            <label>
              Name
              <input value="Evening screen sunset" readOnly />
            </label>
            <label>
              Frequency
              <select value="daily" readOnly>
                <option value="daily">Daily</option>
              </select>
            </label>
            <label>
              Reminder
              <input value="8:30 PM" readOnly />
            </label>
          </div>
          <button type="button" className="primary-action">
            <Plus size={18} />
            Add habit
          </button>
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
                state once Supabase persistence is connected.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </AppShell>
  )
}
