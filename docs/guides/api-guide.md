# API Usage Guide

Complete guide to using the Agent M API.

---

## Base URL

**Local Development:**
```
http://localhost:8000
```

**Production:**
```
https://api.yourdomain.com
```

---

## Authentication

All API endpoints (except health check) require authentication.

### Get JWT Token

The frontend handles authentication automatically via Supabase. For direct API access:

1. Sign up via frontend or Supabase Auth
2. Get access token from Supabase session
3. Include in requests:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:8000/api/v1/resume
```

---

## API Documentation

### Interactive Docs

Visit these URLs for interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## Endpoints Reference

### Health Check

**GET** `/health`

Check if API is running.

```bash
curl http://localhost:8000/health
```

Response:
```json
{
  "status": "healthy"
}
```

---

### Resume Endpoints

#### Upload Resume

**POST** `/api/v1/upload/resume`

Upload a PDF or DOCX resume file.

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/resume.pdf" \
  http://localhost:8000/api/v1/upload/resume
```

Response:
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "file_name": "resume.pdf",
  "file_path": "path/in/storage",
  "file_size": 245678,
  "uploaded_at": "2024-01-20T10:30:00Z"
}
```

#### Parse Resume

**POST** `/api/v1/parse/resume/{resume_id}`

Parse resume with AI to extract structured data.

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/parse/resume/RESUME_UUID
```

Response:
```json
{
  "id": "uuid",
  "parsed_data": {
    "skills": ["Python", "FastAPI", "React", "TypeScript"],
    "experience": [
      {
        "company": "Tech Corp",
        "role": "Software Engineer",
        "duration": "2020-2023",
        "description": "Built APIs..."
      }
    ],
    "education": [
      {
        "institution": "University",
        "degree": "BS Computer Science",
        "year": "2020"
      }
    ]
  },
  "parsed_at": "2024-01-20T10:35:00Z"
}
```

#### Get Resume

**GET** `/api/v1/resume`

Get user's current resume.

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/resume
```

---

### Context Endpoints

#### Create/Update Context

**POST** `/api/v1/context/build`

Create or update user's outreach context.

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "target_roles": ["Software Engineer", "Full Stack Developer"],
    "target_industries": ["FinTech", "HealthTech"],
    "target_locations": ["San Francisco", "Remote"],
    "keywords": ["startup", "growth stage", "remote-first"],
    "preferred_tone": "professional",
    "additional_context": "Looking for senior roles with equity"
  }' \
  http://localhost:8000/api/v1/context/build
```

Response:
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "target_roles": ["Software Engineer", "Full Stack Developer"],
  "target_industries": ["FinTech", "HealthTech"],
  "target_locations": ["San Francisco", "Remote"],
  "keywords": ["startup", "growth stage", "remote-first"],
  "preferred_tone": "professional",
  "additional_context": "Looking for senior roles with equity",
  "created_at": "2024-01-20T10:40:00Z",
  "updated_at": "2024-01-20T10:40:00Z"
}
```

#### Get Context

**GET** `/api/v1/context`

Get user's context profile.

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/context
```

---

### SMTP Endpoints

#### Save SMTP Credentials

**POST** `/api/v1/smtp/credentials`

Save user's SMTP email credentials (encrypted).

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "smtp_host": "smtp.gmail.com",
    "smtp_port": 587,
    "smtp_username": "your.email@gmail.com",
    "smtp_password": "your-app-password"
  }' \
  http://localhost:8000/api/v1/smtp/credentials
```

Response:
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "smtp_host": "smtp.gmail.com",
  "smtp_port": 587,
  "smtp_username": "your.email@gmail.com",
  "created_at": "2024-01-20T10:45:00Z"
}
```

Note: Password is encrypted and never returned.

#### Get SMTP Credentials

**GET** `/api/v1/smtp/credentials`

Get user's SMTP configuration (password excluded).

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/smtp/credentials
```

#### Test SMTP Connection

**POST** `/api/v1/smtp/test`

Test SMTP connection by sending a test email.

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/smtp/test
```

Response:
```json
{
  "success": true,
  "message": "Test email sent successfully to your.email@gmail.com"
}
```

---

### Email Endpoints

#### Send Email

**POST** `/api/v1/email/send`

