"""
Pydantic models for API requests and responses
"""

from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime


# Resume models
class ResumeUploadResponse(BaseModel):
    """Response after resume upload"""
    resume_id: str
    file_name: str
    file_path: str
    message: str


class ParsedResumeData(BaseModel):
    """Parsed resume data from AI"""
    skills: List[str]
    experience_years: Optional[int]
    education: List[str]
    job_titles: List[str]
    achievements: List[str]


class ResumeParseResponse(BaseModel):
    """Response after resume parsing"""
    resume_id: str
    parsed_data: ParsedResumeData
    message: str


# Context models
class ContextBuildRequest(BaseModel):
    """Request to build user context"""
    target_roles: List[str]
    preferred_industries: List[str]
    pitch_tone: str = "professional"
    keywords: List[str] = []
    custom_message: Optional[str] = None
    geography: List[str] = []


class ContextResponse(BaseModel):
    """User context response"""
    id: str
    user_id: str
    target_roles: List[str]
    preferred_industries: List[str]
    pitch_tone: str
    keywords: List[str]
    custom_message: Optional[str]
    geography: List[str]
    created_at: datetime
    updated_at: datetime


# SMTP models
class SMTPCredentialsRequest(BaseModel):
    """Request to save SMTP credentials"""
    smtp_host: str
    smtp_port: int
    smtp_user: EmailStr
    smtp_password: str
    use_tls: bool = True


class SMTPCredentialsResponse(BaseModel):
    """SMTP credentials response (without password)"""
    id: str
    user_id: str
    smtp_host: str
    smtp_port: int
    smtp_user: str
    use_tls: bool
    is_active: bool
    created_at: datetime


class SMTPTestResponse(BaseModel):
    """SMTP connection test response"""
    success: bool
    message: str


# Email models
class EmailSendRequest(BaseModel):
    """Request to send email manually (Phase 1)"""
    to_email: EmailStr
    subject: str
    body: str
    cc: Optional[List[EmailStr]] = None
    bcc: Optional[List[EmailStr]] = None


class EmailSendResponse(BaseModel):
    """Email send response"""
    success: bool
    message: str
    sent_at: Optional[datetime] = None


# Error response
class ErrorResponse(BaseModel):
    """Standard error response"""
    detail: str
