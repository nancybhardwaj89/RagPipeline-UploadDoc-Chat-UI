# RAG Document Assistant

A retrieval-augmented generation (RAG) chat application that lets users upload documents, then ask natural-language questions answered strictly from those documents — with source citations. Built with **n8n** for the AI/orchestration backend and **React (Vite)** for the frontend, deployed on **Vercel**.

**Live demo:** https://rag-pipeline-upload-doc-chat-ui.vercel.app/
**Author:** Nancy Bhardwaj — [LinkedIn](https://linkedin.com/in/nancy-bhardwaj) · [GitHub](https://github.com/nancybhardwaj89)

---

## Overview

This project demonstrates an end-to-end AI-augmented workflow: document ingestion, vector embedding, semantic search, and an LLM agent constrained to answer only from retrieved context — a pattern directly applicable to AI-driven test case generation, requirements analysis, and QA knowledge-base tooling.

**How it works:**
1. A user uploads a document (PDF, CSV, JSON, or TXT) through the upload screen.
2. n8n chunks the document, generates embeddings (OpenAI), and stores them in a Pinecone vector index.
3. The user asks a question in the chat screen.
4. An n8n AI Agent (Groq Llama 3.1) retrieves the most relevant chunks from Pinecone and answers using only that retrieved content, citing the source file.

---

## Architecture

```
┌─────────────────┐        ┌──────────────────────────────────────────┐
│                  │        │                n8n workflow               │
│  React Frontend  │        │                                          │
│    (Vercel)      │        │  Phase 1 — Ingestion                     │
│                  │  POST  │  Form Trigger → Text Splitter →          │
│  Upload screen   ├───────►│  Embeddings (OpenAI) → Pinecone (insert) │
│                  │        │                                          │
│                  │        │  Phase 2 — Retrieval                     │
│  Chat screen     ├───────►│  Chat Trigger → AI Agent (Groq) →        │
│                  │  POST  │  Pinecone (retrieve-as-tool) → Response  │
└─────────────────┘        └──────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite |
| Workflow / Orchestration | n8n (Cloud) |
| LLM | Groq — Llama 3.1 8B Instant |
| Embeddings | OpenAI Embeddings (small model) |
| Vector Database | Pinecone |
| Hosting | Vercel |

---

## Screenshots

### n8n Workflow

<img width="1697" height="802" alt="image" src="https://github.com/user-attachments/assets/aa083723-4503-4459-b99d-0eb5044b8362" />


### Upload Document UI
_Step 1 — users add documents to the knowledge base._

<img width="757" height="600" alt="image" src="https://github.com/user-attachments/assets/89938086-094c-4038-a194-f7a1d30f86de" />
<img width="1078" height="713" alt="image" src="https://github.com/user-attachments/assets/671bd2e1-761c-460c-acb6-15f329cac7b6" />


### Chat UI
_Step 2 — users ask questions answered from the uploaded documents._

<img width="1035" height="795" alt="image" src="https://github.com/user-attachments/assets/59ca1aea-2cdb-4b8b-a999-0fd5183b1372" />

---

## Project Structure

```
rag-chat-ui/
├── src/
│   ├── App.jsx          # Top-level view switcher (upload → chat)
│   ├── UploadView.jsx   # Step 1: document upload screen
│   ├── ChatView.jsx     # Step 2: chat interface
│   ├── App.css          # Styling
│   └── main.jsx         # Entry point
├── screenshots/         # README images (add your own)
├── .env.example         # Template for required environment variables
├── index.html
├── package.json
└── vite.config.js
```

---

## Getting Started Locally

**Prerequisites:** Node.js 18+, an active n8n workflow with a Form Trigger and Chat Trigger node.

```bash
git clone https://github.com/nancybhardwaj89/rag-chat-ui.git
cd rag-chat-ui
npm install
cp .env.example .env
```

Fill in `.env` with your own n8n URLs:
```
VITE_N8N_WEBHOOK_URL=https://YOUR-N8N-DOMAIN/webhook/<chat-trigger-id>/chat
VITE_N8N_FORM_URL=https://YOUR-N8N-DOMAIN/form/<form-trigger-id>
```

Run the dev server:
```bash
npm run dev
```
Open `http://localhost:5173`. Your n8n workflow must be **Active** for requests to succeed.

---

## Deployment

Deployed on **Vercel**:
1. Import this repo into Vercel.
2. Framework preset: Vite (auto-detected).
3. Add `VITE_N8N_WEBHOOK_URL` and `VITE_N8N_FORM_URL` under **Environment Variables**.
4. Deploy.

Every push to `main` auto-redeploys.

---

## Key Design Notes

- **Two-step flow (upload → chat):** the n8n Form Trigger page can't be embedded in an iframe (n8n Cloud blocks framing by default), so the upload step opens n8n's hosted form in a new tab rather than embedding it — a more reliable pattern than fighting CORS/frame restrictions.
- **No secrets in the frontend:** Pinecone and Groq API keys live only inside n8n's credential store and never touch the browser. The frontend only knows the two n8n endpoint URLs, kept out of version control via `.env`.
- **Session-based chat memory:** each browser tab generates a random session ID so n8n's buffer memory node can maintain per-user conversation context.

---

## Roadmap / Possible Extensions

- Add shared-secret header authentication on the n8n webhooks to prevent unauthorized use.
- Show upload confirmation status inline instead of requiring a manual "continue" click.
- Display retrieved source chunks/citations directly in the chat UI.

---

## License

MIT
