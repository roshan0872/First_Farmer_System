from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.chat import ChatMessage
from app.models.user import User
from app.schemas.chatbot import ChatRequest, ChatResponse, ChatHistoryItem
from app.services.chatbot_service import process_chat_message
from app.api.deps import get_current_user_optional

router = APIRouter(prefix="/chat", tags=["Agriculture Chatbot"])


@router.post("", response_model=ChatResponse)
async def chat_interaction(
    chat_req: ChatRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    user_id = current_user.id if current_user else None
    return await process_chat_message(db, chat_req, user_id=user_id)


@router.get("/history", response_model=List[ChatHistoryItem])
def get_chat_history(
    conversation_id: str = Query(..., description="Conversation ID to retrieve history for"),
    db: Session = Depends(get_db),
):
    messages = db.query(ChatMessage).filter(
        ChatMessage.conversation_id == conversation_id
    ).order_by(ChatMessage.created_at.asc()).all()
    return messages
