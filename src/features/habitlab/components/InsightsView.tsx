import { TrendingUp } from 'lucide-react'
import {
  buildWeeklySummary,
  calculateCurrentStreak,
  getTodayHabitRows,
} from '../domain'
import { useHabitLab } from '../HabitLabProvider'
import AppShell from './AppShell'
import AuthPanel from './AuthPanel'
import GlassCard from './GlassCard'

export default function InsightsView() {
  const { checkins, error, habits, isLoading, isSignedIn, logs, today } =
    useHabitLab()
  const summary = buildWeeklySummary({
    endDate: today,
    habits,
    logs,
    checkins,
  })
  const average = Math.round(
    summary.length > 0
      ? summary.reduce((total, day) => total + day.completionPercent, 0) /
          summary.length
      : 0,
  )
  const bestDay = summary.reduce((best, day) =>
    day.completionPercent > best.completionPercent ? day : best,
  )
  const todayRows = getTodayHabitRows({ date: today, habits, logs })
  const nextFocus = todayRows.find((row) => row.status === 'pending')
  const mostStable = habits
    .map((habit) => ({
      habit,
      streak: calculateCurrentStreak({ habitId: habit.id, throughDate: today, logs }),
    }))
    .sort((a, b) => b.streak - a.streak)[0]
  const latestCheckin = checkins[0]

  return (
    <AppShell
      eyebrow="Gentle patterns"
      title="Insights"
      subtitle="A soft weekly readout: enough signal to learn from yourself, not enough pressure to turn life into a chart."
    >
      {!isSignedIn ? <AuthPanel /> : null}
      {isSignedIn && isLoading ? (
        <GlassCard className="state-card p-5 sm:p-6">Loading Supabase insights...</GlassCard>
      ) : null}
      {isSignedIn && error ? (
        <GlassCard className="state-card p-5 sm:p-6 error-state">{error}</GlassCard>
      ) : null}
      {isSignedIn && !isLoading ? (
      <div className="content-grid">
        <GlassCard className="p-5 sm:p-6" tone="blue">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Week</p>
              <h2>{average}% average completion</h2>
            </div>
            <TrendingUp size={24} />
          </div>
          <div className="week-bars">
            {summary.map((day) => (
              <div key={day.date} className="week-bar">
                <span
                  style={{ height: `${Math.max(day.completionPercent, 8)}%` }}
                />
                <small>
                  {new Date(`${day.date}T00:00:00Z`).toLocaleDateString('en', {
                    weekday: 'short',
                  })}
                </small>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5 sm:p-6">
          <div className="metric-grid">
            <article>
              <span>Best day</span>
              <strong>{bestDay.completionPercent}%</strong>
              <p>{bestDay.date}</p>
            </article>
            <article>
              <span>Current mood</span>
              <strong>{latestCheckin?.mood ?? 'None'}</strong>
              <p>
                {latestCheckin
                  ? `Energy ${latestCheckin.energy}/5 from ${latestCheckin.date}.`
                  : 'Save a check-in to track mood.'}
              </p>
            </article>
            <article>
              <span>Most stable</span>
              <strong>{mostStable?.habit.name ?? 'None'}</strong>
              <p>{mostStable ? `${mostStable.streak} day streak.` : 'Complete habits to build a streak.'}</p>
            </article>
            <article>
              <span>Next focus</span>
              <strong>{nextFocus?.habit.name ?? 'Clear'}</strong>
              <p>{nextFocus ? 'One small completion is enough.' : 'No pending habits today.'}</p>
            </article>
          </div>
        </GlassCard>
      </div>
      ) : null}
    </AppShell>
  )
}
