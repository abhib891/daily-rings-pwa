import { useState, type FormEvent } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import './AuthPanel.css'

type AuthPanelProps = {
  supabase: SupabaseClient
}

export function AuthPanel({ supabase }: AuthPanelProps) {
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const redirectTo = `${window.location.origin}${window.location.pathname}`

  async function sendMagicLink(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    const trimmed = email.trim()
    if (!trimmed) return
    setBusy(true)
    const { error: err } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: { emailRedirectTo: redirectTo },
    })
    setBusy(false)
    if (err) {
      setError(err.message)
      return
    }
    setMessage('Check your email for a sign-in link.')
  }

  async function signInWithGoogle() {
    setError(null)
    setMessage(null)
    setBusy(true)
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    })
    setBusy(false)
    if (err) setError(err.message)
  }

  return (
    <section className="auth-panel" aria-labelledby="auth-heading">
      <h2 id="auth-heading" className="auth-title">
        Sign in to sync everywhere
      </h2>
      <p className="auth-lead">
        One account links your rings on this phone, your laptop, and any browser
        you use with the same sign-in.
      </p>

      <button
        type="button"
        className="auth-btn auth-btn-google"
        onClick={() => void signInWithGoogle()}
        disabled={busy}
      >
        Continue with Google
      </button>

      <p className="auth-divider">or</p>

      <form className="auth-email-form" onSubmit={(e) => void sendMagicLink(e)}>
        <label htmlFor="auth-email" className="auth-label">
          Email (magic link)
        </label>
        <input
          id="auth-email"
          className="auth-input"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={busy}
        />
        <button type="submit" className="auth-btn auth-btn-primary" disabled={busy || !email.trim()}>
          Send sign-in link
        </button>
      </form>

      {message && <p className="auth-msg auth-msg--ok">{message}</p>}
      {error && <p className="auth-msg auth-msg--err">{error}</p>}
    </section>
  )
}
