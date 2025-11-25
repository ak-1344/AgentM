"""
Context service - manages user context profiles
"""

from app.database.supabase_client import get_supabase
import logging

logger = logging.getLogger(__name__)


class ContextService:
    """Service for context profile operations"""
    
    def __init__(self):
        self.supabase = get_supabase()
    
    async def save_context(self, user_id: str, context_data: dict) -> dict:
        """
        Save or update user context profile
        Uses upsert to handle both create and update
        """
        try:
            data = {
                "user_id": user_id,
                "target_roles": context_data.get("target_roles", []),
                "preferred_industries": context_data.get("preferred_industries", []),
                "pitch_tone": context_data.get("pitch_tone", "professional"),
                "keywords": context_data.get("keywords", []),
                "custom_message": context_data.get("custom_message"),
                "geography": context_data.get("geography", []),
                "context_json": context_data
            }
            
            response = self.supabase.table("context_profiles")\
                .upsert(data, on_conflict="user_id")\
                .execute()
            
            return response.data[0]
            
        except Exception as e:
            logger.error(f"Save context error: {e}", exc_info=True)
            raise
    
    async def get_context(self, user_id: str) -> dict:
        """Get user's context profile"""
        try:
            response = self.supabase.table("context_profiles")\
                .select("*")\
                .eq("user_id", user_id)\
                .execute()
            
            if not response.data:
                return None
            
            return response.data[0]
            
        except Exception as e:
            logger.error(f"Get context error: {e}", exc_info=True)
            raise
    
    async def delete_context(self, user_id: str):
        """Delete user's context profile"""
        try:
            self.supabase.table("context_profiles")\
                .delete()\
                .eq("user_id", user_id)\
                .execute()
            
        except Exception as e:
            logger.error(f"Delete context error: {e}", exc_info=True)
            raise
