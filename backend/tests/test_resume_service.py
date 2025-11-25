"""
Tests for Resume Service
"""
import pytest
from unittest.mock import Mock, AsyncMock, patch
from app.services.resume_service import ResumeService


@pytest.mark.asyncio
async def test_save_resume_success(mock_supabase, mock_user_id, sample_resume_data):
    """Test successful resume save"""
    service = ResumeService()
    
    # Mock successful database insert
    mock_supabase.execute.return_value = {
        "data": [{
            "id": "resume-id-123",
            "user_id": mock_user_id,
            "file_name": "test_resume.pdf",
            "parsed_data": sample_resume_data
        }],
        "error": None
    }
    
    with patch('app.services.resume_service.get_supabase_client', return_value=mock_supabase):
        result = await service.save_resume(
            user_id=mock_user_id,
            file_name="test_resume.pdf",
            file_path="resumes/test_resume.pdf",
            extracted_text="Sample resume text",
            parsed_data=sample_resume_data
        )
    
    assert result["success"] is True
    assert "resume_id" in result


@pytest.mark.asyncio
async def test_get_user_resumes(mock_supabase, mock_user_id, sample_resume_data):
    """Test fetching user resumes"""
    service = ResumeService()
    
    mock_supabase.execute.return_value = {
        "data": [
            {
                "id": "resume-1",
                "file_name": "resume1.pdf",
                "parsed_data": sample_resume_data,
                "created_at": "2024-01-01T00:00:00"
            }
        ],
        "error": None
    }
    
    with patch('app.services.resume_service.get_supabase_client', return_value=mock_supabase):
        result = await service.get_user_resumes(mock_user_id)
    
    assert len(result) == 1
    assert result[0]["file_name"] == "resume1.pdf"


@pytest.mark.asyncio
async def test_get_resume_by_id_not_found(mock_supabase, mock_user_id):
    """Test resume not found scenario"""
    service = ResumeService()
    
    mock_supabase.execute.return_value = {
        "data": [],
        "error": None
    }
    
    with patch('app.services.resume_service.get_supabase_client', return_value=mock_supabase):
        with pytest.raises(Exception, match="Resume not found"):
            await service.get_resume_by_id(mock_user_id, "non-existent-id")
