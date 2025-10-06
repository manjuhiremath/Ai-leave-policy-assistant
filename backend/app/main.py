import os
import json
import time
from typing import List, Optional, Dict, Any

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import simplified RAG functions
from .rag import rag_answer, ingest_files, list_documents, get_document

# Pydantic models
class AskRequest(BaseModel):
    question: str
    filters: Optional[Dict[str, Any]] = None
    top_k: Optional[int] = 5
    follow_up_context: Optional[str] = None

class Citation(BaseModel):
    doc_id: str
    title: Optional[str] = None
    section: Optional[str] = None
    snippet: Optional[str] = None
    category: Optional[str] = None
    confidence: Optional[str] = None

class AskResponse(BaseModel):
    answer: str
    citations: List[Citation]
    policy_matches: List[str]
    confidence: str
    disclaimer: str
    metadata: Dict[str, Any]

class IngestResponse(BaseModel):
    status: str
    documents_processed: Optional[int] = 0
    chunks_created: Optional[int] = 0
    message: Optional[str] = None

class DocumentMetadata(BaseModel):
    doc_id: str
    title: str
    version: str
    effective_date: str
    region: str
    category: str
    owner: str

class FeedbackRequest(BaseModel):
    answer_id: Optional[str] = None
    question: str
    helpful: bool
    comments: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    service: str
    model: str
    embedding_model: str
    timestamp: int

# Initialize FastAPI
app = FastAPI(
    title="HR Policy Assistant (Gemini)",
    description="AI assistant for company policies using Google Gemini",
    version="2.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        service="hr-policy-assistant",
        model=os.getenv("GEMINI_CHAT_MODEL", "gemini-1.0-pro"),
        embedding_model=os.getenv("GEMINI_EMBED_MODEL", "models/embedding-001"),
        timestamp=int(time.time())
    )

@app.post("/ask", response_model=AskResponse)
async def ask_question(request: AskRequest):
    start_time = time.time()
    
    try:
        result = await rag_answer(
            question=request.question,
            filters=request.filters or {},
            top_k=request.top_k or 5,
            follow_up_context=request.follow_up_context
        )
        
        # Add latency to metadata
        result["metadata"]["latency_ms"] = int((time.time() - start_time) * 1000)
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.post("/ingest", response_model=IngestResponse)
async def ingest_policies():
    try:
        policies_path = "./policies"
        if not os.path.exists(policies_path):
            os.makedirs(policies_path)
            return IngestResponse(
                status="info",
                message="Policies directory created. Please add policy files and run ingestion again."
            )
        
        result = await ingest_files(policies_path)
        return IngestResponse(**result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {str(e)}")

@app.get("/documents", response_model=List[DocumentMetadata])
async def list_docs():
    try:
        return await list_documents()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing documents: {str(e)}")

@app.get("/documents/{doc_id}", response_model=DocumentMetadata)
async def get_doc(doc_id: str):
    try:
        return await get_document(doc_id)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Document not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving document: {str(e)}")

@app.post("/feedback")
async def submit_feedback(feedback: FeedbackRequest):
    try:
        # Store feedback
        os.makedirs("./storage", exist_ok=True)
        feedback_data = feedback.dict()
        feedback_data["timestamp"] = time.time()
        
        with open("./storage/feedback.jsonl", "a", encoding="utf-8") as f:
            f.write(json.dumps(feedback_data) + "\n")
        
        return {"status": "success", "message": "Feedback recorded"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving feedback: {str(e)}")

@app.on_event("startup")
async def startup_event():
    """Initialize on startup"""
    print("🚀 HR Policy Assistant (Gemini) Starting...")
    print(f"💬 Chat Model: {os.getenv('GEMINI_CHAT_MODEL', 'gemini-1.0-pro')}")
    print(f"🔤 Embedding Model: {os.getenv('GEMINI_EMBED_MODEL', 'models/embedding-001')}")
    
    current_dir = os.path.dirname(os.path.abspath(__file__))
    storage_dir = os.path.abspath(os.path.join(current_dir, "..", "storage"))
    print(f"📁 Storage: {storage_dir}")
    
    # Ensure directories exist
    os.makedirs("./policies", exist_ok=True)
    os.makedirs("./storage", exist_ok=True)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)