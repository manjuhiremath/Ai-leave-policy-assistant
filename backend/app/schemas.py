from pydantic import BaseModel
from typing import Any, Dict, List, Optional

class AskInput(BaseModel):
    question: str
    filters: Optional[Dict[str, Any]] = None
    top_k: Optional[int] = 5
    follow_up_context: Optional[str] = None

class Citation(BaseModel):
    doc_id: str
    section: Optional[str] = None
    snippet: Optional[str] = None
    page: Optional[int] = None

class AskOutput(BaseModel):
    answer: str
    citations: List[Citation]
    policy_matches: List[str]
    confidence: str
    disclaimer: str
    metadata: Dict[str, Any]

class IngestOutput(BaseModel):
    inserted: int

class DocMeta(BaseModel):
    doc_id: str
    title: str
    version: str
    effective_date: str
    region: str
    category: str
    owner: str
    url: str

class Healthz(BaseModel):
    status: str
    time_ms: int

# Add this missing model
class FeedbackInput(BaseModel):
    answer_id: Optional[str] = None
    question: str
    helpful: bool
    comments: Optional[str] = None
from pydantic import BaseModel
from typing import Any, Dict, List, Optional

class AskInput(BaseModel):
    question: str
    filters: Optional[Dict[str, Any]] = None
    top_k: Optional[int] = 5
    follow_up_context: Optional[str] = None

class Citation(BaseModel):
    doc_id: str
    section: Optional[str] = None
    snippet: Optional[str] = None
    page: Optional[int] = None

class AskOutput(BaseModel):
    answer: str
    citations: List[Citation]
    policy_matches: List[str]
    confidence: str
    disclaimer: str
    metadata: Dict[str, Any]

class IngestOutput(BaseModel):
    inserted: int

class DocMeta(BaseModel):
    doc_id: str
    title: str
    version: str
    effective_date: str
    region: str
    category: str
    owner: str
    url: str

class Healthz(BaseModel):
    status: str
    time_ms: int

# Add this missing model
class FeedbackInput(BaseModel):
    answer_id: Optional[str] = None
    question: str
    helpful: bool
    comments: Optional[str] = None
