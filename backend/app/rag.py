import os
import glob
import re
import json
from datetime import datetime
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
load_dotenv()

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

# Gemini-only imports
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI

# Vector store (FAISS only - no Pinecone/Chroma to simplify)
from langchain_community.vectorstores import FAISS

# Chains & prompts
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate

# Absolute storage paths
DIR_PATH = os.path.dirname(os.path.abspath(__file__))
STORE_DIR = os.path.abspath(os.path.join(DIR_PATH, "..", "storage", "faiss_index"))
META_PATH = os.path.abspath(os.path.join(DIR_PATH, "..", "storage", "docs_meta.jsonl"))
os.makedirs(os.path.dirname(STORE_DIR), exist_ok=True)
os.makedirs(os.path.dirname(META_PATH), exist_ok=True)

def _get_embeddings():
    """Initialize Gemini embeddings"""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is required")
    
    model = os.getenv("GEMINI_EMBED_MODEL", "models/embedding-001")
    print(f"Using Gemini embeddings: {model}")
    
    return GoogleGenerativeAIEmbeddings(
        model=model,
        google_api_key=api_key
    )

def _get_llm():
    """Initialize Gemini chat model"""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is required")
    
    model = os.getenv("GEMINI_CHAT_MODEL", "gemini-1.0-pro")
    print(f"Using Gemini LLM: {model}")
    
    return ChatGoogleGenerativeAI(
        model=model,
        google_api_key=api_key,
        temperature=0.1,
        max_output_tokens=1000
    )

def _get_vectorstore():
    """Initialize FAISS vector store with Gemini embeddings"""
    try:
        emb = _get_embeddings()
        if os.path.exists(STORE_DIR):
            print("Loading existing FAISS index")
            return FAISS.load_local(
                STORE_DIR, 
                emb, 
                allow_dangerous_deserialization=True
            )
        else:
            print("No existing FAISS index found")
            return None
    except Exception as e:
        print(f"Error loading vector store: {e}")
        return None

def _load_documents(path: str) -> List[Document]:
    """Load documents from directory"""
    docs = []
    
    if not os.path.exists(path):
        print(f"Warning: Policies directory not found: {path}")
        return docs
    
    supported_extensions = ('.txt', '.md', '.pdf')
    
    for file_path in glob.glob(os.path.join(path, "*")):
        if file_path.endswith(supported_extensions):
            try:
                # For now, handle only text files
                if file_path.endswith(('.txt', '.md')):
                    with open(file_path, "r", encoding="utf-8") as f:
                        content = f.read()
                    
                    filename = os.path.basename(file_path)
                    doc_id = os.path.splitext(filename)[0]
                    metadata = _infer_metadata(filename)
                    
                    # Write metadata
                    _write_metadata({
                        **metadata, 
                        "doc_id": doc_id, 
                        "file_path": file_path,
                        "ingestion_time": datetime.now().isoformat()
                    })
                    
                    docs.append(Document(
                        page_content=content, 
                        metadata={
                            "source": doc_id,
                            "title": filename,
                            **metadata
                        }
                    ))
                    print(f"✓ Loaded: {filename}")
                    
            except Exception as e:
                print(f"✗ Error loading {file_path}: {e}")
    
    return docs

def _infer_metadata(filename: str) -> Dict[str, str]:
    """Infer metadata from filename"""
    lower_name = filename.lower()
    
    if "leave" in lower_name:
        category = "Leave"
    elif "exit" in lower_name:
        category = "Exit"
    elif "communication" in lower_name:
        category = "Communication"
    elif "referral" in lower_name:
        category = "Referral"
    elif "benefit" in lower_name:
        category = "Benefits"
    elif "posh" in lower_name:
        category = "PoSH"
    else:
        category = "General"
    
    return {
        "title": filename,
        "version": "1.0",
        "effective_date": datetime.now().strftime("%Y-%m-%d"),
        "region": "IN",
        "category": category,
        "owner": "HR Department",
    }

def _write_metadata(metadata: Dict[str, Any]):
    """Write document metadata to JSONL file"""
    try:
        with open(META_PATH, "a", encoding="utf-8") as f:
            f.write(json.dumps(metadata) + "\n")
    except Exception as e:
        print(f"Error writing metadata: {e}")

async def ingest_files(path: str) -> Dict[str, Any]:
    """Ingest documents and create vector store"""
    print(f"Starting ingestion from: {path}")
    
    raw_docs = _load_documents(path)
    if not raw_docs:
        return {"status": "error", "message": "No documents found to ingest", "chunks_processed": 0}
    
    # Split documents into chunks
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        separators=["\n\n", "\n", ". ", "! ", "? ", " ", ""]
    )
    chunks = splitter.split_documents(raw_docs)
    
    print(f"Split {len(raw_docs)} documents into {len(chunks)} chunks")
    
    try:
        # Create FAISS index with Gemini embeddings
        emb = _get_embeddings()
        vector_store = FAISS.from_documents(chunks, emb)
        
        # Save the index
        vector_store.save_local(STORE_DIR)
        print(f"✓ FAISS index saved to: {STORE_DIR}")
        
        return {
            "status": "success",
            "documents_processed": len(raw_docs),
            "chunks_created": len(chunks),
            "vector_store": "faiss",
            "embedding_model": os.getenv("GEMINI_EMBED_MODEL", "models/embedding-001")
        }
        
    except Exception as e:
        print(f"✗ Error during ingestion: {e}")
        return {"status": "error", "message": str(e), "chunks_processed": 0}

