"""
Logs Service - handles activity logging and retrieval
"""

from app.database.supabase_client import get_supabase_client
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)


class LogsService:
    """Service for activity logs"""
    
    def __init__(self):
        self.supabase = get_supabase_client()
    
    async def get_logs(
        self,
        user_id: str,
        level: Optional[str] = None,
        action: Optional[str] = None,
        limit: int = 100
    ) -> List[dict]:
        """
        Get user's activity logs with optional filters
        """
        try:
            query = self.supabase.table("activity_logs")\
                .select("*")\
                .eq("user_id", user_id)\
                .order("created_at", desc=True)\
                .limit(limit)
            
            if level:
                query = query.eq("level", level)
            
            if action:
                query = query.eq("action", action)
            
            result = query.execute()
            return result.data
            
        except Exception as e:
            logger.error(f"Get logs error: {e}", exc_info=True)
            raise
    
    async def log_activity(
        self,
        user_id: str,
        level: str,
        action: str,
        message: str,
        details: Optional[dict] = None,
        related_entity_type: Optional[str] = None,
        related_entity_id: Optional[str] = None
    ) -> dict:
        """
        Create a new activity log entry
        """
        try:
            log_data = {
                "user_id": user_id,
                "level": level,
                "action": action,
                "message": message,
                "details": details,
                "related_entity_type": related_entity_type,
                "related_entity_id": related_entity_id
            }
            
            result = self.supabase.table("activity_logs")\
                .insert(log_data)\
                .execute()
            
            return result.data[0]
            
        except Exception as e:
            logger.error(f"Log activity error: {e}", exc_info=True)
            # Don't raise - logging should not break main flow
            return {}
    
    async def clear_old_logs(
        self,
        user_id: str,
        days: int = 30
    ) -> int:
        """
        Clear logs older than specified days
        """
        try:
            from datetime import datetime, timedelta
            
            cutoff_date = datetime.utcnow() - timedelta(days=days)
            
            result = self.supabase.table("activity_logs")\
                .delete()\
                .eq("user_id", user_id)\
                .lt("created_at", cutoff_date.isoformat())\
                .execute()
            
            return len(result.data) if result.data else 0
            
        except Exception as e:
            logger.error(f"Clear old logs error: {e}", exc_info=True)
            raise
    
    async def get_logs_stats(self, user_id: str) -> dict:
        """
        Get statistics about user's logs
        """
        try:
            # Get all logs for user
            result = self.supabase.table("activity_logs")\
                .select("level, action")\
                .eq("user_id", user_id)\
                .execute()
            
            logs = result.data
            
            # Calculate stats
            stats = {
                "total": len(logs),
                "by_level": {
                    "info": 0,
                    "warning": 0,
                    "error": 0,
                    "success": 0
                },
                "by_action": {}
            }
            
            for log in logs:
                level = log.get("level", "info")
                action = log.get("action", "unknown")
                
                stats["by_level"][level] = stats["by_level"].get(level, 0) + 1
                stats["by_action"][action] = stats["by_action"].get(action, 0) + 1
            
            return stats
            
        except Exception as e:
            logger.error(f"Get logs stats error: {e}", exc_info=True)
            raise
