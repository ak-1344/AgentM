"""
User context configuration endpoints
"""

from fastapi import APIRouter, HTTPException, Depends
from app.core.security import get_current_user_id
from app.models.schemas import ContextBuildRequest, ContextResponse
from app.services.context_service import ContextService
from app.services.ai_service import AIService
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/build", response_model=ContextResponse)
async def build_context(
    request: ContextBuildRequest,
    user_id: str = Depends(get_current_user_id)
):
    """
    Build or update user context profile
    AI refines the context based on user input
    """
    try:
        logger.info(f"User {user_id} building context")
        
        context_service = ContextService()
        ai_service = AIService()
        
        # Refine context with AI (optional enhancement)
        refined_context = await ai_service.refine_context(request.dict())
        
        # Save to database
        context = await context_service.save_context(user_id, refined_context)
        
        return ContextResponse(**context)
        
    except Exception as e:
        logger.error(f"Context build error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("", response_model=ContextResponse)
async def get_context(user_id: str = Depends(get_current_user_id)):
    """Get user's context profile"""
    try:
        context_service = ContextService()
        context = await context_service.get_context(user_id)
        
        if not context:
            raise HTTPException(status_code=404, detail="Context not found")
        
        return ContextResponse(**context)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get context error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("")
async def delete_context(user_id: str = Depends(get_current_user_id)):
    """Delete user's context profile"""
    try:
        context_service = ContextService()
        await context_service.delete_context(user_id)
        return {"message": "Context deleted successfully"}
    except Exception as e:
        logger.error(f"Delete context error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
