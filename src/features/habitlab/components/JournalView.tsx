import { BookOpen } from 'lucide-react'
import { demoCheckins } from '../demoData'
import AppShell from './AppShell'
import GlassCard from './GlassCard'

export default function JournalView() {
  return (
    <AppShell
      eyebrow="Private record"
      title="Journal"
      subtitle="A quiet trail of daily reflections tied to mood, energy, and the habits you practiced."
    >
      <GlassCard className="p-5 sm:p-6" tone="strong">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Reflections</p>
            <h2>Recent entries</h2>
          </div>
          <BookOpen size={24} />
        </div>
        <div className="journal-list">
          {demoCheckins.map((entry) => (
            <article key={entry.id} className="journal-entry">
              <time>{entry.date}</time>
              <h3>{entry.mood} · energy {entry.energy}/5</h3>
              <p>{entry.reflection}</p>
            </article>
          ))}
        </div>
      </GlassCard>
    </AppShell>
  )
}
