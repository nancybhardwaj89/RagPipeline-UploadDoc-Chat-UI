import { useState, useRef, useEffect } from 'react'
import './App.css'

// The webhook URL comes from an environment variable so it is never
// hard-coded into the source code (see .env.example for how to set it).
const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL

// A random ID so n8n's chat memory can tell one visitor's conversation
// apart from another's. It is created once per browser tab.
function makeSessionId() {
  return 'sess_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export default function ChatView({ onStartOver }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hi! Ask me anything about the documents you've uploaded to the knowledge base.",
    },
  ])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')
  const sessionId = useRef(makeSessionId())
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isSending])

  async function sendMessage(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || isSending) return

    setMessages((prev) => [...prev, { role: 'user', text }])
    setInput('')
    setIsSending(true)
    setError('')

    if (!WEBHOOK_URL) {
      setError(
        'No webhook URL is configured. Add VITE_N8N_WEBHOOK_URL to your .env file and restart the dev server.'
      )
      setIsSending(false)
      return
    }

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sendMessage',
          chatInput: text,
          sessionId: sessionId.current,
        }),
      })

      if (!response.ok) {
        throw new Error(`n8n responded with status ${response.status}`)
      }

      const data = await response.json()

      // n8n's AI Agent node can name the reply field differently
      // depending on version, so we check the common possibilities.
      const reply =
        data.output ?? data.text ?? data.answer ?? data.reply ?? JSON.stringify(data)

      setMessages((prev) => [...prev, { role: 'assistant', text: reply }])
    } catch (err) {
      setError(
        `Couldn't reach the n8n workflow. Check that it is Active and the URL is correct. (${err.message})`
      )
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="page">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <span className="brand-mark">RAG</span>
            <div>
              <h1>Document Assistant</h1>
              <p className="subtitle">Answers sourced from your uploaded files</p>
            </div>
          </div>
          <button className="link-button" onClick={onStartOver} type="button">
            Upload more documents
          </button>
        </div>
      </header>

      <main className="chat-shell">
        <div className="messages">
          {messages.map((m, i) => (
            <div key={i} className={`bubble-row ${m.role}`}>
              <div className="bubble">
                <span className="bubble-label">{m.role === 'user' ? 'You' : 'Assistant'}</span>
                <p>{m.text}</p>
              </div>
            </div>
          ))}
          {isSending && (
            <div className="bubble-row assistant">
              <div className="bubble typing">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form className="composer" onSubmit={sendMessage}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your documents..."
            disabled={isSending}
          />
          <button type="submit" disabled={isSending || !input.trim()}>
            Send
          </button>
        </form>
      </main>
    </div>
  )
}
