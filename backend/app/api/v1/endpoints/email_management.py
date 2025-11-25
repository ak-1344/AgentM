"""
Email Management API endpoints
"""

from fastapi import APIRouter, HTTPException, Depends
from app.core.security import get_current_user_id
from app.models.schemas import (
    EmailGenerateRequest,
    EmailResponse,
    EmailUpdateStatusRequest,
    EmailUpdateContentRequest,
    ChatMessageRequest,
    ChatMessageResponse,
    QuickActionRequest
)
from app.services.email_management_service import EmailManagementService
from app.services.chatbot_service import ChatbotService
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/generate", response_model=EmailResponse)
async def generate_email(
    request: EmailGenerateRequest,
    user_id: str = Depends(get_current_user_id)
):
    """
    Generate a personalized email using AI
    """
    try:
        logger.info(f"Generating email for {request.company_name}")
        
        service = EmailManagementService()
        email = await service.generate_email(
            user_id=user_id,
            company_name=request.company_name,
            company_website=request.company_website,
            company_location=request.company_location,
            position_title=request.position_title,
            job_type=request.job_type,
            salary_range=request.salary_range,
            keywords=request.keywords,
            custom_prompt=request.custom_prompt
        )
        
        return EmailResponse(**email)
        
    except Exception as e:
        logger.error(f"Generate email error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/list", response_model=List[EmailResponse])
async def get_emails(
    status: Optional[str] = None,
    user_id: str = Depends(get_current_user_id)
):
    """
    Get all emails, optionally filtered by status
    """
    try:
        service = EmailManagementService()
        emails = await service.get_emails(user_id=user_id, status=status)
        
        return [EmailResponse(**email) for email in emails]
        
    except Exception as e:
        logger.error(f"Get emails error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{email_id}", response_model=EmailResponse)
async def get_email(
    email_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """
    Get a specific email by ID
    """
    try:
        service = EmailManagementService()
        email = await service.get_email(user_id=user_id, email_id=email_id)
        
        return EmailResponse(**email)
        
    except Exception as e:
        logger.error(f"Get email error: {e}", exc_info=True)
        raise HTTPException(status_code=404, detail="Email not found")


@router.patch("/{email_id}/status", response_model=EmailResponse)
async def update_email_status(
    email_id: str,
    request: EmailUpdateStatusRequest,
    user_id: str = Depends(get_current_user_id)
):
    """
    Update email status (new -> under_review -> approved/rejected)
    """
    try:
        service = EmailManagementService()
        email = await service.update_email_status(
            user_id=user_id,
            email_id=email_id,
            status=request.status
        )
        
        return EmailResponse(**email)
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Update email status error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/{email_id}/content", response_model=EmailResponse)
async def update_email_content(
    email_id: str,
    request: EmailUpdateContentRequest,
    user_id: str = Depends(get_current_user_id)
):
    """
    Update email content
    """
    try:
        service = EmailManagementService()
        email = await service.update_email_content(
            user_id=user_id,
            email_id=email_id,
            subject=request.subject,
            content=request.content,
            recipient_email=request.recipient_email,
            recipient_name=request.recipient_name
        )
        
        return EmailResponse(**email)
        
    except Exception as e:
        logger.error(f"Update email content error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{email_id}")
async def delete_email(
    email_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """
    Delete an email
    """
    try:
        service = EmailManagementService()
        await service.delete_email(user_id=user_id, email_id=email_id)
        
        return {"success": True, "message": "Email deleted"}
        
    except Exception as e:
        logger.error(f"Delete email error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{email_id}/chat", response_model=ChatMessageResponse)
async def chat_with_email(
    email_id: str,
    request: ChatMessageRequest,
    user_id: str = Depends(get_current_user_id)
):
    """
    Chat with AI about an email (for review and editing)
    """
    try:
        chatbot_service = ChatbotService()
        email_service = EmailManagementService()
        
        # Get chat history
        chat_history = await email_service.get_chat_history(
            user_id=user_id,
            email_id=email_id
        )
        
        # Process chat
        response = await chatbot_service.chat(
            user_id=user_id,
            email_id=email_id,
            user_message=request.message,
            chat_history=chat_history
        )
        
        return ChatMessageResponse(**response)
        
    except Exception as e:
        logger.error(f"Chat error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{email_id}/chat/history")
async def get_chat_history(
    email_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """
    Get chat history for an email
    """
    try:
        service = EmailManagementService()
        history = await service.get_chat_history(
            user_id=user_id,
            email_id=email_id
        )
        
        return {"messages": history}
        
    except Exception as e:
        logger.error(f"Get chat history error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{email_id}/quick-action")
async def apply_quick_action(
    email_id: str,
    request: QuickActionRequest,
    user_id: str = Depends(get_current_user_id)
):
    """
    Apply quick action to email (make formal, casual, shorter, etc.)
    """
    try:
        chatbot_service = ChatbotService()
        result = await chatbot_service.apply_quick_action(
            user_id=user_id,
            email_id=email_id,
            action=request.action
        )
        
        return result
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Quick action error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
