import sys
import os
import asyncio
from unittest.mock import MagicMock, patch
from datetime import datetime

# Add backend to path
sys.path.append(os.getcwd())

# Mock dependencies before importing services
sys.modules["app.database.supabase_client"] = MagicMock()
sys.modules["google"] = MagicMock()
sys.modules["google.genai"] = MagicMock()
sys.modules["google.genai.types"] = MagicMock()
sys.modules["app.core.config"] = MagicMock()
sys.modules["app.core.security"] = MagicMock()
sys.modules["fastapi"] = MagicMock()
sys.modules["fastapi.responses"] = MagicMock()
sys.modules["PyPDF2"] = MagicMock()
sys.modules["docx"] = MagicMock()

# Mock Pydantic
mock_pydantic = MagicMock()
class MockBaseModel:
    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)
    
    def dict(self):
        return self.__dict__

mock_pydantic.BaseModel = MockBaseModel
mock_pydantic.EmailStr = str
mock_pydantic.Field = MagicMock()
sys.modules["pydantic"] = mock_pydantic

# Setup mocks
mock_supabase = MagicMock()
sys.modules["app.database.supabase_client"].get_supabase.return_value = mock_supabase

mock_settings = MagicMock()
mock_settings.GOOGLE_API_KEY = "test_key"
mock_settings.GOOGLE_API_KEY_PARSER = "test_key"
sys.modules["app.core.config"].settings = mock_settings

# Import services
from app.services.resume_service import ResumeService
from app.services.ai_service import AIService
from app.models.schemas import ParsedResumeData

async def test_upload_resume():
    print("Testing upload_resume...")
    service = ResumeService()
    
    # Mock file
    mock_file = MagicMock()
    mock_file.filename = "test.pdf"
    mock_file.content_type = "application/pdf"
    async def read_content():
        return b"fake content"
    mock_file.read = read_content
    
    # Mock Supabase responses
    # 1. Check existing
    mock_supabase.table().select().eq().execute.return_value.data = [{"id": "existing_id"}]
    
    # 2. Upload
    mock_supabase.storage.from_().upload.return_value = "ok"
    
    # 3. Insert
    mock_supabase.table().insert().execute.return_value.data = [{"id": "new_id"}]
    
    result = await service.upload_resume("user123", mock_file)
    
    print(f"Result: {result}")
    assert result["resume_id"] == "new_id"
    assert "resume_" in result["file_path"]
    print("✅ upload_resume passed")

async def test_parse_resume():
    print("\nTesting parse_resume_text...")
    service = AIService()
    
    # Mock GenAI client
    mock_client = MagicMock()
    with patch.object(service, "_get_client", return_value=mock_client):
        # Mock response
        mock_response = MagicMock()
        mock_response.text = '{"name": "John Doe", "links": ["github.com/john"], "skills": ["Python"], "experience_years": 5, "education": [], "job_titles": [], "achievements": []}'
        mock_client.models.generate_content.return_value = mock_response
        
        result = await service.parse_resume_text("Some resume text")
        
        print(f"Result: {result}")
        assert result.name == "John Doe"
        assert "github.com/john" in result.links
        print("✅ parse_resume_text passed")

async def main():
    try:
        await test_upload_resume()
        await test_parse_resume()
        print("\n🎉 All tests passed!")
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
