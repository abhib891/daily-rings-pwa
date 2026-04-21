import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { AppMark } from './components/AppMark'
import { AuthPanel } from './components/AuthPanel'
import { Ring } from './components/Ring'
import {
  dedupeHabits,
  ensureDefaultHabits,
  fetchEntriesFromCloud,
  fetchHabitsFromCloud,
  updateHabitNameCloud,
  upsertDayEntry,
} from './lib/cloudData'
import { addDays, localDateString, parseDate } from './lib/dates'
import { fetchDailyQuote, type DailyQuote } from './lib/dailyQuote'
import { firstNameFromUser } from './lib/greeting'
import { getSupabase } from './lib/supabaseClient'
import {
  doubleMissRisk,
  emptySyncedShell,
  isCompleted,
  loadState,
  renameHabit,
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

function MotivationQuote({
  quote,
  loading,
}: {
  quote: DailyQuote | null
  loading: boolean
}) {
  return (
    <aside className="app-quote" aria-label="Daily quote">
      {loading || !quote ? (
        <p className="app-quote-loading">Loading today’s quote…</p>
      ) : (
        <>
          <blockquote className="app-quote-text">“{quote.text}”</blockquote>
          <cite className="app-quote-author">— {quote.author}</cite>
        </>
      )}
    </aside>
  )
}

function NeverMissTwiceNote({ centered = false }: { centered?: boolean }) {
  return (
    <p
      className={`app-bottom-reminder${centered ? ' app-bottom-reminder--center' : ''}`}
    >
      <strong>Never Miss Twice Nudge:</strong>{' '}
      <em>
        Once you have a little history, if you missed a habit yesterday the app highlights that ring as
        an in-app reminder so you are less likely to miss two days in a row. (No email or push
        notifications.)
      </em>
    </p>
  )
}

export default function App() {
  const supabase = useMemo(() => getSupabase(), [])
  const [session, setSession] = useState<Session | null>(null)
  const [authReady, setAuthReady] = useState(!supabase)
  const [state, setState] = useState<AppState>(() =>
    supabase ? emptySyncedShell() : loadState(),
  )
  const [cloudBusy, setCloudBusy] = useState(false)
  const [cloudError, setCloudError] = useState<string | null>(null)
  const [dailyQuote, setDailyQuote] = useState<DailyQuote | null>(null)
  const [quoteLoading, setQuoteLoading] = useState(true)

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
      await dedupeHabits(supabase)
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

  useEffect(() => {
    const ac = new AbortController()
    let cancelled = false
    setQuoteLoading(true)
    void fetchDailyQuote(ac.signal).then((q) => {
      if (!cancelled) {
        setDailyQuote(q)
        setQuoteLoading(false)
      }
    })
    return () => {
      cancelled = true
      ac.abort()
    }
  }, [])

  const today = useMemo(() => localDateString(), [])
  const days = useMemo(() => weekDates(today), [today])

  const sortedHabits = useMemo(
    () => [...state.habits].sort((a, b) => a.sortOrder - b.sortOrder),
    [state.habits],
  )

  const greetingName = useMemo(
    () => (session?.user ? firstNameFromUser(session.user) : ''),
    [session?.user],
  )

  const applyToggle = useCallback(
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

  const requestToggle = useCallback(
    (habitId: string, habitName: string) => {
      const cur = isCompleted(state, habitId, today)
      if (!cur) {
        const dateStr = parseDate(today).toLocaleDateString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
        const ok = window.confirm(
          `Are you sure you completed “${habitName}” for ${dateStr}?`,
        )
        if (!ok) return
      }
      void applyToggle(habitId)
    },
    [state, today, applyToggle],
  )

  const commitRename = useCallback(
    async (habitId: string, name: string) => {
      const trimmed = name.trim()
      if (!trimmed) return
      const habit = state.habits.find((h) => h.id === habitId)
      if (!habit || habit.name === trimmed) return

      if (useCloud && supabase && session) {
        try {
          await updateHabitNameCloud(
            supabase,
            session.user.id,
            habitId,
            trimmed,
          )
          setState((s) => renameHabit(s, habitId, trimmed))
        } catch (err) {
          setCloudError(
            err instanceof Error ? err.message : 'Could not rename habit',
          )
          await reloadCloud()
        }
        return
      }

      setState((s) => renameHabit(s, habitId, trimmed))
    },
    [state, useCloud, supabase, session, reloadCloud],
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
          <div className="app-brand">
            <AppMark />
            <div className="app-header-main">
              <div className="app-header-title-row">
                <div className="app-brand-text">
                  <h1 className="app-title">Activity Tracker</h1>
                  <p className="app-sub">Habits that follow you everywhere</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        <MotivationQuote quote={dailyQuote} loading={quoteLoading} />
        <AuthPanel supabase={supabase} />
        <p className="app-footnote">
          <Link to="/install" className="app-footnote-link">
            Install on iPhone or Android
          </Link>
        </p>
        <p className="app-footnote app-footnote--tight">
          Configure <code>VITE_SUPABASE_URL</code> and{' '}
          <code>VITE_SUPABASE_ANON_KEY</code> on your host (e.g. Vercel) and allow
          this URL in Supabase Auth redirect settings.
        </p>
        <NeverMissTwiceNote centered />
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-brand">
          <AppMark />
          <div className="app-header-main">
            <div className="app-header-title-row">
              <div className="app-brand-text">
                <h1 className="app-title">Activity Tracker</h1>
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
          </div>
        </div>
        <p className="app-hint">{hint}</p>
        {useCloud && session?.user && (
          <section
            className="app-greeting-card"
            role="status"
            aria-label={`Welcome, ${greetingName}. How are you doing today?`}
          >
            <p className="app-greeting-lead">
              Welcome, <span className="app-greeting-name">{greetingName}</span>
            </p>
            <p className="app-greeting-sub">How are you doing today?</p>
          </section>
        )}
        <MotivationQuote quote={dailyQuote} loading={quoteLoading} />
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

      <div className="app-body">
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
                onToggle={() => requestToggle(h.id, h.name)}
                onRename={(name) => void commitRename(h.id, name)}
              />
            )
          })}
        </section>

        <div className="app-body-side">
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

          <footer className="app-bottom">
            <NeverMissTwiceNote />
            <p className="app-bottom-note">
              <Link to="/install" className="app-bottom-note-link">
                Install on iPhone or Android
              </Link>
              <span aria-hidden="true"> · </span>
              Daily quotes load from{' '}
              <a href="https://github.com/lukePeavey/quotable" target="_blank" rel="noreferrer">
                Quotable
              </a>{' '}
              when you are online; otherwise a built-in list is used.
            </p>
          </footer>
        </div>
      </div>
    </div>
  )
}
