from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict


class RelatedLink(BaseModel):
    title: str
    url: str


class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    language: Optional[str] = "en"


class ChatResponse(BaseModel):
    reply: str
    conversation_id: str
    matched_topic: Optional[str] = None
    related_links: List[RelatedLink] = []
    is_ai_generated: bool = False
    source_attribution: str


class ChatHistoryItem(BaseModel):
    id: int
    role: str
    message_text: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
