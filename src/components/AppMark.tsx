/** Minimal three-ring mark (activity / habits), matches in-app ring accents. */
export function AppMark() {
  return (
    <svg
      className="app-mark"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        className="app-mark-ring app-mark-ring--outer"
        cx="22"
        cy="22"
        r="19"
        strokeWidth="3.25"
        strokeLinecap="round"
        strokeDasharray="96 130"
        transform="rotate(-90 22 22)"
      />
      <circle
        className="app-mark-ring app-mark-ring--mid"
        cx="22"
        cy="22"
        r="14"
        strokeWidth="3.25"
        strokeLinecap="round"
        strokeDasharray="68 120"
        transform="rotate(-90 22 22)"
      />
      <circle
        className="app-mark-ring app-mark-ring--inner"
        cx="22"
        cy="22"
        r="9"
        strokeWidth="3.25"
        strokeLinecap="round"
        strokeDasharray="44 100"
        transform="rotate(-90 22 22)"
      />
    </svg>
  )
}
