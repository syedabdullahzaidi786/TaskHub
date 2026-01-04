from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

from ..database import get_session
from ..auth.middleware import require_auth
from ..models.chat import Conversation, Message
from ..services.agent import run_agent

router = APIRouter()

# Request/Response Schemas
class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None

class ToolCallResponse(BaseModel):
    tool: str
    args: Dict[str, Any]
    result: Any

class ChatResponse(BaseModel):
    conversation_id: int
    response: str
    tool_calls: List[ToolCallResponse]

@router.post("/{user_id}/chat", response_model=ChatResponse)
async def chat_endpoint(
    user_id: str,
    request: ChatRequest,
    session: Session = Depends(get_session),
    # verifying auth against the user_id in path to ensure security
    auth_user_id: UUID = Depends(require_auth)
):
    """
    Chat with the AI Todo Assistant.
    """
    # Security check: Ensure authenticated user matches the path user_id
    if str(auth_user_id) != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized access to this chat")

    # 1. Get or Create Conversation
    conversation = None
    if request.conversation_id:
        conversation = session.get(Conversation, request.conversation_id)
        if not conversation or conversation.user_id != user_id:
            # If invalid ID provided, create new one or raise error? 
            # Requirement says "Existing conversation ID (creates new if not provided)"
            # Better to error if provided but not found, or just fall back to new.
            # Falling back to new is safer for "stateless" resilience.
            conversation = None
    
    if not conversation:
        conversation = Conversation(user_id=user_id)
        session.add(conversation)
        session.commit()
        session.refresh(conversation)

    # 2. Retrieve History
    # We need to fetch messages for this conversation
    # Sort by created_at asc
    statement = select(Message).where(Message.conversation_id == conversation.id).order_by(Message.created_at)
    history_messages = session.exec(statement).all()

    # 3. Store User Message
    user_msg = Message(
        conversation_id=conversation.id,
        role="user",
        content=request.message
    )
    session.add(user_msg)
    session.commit() # commit to save ID/timestamp if needed, or valid object
    
    # Update local history for the agent run
    run_history = list(history_messages)
    run_history.append(user_msg)

    # 4. Run Agent
    agent_result = await run_agent(
        session=session,
        user_id=user_id,
        message=request.message,
        history_messages=history_messages # we pass history EXCLUDING the latest msg? or INCLUDING?
        # run_agent logic: "Re-hydrate chat session... Send message".
        # If we include the latest message in history AND send it again, Gemini sees it twice?
        # Typically start_chat(history=...) sets the PREVIOUS context.
        # Then send_message(new_msg) adds the new turn.
        # So we pass 'history_messages' (old) to start_chat, and 'request.message' (new) to send_message.
        # Correct.
    )

    # 5. Store Assistant Response
    assistant_msg = Message(
        conversation_id=conversation.id,
        role="assistant",
        content=agent_result["response"]
    )
    session.add(assistant_msg)
    session.commit()

    return ChatResponse(
        conversation_id=conversation.id,
        response=agent_result["response"],
        tool_calls=agent_result.get("tool_calls", [])
    )
