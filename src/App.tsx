import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from 'react'
import type { Session } from '@supabase/supabase-js'
import { AuthPanel } from './components/AuthPanel'
import { Ring } from './components/Ring'
import {
  ensureDefaultHabits,
  fetchEntriesFromCloud,
  fetchHabitsFromCloud,
  insertHabitCloud,
  upsertDayEntry,
} from './lib/cloudData'
import { addDays, localDateString, parseDate } from './lib/dates'
import { getSupabase } from './lib/supabaseClient'
import {
  addHabit,
  doubleMissRisk,
  emptySyncedShell,
  isCompleted,
  loadState,
  saveState,
  setCompleted,
  type AppState,
} from './lib/storage'
import './App.css'

const ACCENTS = ['#ff375f', '#30d158', '#0a84ff', '#bf5af2', '#ff9f0a']

function weekDates(endingOn: string): string[] {
  const out: string[] = []
  for (let i = 6; i >= 0; i -= 1) {
    out.push(addDays(endingOn, -i))
  }
  return out
}

function weekdayShort(dateStr: string): string {
  return parseDate(dateStr).toLocaleDateString(undefined, { weekday: 'narrow' })
}

export default function App() {
  const supabase = useMemo(() => getSupabase(), [])
  const [session, setSession] = useState<Session | null>(null)
  const [authReady, setAuthReady] = useState(!supabase)
  const [state, setState] = useState<AppState>(() =>
    supabase ? emptySyncedShell() : loadState(),
  )
  const [newName, setNewName] = useState('')
  const [cloudBusy, setCloudBusy] = useState(false)
  const [cloudError, setCloudError] = useState<string | null>(null)

  const useCloud = Boolean(supabase && session)
  const useLocal = !supabase

  useEffect(() => {
    if (!supabase) return
    let cancelled = false
    void supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!cancelled) {
        setSession(s)
        setAuthReady(true)
      }
    })
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })
    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [supabase])

  const reloadCloud = useCallback(async () => {
    if (!supabase || !session?.user.id) return
    setCloudError(null)
    setCloudBusy(true)
    try {
      await ensureDefaultHabits(supabase)
      const habits = await fetchHabitsFromCloud(supabase, session.user.id)
      const from = addDays(localDateString(), -120)
      const to = localDateString()
      const entries = await fetchEntriesFromCloud(
        supabase,
        session.user.id,
        from,
        to,
      )
      setState({ habits, entries })
    } catch (e) {
      setCloudError(e instanceof Error ? e.message : 'Could not load cloud data')
    } finally {
      setCloudBusy(false)
    }
  }, [supabase, session])

  useEffect(() => {
    if (!useCloud) return
    let cancelled = false
    void Promise.resolve().then(async () => {
      if (cancelled) return
      await reloadCloud()
    })
    return () => {
      cancelled = true
    }
  }, [useCloud, reloadCloud])

  useEffect(() => {
    if (useLocal) saveState(state)
  }, [state, useLocal])

  const today = useMemo(() => localDateString(), [])
  const days = useMemo(() => weekDates(today), [today])

  const sortedHabits = useMemo(
    () => [...state.habits].sort((a, b) => a.sortOrder - b.sortOrder),
    [state.habits],
  )

  const toggle = useCallback(
    async (habitId: string) => {
      const cur = isCompleted(state, habitId, today)
      const next = !cur
      if (useCloud && supabase && session) {
        setState((s) => setCompleted(s, habitId, today, next))
        try {
          await upsertDayEntry(
            supabase,
            session.user.id,
            habitId,
            today,
            next,
          )
        } catch {
          await reloadCloud()
        }
        return
      }
      setState((s) => setCompleted(s, habitId, today, next))
    },
    [state, today, useCloud, supabase, session, reloadCloud],
  )

  const submitHabit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      const trimmed = newName.trim()
      if (!trimmed) return

      if (useCloud && supabase && session) {
        const maxOrder = Math.max(-1, ...state.habits.map((h) => h.sortOrder))
        try {
          const h = await insertHabitCloud(
            supabase,
            session.user.id,
            trimmed,
            maxOrder + 1,
          )
          setState((s) => ({
            ...s,
            habits: [...s.habits, h].sort((a, b) => a.sortOrder - b.sortOrder),
          }))
          setNewName('')
        } catch (err) {
          setCloudError(
            err instanceof Error ? err.message : 'Could not add habit',
          )
        }
        return
      }

      setState((s) => addHabit(s, trimmed))
      setNewName('')
    },
    [newName, state.habits, useCloud, supabase, session],
  )

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut()
    setState(loadState())
    setCloudError(null)
  }, [supabase])

  const hint = useCloud
    ? 'Signed in — changes sync to your account on every device.'
    : supabase
      ? 'Sign in once to sync rings across phone, laptop, and browsers.'
      : import.meta.env.PROD
        ? 'Cloud not configured in this build — data stays in this browser only. In Vercel → Settings → Environment Variables, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY for Production, then Redeploy (use “Redeploy” without cache if unsure).'
        : 'Cloud not configured — copy .env.example to .env with your Supabase URL and anon/publishable key, then restart npm run dev.'

  if (supabase && !authReady) {
    return (
      <div className="app app--center">
        <p className="app-loading">Loading…</p>
      </div>
    )
  }

  if (supabase && !session) {
    return (
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">Daily Rings</h1>
          <p className="app-sub">Habits that follow you everywhere</p>
        </header>
        <AuthPanel supabase={supabase} />
        <p className="app-footnote">
          Configure <code>VITE_SUPABASE_URL</code> and{' '}
          <code>VITE_SUPABASE_ANON_KEY</code> on your host (e.g. Vercel) and allow
          this URL in Supabase Auth redirect settings.
        </p>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-row">
          <div>
            <h1 className="app-title">Daily Rings</h1>
            <p className="app-sub">
              Today ·{' '}
              {parseDate(today).toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
          {useCloud && session?.user && (
            <div className="app-session">
              <span className="app-session-email" title={session.user.email ?? ''}>
                {session.user.email ?? session.user.id.slice(0, 8)}
              </span>
              <button type="button" className="sign-out-btn" onClick={() => void signOut()}>
                Sign out
              </button>
            </div>
          )}
        </div>
        <p className="app-hint">{hint}</p>
      </header>

      {cloudError && (
        <p className="app-error" role="alert">
          {cloudError}{' '}
          {useCloud && (
            <button type="button" className="link-btn" onClick={() => void reloadCloud()}>
              Retry
            </button>
          )}
        </p>
      )}

      {cloudBusy && useCloud && (
        <p className="app-loading-inline" aria-live="polite">
          Syncing…
        </p>
      )}

      <section className="rings-row" aria-label="Today’s habits">
        {sortedHabits.map((h, i) => {
          const closed = isCompleted(state, h.id, today)
          const risk = doubleMissRisk(state, h.id, today)
          const accent = ACCENTS[i % ACCENTS.length]
          const track = 'var(--ring-track-muted)'
          return (
            <Ring
              key={h.id}
              label={h.name}
              closed={closed}
              atRisk={risk && !closed}
              accent={accent}
              track={track}
              onToggle={() => void toggle(h.id)}
            />
          )
        })}
      </section>

      <form className="add-habit" onSubmit={(e) => void submitHabit(e)}>
        <label htmlFor="habit-name" className="sr-only">
          New habit name
        </label>
        <input
          id="habit-name"
          className="add-habit-input"
          placeholder="Add a habit…"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          maxLength={80}
        />
        <button type="submit" className="add-habit-btn" disabled={!newName.trim() || cloudBusy}>
          Add
        </button>
      </form>

      <section className="week-panel" aria-label="Last seven days">
        <h2 className="week-title">Past week</h2>
        <div className="week-table">
          <div className="week-head">
            <span className="week-corner" />
            {days.map((d) => (
              <span key={d} className="week-dow" title={d}>
                {weekdayShort(d)}
              </span>
            ))}
          </div>
          {sortedHabits.map((h) => (
            <div key={h.id} className="week-row">
              <span className="week-habit-name">{h.name}</span>
              {days.map((d) => {
                const done = isCompleted(state, h.id, d)
                const isToday = d === today
                return (
                  <span
                    key={d}
                    className={`week-cell${done ? ' week-cell--done' : ''}${isToday ? ' week-cell--today' : ''}`}
                    title={`${h.name} · ${d}`}
                    aria-label={`${h.name} ${d}: ${done ? 'done' : 'not done'}`}
                  >
                    {done ? '●' : '○'}
                  </span>
                )
              })}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
