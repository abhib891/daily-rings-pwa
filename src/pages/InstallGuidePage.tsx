import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AppMark } from '../components/AppMark'
import './InstallGuidePage.css'

export function InstallGuidePage() {
  useEffect(() => {
    const prev = document.title
    document.title = 'Install · Activity Tracker'
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <div className="app install-guide">
      <header className="install-guide-header">
        <div className="app-brand">
          <AppMark />
          <div className="app-header-main">
            <div className="app-header-title-row">
              <div className="app-brand-text">
                <h1 className="app-title">Install as an app</h1>
                <p className="app-sub">Activity Tracker on iPhone &amp; Android</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="install-guide-nav" aria-label="Page">
        <Link to="/" className="install-guide-back">
          ← Back to Activity Tracker
        </Link>
      </nav>

      <article className="install-guide-article">
        <p className="install-guide-lead">
          Install the site like a native app so it opens full-screen from your home screen. Use your
          production <strong>https://</strong> link (for example your Vercel URL) — not plain{' '}
          <code className="install-guide-code">http://</code> on a local network.
        </p>

        <section className="install-guide-section" aria-labelledby="install-iphone">
          <h2 id="install-iphone" className="install-guide-h2">
            iPhone (Safari)
          </h2>
          <ol className="install-guide-steps">
            <li>Open <strong>Safari</strong> and go to your Activity Tracker URL.</li>
            <li>
              Tap the <strong>Share</strong> button <span aria-hidden="true">(□↑)</span>.
            </li>
            <li>
              Scroll and tap <strong>Add to Home Screen</strong>.
            </li>
            <li>Edit the name if you like, then tap <strong>Add</strong>.</li>
            <li>
              Open the app from your home screen icon — it runs in its own window, like other apps.
            </li>
          </ol>
          <p className="install-guide-tip">
            If an old version appears after an update, open the site in Safari once, pull to refresh,
            or remove the home screen icon and add it again. You can also clear Safari website data
            for that site if needed.
          </p>
        </section>

        <section className="install-guide-section" aria-labelledby="install-android">
          <h2 id="install-android" className="install-guide-h2">
            Android (Chrome)
          </h2>
          <ol className="install-guide-steps">
            <li>Open <strong>Chrome</strong> and go to your Activity Tracker URL.</li>
            <li>
              Tap the <strong>⋮</strong> menu (top right).
            </li>
            <li>
              Tap <strong>Install app</strong> or <strong>Add to Home screen</strong> (wording
              varies by Chrome version).
            </li>
            <li>Confirm — the icon appears on your home screen or app drawer.</li>
          </ol>
          <p className="install-guide-tip">
            Samsung Internet and other browsers often have a similar “Add to Home” or “Install”
            option in their share or menu panel.
          </p>
        </section>

        <section className="install-guide-section" aria-labelledby="install-sync">
          <h2 id="install-sync" className="install-guide-h2">
            Data on every device
          </h2>
          <p className="install-guide-p">
            Without signing in, data stays in that browser only — your installed iPhone app and
            your laptop <strong>do not</strong> share the same storage.
          </p>
          <p className="install-guide-p">
            <strong>Sign in</strong> (Google or email link) so habits sync through your account;
            then the same rings show on phone, tablet, and desktop.
          </p>
        </section>
      </article>

      <footer className="install-guide-footer">
        <Link to="/" className="install-guide-back install-guide-back--footer">
          Open Activity Tracker
        </Link>
      </footer>
    </div>
  )
}
