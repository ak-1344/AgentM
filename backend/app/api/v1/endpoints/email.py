"""
Email sending endpoints (Phase 1 - Manual send)
"""

from fastapi import APIRouter, HTTPException, Depends
from app.core.security import get_current_user_id
from app.models.schemas import EmailSendRequest, EmailSendResponse
from app.services.email_service import EmailService
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/send", response_model=EmailSendResponse)
async def send_email(
    request: EmailSendRequest,
    user_id: str = Depends(get_current_user_id)
):
    """
    Send email manually using user's SMTP credentials
    Phase 1: Direct send without drafting/approval workflow
    """
    try:
        logger.info(f"User {user_id} sending email to {request.to_email}")
        
        email_service = EmailService()
        
        # Send email
        await email_service.send_email(
            user_id=user_id,
            to_email=request.to_email,
            subject=request.subject,
            body=request.body,
            cc=request.cc,
            bcc=request.bcc
        )
        
        return EmailSendResponse(
            success=True,
            message="Email sent successfully",
            sent_at=datetime.utcnow()
        )
        
    except Exception as e:
        logger.error(f"Email send error: {e}", exc_info=True)
        return EmailSendResponse(
            success=False,
            message=f"Failed to send email: {str(e)}"
        )


@router.get("/history")
async def get_email_history(
    user_id: str = Depends(get_current_user_id),
    limit: int = 50
):
    """
    Get user's email sending history
    TODO: Implement in Phase 3 with proper logging
    """
    # Placeholder for Phase 3
    return {
        "message": "Email history will be available in Phase 3",
        "count": 0,
        "emails": []
    }
