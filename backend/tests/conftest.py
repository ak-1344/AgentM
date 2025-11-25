"""
Pytest configuration and fixtures for Agent M backend tests
"""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import Mock, AsyncMock
import os

# Set test environment
os.environ["ENVIRONMENT"] = "test"
os.environ["SECRET_KEY"] = "test-secret-key-for-testing-only"
os.environ["ENCRYPTION_KEY"] = "test-encryption-key-32-bytes-long!"
os.environ["SUPABASE_URL"] = "https://test.supabase.co"
os.environ["SUPABASE_SERVICE_ROLE_KEY"] = "test-service-role-key"
os.environ["OPENAI_API_KEY"] = "test-openai-key"

from app.core.config import settings
from main import app


@pytest.fixture
def client():
    """Test client fixture"""
    return TestClient(app)


@pytest.fixture
def mock_supabase():
    """Mock Supabase client"""
    mock = Mock()
    mock.table = Mock(return_value=mock)
    mock.select = Mock(return_value=mock)
    mock.insert = Mock(return_value=mock)
    mock.update = Mock(return_value=mock)
    mock.delete = Mock(return_value=mock)
    mock.eq = Mock(return_value=mock)
    mock.execute = AsyncMock(return_value={"data": [], "error": None})
    return mock


@pytest.fixture
def mock_user_id():
    """Mock authenticated user ID"""
    return "123e4567-e89b-12d3-a456-426614174000"


@pytest.fixture
def sample_resume_data():
    """Sample resume data for testing"""
    return {
        "personal_info": {
            "name": "John Doe",
            "email": "john.doe@example.com",
            "phone": "+1234567890"
        },
        "skills": ["Python", "FastAPI", "React", "TypeScript"],
        "experience": [
            {
                "title": "Senior Developer",
                "company": "Tech Corp",
                "duration": "2020-2023"
            }
        ],
        "education": [
            {
                "degree": "BS Computer Science",
                "institution": "University of Tech"
            }
        ]
    }


@pytest.fixture
def sample_context_data():
    """Sample context profile data"""
    return {
        "target_roles": ["Software Engineer", "Backend Developer"],
        "preferred_industries": ["Technology", "SaaS"],
        "experience_level": "Senior",
        "keywords": ["Python", "FastAPI", "Microservices"],
        "additional_context": "Looking for remote opportunities",
        "geography": ["United States", "Europe"]
    }


@pytest.fixture
def sample_smtp_config():
    """Sample SMTP configuration"""
    return {
        "smtp_host": "smtp.gmail.com",
        "smtp_port": 587,
        "smtp_username": "test@example.com",
        "smtp_password": "test-app-password",
        "from_email": "test@example.com",
        "from_name": "Test User"
    }
