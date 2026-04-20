import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from 'react'
import { Ring } from './components/Ring'
import { addDays, localDateString, parseDate } from './lib/dates'
import {
  addHabit,
  doubleMissRisk,
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
  const [state, setState] = useState<AppState>(() => loadState())
  const [newName, setNewName] = useState('')

  useEffect(() => {
    saveState(state)
  }, [state])

  const today = useMemo(() => localDateString(), [])
  const days = useMemo(() => weekDates(today), [today])

  const sortedHabits = useMemo(
    () => [...state.habits].sort((a, b) => a.sortOrder - b.sortOrder),
    [state.habits],
  )

  const toggle = useCallback((habitId: string) => {
    setState((s) => {
      const cur = isCompleted(s, habitId, today)
      return setCompleted(s, habitId, today, !cur)
    })
  }, [today])

  const submitHabit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      setState((s) => addHabit(s, newName))
      setNewName('')
    },
    [newName],
  )

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Daily Rings</h1>
        <p className="app-sub">
          Today ·{' '}
          {parseDate(today).toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
          })}
        </p>
        <p className="app-hint">
          Tap a ring to log today. Data stays in this browser only.
        </p>
      </header>

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
              onToggle={() => toggle(h.id)}
            />
          )
        })}
      </section>

      <form className="add-habit" onSubmit={submitHabit}>
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
        <button type="submit" className="add-habit-btn" disabled={!newName.trim()}>
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
