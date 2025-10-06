HR Policy Assistant
A secure internal web app that answers natural-language questions about company policies with explicit citations using a RAG pipeline, with an optional WhatsApp entry point for employees.

Features
Search-style question box with Ask, Clear, Copy, mobile-responsive layout, and dark-first theme via CSS variables and system preference.

FastAPI backend with RAG over a local vector index (FAISS), configurable embeddings (OpenAI, Gemini, or local HuggingFace), and clean JSON responses with citations and confidence.

Server-side proxy in Next.js App Router to avoid CORS and keep secrets server-only via environment variables.

WhatsApp Cloud API webhook endpoints to enable WhatsApp as a channel with verification and secure signature checks.

Architecture
Frontend: Next.js App Router (JS) with a Route Handler under app/api/ask/route.js that proxies to FastAPI using BACKEND_URL to avoid client-side CORS and exposure of secrets.

Backend: FastAPI service exposing /ask, /ingest, /docs, /feedback, and /healthz; ingestion builds and persists a FAISS index; query path retrieves top-k chunks and composes a concise, cited answer.

Vector store: FAISS locally by default for cost-free development and fast retrieval on modest corpora; optional Chroma/Pinecone can be enabled via env.

Repository layout
frontend/ — Next.js App Router app with components and app/api/ask/route.js server proxy.

backend/ — FastAPI app, RAG pipeline, schemas, and scripts including ingestion.

policies/ — Source documents (.txt/.md/.pdf/.docx) for ingestion, organized as separate policy files per category.

storage/index/ — Persisted FAISS index (auto-created).

Prerequisites
Node.js (Next.js 14) and npm for the frontend, and Python 3.10+ with pip/venv for the backend.

API keys if using hosted embeddings or LLMs (OPENAI_API_KEY or GEMINI_API_KEY), otherwise local embeddings avoid external quotas entirely.

Environment variables
Create a .env (backend) from .env.example with one provider and backend selection set explicitly to avoid fallbacks.

EMBEDDINGS_PROVIDER=openai | gemini | huggingface (recommended for local development) .

VECTOR_BACKEND=faiss | chroma | pinecone (faiss by default) .

OPENAI_API_KEY or GEMINI_API_KEY if using hosted embeddings, plus WhatsApp secrets for webhook if enabling that channel.

Example backend .env keys:

OPENAI_API_KEY or GEMINI_API_KEY, EMBEDDINGS_PROVIDER, VECTOR_BACKEND, WHATSAPP_VERIFY_TOKEN, WHATSAPP_APP_SECRET, WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID.

Frontend .env.local:

BACKEND_URL=http://localhost:8000 to point the Route Handler at the API server.

Install and run (backend)
Create and activate a virtual environment, install dependencies, and ingest policies to build the vector index.

Ensure .env is present or passed to Uvicorn via --env-file so the process sees provider choice and keys at startup.

Commands:

python -m venv .venv && ..venv\Scripts\activate.

pip install -r backend\requirements.txt.

python -m backend.scripts.ingest_policies to load, split, embed, and persist FAISS under storage/index.

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 --env-file .env to serve the API.

Install and run (frontend)
In frontend/, npm install and npm run dev, with .env.local BACKEND_URL pointing to the FastAPI base URL.

The page calls /api/ask on the Next.js server, which proxies to the backend, keeping secrets on the server under App Router conventions.

Endpoints
POST /ask: body includes question, filters, top_k, follow_up_context, returning answer, citations, policy_matches, confidence, disclaimer, and metadata (latency_ms, retriever_k, model).

POST /ingest: re-indexes policies from the policies/ directory, normalizes text, splits, embeds, and persists to the vector store for subsequent queries.

GET /docs and GET /docs/{doc_id}: lists and retrieves stored doc metadata for citations and linking.

POST /feedback: appends a JSONL record to storage for later analysis of helpfulness, with a simple schema for answer id and comments.

GET /healthz: readiness/liveness probe returning status ok and a timestamp in ms.

Ingestion pipeline
Loaders accept .txt/.md by default and can be extended to PDF/DOCX with PyPDFLoader and Docx2txtLoader; DirectoryLoader can orchestrate bulk file intake.

RecursiveCharacterTextSplitter chunks content to control context window fit, preserving headings for citation extraction heuristics.

Embeddings: choose hosted (OpenAI or Gemini) or local sentence-transformers via HuggingFaceEmbeddings to avoid quotas; local is ideal for internal corpora.

Vector store: FAISS.from_documents(...).save_local(...) at ingest, FAISS.load_local(...).as_retriever(...) at runtime for low-latency semantic retrieval.