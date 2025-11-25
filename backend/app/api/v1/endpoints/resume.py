"""
Resume upload and parsing endpoints
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.core.security import get_current_user_id
from app.models.schemas import ResumeUploadResponse, ResumeParseResponse
from app.services.resume_service import ResumeService
from app.services.ai_service import AIService
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/upload", response_model=ResumeUploadResponse)
async def upload_resume(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user_id)
):
    """
    Upload resume file (PDF, DOC, DOCX)
    Stores file in Supabase storage and creates database record
    """
    try:
        logger.info(f"User {user_id} uploading resume: {file.filename}")
        
        # Validate file type
        allowed_types = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ]
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Only PDF, DOC, and DOCX are allowed."
            )
        
        # Upload file
        resume_service = ResumeService()
        result = await resume_service.upload_resume(user_id, file)
        
        return ResumeUploadResponse(**result)
        
    except Exception as e:
        logger.error(f"Resume upload error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/parse/{resume_id}", response_model=ResumeParseResponse)
async def parse_resume(
    resume_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """
    Parse uploaded resume using AI
    Extracts skills, experience, education, etc.
    """
    try:
        logger.info(f"User {user_id} parsing resume: {resume_id}")
        
        resume_service = ResumeService()
        ai_service = AIService()
        
        # Get resume text
        resume_text = await resume_service.get_resume_text(resume_id, user_id)
        
        # Parse with AI
        parsed_data = await ai_service.parse_resume(resume_text)
        
        # Update database
        await resume_service.save_parsed_data(resume_id, user_id, parsed_data)
        
        return ResumeParseResponse(
            resume_id=resume_id,
            parsed_data=parsed_data,
            message="Resume parsed successfully"
        )
        
    except Exception as e:
        logger.error(f"Resume parsing error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{resume_id}")
async def get_resume(
    resume_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """Get resume details"""
    try:
        resume_service = ResumeService()
        resume = await resume_service.get_resume(resume_id, user_id)
        return resume
    except Exception as e:
        logger.error(f"Get resume error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
