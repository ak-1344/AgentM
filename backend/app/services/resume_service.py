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
            
            # Generate unique file path
            timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
            file_path = f"{user_id}/{timestamp}_{file.filename}"
            
            # Upload to Supabase storage
            storage_response = self.supabase.storage.from_("resumes").upload(
                file_path,
                content,
                {"content-type": file.content_type}
            )
            
            # Extract text from resume
            extracted_text = self._extract_text(content, file.content_type)
            
            # Create database record
            resume_data = {
                "user_id": user_id,
                "file_name": file.filename,
                "file_path": file_path,
                "extracted_text": extracted_text
            }
            
            db_response = self.supabase.table("resumes").insert(resume_data).execute()
            resume_record = db_response.data[0]
            
            return {
                "resume_id": resume_record["id"],
                "file_name": file.filename,
                "file_path": file_path,
                "message": "Resume uploaded successfully"
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
    
    async def save_parsed_data(self, resume_id: str, user_id: str, parsed_data: dict):
        """Save parsed resume data to database"""
        try:
            self.supabase.table("resumes")\
                .update({"parsed_data": parsed_data})\
                .eq("id", resume_id)\
                .eq("user_id", user_id)\
                .execute()
            
        except Exception as e:
            logger.error(f"Save parsed data error: {e}", exc_info=True)
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
