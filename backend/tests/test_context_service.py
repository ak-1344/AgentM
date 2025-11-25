"""
Tests for Context Service
"""
import pytest
from unittest.mock import patch, Mock
from app.services.context_service import ContextService


@pytest.mark.asyncio
async def test_save_context_profile_success(mock_supabase, mock_user_id, sample_context_data):
    """Test successful context profile save"""
    service = ContextService()
    
    mock_supabase.execute.return_value = {
        "data": [{
            "id": "context-id-123",
            "user_id": mock_user_id,
            **sample_context_data
        }],
        "error": None
    }
    
    with patch('app.services.context_service.get_supabase_client', return_value=mock_supabase):
        result = await service.save_context_profile(mock_user_id, sample_context_data)
    
    assert result["success"] is True
    assert "context_id" in result


@pytest.mark.asyncio
async def test_get_context_profile(mock_supabase, mock_user_id, sample_context_data):
    """Test fetching context profile"""
    service = ContextService()
    
    mock_supabase.execute.return_value = {
        "data": [{
            "id": "context-id-123",
            "user_id": mock_user_id,
            **sample_context_data
        }],
        "error": None
    }
    
    with patch('app.services.context_service.get_supabase_client', return_value=mock_supabase):
        result = await service.get_context_profile(mock_user_id)
    
    assert result is not None
    assert result["target_roles"] == sample_context_data["target_roles"]


@pytest.mark.asyncio
async def test_update_context_profile(mock_supabase, mock_user_id, sample_context_data):
    """Test updating context profile"""
    service = ContextService()
    
    updated_data = sample_context_data.copy()
    updated_data["experience_level"] = "Lead"
    
    mock_supabase.execute.return_value = {
        "data": [{
            "id": "context-id-123",
            "user_id": mock_user_id,
            **updated_data
        }],
        "error": None
    }
    
    with patch('app.services.context_service.get_supabase_client', return_value=mock_supabase):
        result = await service.update_context_profile(mock_user_id, updated_data)
    
    assert result["success"] is True
    assert result["context"]["experience_level"] == "Lead"
