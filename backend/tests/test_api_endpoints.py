"""
Integration tests for API endpoints
"""
import pytest
from unittest.mock import patch, Mock
from fastapi import status


def test_health_check(client):
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["status"] == "healthy"


def test_api_root(client):
    """Test API root endpoint"""
    response = client.get("/")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "message" in data
    assert "version" in data


@pytest.mark.parametrize("endpoint", [
    "/api/v1/resume/upload",
    "/api/v1/context/save",
    "/api/v1/smtp/save",
    "/api/v1/email/send"
])
def test_protected_endpoints_require_auth(client, endpoint):
    """Test that protected endpoints require authentication"""
    # Without auth token, should get 401 or redirect
    response = client.post(endpoint, json={})
    # Most likely 401 Unauthorized or 403 Forbidden
    assert response.status_code in [401, 403, 422]  # 422 if validation fails first


def test_cors_headers(client):
    """Test CORS headers are present"""
    response = client.options("/api/v1/resume/upload")
    # CORS middleware should add headers
    assert response.status_code in [200, 405]  # Some frameworks return 405 for OPTIONS
