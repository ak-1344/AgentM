"""
Main API router - combines all endpoint routers
"""

from fastapi import APIRouter
from app.api.v1.endpoints import resume, context, smtp, email

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(
    resume.router,
    prefix="/upload",
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
