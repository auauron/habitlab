import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Sparkles } from 'lucide-react'
import GlassCard from '../features/habitlab/components/GlassCard'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="welcome-screen">
      <GlassCard className="welcome-card" tone="blue">
        <span className="brand-orb">
          <Sparkles size={22} strokeWidth={2.2} />
        </span>
        <p className="eyebrow">HabitLab</p>
        <h1>Your calm daily ritual, held in glass and light.</h1>
        <p>
          Track habits, mood, energy, and one honest reflection without turning
          your day into a scoreboard.
        </p>
        <Link to="/today" className="primary-action welcome-action">
          Open today
          <ArrowRight size={18} strokeWidth={2.2} />
        </Link>
      </GlassCard>
    </main>
  )
}
