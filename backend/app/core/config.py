"""
Core configuration settings for Agent M backend
Uses pydantic-settings for environment variable management
"""

from pydantic_settings import BaseSettings
from typing import List, Optional
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Application
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"
    LOG_LEVEL: str = "INFO"
    
    # Security
    SECRET_KEY: str
    ENCRYPTION_KEY: str
    
    # Supabase
    SUPABASE_URL: str
    SUPABASE_SERVICE_ROLE_KEY: str
    SUPABASE_JWT_SECRET: str
    DATABASE_URL: str
    
    # AI & Gemini
    GOOGLE_API_KEY: str
    GOOGLE_API_KEY_PARSER: Optional[str] = None
    GOOGLE_API_KEY_GENERATOR: Optional[str] = None
    GOOGLE_API_KEY_CHATBOT: Optional[str] = None
    GEMINI_MODEL: str = "models/gemini-2.0-flash"  # Backup/fallback
    GEMINI_MODEL_PARSER: str = "models/gemini-2.0-flash"  # File extraction (PDF/DOCX)
    GEMINI_MODEL_GENERATOR: str = "models/gemini-2.5-flash"  # Text generation (context/emails)
    GEMINI_MODEL_CHATBOT: str = "models/gemini-2.5-pro"  # Conversation & review
    GEMINI_TEMPERATURE: float = 0.7
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    
    # SMTP Default Settings
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USE_TLS: bool = True
    
    class Config:
        env_file = [".env", ".env.local"]
        case_sensitive = True


# Initialize settings
settings = Settings()
