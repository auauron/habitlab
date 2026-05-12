import { KeyRound, Palette, ShieldCheck } from 'lucide-react'
import { useHabitLab } from '../HabitLabProvider'
import AppShell from './AppShell'
import AuthPanel from './AuthPanel'
import GlassCard from './GlassCard'

export default function SettingsView() {
  const {
    checkins,
    habits,
    isConfigured,
    isSignedIn,
    logs,
    signOut,
    userLabel,
  } = useHabitLab()

  return (
    <AppShell
      eyebrow="Personal setup"
      title="Settings"
      subtitle="Profile, theme, and Supabase connection status for your private HabitLab workspace."
    >
      {!isSignedIn ? <AuthPanel /> : null}
      <div className="content-grid">
        <GlassCard className="p-5 sm:p-6" tone="blue">
          <p className="eyebrow">Profile</p>
          <h2 className="panel-title">{isSignedIn ? userLabel : 'Not signed in'}</h2>
          <p className="panel-copy">
            {isSignedIn
              ? `${habits.length} habits · ${logs.length} logs · ${checkins.length} reflections`
              : 'Sign in to read and write your Supabase-backed personal workspace.'}
          </p>
          {isSignedIn ? (
            <button type="button" className="secondary-action settings-signout" onClick={signOut}>
              Sign out
            </button>
          ) : null}
        </GlassCard>

        <GlassCard className="p-5 sm:p-6">
          <div className="settings-list">
            <article>
              <Palette size={22} />
              <div>
                <h3>Theme</h3>
                <p>Liquid Calm glassy blue, responsive across phone and desktop.</p>
              </div>
            </article>
            <article>
              <ShieldCheck size={22} />
              <div>
                <h3>Privacy</h3>
                <p>Every persisted row is protected by owner-only Supabase RLS.</p>
              </div>
            </article>
            <article>
              <KeyRound size={22} />
              <div>
                <h3>Backend</h3>
                <p>
                  {isConfigured
                    ? 'Supabase environment variables are configured.'
                    : 'Supabase environment variables are missing.'}
                </p>
              </div>
            </article>
          </div>
        </GlassCard>
      </div>
    </AppShell>
  )
}
