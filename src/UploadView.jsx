import './App.css'

// The n8n Form Trigger URL — this is the page n8n generates automatically
// for your "On form submission" node. It handles the file picker and the
// upload itself; we just embed it and wait for the user to confirm.
const FORM_URL = import.meta.env.VITE_N8N_FORM_URL

export default function UploadView({ onContinue }) {
  return (
    <div className="page">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <span className="brand-mark">RAG</span>
            <div>
              <h1>Document Assistant</h1>
              <p className="subtitle">Step 1 — add documents to the knowledge base</p>
            </div>
          </div>
        </div>
      </header>

      <main className="upload-shell">
        {FORM_URL ? (
          <div className="upload-card">
            <div className="upload-icon">📄</div>
            <h2>Add documents to your knowledge base</h2>
            <p className="upload-hint">
              The upload form opens in a new tab (n8n doesn't allow it to be
              shown inside another site). Fill it in, submit it, then come
              back to this tab.
            </p>
            <a
              className="primary-button"
              href={FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open upload form ↗
            </a>
          </div>
        ) : (
          <div className="error-banner">
            No upload form URL is configured. Add VITE_N8N_FORM_URL to your .env
            file and restart the dev server.
          </div>
        )}

        <button className="primary-button secondary" onClick={onContinue} type="button">
          I've uploaded my documents — start chatting →
        </button>
      </main>
    </div>
  )
}
