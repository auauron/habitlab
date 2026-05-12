import { KeyRound, Loader2, Mail, ShieldCheck } from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { useHabitLab } from '../HabitLabProvider'
import GlassCard from './GlassCard'

type AuthPanelProps = {
  compact?: boolean
}

export default function AuthPanel({ compact = false }: AuthPanelProps) {
  const { error, isConfigured, notice, authenticate } = useHabitLab()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email.trim() || !password) return

    setIsSubmitting(true)
    await authenticate(email.trim(), password)
    setIsSubmitting(false)
  }

  return (
    <GlassCard className={compact ? 'auth-panel compact' : 'auth-panel'} tone="blue">
      <span className="auth-icon">
        <KeyRound size={22} />
      </span>
      <div>
        <p className="eyebrow">Supabase required</p>
        <h2>Sign in to load your real HabitLab data.</h2>
        <p>
          HabitLab now reads and writes through your Supabase project. No sample
          habits are shown once you enter the app.
        </p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email
          <span>
            <Mail size={17} />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              disabled={!isConfigured || isSubmitting}
            />
          </span>
        </label>
        <label>
          Password
          <span>
            <KeyRound size={17} />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your password"
              disabled={!isConfigured || isSubmitting}
            />
          </span>
        </label>
        <button
          type="submit"
          className="primary-action"
          disabled={!isConfigured || isSubmitting}
        >
          {isSubmitting ? <Loader2 className="spin" size={18} /> : <ShieldCheck size={18} />}
          Sign in / Sign up
        </button>
      </form>

      {!isConfigured ? (
        <p className="status-message is-error">Add Supabase env vars first.</p>
      ) : null}
      {notice ? <p className="status-message is-ok">{notice}</p> : null}
      {error ? <p className="status-message is-error">{error}</p> : null}
    </GlassCard>
  )
}
