"""
Email Management Service - handles AI-generated emails workflow
"""

from app.database.supabase_client import get_supabase_client
from app.services.ai_service import AIService
from typing import List, Optional, Dict
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class EmailManagementService:
    """Service for managing AI-generated emails workflow"""
    
    def __init__(self):
        self.supabase = get_supabase_client()
        self.ai_service = AIService()
    
    async def generate_email(
        self,
        user_id: str,
        company_name: str,
        company_website: Optional[str],
        company_location: Optional[str],
        position_title: Optional[str],
        job_type: Optional[str],
        salary_range: Optional[str],
        keywords: Optional[List[str]],
        custom_prompt: Optional[str] = None
    ) -> dict:
        """
        Generate a personalized email using AI
        """
        try:
            logger.info(f"Generating email for {company_name} for user {user_id}")
            
            # Get user context and resume
            context_response = self.supabase.table("context_profiles")\
                .select("*")\
                .eq("user_id", user_id)\
                .single()\
                .execute()
            
            resume_response = self.supabase.table("resumes")\
                .select("*")\
                .eq("user_id", user_id)\
                .order("created_at", desc=True)\
                .limit(1)\
                .execute()
            
            user_context = context_response.data if context_response.data else {}
            resume_data = resume_response.data[0] if resume_response.data else {}
            
            # Generate email with AI
            email_content = await self.ai_service.generate_email(
                company_name=company_name,
                company_description=custom_prompt or f"Company: {company_name}",
                user_context=user_context,
                resume_data=resume_data
            )
            
            # Store in database
            email_data = {
                "user_id": user_id,
                "recipient_email": "",  # Will be filled later
                "recipient_name": "",
                "subject": email_content.get("subject", ""),
                "content": email_content.get("body", ""),
                "company_name": company_name,
                "company_website": company_website,
                "company_location": company_location,
                "position_title": position_title,
                "keywords": keywords or [],
                "job_type": job_type,
                "salary_range": salary_range,
                "status": "new",
                "ai_model": "gemini-pro",
                "generation_metadata": {
                    "custom_prompt": custom_prompt,
                    "generated_at": datetime.utcnow().isoformat()
                }
            }
            
            result = self.supabase.table("ai_emails")\
                .insert(email_data)\
                .execute()
            
            # Log activity
            await self._log_activity(
                user_id=user_id,
                level="success",
                action="email_generated",
                message=f"Generated email for {company_name}",
                related_entity_type="email",
                related_entity_id=result.data[0]["id"]
            )
            
            return result.data[0]
            
        except Exception as e:
            logger.error(f"Email generation error: {e}", exc_info=True)
            await self._log_activity(
                user_id=user_id,
                level="error",
                action="email_generation_failed",
                message=f"Failed to generate email: {str(e)}"
            )
            raise
    
    async def get_emails(
        self,
        user_id: str,
        status: Optional[str] = None
    ) -> List[dict]:
        """
        Get user's emails, optionally filtered by status
        """
        try:
            query = self.supabase.table("ai_emails")\
                .select("*")\
                .eq("user_id", user_id)\
                .order("created_at", desc=True)
            
            if status:
                query = query.eq("status", status)
            
            result = query.execute()
            return result.data
            
        except Exception as e:
            logger.error(f"Get emails error: {e}", exc_info=True)
            raise
    
    async def get_email(self, user_id: str, email_id: str) -> dict:
        """
        Get a specific email by ID
        """
        try:
            result = self.supabase.table("ai_emails")\
                .select("*")\
                .eq("id", email_id)\
                .eq("user_id", user_id)\
                .single()\
                .execute()
            
            return result.data
            
        except Exception as e:
            logger.error(f"Get email error: {e}", exc_info=True)
            raise
    
    async def update_email_status(
        self,
        user_id: str,
        email_id: str,
        status: str
    ) -> dict:
        """
        Update email status (new -> under_review -> approved/rejected)
        """
        try:
            # Validate status
            valid_statuses = ["new", "under_review", "approved", "rejected"]
            if status not in valid_statuses:
                raise ValueError(f"Invalid status. Must be one of: {valid_statuses}")
            
            update_data = {
                "status": status,
                "reviewed_at": datetime.utcnow().isoformat() if status in ["approved", "rejected"] else None
            }
            
            result = self.supabase.table("ai_emails")\
                .update(update_data)\
                .eq("id", email_id)\
                .eq("user_id", user_id)\
                .execute()
            
            # Log activity
            await self._log_activity(
                user_id=user_id,
                level="info",
                action="email_status_updated",
                message=f"Email status changed to {status}",
                related_entity_type="email",
                related_entity_id=email_id
            )
            
            return result.data[0]
            
        except Exception as e:
            logger.error(f"Update email status error: {e}", exc_info=True)
            raise
    
    async def update_email_content(
        self,
        user_id: str,
        email_id: str,
        subject: Optional[str] = None,
        content: Optional[str] = None,
        recipient_email: Optional[str] = None,
        recipient_name: Optional[str] = None
    ) -> dict:
        """
        Update email content (after AI chat modifications)
        """
        try:
            update_data = {}
            
            if subject is not None:
                update_data["subject"] = subject
            if content is not None:
                update_data["content"] = content
            if recipient_email is not None:
                update_data["recipient_email"] = recipient_email
            if recipient_name is not None:
                update_data["recipient_name"] = recipient_name
            
            result = self.supabase.table("ai_emails")\
                .update(update_data)\
                .eq("id", email_id)\
                .eq("user_id", user_id)\
                .execute()
            
            # Log activity
            await self._log_activity(
                user_id=user_id,
                level="info",
                action="email_updated",
                message="Email content updated",
                related_entity_type="email",
                related_entity_id=email_id
            )
            
            return result.data[0]
            
        except Exception as e:
            logger.error(f"Update email content error: {e}", exc_info=True)
            raise
    
    async def delete_email(self, user_id: str, email_id: str) -> bool:
        """
        Delete an email
        """
        try:
            self.supabase.table("ai_emails")\
                .delete()\
                .eq("id", email_id)\
                .eq("user_id", user_id)\
                .execute()
            
            # Log activity
            await self._log_activity(
                user_id=user_id,
                level="warning",
                action="email_deleted",
                message="Email deleted",
                related_entity_type="email",
                related_entity_id=email_id
            )
            
            return True
            
        except Exception as e:
            logger.error(f"Delete email error: {e}", exc_info=True)
            raise
    
    async def get_chat_history(
        self,
        user_id: str,
        email_id: str
    ) -> List[dict]:
        """
        Get chat history for an email
        """
        try:
            result = self.supabase.table("email_chat_history")\
                .select("*")\
                .eq("email_id", email_id)\
                .eq("user_id", user_id)\
                .order("created_at", desc=False)\
                .execute()
            
            return result.data
            
        except Exception as e:
            logger.error(f"Get chat history error: {e}", exc_info=True)
            raise
    
    async def save_chat_message(
        self,
        user_id: str,
        email_id: str,
        role: str,
        message: str
    ) -> dict:
        """
        Save a chat message
        """
        try:
            chat_data = {
                "email_id": email_id,
                "user_id": user_id,
                "role": role,
                "message": message,
                "ai_model": "gemini-pro" if role == "assistant" else None
            }
            
            result = self.supabase.table("email_chat_history")\
                .insert(chat_data)\
                .execute()
            
            return result.data[0]
            
        except Exception as e:
            logger.error(f"Save chat message error: {e}", exc_info=True)
            raise
    
    async def _log_activity(
        self,
        user_id: str,
        level: str,
        action: str,
        message: str,
        related_entity_type: Optional[str] = None,
        related_entity_id: Optional[str] = None
    ):
        """
        Helper to log activity
        """
        try:
            log_data = {
                "user_id": user_id,
                "level": level,
                "action": action,
                "message": message,
                "related_entity_type": related_entity_type,
                "related_entity_id": related_entity_id
            }
            
            self.supabase.table("activity_logs")\
                .insert(log_data)\
                .execute()
            
        except Exception as e:
            logger.error(f"Activity logging error: {e}", exc_info=True)
            # Don't raise - logging should not break main flow
