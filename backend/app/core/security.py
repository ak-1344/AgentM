"""
Security utilities for authentication and encryption
"""

from jose import jwt, JWTError
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from cryptography.fernet import Fernet
from datetime import datetime, timedelta
import os

from app.core.config import settings

# HTTP Bearer token security
security = HTTPBearer()

# Initialize Fernet cipher for password encryption
cipher = Fernet(settings.ENCRYPTION_KEY.encode())


def verify_jwt_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Verify JWT token from Supabase
    Used as dependency in protected endpoints
    """
    try:
        token = credentials.credentials
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated"
        )
        return payload
    except JWTError as e:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication credentials"
        )


def get_current_user_id(token_payload: dict = Security(verify_jwt_token)) -> str:
    """
    Extract user ID from verified JWT token
    """
    user_id = token_payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user_id


def encrypt_password(password: str) -> str:
    """Encrypt password using Fernet symmetric encryption"""
    return cipher.encrypt(password.encode()).decode()


def decrypt_password(encrypted_password: str) -> str:
    """Decrypt password using Fernet"""
    return cipher.decrypt(encrypted_password.encode()).decode()


def create_access_token(data: dict, expires_delta: timedelta = None):
    """
    Create JWT access token
    (Optional - mainly using Supabase auth)
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=24)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt
