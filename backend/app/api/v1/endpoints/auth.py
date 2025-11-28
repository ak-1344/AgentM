"""
Auth API endpoints for user profile management
"""

from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any
import logging

from app.core.security import get_current_user_id
from app.services.auth_service import AuthService
from app.models.schemas import UserProfileResponse, UserProfileUpdateRequest, UserStatsResponse

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/profile", response_model=UserProfileResponse)
async def get_user_profile(
    user_id: str = Depends(get_current_user_id)
):
    """
    Get current user's profile
    """
    try:
        service = AuthService()
        profile = await service.get_user_profile(user_id)
        
        if not profile:
            raise HTTPException(status_code=404, detail="User profile not found")
        
        return UserProfileResponse(**profile)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching user profile: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/profile", response_model=UserProfileResponse)
async def update_user_profile(
    request: UserProfileUpdateRequest,
    user_id: str = Depends(get_current_user_id)
):
    """
    Update current user's profile
    """
    try:
        service = AuthService()
        
        # Build update dictionary with only provided fields
        updates = {}
        if request.full_name is not None:
            updates['full_name'] = request.full_name
        if request.phone is not None:
            updates['phone'] = request.phone
        if request.company is not None:
            updates['company'] = request.company
        if request.job_title is not None:
            updates['job_title'] = request.job_title
        
        if not updates:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        updated_profile = await service.update_user_profile(user_id, updates)
        return UserProfileResponse(**updated_profile)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating user profile: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/profile")
async def delete_user_profile(
    user_id: str = Depends(get_current_user_id)
):
    """
    Delete current user's profile and all associated data
    WARNING: This action is irreversible
    """
    try:
        service = AuthService()
        success = await service.delete_user_profile(user_id)
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to delete user profile")
        
        return {"message": "User profile and all associated data deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting user profile: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/stats", response_model=UserStatsResponse)
async def get_user_stats(
    user_id: str = Depends(get_current_user_id)
):
    """
    Get current user's statistics
    """
    try:
        service = AuthService()
        stats = await service.get_user_stats(user_id)
        
        return UserStatsResponse(**stats)
    except Exception as e:
        logger.error(f"Error fetching user stats: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
