# HR Policy Assistant

A secure internal web app that answers natural-language questions about company policies with explicit citations using a RAG pipeline.

---

##  Features

-  Search-style question box with **Ask**, **Clear**, **Copy**  
-  Mobile-responsive layout, dark-first theme via CSS variables, user preference for dark/light mode integrated system preference
-  FastAPI backend with **RAG over FAISS** vector index  
-  Configurable embeddings: **Gemini** with **gemini-2.5-flash**  
-  Clean JSON responses with citations and confidence  
-  Server-side proxy in **Next.js App Router** to avoid CORS and keep secrets safe  

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
# run Backend
```env
cd backend
pip install -r requirements.txt
python -m scripts.ingest_policies
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
(or)
uvicorn main:app --host 0.0.0.0 --port 8000
```


### Docker (Containerized Deployment)

**Note**: Docker configuration not included in this version due to time constraints. For production deployment, create:
- `backend/Dockerfile` with Python 3.10+ base image, copy requirements, and run Uvicorn
- `frontend/Dockerfile` with Node 18+ base image, build Next.js, and serve
- `docker-compose.yml` to orchestrate both services with environment variable injection

### Platform Deployment (backend (Render) and frontend (Vercel))

#### Render
1. Create two web services: one for FastAPI (Python), one for Next.js (Node)
2. Set environment variables in Render dashboard
3. Add build commands:
   - Backend: `pip install -r requirements.txt && python -m scripts.ingest_policies`
   - Frontend: `npm install && npm run build`
4. Start commands:
   - Backend: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Frontend: `npm start`


**Note**: Full deployment configs and CI/CD pipelines (GitHub Actions) were not implemented due to project time constraints. Recommended for production: use managed services (Render/Vercel) with secret management.

---


Screenshots
<table>
  <tr>
    <td><img src="/assets/ss1.png" alt="Home - Light Theme" style="height:400px;width:400px;object-fit:contain;" /><br/><sub>Home - Light Theme</sub></td>
    <td><img src="/assets/ss2.png" alt="Home - Dark Theme" style="height:400px;width:400px;object-fit:contain;" /><br/><sub>Home - Dark Theme</sub></td>
  </tr>
  <tr>
    <td><img src="/assets/ss3.png" alt="Answer with Citations" style="height:400px;width:400px;object-fit:contain;" /><br/><sub>Answer with Citations</sub></td>
    <td><img src="/assets/ss4.png" alt="Mobile Responsive" style="height:400px;width:400px;object-fit:contain;" /><br/><sub>Mobile Responsive</sub></td>
  </tr>
  <tr>
    <td><img src="/assets/ss5.png" alt="Policy References" style="height:400px;width:400px;object-fit:contain;" /><br/><sub>Policy References Expanded</sub></td>
    <td><img src="/assets/ss6.png" alt="FastAPI Docs" style="height:400px;width:400px;object-fit:contain;" /><br/><sub>FastAPI Interactive Docs</sub></td>
  </tr>
</table>


