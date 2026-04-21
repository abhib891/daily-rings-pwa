import { GOAL_LINE_MAX_LEN } from '../lib/goalLine'
import './GoalLineCard.css'

export type GoalSaveStatus = 'idle' | 'saving' | 'saved' | 'error'

type GoalLineCardProps = {
  value: string
  onChange: (value: string) => void
  onSave: () => void
  saveStatus: GoalSaveStatus
  /** When true, “saved” copy refers to browser storage, not Supabase. */
  persistedLocally?: boolean
  disabled?: boolean
}

export function GoalLineCard({
  value,
  onChange,
  onSave,
  saveStatus,
  persistedLocally = false,
  disabled,
}: GoalLineCardProps) {
  return (
    <section className="app-goal-card" aria-labelledby="app-goal-title">
      <h2 id="app-goal-title" className="app-goal-title">
        Remember your goal
      </h2>
      <p className="app-goal-sub">Add one line that stays with you until you change it.</p>
      <label htmlFor="app-goal-input" className="sr-only">
        Your one-line goal
      </label>
      <textarea
        id="app-goal-input"
        className="app-goal-input"
        rows={2}
        maxLength={GOAL_LINE_MAX_LEN}
        placeholder="e.g. Close all three rings before bed."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => onSave()}
        disabled={disabled}
      />
      <div className="app-goal-toolbar">
        <span className="app-goal-status" aria-live="polite">
          {saveStatus === 'saving' && 'Saving…'}
          {saveStatus === 'saved' &&
            (persistedLocally ? 'Saved on this device' : 'Saved to your account')}
          {saveStatus === 'error' && 'Could not save'}
        </span>
        <span className="app-goal-count">
          {value.length} / {GOAL_LINE_MAX_LEN}
        </span>
        <button type="button" className="app-goal-save" onClick={onSave} disabled={disabled}>
          Save
        </button>
      </div>
    </section>
  )
}
