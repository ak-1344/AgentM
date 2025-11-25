"""
SMTP configuration endpoints
"""

from fastapi import APIRouter, HTTPException, Depends
from app.core.security import get_current_user_id
from app.models.schemas import (
    SMTPCredentialsRequest,
    SMTPCredentialsResponse,
    SMTPTestResponse
)
from app.services.smtp_service import SMTPService
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/credentials", response_model=SMTPCredentialsResponse)
async def save_smtp_credentials(
    request: SMTPCredentialsRequest,
    user_id: str = Depends(get_current_user_id)
):
    """
    Save SMTP credentials for user
    Password is encrypted before storage
    """
    try:
        logger.info(f"User {user_id} saving SMTP credentials")
        
        smtp_service = SMTPService()
        credentials = await smtp_service.save_credentials(user_id, request.dict())
        
        return SMTPCredentialsResponse(**credentials)
        
    except Exception as e:
        logger.error(f"Save SMTP credentials error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/credentials", response_model=SMTPCredentialsResponse)
async def get_smtp_credentials(user_id: str = Depends(get_current_user_id)):
    """Get user's SMTP credentials (without password)"""
    try:
        smtp_service = SMTPService()
        credentials = await smtp_service.get_credentials(user_id)
        
        if not credentials:
            raise HTTPException(status_code=404, detail="SMTP credentials not found")
        
        return SMTPCredentialsResponse(**credentials)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get SMTP credentials error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/test", response_model=SMTPTestResponse)
async def test_smtp_connection(user_id: str = Depends(get_current_user_id)):
    """
    Test SMTP connection with saved credentials
    Sends a test email to the user's email address
    """
    try:
        logger.info(f"User {user_id} testing SMTP connection")
        
        smtp_service = SMTPService()
        result = await smtp_service.test_connection(user_id)
        
        return SMTPTestResponse(**result)
        
    except Exception as e:
        logger.error(f"SMTP test error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/credentials")
async def delete_smtp_credentials(user_id: str = Depends(get_current_user_id)):
    """Delete user's SMTP credentials"""
    try:
        smtp_service = SMTPService()
        await smtp_service.delete_credentials(user_id)
        return {"message": "SMTP credentials deleted successfully"}
    except Exception as e:
        logger.error(f"Delete SMTP credentials error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
