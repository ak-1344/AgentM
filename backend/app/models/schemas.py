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
    is_upload_completed: bool = True
    is_parse_completed: bool = False
    message: str


class ParsedResumeData(BaseModel):
    """Parsed resume data from AI"""
    name: Optional[str] = None
    links: Optional[dict] = {}  # Changed to dict for key-value pairs like {"LinkedIn": "url", "GitHub": "url"}
    skills: List[str]
    experience_years: Optional[int]
    education: List[str]
    job_titles: List[str]
    achievements: List[str]


class ResumeParseResponse(BaseModel):
    """Response after resume parsing"""
    resume_id: str
    parsed_data: ParsedResumeData
    is_upload_completed: bool = True
    is_parse_completed: bool = True
    message: str


# Context models
class ContextBuildRequest(BaseModel):
    """Request to build user context"""
    purpose: str  # Jobs, Sponsorship, Freelancing, etc.
    target_roles: List[str]
    preferred_industries: List[str]
    pitch_tone: str = "professional"
    keywords: List[str] = []
    custom_message: Optional[str] = None
    geography: List[str] = []
    resume_extracted_text: Optional[str] = None
    resume_parsed_data: Optional[dict] = None


class ContextResponse(BaseModel):
    """User context response"""
    id: str
    user_id: str
    purpose: Optional[str] = None
    target_roles: List[str]
    preferred_industries: List[str]
    pitch_tone: str
    keywords: List[str]
    custom_message: Optional[str]
    geography: List[str]
    resume_extracted_text: Optional[str] = None
    resume_parsed_data: Optional[dict] = None
    created_at: datetime
    updated_at: datetime


class ContextSuggestionsResponse(BaseModel):
    """AI-generated context suggestions"""
    suggested_roles: List[str] = []
    suggested_industries: List[str] = []
    suggested_keywords: List[str] = []
    suggested_geography: List[str] = []


class PredefinedTagsResponse(BaseModel):
    """Predefined tags for context setup (no AI needed)"""
    purposes: List[str]
    roles: List[str]
    industries: List[str]
    keywords: List[str]
    locations: List[str]


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


# AI Email Management models
class EmailGenerateRequest(BaseModel):
    """Request to generate AI email"""
    company_name: str
    company_website: Optional[str] = None
    company_location: Optional[str] = None
    position_title: Optional[str] = None
    job_type: Optional[str] = None
    salary_range: Optional[str] = None
    keywords: Optional[List[str]] = None
    custom_prompt: Optional[str] = None


class EmailResponse(BaseModel):
    """AI Email response"""
    id: str
    user_id: str
    recipient_email: str
    recipient_name: Optional[str]
    subject: str
    content: str
    company_name: Optional[str]
    company_website: Optional[str]
    company_location: Optional[str]
    position_title: Optional[str]
    keywords: List[str]
    job_type: Optional[str]
    salary_range: Optional[str]
    status: str
    created_at: datetime
    updated_at: datetime


class EmailUpdateStatusRequest(BaseModel):
    """Request to update email status"""
    status: str


class EmailUpdateContentRequest(BaseModel):
    """Request to update email content"""
    subject: Optional[str] = None
    content: Optional[str] = None
    recipient_email: Optional[str] = None
    recipient_name: Optional[str] = None


class ChatMessageRequest(BaseModel):
    """Chat message request"""
    message: str


class ChatMessageResponse(BaseModel):
    """Chat message response"""
    message: str
    email_updated: bool


class QuickActionRequest(BaseModel):
    """Quick action request"""
    action: str


# Logs models
class LogEntry(BaseModel):
    """Activity log entry"""
    id: str
    user_id: str
    level: str
    action: str
    message: str
    details: Optional[dict]
    related_entity_type: Optional[str]
    related_entity_id: Optional[str]
    created_at: datetime


class LogsResponse(BaseModel):
    """Logs list response"""
    logs: List[LogEntry]
    total: int
    message: str
    sent_at: Optional[datetime] = None


# Error response
class ErrorResponse(BaseModel):
    """Standard error response"""
    detail: str
