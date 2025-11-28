"""
Main API router - combines all endpoint routers
"""

from fastapi import APIRouter
from app.api.v1.endpoints import resume, context, smtp, email, email_management, logs, auth

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication & User Profile"]
)

api_router.include_router(
    resume.router,
    prefix="/resume",
    tags=["Resume Upload & Parsing"]
)

api_router.include_router(
    context.router,
    prefix="/context",
    tags=["User Context"]
)

api_router.include_router(
    smtp.router,
    prefix="/smtp",
    tags=["SMTP Configuration"]
)

api_router.include_router(
    email.router,
    prefix="/email",
    tags=["Email Sending"]
)

api_router.include_router(
    email_management.router,
    prefix="/emails",
    tags=["Email Management"]
)

api_router.include_router(
    logs.router,
    prefix="/logs",
    tags=["Activity Logs"]
)
