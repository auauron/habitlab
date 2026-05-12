import { TrendingUp } from 'lucide-react'
import { buildWeeklySummary } from '../domain'
import { demoCheckins, demoHabits, demoLogs, demoToday } from '../demoData'
import AppShell from './AppShell'
import GlassCard from './GlassCard'

const summary = buildWeeklySummary({
  endDate: demoToday,
  habits: demoHabits,
  logs: demoLogs,
  checkins: demoCheckins,
})

export default function InsightsView() {
  const average = Math.round(
    summary.reduce((total, day) => total + day.completionPercent, 0) /
      summary.length,
  )
  const bestDay = summary.reduce((best, day) =>
    day.completionPercent > best.completionPercent ? day : best,
  )

  return (
    <AppShell
      eyebrow="Gentle patterns"
      title="Insights"
      subtitle="A soft weekly readout: enough signal to learn from yourself, not enough pressure to turn life into a chart."
    >
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
              <strong>Clear</strong>
              <p>Energy is trending steady.</p>
            </article>
            <article>
              <span>Most stable</span>
              <strong>Hydrate</strong>
              <p>Three complete days in a row.</p>
            </article>
            <article>
              <span>Next focus</span>
              <strong>Walk</strong>
              <p>Protect a small outdoor reset.</p>
            </article>
          </div>
        </GlassCard>
      </div>
    </AppShell>
  )
}
