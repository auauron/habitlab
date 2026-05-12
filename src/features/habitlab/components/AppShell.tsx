import { Link } from '@tanstack/react-router'
import {
  BarChart3,
  BookOpen,
  CalendarCheck2,
  ListChecks,
  Settings,
  Sparkles,
} from 'lucide-react'
import type { ReactNode } from 'react'

const navItems = [
  { to: '/today', label: 'Today', icon: CalendarCheck2 },
  { to: '/habits', label: 'Habits', icon: ListChecks },
  { to: '/insights', label: 'Insights', icon: BarChart3 },
  { to: '/journal', label: 'Journal', icon: BookOpen },
  { to: '/settings', label: 'Settings', icon: Settings },
] as const

type AppShellProps = {
  children: ReactNode
  eyebrow?: string
  title?: string
  subtitle?: string
}

export default function AppShell({
  children,
  eyebrow = 'Personal ritual',
  title = 'HabitLab',
  subtitle = 'A calm space for habits, mood, and small reflections.',
}: AppShellProps) {
  return (
    <div className="app-shell">
      <aside className="desktop-rail">
        <Link to="/" className="brand-mark" aria-label="HabitLab home">
          <span className="brand-orb">
            <Sparkles size={18} strokeWidth={2.2} />
          </span>
          <span>
            <strong>HabitLab</strong>
            <small>Liquid Calm</small>
          </span>
        </Link>

        <nav className="rail-nav" aria-label="Primary">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="rail-link"
              activeProps={{ className: 'rail-link is-active' }}
            >
              <Icon size={19} strokeWidth={2.1} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <main className="app-main">
        <header className="app-topbar">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <Link to="/settings" className="profile-pill">
            <span className="profile-dot" />
            <span>Auauron</span>
          </Link>
        </header>

        {children}
      </main>

      <nav className="mobile-tabs" aria-label="Primary">
        {navItems.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="mobile-tab"
            activeProps={{ className: 'mobile-tab is-active' }}
          >
            <Icon size={21} strokeWidth={2.1} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
