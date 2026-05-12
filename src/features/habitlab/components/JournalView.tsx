import { BookOpen } from 'lucide-react'
import { useHabitLab } from '../HabitLabProvider'
import AppShell from './AppShell'
import AuthPanel from './AuthPanel'
import GlassCard from './GlassCard'

export default function JournalView() {
  const { checkins, error, isLoading, isSignedIn } = useHabitLab()

  return (
    <AppShell
      eyebrow="Private record"
      title="Journal"
      subtitle="A quiet trail of daily reflections tied to mood, energy, and the habits you practiced."
    >
      {!isSignedIn ? <AuthPanel /> : null}
      {isSignedIn && isLoading ? (
        <GlassCard className="state-card p-5 sm:p-6">Loading reflections from Supabase...</GlassCard>
      ) : null}
      {isSignedIn && error ? (
        <GlassCard className="state-card p-5 sm:p-6 error-state">{error}</GlassCard>
      ) : null}
      {isSignedIn && !isLoading ? (
      <GlassCard className="p-5 sm:p-6" tone="strong">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Reflections</p>
            <h2>Recent entries</h2>
          </div>
          <BookOpen size={24} />
        </div>
        <div className="journal-list">
          {checkins.length === 0 ? (
            <div className="empty-state">
              <BookOpen size={22} />
              <p>No check-ins in Supabase yet. Save today&apos;s reflection to start your journal.</p>
            </div>
          ) : null}
          {checkins.map((entry) => (
            <article key={entry.id} className="journal-entry">
              <time>{entry.date}</time>
              <h3>{entry.mood} · energy {entry.energy}/5</h3>
              <p>{entry.reflection}</p>
            </article>
          ))}
        </div>
      </GlassCard>
      ) : null}
    </AppShell>
  )
}