Send an email using user's SMTP credentials.

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@company.com",
    "subject": "Application for Software Engineer Position",
    "body": "Dear Hiring Manager,\n\nI am writing to express my interest...",
    "cc": ["another@email.com"],
    "bcc": []
  }' \
  http://localhost:8000/api/v1/email/send
```

Response:
```json
{
  "success": true,
  "message": "Email sent successfully",
  "sent_at": "2024-01-20T10:50:00Z"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "detail": "Error message here"
}
```

### Common Error Codes

- `400` - Bad Request (invalid input)
- `401` - Unauthorized (missing or invalid token)
- `404` - Not Found (resource doesn't exist)
- `422` - Validation Error (invalid data format)
- `500` - Internal Server Error

Example validation error:
```json
{
  "detail": [
    {
      "loc": ["body", "smtp_port"],
      "msg": "ensure this value is less than or equal to 65535",
      "type": "value_error.number.not_le"
    }
  ]
}
```

---

## Rate Limiting

Currently no rate limiting implemented. Will be added in Phase 2.

Planned limits:
- API calls: 100/minute
- Email sending: 50/hour
- Resume parsing: 10/hour

---

## Best Practices

### 1. Always Check HTTP Status

```python
response = requests.post(url, headers=headers, json=data)
if response.status_code == 200:
    result = response.json()
else:
    print(f"Error: {response.status_code}")
    print(response.json())
```

### 2. Handle Timeouts

```python
try:
    response = requests.post(url, timeout=30)
except requests.Timeout:
    print("Request timed out")
```

### 3. Store Tokens Securely

Never hardcode tokens. Use environment variables:

```python
import os
token = os.getenv("API_TOKEN")
```

### 4. Validate Input Before Sending

```python
# Check file size before upload
if os.path.getsize(file_path) > 10 * 1024 * 1024:
    print("File too large (max 10MB)")
    return
```

---

## Python Client Example

```python
import requests
import os

class AgentMClient:
    def __init__(self, base_url, token):
        self.base_url = base_url
        self.headers = {
            "Authorization": f"Bearer {token}"
        }
    
    def upload_resume(self, file_path):
        url = f"{self.base_url}/api/v1/upload/resume"
        with open(file_path, 'rb') as f:
            files = {'file': f}
            response = requests.post(url, headers=self.headers, files=files)
        return response.json()
    
    def parse_resume(self, resume_id):
        url = f"{self.base_url}/api/v1/parse/resume/{resume_id}"
        response = requests.post(url, headers=self.headers)
        return response.json()
    
    def create_context(self, context_data):
        url = f"{self.base_url}/api/v1/context/build"
        response = requests.post(url, headers=self.headers, json=context_data)
        return response.json()
    
    def send_email(self, email_data):
        url = f"{self.base_url}/api/v1/email/send"
        response = requests.post(url, headers=self.headers, json=email_data)
        return response.json()

# Usage
client = AgentMClient(
    base_url="http://localhost:8000",
    token=os.getenv("API_TOKEN")
)

# Upload and parse resume
resume = client.upload_resume("resume.pdf")
parsed = client.parse_resume(resume['id'])

# Create context
context = client.create_context({
    "target_roles": ["Software Engineer"],
    "target_industries": ["Tech"],
    "preferred_tone": "professional"
})

# Send email
result = client.send_email({
    "to": "hiring@company.com",
    "subject": "Application",
    "body": "Hello..."
})
```

---

## JavaScript/TypeScript Client

The frontend already includes an API client at `frontend/lib/api.ts`. You can use it as reference for your own client.

Example:
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Usage
const uploadResume = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/api/v1/upload/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};
```

---

## Testing the API

### Using cURL

All examples above use cURL for easy testing.

### Using Postman

1. Import OpenAPI spec from `/docs` endpoint
2. Set up environment with:
   - `base_url`: http://localhost:8000
   - `token`: Your JWT token
3. Use `{{base_url}}` and `{{token}}` in requests

### Using HTTPie

```bash
# Install HTTPie
pip install httpie

# Make requests
http POST http://localhost:8000/api/v1/context/build \
  Authorization:"Bearer TOKEN" \
  target_roles:='["Software Engineer"]' \
  preferred_tone="professional"
```

---

## Support

For API issues:
- Check `/docs` for latest endpoint documentation
- Review error responses for details
- Check backend logs: `docker-compose logs backend`
- Open GitHub issue with request/response details

---

**Happy API building! 🚀**
