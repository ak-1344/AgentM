"""
Supabase database client singleton.
Implements thread-safe singleton pattern with strict configuration validation.
"""

import logging
import threading
from typing import Optional

from supabase import create_client, Client
from app.core.config import settings

logger = logging.getLogger(__name__)

class SupabaseClient:
    """
    Thread-safe Singleton wrapper for the Supabase client.
    """
    
    _instance: Optional[Client] = None
    _lock: threading.Lock = threading.Lock()
    
    @classmethod
    def get_client(cls) -> Client:
        """
        Get or create the Supabase client instance in a thread-safe manner.
        
        Returns:
            Client: The authenticated Supabase client.
            
        Raises:
            ValueError: If Supabase configuration settings are missing.
        """
        # First check (unlocked) - Performance optimization
        if cls._instance is None:
            # Acquire lock to ensure only one thread enters this block
            with cls._lock:
                # Second check (locked) - Essential for thread safety
                if cls._instance is None:
                    cls._initialize_client()
        
        return cls._instance

    @classmethod
    def _initialize_client(cls) -> None:
        """Internal method to initialize the client with validation."""
        try:
            # 1. Validate Configuration (Fail Fast)
            if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
                raise ValueError(
                    "Supabase URL or Key is missing in application settings."
                )

            # 2. Initialize Client
            cls._instance = create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_SERVICE_ROLE_KEY
            )
            
            logger.info("✅ Supabase client initialized successfully")
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize Supabase client: {str(e)}")
            # Re-raise to prevent the app from starting in a broken state
            raise

    @classmethod
    def reset(cls) -> None:
        """
        Resets the singleton instance. 
        CRITICAL for writing isolated unit tests.
        """
        with cls._lock:
            cls._instance = None


# Convenience function: Explicit is better than implicit.
# Kept one standard entry point.
def get_supabase_client() -> Client:
    """Public accessor for the Supabase client."""
    return SupabaseClient.get_client()
