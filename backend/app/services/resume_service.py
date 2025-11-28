"""
Resume service - handles resume upload, storage, and retrieval
"""

from fastapi import UploadFile
from app.database.supabase_client import get_supabase
import PyPDF2
import docx
import io
import logging
from datetime import datetime

logger = logging.getLogger(__name__)


class ResumeService:
    """Service for resume operations"""
    
    def __init__(self):
        self.supabase = get_supabase()
    
    async def upload_resume(self, user_id: str, file: UploadFile) -> dict:
        """
        Upload resume to Supabase storage and create database record
        """
        try:
            # Read file content
            content = await file.read()
            
            # Check if resume already exists for user
            existing = self.supabase.table("resumes").select("id").eq("user_id", user_id).execute()
            if existing.data:
                logger.info(f"User {user_id} already has a resume. Uploading new version.")
            
            # Generate file path with user-based name (one resume per user)
            # Format: user_id/resume_{user_id}.{ext}
            ext = file.filename.split('.')[-1] if '.' in file.filename else "pdf"
            file_path = f"{user_id}/resume_{user_id}.{ext}"
            
            # Upload to Supabase storage (upsert=True to overwrite)
            storage_response = self.supabase.storage.from_("resumes").upload(
                file_path,
                content,
                {"content-type": file.content_type, "upsert": "true"}
            )
            
            # Extract text from resume (Restored)
            extracted_text = self._extract_text(content, file.content_type)
            
            # Create database record with upload completed status
            resume_data = {
                "user_id": user_id,
                "file_name": file.filename,
                "file_path": file_path,
                "extracted_text": extracted_text,
                "parsed_data": None, # Explicitly null to indicate pending parse
                "is_upload_completed": True,  # Mark upload as completed
                "is_parse_completed": False   # Parse not done yet
            }
            
            db_response = self.supabase.table("resumes").insert(resume_data).execute()
            resume_record = db_response.data[0]
            
            return {
                "resume_id": resume_record["id"],
                "file_name": file.filename,
                "file_path": file_path,
                "is_upload_completed": True,
                "is_parse_completed": False,
                "message": "Resume uploaded successfully. Parsing pending."
            }
            
        except Exception as e:
            logger.error(f"Resume upload error: {e}", exc_info=True)
            raise
    
    async def get_resume_text(self, resume_id: str, user_id: str) -> str:
        """Get extracted text from resume"""
        try:
            response = self.supabase.table("resumes")\
                .select("extracted_text")\
                .eq("id", resume_id)\
                .eq("user_id", user_id)\
                .execute()
            
            if not response.data:
                raise Exception("Resume not found")
            
            return response.data[0]["extracted_text"]
            
        except Exception as e:
            logger.error(f"Get resume text error: {e}", exc_info=True)
            raise
    
    async def save_parsed_data(self, resume_id: str, user_id: str, parsed_data: any):
        """Save parsed resume data to database and mark parse as completed"""
        try:
            # Convert Pydantic model to dict if needed
            if hasattr(parsed_data, "model_dump"):
                data_to_save = parsed_data.model_dump()
            elif hasattr(parsed_data, "dict"):
                data_to_save = parsed_data.dict()
            else:
                data_to_save = parsed_data

            # Update both parsed_data and completion status
            self.supabase.table("resumes")\
                .update({
                    "parsed_data": data_to_save,
                    "is_parse_completed": True  # Mark parse as completed
                })\
                .eq("id", resume_id)\
                .eq("user_id", user_id)\
                .execute()
            
            logger.info(f"Resume {resume_id} marked as parse completed")
            
        except Exception as e:
            logger.error(f"Save parsed data error: {e}", exc_info=True)
            raise
    
    async def get_current_resume(self, user_id: str) -> dict:
        """Get current resume for user"""
        try:
            # Get latest resume for user
            response = self.supabase.table("resumes")\
                .select("*")\
                .eq("user_id", user_id)\
                .order("created_at", desc=True)\
                .limit(1)\
                .execute()
            
            if not response.data:
                return None
            
            return response.data[0]
            
        except Exception as e:
            logger.error(f"Get current resume error: {e}", exc_info=True)
            raise

    async def get_resume(self, resume_id: str, user_id: str) -> dict:
        """Get resume details"""
        try:
            response = self.supabase.table("resumes")\
                .select("*")\
                .eq("id", resume_id)\
                .eq("user_id", user_id)\
                .execute()
            
            if not response.data:
                raise Exception("Resume not found")
            
            return response.data[0]
            
        except Exception as e:
            logger.error(f"Get resume error: {e}", exc_info=True)
            raise
    
    async def download_resume(self, resume_id: str, user_id: str) -> tuple[bytes, str, str]:
        """Download resume file"""
        try:
            # Get file info from DB
            resume = await self.get_resume(resume_id, user_id)
            file_path = resume["file_path"]
            original_name = resume["file_name"]
            
            # Download from Storage
            response = self.supabase.storage.from_("resumes").download(file_path)
            
            # Determine mime type
            mime_type = "application/pdf"
            if file_path.endswith(".docx"):
                mime_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            elif file_path.endswith(".doc"):
                mime_type = "application/msword"
                
            return response, mime_type, original_name
            
        except Exception as e:
            logger.error(f"Download resume error: {e}", exc_info=True)
            raise

    async def get_resume_file_content(self, resume_id: str, user_id: str) -> tuple[bytes, str]:
        """Get resume file content and mime type from storage"""
        try:
            # Get file path from DB
            resume = await self.get_resume(resume_id, user_id)
            file_path = resume["file_path"]
            
            # Download from Storage
            response = self.supabase.storage.from_("resumes").download(file_path)
            
            # Determine mime type (basic check based on extension)
            mime_type = "application/pdf"
            if file_path.endswith(".docx"):
                mime_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            elif file_path.endswith(".doc"):
                mime_type = "application/msword"
                
            return response, mime_type
            
        except Exception as e:
            logger.error(f"Get resume file error: {e}", exc_info=True)
            raise
    
    def _extract_text(self, content: bytes, content_type: str) -> str:
        """Extract text from PDF or DOCX file"""
        try:
            if content_type == "application/pdf":
                return self._extract_pdf_text(content)
            elif content_type in [
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ]:
                return self._extract_docx_text(content)
            else:
                return ""
        except Exception as e:
            logger.error(f"Text extraction error: {e}", exc_info=True)
            return ""
    
    def _extract_pdf_text(self, content: bytes) -> str:
        """Extract text from PDF"""
        try:
            pdf_file = io.BytesIO(content)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            
            return text.strip()
        except Exception as e:
            logger.error(f"PDF extraction error: {e}", exc_info=True)
            return ""
    
    def _extract_docx_text(self, content: bytes) -> str:
        """Extract text from DOCX"""
        try:
            doc_file = io.BytesIO(content)
            doc = docx.Document(doc_file)
            
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            
            return text.strip()
        except Exception as e:
            logger.error(f"DOCX extraction error: {e}", exc_info=True)
            return ""
