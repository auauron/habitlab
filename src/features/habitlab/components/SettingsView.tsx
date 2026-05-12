import { KeyRound, Palette, ShieldCheck } from 'lucide-react'
import AppShell from './AppShell'
import GlassCard from './GlassCard'

export default function SettingsView() {
  return (
    <AppShell
      eyebrow="Personal setup"
      title="Settings"
      subtitle="Profile, theme, and Supabase readiness live here once persistence is connected."
    >
      <div className="content-grid">
        <GlassCard className="p-5 sm:p-6" tone="blue">
          <p className="eyebrow">Profile</p>
          <h2 className="panel-title">Auauron</h2>
          <p className="panel-copy">
            Personal workspace · private by default · no social sharing in v1.
          </p>
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
                <p>Every persisted row will be protected by Supabase RLS.</p>
              </div>
            </article>
            <article>
              <KeyRound size={22} />
              <div>
                <h3>Auth</h3>
                <p>Supabase Auth sign-in will replace this demo profile state.</p>
              </div>
            </article>
          </div>
        </GlassCard>
      </div>
    </AppShell>
  )
}
