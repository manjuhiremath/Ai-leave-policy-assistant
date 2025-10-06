# HR Policy Assistant

A secure internal web app that answers natural-language questions about company policies with explicit citations using a RAG pipeline, with an optional WhatsApp entry point for employees.

---

## ✨ Features

- 🔍 Search-style question box with **Ask**, **Clear**, **Copy**  
- 📱 Mobile-responsive layout, dark-first theme via CSS variables and system preference  
- ⚡ FastAPI backend with **RAG over FAISS** vector index  
- 🔑 Configurable embeddings: **OpenAI**, **Gemini**, or **local HuggingFace**  
- 📝 Clean JSON responses with citations and confidence  
- 🔒 Server-side proxy in **Next.js App Router** to avoid CORS and keep secrets safe  
- 💬 Optional **WhatsApp Cloud API** integration with webhook verification  

---

## 🏛 Architecture

- **Frontend**:  
  - Next.js App Router (JS)  
  - Route Handler under `app/api/ask/route.js` proxies to FastAPI using `BACKEND_URL`  
  - Avoids client-side CORS and prevents exposure of secrets  

- **Backend**:  
  - FastAPI service exposing: `/ask`, `/ingest`, `/docs`, `/feedback`, `/healthz`  
  - Ingestion builds and persists a **FAISS index**  
  - Query retrieves top-k chunks and composes concise, cited answers  

- **Vector Store**:  
  - FAISS (local, default) for cost-free development and fast retrieval  
  - Optional: Chroma / Pinecone via environment variable  

---

## 📂 Repository Layout

```
hr-policy-assistant/
├── backend1/          # FastAPI service
├── frontend/          # Next.js App Router frontend
└── README.md          # Project documentation
```

## 🔧 Prerequisites

- Node.js (Next.js 14) + npm  
- Python 3.10+ + pip/venv  
- API keys (if using hosted embeddings or LLMs:  `GEMINI_API_KEY`)  


## ⚙️ Environment Variables

### Backend `.env`
```env
# Gemini Configuration
GEMINI_API_KEY=(please provide your own gemini api key)
GEMINI_EMBED_MODEL=models/embedding-001
GEMINI_CHAT_MODEL=gemini-2.5-flash
VECTOR_BACKEND=faiss

# Pinecone (optional)
PINECONE_API_KEY=(please provide your own api key)
PINECONE_INDEX=hr-policies
EMBEDDINGS_PROVIDER=gemini   # or gemini
```
# Frontend `.env`
```env
BACKEND_URL=http://localhost:8000
```
# run Frontend
```env
cd frontend
npm install
npm run dev
```