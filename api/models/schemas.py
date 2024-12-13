from pydantic import BaseModel
from typing import List, Optional

class SearchResult(BaseModel):
    id: str
    title: str
    content: str
    url: str
    relevanceScore: float

class SearchResponse(BaseModel):
    results: List[SearchResult]

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str