"""
Authentication and user profile service
Handles user registration, profile management, and authentication helpers
"""

import logging
from typing import Optional, Dict, Any
from datetime import datetime

from app.database.supabase_client import get_supabase_client

logger = logging.getLogger(__name__)


class AuthService:
    """Service for authentication and user profile operations"""
    
    def __init__(self):
        self.supabase = get_supabase_client()
    
    async def get_user_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        """
        Get user profile by user ID
        
        Args:
            user_id: User's unique identifier
            
        Returns:
            User profile data or None if not found
        """
        try:
            response = self.supabase.table('user_profiles') \
                .select('*') \
                .eq('id', user_id) \
                .single() \
                .execute()
            
            return response.data if response.data else None
        except Exception as e:
            logger.error(f"Error fetching user profile for {user_id}: {e}")
            return None
    
    async def create_user_profile(
        self,
        user_id: str,
        email: str,
        full_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Create a new user profile
        
        Args:
            user_id: User's unique identifier
            email: User's email address
            full_name: User's full name (optional)
            
        Returns:
            Created user profile data
        """
        try:
            profile_data = {
                'id': user_id,
                'email': email,
                'full_name': full_name,
                'created_at': datetime.utcnow().isoformat(),
                'updated_at': datetime.utcnow().isoformat(),
            }
            
            response = self.supabase.table('user_profiles') \
                .upsert(profile_data) \
                .execute()
            
            logger.info(f"User profile created for {user_id}")
            return response.data[0] if response.data else profile_data
        except Exception as e:
            logger.error(f"Error creating user profile for {user_id}: {e}")
            raise
    
    async def update_user_profile(
        self,
        user_id: str,
        updates: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Update user profile
        
        Args:
            user_id: User's unique identifier
            updates: Dictionary of fields to update
            
        Returns:
            Updated user profile data
        """
        try:
            # Add updated_at timestamp
            updates['updated_at'] = datetime.utcnow().isoformat()
            
            response = self.supabase.table('user_profiles') \
                .update(updates) \
                .eq('id', user_id) \
                .execute()
            
            logger.info(f"User profile updated for {user_id}")
            return response.data[0] if response.data else {}
        except Exception as e:
            logger.error(f"Error updating user profile for {user_id}: {e}")
            raise
    
    async def delete_user_profile(self, user_id: str) -> bool:
        """
        Delete user profile and associated data
        
        Args:
            user_id: User's unique identifier
            
        Returns:
            True if successful, False otherwise
        """
        try:
            # Note: This should cascade delete related data based on DB constraints
            self.supabase.table('user_profiles') \
                .delete() \
                .eq('id', user_id) \
                .execute()
            
            logger.info(f"User profile deleted for {user_id}")
            return True
        except Exception as e:
            logger.error(f"Error deleting user profile for {user_id}: {e}")
            return False
    
    async def check_user_exists(self, email: str) -> bool:
        """
        Check if a user with the given email exists
        
        Args:
            email: Email address to check
            
        Returns:
            True if user exists, False otherwise
        """
        try:
            response = self.supabase.table('user_profiles') \
                .select('id') \
                .eq('email', email) \
                .execute()
            
            return len(response.data) > 0 if response.data else False
        except Exception as e:
            logger.error(f"Error checking if user exists: {e}")
            return False
    
    async def get_user_stats(self, user_id: str) -> Dict[str, Any]:
        """
        Get user statistics (resumes, contexts, emails sent, etc.)
        
        Args:
            user_id: User's unique identifier
            
        Returns:
            Dictionary with user statistics
        """
        try:
            stats = {
                'resumes_count': 0,
                'contexts_count': 0,
                'smtp_configured': False,
                'emails_sent': 0,
            }
            
            # Count resumes
            resume_response = self.supabase.table('resumes') \
                .select('id', count='exact') \
                .eq('user_id', user_id) \
                .execute()
            stats['resumes_count'] = resume_response.count if hasattr(resume_response, 'count') else 0
            
            # Count contexts
            context_response = self.supabase.table('user_contexts') \
                .select('id', count='exact') \
                .eq('user_id', user_id) \
                .execute()
            stats['contexts_count'] = context_response.count if hasattr(context_response, 'count') else 0
            
            # Check SMTP configuration
            smtp_response = self.supabase.table('smtp_credentials') \
                .select('id') \
                .eq('user_id', user_id) \
                .execute()
            stats['smtp_configured'] = len(smtp_response.data) > 0 if smtp_response.data else False
            
            # Count emails sent (if email_logs table exists)
            try:
                email_response = self.supabase.table('email_logs') \
                    .select('id', count='exact') \
                    .eq('user_id', user_id) \
                    .eq('status', 'sent') \
                    .execute()
                stats['emails_sent'] = email_response.count if hasattr(email_response, 'count') else 0
            except:
                pass  # Table might not exist yet
            
            return stats
        except Exception as e:
            logger.error(f"Error fetching user stats for {user_id}: {e}")
            return {}
