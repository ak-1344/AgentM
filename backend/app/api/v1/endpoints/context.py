"""
User context configuration endpoints
"""

from fastapi import APIRouter, HTTPException, Depends
from app.core.security import get_current_user_id
from app.models.schemas import (
    ContextBuildRequest, 
    ContextResponse, 
    ContextSuggestionsResponse,
    PredefinedTagsResponse
)
from app.models.predefined_tags import (
    PURPOSE_OPTIONS,
    COMMON_TECH_ROLES,
    COMMON_TECH_INDUSTRIES,
    COMMON_TECH_KEYWORDS,
    COMMON_LOCATIONS
)
from app.services.context_service import ContextService
from app.services.ai_service import AIService
from app.services.resume_service import ResumeService
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
    Automatically includes user's resume data for email generation
    """
    try:
        logger.info(f"User {user_id} building context")
        
        context_service = ContextService()
        resume_service = ResumeService()
        ai_service = AIService()
        
        # Get user's resume data to include with context
        try:
            resume = await resume_service.get_current_resume(user_id)
            if resume:
                # Include resume data in context for email generation
                context_data = request.dict()
                context_data['resume_extracted_text'] = resume.get('extracted_text')
                context_data['resume_parsed_data'] = resume.get('parsed_data')
            else:
                context_data = request.dict()
        except Exception as e:
            logger.warning(f"Could not fetch resume data: {e}")
            context_data = request.dict()
        
        # Refine context with AI (optional enhancement)
        refined_context = await ai_service.refine_context(context_data)
        
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


@router.get("/predefined-tags", response_model=PredefinedTagsResponse)
async def get_predefined_tags():
    """
    Get predefined tags for context setup (no AI needed)
    Returns common tech roles, industries, keywords, and locations
    """
    return PredefinedTagsResponse(
        purposes=PURPOSE_OPTIONS,
        roles=COMMON_TECH_ROLES,
        industries=COMMON_TECH_INDUSTRIES,
        keywords=COMMON_TECH_KEYWORDS,
        locations=COMMON_LOCATIONS
    )


@router.get("/suggestions", response_model=ContextSuggestionsResponse)
async def get_context_suggestions(user_id: str = Depends(get_current_user_id)):
    """
    Get AI-generated context suggestions based on user's parsed resume
    """
    try:
        logger.info(f"User {user_id} requesting context suggestions")
        
        resume_service = ResumeService()
        ai_service = AIService()
        
        # Get user's most recent resume
        resume = await resume_service.get_current_resume(user_id)
        if not resume:
            raise HTTPException(status_code=404, detail="No resume found. Please upload a resume first.")
        
        # Check if resume has been parsed
        if not resume.get('parsed_data'):
            raise HTTPException(
                status_code=400, 
                detail="Resume has not been parsed yet. Please parse your resume first."
            )
        
        # Generate suggestions using AI
        from app.models.schemas import ParsedResumeData
        parsed_data = ParsedResumeData(**resume['parsed_data'])
        suggestions = await ai_service.generate_context_suggestions(parsed_data)
        
        return ContextSuggestionsResponse(**suggestions)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get context suggestions error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
