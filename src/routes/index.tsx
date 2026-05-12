import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Database, LockKeyhole, Sparkles, Waves } from 'lucide-react'
import { calculateCompletionPercent, getTodayHabitRows } from '../features/habitlab/domain'
import { useHabitLab } from '../features/habitlab/HabitLabProvider'
import AuthPanel from '../features/habitlab/components/AuthPanel'
import GlassCard from '../features/habitlab/components/GlassCard'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const { checkins, habits, isSignedIn, logs, today } = useHabitLab()
  const rows = getTodayHabitRows({ date: today, habits, logs })
  const completion = calculateCompletionPercent(rows)
  const latestCheckin = checkins[0]

  return (
    <main className="landing-page">
      <section className="landing-hero">
        <div className="landing-copy">
          <span className="landing-brand">
            <span className="brand-orb">
              <Sparkles size={20} strokeWidth={2.2} />
            </span>
            HabitLab
          </span>
          <p className="eyebrow">Personal habit studio</p>
          <h1>A calmer command center for the rituals that keep you clear.</h1>
          <p>
            HabitLab is now wired to your Supabase backend: habits, check-ins,
            reflections, and streaks come from your private database instead of
            sample data.
          </p>
          <div className="landing-actions">
            <Link id="open-today-link" to="/today" className="primary-action">
              Open today
              <ArrowRight size={18} strokeWidth={2.2} />
            </Link>
            <Link id="shape-habits-link" to="/habits" className="secondary-action">
              Shape habits
            </Link>
          </div>
        </div>

        <div className="landing-stage" aria-label="HabitLab live preview">
          <GlassCard className="landing-device" tone="blue">
            <div className="device-top">
              <span />
              <strong>{completion}%</strong>
            </div>
            <div className="device-orb">
              <Waves size={34} />
              <span>Today</span>
            </div>
            <div className="device-lines">
              {rows.slice(0, 4).map((row) => (
                <span key={row.habit.id} className={`line-${row.status}`}>
                  <i />
                  {row.habit.name}
                </span>
              ))}
              {rows.length === 0 ? (
                <span>
                  <i />
                  No habits yet
                </span>
              ) : null}
            </div>
          </GlassCard>

          <GlassCard className="landing-stat top-stat">
            <Database size={20} />
            <strong>{habits.length}</strong>
            <span>backend habits</span>
          </GlassCard>
          <GlassCard className="landing-stat bottom-stat">
            <LockKeyhole size={20} />
            <strong>{isSignedIn ? 'RLS' : 'Auth'}</strong>
            <span>{isSignedIn ? 'private rows' : 'sign in required'}</span>
          </GlassCard>
        </div>
      </section>

      <section className="landing-panel-row">
        {isSignedIn ? (
          <GlassCard className="landing-live-panel" tone="strong">
            <p className="eyebrow">Live backend state</p>
            <h2>
              {rows.length > 0
                ? `${rows.filter((row) => row.status === 'complete').length} of ${rows.length} done today`
                : 'Your backend is ready for the first habit'}
            </h2>
            <p>
              {latestCheckin?.reflection ||
                'Create a habit, check it off, and your real Supabase rows will appear here.'}
            </p>
          </GlassCard>
        ) : (
          <AuthPanel compact />
        )}
      </section>
    </main>
  )
}
