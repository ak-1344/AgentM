# Backend Tests

This directory contains tests for the Agent M backend API.

## Structure

```
tests/
├── __init__.py              # Package initialization
├── conftest.py              # Pytest fixtures and configuration
├── test_resume_service.py   # Resume service tests
├── test_context_service.py  # Context service tests
├── test_api_endpoints.py    # API integration tests
└── README.md                # This file
```

## Running Tests

### Prerequisites

Install test dependencies:

```bash
cd backend
pip install pytest pytest-asyncio pytest-cov httpx
```

### Run All Tests

```bash
pytest
```

### Run with Coverage

```bash
pytest --cov=app --cov-report=html --cov-report=term
```

Coverage report will be generated in `htmlcov/` directory.

### Run Specific Test File

```bash
pytest tests/test_resume_service.py
```

### Run Specific Test

```bash
pytest tests/test_resume_service.py::test_save_resume_success
```

### Run with Verbose Output

```bash
pytest -v
```

### Run Tests in Parallel

```bash
pip install pytest-xdist
pytest -n auto
```

## Test Configuration

Test configuration is defined in `conftest.py`:

- **Environment Variables**: Automatically set to test values
- **Fixtures**: Reusable test data and mocks
- **Client**: FastAPI test client for integration tests
- **Mocks**: Pre-configured mocks for external services

## Writing Tests

### Unit Tests

Test individual functions and methods:

```python
import pytest
from app.services.my_service import MyService

@pytest.mark.asyncio
async def test_my_function():
    service = MyService()
    result = await service.my_function()
    assert result == expected_value
```

### Integration Tests

Test API endpoints:

```python
def test_my_endpoint(client):
    response = client.post("/api/v1/my-endpoint", json={"data": "value"})
    assert response.status_code == 200
    assert response.json()["success"] is True
```

### Using Fixtures

```python
def test_with_mock_data(mock_user_id, sample_resume_data):
    # Use fixture data in your test
    assert mock_user_id is not None
    assert "skills" in sample_resume_data
```

## Mocking External Services

### Supabase

```python
from unittest.mock import patch

with patch('app.services.my_service.get_supabase_client', return_value=mock_supabase):
    result = await service.my_method()
```

### OpenAI

```python
with patch('app.services.ai_service.openai.ChatCompletion.create') as mock_openai:
    mock_openai.return_value = {"choices": [{"message": {"content": "test"}}]}
    result = await ai_service.parse_resume(text)
```

## Test Coverage Goals

- **Unit Tests**: Aim for 80%+ coverage of service layer
- **Integration Tests**: Cover all API endpoints
- **Error Cases**: Test error handling and edge cases
- **Authentication**: Test protected endpoints require auth

## Current Test Status

✅ **Implemented**:
- Resume service tests (save, get, not found)
- Context service tests (save, get, update)
- API endpoint tests (health, auth protection, CORS)
- Pytest configuration with fixtures

🚧 **To Be Added** (Future):
- SMTP service tests
- Email service tests
- AI service tests (with mocked OpenAI)
- File upload tests
- Database migration tests
- Performance tests

## Continuous Integration

Tests run automatically on:
- Push to main branch
- Pull request creation
- Manual workflow dispatch

See `.github/workflows/test.yml` for CI configuration.

## Best Practices

1. **Isolate Tests**: Each test should be independent
2. **Use Fixtures**: Reuse common test data
3. **Mock External Services**: Don't make real API calls
4. **Test Edge Cases**: Empty data, invalid input, errors
5. **Clear Names**: Test names should describe what they test
6. **Fast Tests**: Keep tests fast by mocking I/O
7. **Clean Up**: Use fixtures for setup and teardown

## Troubleshooting

### Import Errors

Make sure you're running from the backend directory:
```bash
cd backend
pytest
```

### Async Test Errors

Ensure pytest-asyncio is installed and tests are marked:
```python
@pytest.mark.asyncio
async def test_async_function():
    pass
```

### Environment Variables

Tests automatically set test environment variables in `conftest.py`. If you need to override:
```bash
ENVIRONMENT=test pytest
```

## Resources

- [Pytest Documentation](https://docs.pytest.org/)
- [FastAPI Testing](https://fastapi.tiangolo.com/tutorial/testing/)
- [pytest-asyncio](https://pytest-asyncio.readthedocs.io/)
- [unittest.mock](https://docs.python.org/3/library/unittest.mock.html)