def _get_retriever():
    """Create retriever from vector store"""
    vector_store = _get_vectorstore()
    if vector_store is None:
        raise RuntimeError(
            "Vector store not initialized. Please run ingestion first with policy files in ./policies directory."
        )
    
    return vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 5}
    )

# Improved prompt for better answers
SYSTEM_PROMPT = """You are an HR policy assistant for ABC Digital Marketing Agency. 
Answer questions STRICTLY based on the provided policy context.

Guidelines:
- Be precise and cite specific policy sections
- If information isn't in the context, say "I don't have that information in our policy documents" and suggest contacting HR
- Keep answers concise (under 150 words)
- Never invent policy details, numbers, or dates
- Use the exact policy language when possible
- If multiple policies are relevant, mention all applicable ones

Context from policies:
{context}

Question: {question}

Provide a clear, helpful answer with specific policy references:"""

PROMPT = ChatPromptTemplate.from_template(SYSTEM_PROMPT)

def _extract_citations(docs: List[Document]) -> List[Dict[str, Any]]:
    """Extract citations from retrieved documents"""
    citations = []
    
    for doc in docs:
        content = doc.page_content.strip()
        metadata = doc.metadata
        
        # Try to extract section headers
        section = None
        header_match = re.search(r'(?m)^(#+\s+.+|\d+\.\s+.+|[A-Z][^.!?]*:)$', content[:100])
        if header_match:
            section = header_match.group(0).strip()
        
        citations.append({
            "doc_id": metadata.get("source", "Unknown"),
            "title": metadata.get("title", "Unknown"),
            "section": section,
            "snippet": content[:250] + "..." if len(content) > 250 else content,
            "category": metadata.get("category", "Policy"),
            "confidence": "high" if len(content) > 50 else "medium"
        })
    
    return citations

async def rag_answer(
    question: str, 
    filters: Optional[Dict[str, Any]] = None, 
    top_k: int = 5, 
    follow_up_context: Optional[str] = None
) -> Dict[str, Any]:
    """Main RAG answering function using only Gemini"""
    try:
        print(f"🔍 Processing question: {question}")
        
        # Retrieve relevant documents
        retriever = _get_retriever()
        docs = retriever.invoke(question)
        
        if not docs:
            return {
                "answer": "I couldn't find relevant information in our policy documents for your question. Please contact HR for specific guidance.",
                "citations": [],
                "policy_matches": [],
                "confidence": "low",
                "disclaimer": "For policy questions not covered here, please email hr@abc-digital.com",
                "metadata": {
                    "retrieved_docs": 0,
                    "model": os.getenv("GEMINI_CHAT_MODEL", "gemini-1.0-pro"),
                    "response": "no_documents_found"
                }
            }
        
        print(f"✓ Found {len(docs)} relevant document chunks")
        
        # Generate answer using Gemini
        llm = _get_llm()
        chain = create_stuff_documents_chain(llm, PROMPT)
        
        answer = await chain.ainvoke({
            "context": docs,
            "question": question
        })
        
        # Extract citations and metadata
        citations = _extract_citations(docs)
        policy_matches = list(set([doc.metadata.get("category", "Policy") for doc in docs]))
        
        # Determine confidence
        if len(docs) >= 3 and len(answer) > 50:
            confidence = "high"
        elif len(docs) >= 1:
            confidence = "medium"
        else:
            confidence = "low"
        
        return {
            "answer": answer.strip(),
            "citations": citations,
            "policy_matches": policy_matches,
            "confidence": confidence,
            "disclaimer": "Please verify with HR for your specific employment contract and situation.",
            "metadata": {
                "retrieved_docs": len(docs),
                "model": os.getenv("GEMINI_CHAT_MODEL", "gemini-1.0-pro"),
                "embedding_model": os.getenv("GEMINI_EMBED_MODEL", "models/embedding-001")
            }
        }
        
    except Exception as e:
        print(f"✗ Error in rag_answer: {e}")
        return {
            "answer": "I encountered a technical error while processing your question. Please try again or contact HR directly.",
            "citations": [],
            "policy_matches": [],
            "confidence": "low",
            "disclaimer": "Technical issue detected. If this persists, please contact IT support.",
            "metadata": {"error": str(e)}
        }

async def list_documents() -> List[Dict[str, Any]]:
    """List all ingested documents"""
    documents = []
    
    if os.path.exists(META_PATH):
        try:
            with open(META_PATH, "r", encoding="utf-8") as f:
                for line in f:
                    documents.append(json.loads(line.strip()))
        except Exception as e:
            print(f"Error reading metadata: {e}")
    
    return documents

async def get_document(doc_id: str) -> Dict[str, Any]:
    """Get specific document metadata"""
    if os.path.exists(META_PATH):
        with open(META_PATH, "r", encoding="utf-8") as f:
            for line in f:
                metadata = json.loads(line.strip())
                if metadata.get("doc_id") == doc_id:
                    return metadata
    
    raise FileNotFoundError(f"Document {doc_id} not found")