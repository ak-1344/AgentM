"""
Logs API endpoints
"""

from fastapi import APIRouter, HTTPException, Depends
from app.core.security import get_current_user_id
from app.models.schemas import LogsResponse, LogEntry
from app.services.logs_service import LogsService
from typing import Optional
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/", response_model=LogsResponse)
async def get_logs(
    level: Optional[str] = None,
    action: Optional[str] = None,
    limit: int = 100,
    user_id: str = Depends(get_current_user_id)
):
    """
    Get activity logs with optional filters
    """
    try:
        service = LogsService()
        logs = await service.get_logs(
            user_id=user_id,
            level=level,
            action=action,
            limit=limit
        )
        
        return LogsResponse(
            logs=[LogEntry(**log) for log in logs],
            total=len(logs)
        )
        
    except Exception as e:
        logger.error(f"Get logs error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/stats")
async def get_logs_stats(
    user_id: str = Depends(get_current_user_id)
):
    """
    Get logs statistics
    """
    try:
        service = LogsService()
        stats = await service.get_logs_stats(user_id=user_id)
        
        return stats
        
    except Exception as e:
        logger.error(f"Get logs stats error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/clear")
async def clear_old_logs(
    days: int = 30,
    user_id: str = Depends(get_current_user_id)
):
    """
    Clear logs older than specified days
    """
    try:
        service = LogsService()
        deleted_count = await service.clear_old_logs(
            user_id=user_id,
            days=days
        )
        
        return {
            "success": True,
            "message": f"Cleared {deleted_count} old logs",
            "deleted_count": deleted_count
        }
        
    except Exception as e:
        logger.error(f"Clear logs error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
