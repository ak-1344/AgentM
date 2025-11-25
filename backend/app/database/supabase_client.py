"""
Supabase database client singleton
"""

from supabase import create_client, Client
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class SupabaseClient:
    """Singleton Supabase client"""
    
    _instance: Client = None
    
    @classmethod
    def get_client(cls) -> Client:
        """Get or create Supabase client instance"""
        if cls._instance is None:
            try:
                cls._instance = create_client(
                    settings.SUPABASE_URL,
                    settings.SUPABASE_SERVICE_ROLE_KEY
                )
                logger.info("✅ Supabase client initialized")
            except Exception as e:
                logger.error(f"❌ Failed to initialize Supabase client: {e}")
                raise
        return cls._instance


# Convenience function for getting the client
def get_supabase_client() -> Client:
    """Get Supabase client instance"""
    return SupabaseClient.get_client()


# Convenience function
def get_supabase() -> Client:
    """Get Supabase client"""
    return SupabaseClient.get_client()
