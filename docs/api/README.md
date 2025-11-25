# Agent M API Documentation

Complete reference for all API endpoints in Agent M v1.0.0.

---

## 📋 Overview

- **Base URL**: `http://localhost:8000` (development)
- **API Version**: v1
- **Authentication**: JWT Bearer token
- **Content-Type**: `application/json`
- **API Docs**: http://localhost:8000/docs (Swagger UI)

---

## 🔐 Authentication

All endpoints except `/health` require authentication.

### Get Access Token

After logging in via Supabase Auth on the frontend, the JWT token is stored in cookies and passed automatically.

**Headers:**
```http
Authorization: Bearer <your-jwt-token>
```

**Example:**
```bash
curl -H "Authorization: Bearer eyJhbGc..." \
  http://localhost:8000/api/v1/resume/
```

---

## 📚 API Endpoints

### Health Check

#### `GET /health`

Check if the API is running.

**Authentication**: Not required

**Response:**
```json
{
  "status": "healthy",
  "service": "agent-m-backend",
  "version": "1.0.0",
  "environment": "development"
}
```

**Example:**
```bash
curl http://localhost:8000/health
```

---

## 📄 Resume Endpoints

### Upload Resume

#### `POST /api/v1/resume/upload`

Upload a resume file (PDF or DOCX) for AI parsing.

**Authentication**: Required

**Request:**
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `file`: Resume file (PDF/DOCX)

**Response:**
```json
{
  "message": "Resume uploaded and parsed successfully",
  "resume_id": "uuid",
  "file_path": "user-id/resumes/filename.pdf",
  "parsed_data": {
    "skills": ["Python", "FastAPI", "React"],
    "experience": "5 years",
    "education": "BS Computer Science"
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/api/v1/resume/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@resume.pdf"
```

---

### Get Resume

#### `GET /api/v1/resume/`

Retrieve user's resume data.

**Authentication**: Required

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "file_path": "user-id/resumes/resume.pdf",
  "parsed_data": {
    "skills": ["Python", "FastAPI"],
    "experience": "5 years"
  },
  "created_at": "2025-01-01T00:00:00Z"
}
```

**Example:**
```bash
curl http://localhost:8000/api/v1/resume/ \
  -H "Authorization: Bearer <token>"
```

---

## 🎯 Context Endpoints

### Create/Update Context

#### `POST /api/v1/context/`

Create or update user's context profile.

**Authentication**: Required

**Request:**
```json
{
  "target_roles": ["Software Engineer", "Backend Developer"],
  "target_industries": ["Technology", "FinTech"],
  "target_geographies": ["Remote", "San Francisco"],
  "tone": "professional",
  "keywords": ["Python", "API", "microservices"],
  "additional_info": "Looking for senior roles"
}
```

**Response:**
```json
{
  "message": "Context profile saved successfully",
  "context_id": "uuid"
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/api/v1/context/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"target_roles": ["Software Engineer"]}'
```

---

### Get Context

#### `GET /api/v1/context/`

Retrieve user's context profile.

**Authentication**: Required

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "target_roles": ["Software Engineer"],
  "target_industries": ["Technology"],
  "tone": "professional",
  "keywords": ["Python", "API"],
  "created_at": "2025-01-01T00:00:00Z"
}
```

**Example:**
```bash
curl http://localhost:8000/api/v1/context/ \
  -H "Authorization: Bearer <token>"
```

---

## 📧 SMTP Endpoints

### Save SMTP Configuration

#### `POST /api/v1/smtp/save`

Save user's SMTP email configuration (encrypted).

**Authentication**: Required

**Request:**
```json
{
  "smtp_host": "smtp.gmail.com",
  "smtp_port": 587,
  "smtp_username": "user@gmail.com",
  "smtp_password": "app-password-here",
  "from_email": "user@gmail.com",
  "from_name": "John Doe"
}
```

**Response:**
```json
{
  "message": "SMTP configuration saved successfully",
  "config_id": "uuid"
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/api/v1/smtp/save \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"smtp_host": "smtp.gmail.com", "smtp_port": 587}'
```

---

### Test SMTP Configuration

#### `POST /api/v1/smtp/test`

Test SMTP configuration by sending a test email.

**Authentication**: Required

**Request:**
```json
{
  "test_recipient": "test@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Test email sent successfully to test@example.com"
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/api/v1/smtp/test \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"test_recipient": "me@example.com"}'
```

---

## ✉️ Email Sending Endpoint

### Send Email

#### `POST /api/v1/email/send`

Send an email using configured SMTP.

**Authentication**: Required

**Request:**
```json
{
  "to_email": "company@example.com",
  "to_name": "Hiring Manager",
  "subject": "Application for Software Engineer",
  "body": "Dear Hiring Manager,\n\nI am writing to..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully to company@example.com"
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/api/v1/email/send \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"to_email": "hr@company.com", "subject": "Hi"}'
```

---

## 📨 Email Management Endpoints

### Generate Email

#### `POST /api/v1/emails/generate`

Generate a personalized email using GPT-4 based on user context.

**Authentication**: Required

**Request:**
```json
{
  "company_name": "Acme Corp",
  "company_email": "hr@acmecorp.com",
  "position": "Senior Backend Engineer",
  "keywords": ["Python", "microservices", "AWS"]
}
```

**Response:**
```json
{
  "email_id": "uuid",
  "company_name": "Acme Corp",
  "subject": "Application for Senior Backend Engineer Position",
  "email_body": "Dear Hiring Manager,\n\nI am excited to apply...",
  "status": "new",
  "created_at": "2025-01-01T00:00:00Z"
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/api/v1/emails/generate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"company_name": "Acme", "position": "Engineer"}'
```

---

### List Emails

#### `GET /api/v1/emails/list`

List all emails with optional filtering.

**Authentication**: Required

**Query Parameters:**
- `status` (optional): Filter by status (`new`, `under_review`, `approved`, `rejected`)
- `company_name` (optional): Filter by company name

**Response:**
```json
{
  "emails": [
    {
      "id": "uuid",
      "company_name": "Acme Corp",
      "position": "Engineer",
      "status": "new",
      "subject": "Application...",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "count": 1
}
```

**Examples:**
```bash
# Get all emails
curl http://localhost:8000/api/v1/emails/list \
  -H "Authorization: Bearer <token>"

# Filter by status
curl "http://localhost:8000/api/v1/emails/list?status=approved" \
  -H "Authorization: Bearer <token>"

# Filter by company
curl "http://localhost:8000/api/v1/emails/list?company_name=Acme" \
  -H "Authorization: Bearer <token>"
```

---

### Get Email

#### `GET /api/v1/emails/{email_id}`

Get details of a specific email.

**Authentication**: Required

**Path Parameters:**
- `email_id`: UUID of the email

**Response:**
```json
{
  "id": "uuid",
  "company_name": "Acme Corp",
  "company_email": "hr@acmecorp.com",
  "position": "Engineer",
  "keywords": ["Python", "AWS"],
  "subject": "Application for Engineer Position",
  "email_body": "Dear Hiring Manager...",
  "status": "new",
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

**Example:**
```bash
curl http://localhost:8000/api/v1/emails/abc-123-def \
  -H "Authorization: Bearer <token>"
```

---

### Update Email Status

#### `PUT /api/v1/emails/{email_id}/status`

Update the status of an email.

**Authentication**: Required

**Path Parameters:**
- `email_id`: UUID of the email

**Request:**
```json
{
  "status": "approved"
}
```

**Valid statuses:** `new`, `under_review`, `approved`, `rejected`

**Response:**
```json
{
  "message": "Email status updated successfully",
  "email_id": "uuid",
  "new_status": "approved"
}
```

**Example:**
```bash
curl -X PUT http://localhost:8000/api/v1/emails/abc-123/status \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}'
```

---

### Delete Email

#### `DELETE /api/v1/emails/{email_id}`

Delete an email.

**Authentication**: Required

**Path Parameters:**
- `email_id`: UUID of the email

**Response:**
```json
{
  "message": "Email deleted successfully",
  "email_id": "uuid"
}
```

**Example:**
```bash
curl -X DELETE http://localhost:8000/api/v1/emails/abc-123 \
  -H "Authorization: Bearer <token>"
```

---

## 🤖 AI Chatbot Endpoints

### Start Chatbot Review

#### `POST /api/v1/emails/chatbot/review`

Start an AI chatbot session to review an email.

**Authentication**: Required

**Request:**
```json
{
  "email_id": "uuid"
}
```

**Response:**
```json
{
  "session_id": "uuid",
  "email_id": "uuid",
  "initial_message": "I've reviewed your email to Acme Corp. It looks professional and highlights your Python skills well. What would you like to improve?"
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/api/v1/emails/chatbot/review \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"email_id": "abc-123"}'
```

---

### Send Chatbot Message

#### `POST /api/v1/emails/chatbot/message`

Send a message to the AI chatbot and get a response.

**Authentication**: Required

**Request:**
```json
{
  "session_id": "uuid",
  "message": "Make it more engaging"
}
```

**Response:**
```json
{
  "response": "I've revised the email to be more engaging. Here's the updated version:\n\nDear Hiring Manager,\n\nI was thrilled to discover...",
  "updated_email": {
    "subject": "Excited to Join Acme Corp as Senior Engineer",
    "body": "Dear Hiring Manager,\n\nI was thrilled..."
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/api/v1/emails/chatbot/message \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"session_id": "xyz", "message": "Make it shorter"}'
```

---

### Apply Quick Action

#### `POST /api/v1/emails/chatbot/quick-action`

Apply a predefined quick action to an email.

**Authentication**: Required

**Request:**
```json
{
  "email_id": "uuid",
  "action": "make_formal"
}
```

**Valid actions:**
- `make_formal` - Make the email more formal
- `make_casual` - Make the email more casual
- `make_shorter` - Reduce email length
- `make_engaging` - Make the email more engaging

**Response:**
```json
{
  "action_applied": "make_formal",
  "updated_email": {
    "subject": "Application for Senior Backend Engineer Position",
    "body": "Dear Sir/Madam,\n\nI am writing to formally express..."
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/api/v1/emails/chatbot/quick-action \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"email_id": "abc", "action": "make_formal"}'
```

---

## 📊 Activity Log Endpoints

### Create Activity Log

#### `POST /api/v1/logs/activity`

Create a new activity log entry.

**Authentication**: Required

**Request:**
```json
{
  "activity_type": "email_generated",
  "description": "Generated email for Acme Corp",
  "level": "success",
  "metadata": {
    "company": "Acme Corp",
    "position": "Engineer"
  }
}
```

**Valid levels:** `info`, `warning`, `error`, `success`

**Response:**
```json
{
  "log_id": "uuid",
  "message": "Activity log created successfully"
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/api/v1/logs/activity \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"activity_type": "test", "description": "Test log", "level": "info"}'
```

---

### List Activity Logs

#### `GET /api/v1/logs/activity`

List all activity logs with optional filtering.

**Authentication**: Required

**Query Parameters:**
- `level` (optional): Filter by level (`info`, `warning`, `error`, `success`)

**Response:**
```json
{
  "logs": [
    {
      "id": "uuid",
      "activity_type": "email_generated",
      "description": "Generated email for Acme Corp",
      "level": "success",
      "metadata": {
        "company": "Acme Corp"
      },
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "count": 1
}
```

**Examples:**
```bash
# Get all logs
curl http://localhost:8000/api/v1/logs/activity \
  -H "Authorization: Bearer <token>"

# Filter by level
curl "http://localhost:8000/api/v1/logs/activity?level=error" \
  -H "Authorization: Bearer <token>"
```

---

### Delete Activity Log

#### `DELETE /api/v1/logs/activity/{log_id}`

Delete a specific activity log.

**Authentication**: Required

**Path Parameters:**
- `log_id`: UUID of the log

**Response:**
```json
{
  "message": "Activity log deleted successfully",
  "log_id": "uuid"
}
```

**Example:**
```bash
curl -X DELETE http://localhost:8000/api/v1/logs/activity/abc-123 \
  -H "Authorization: Bearer <token>"
```

---

### Clear All Logs

#### `DELETE /api/v1/logs/activity/clear`

Delete all activity logs for the authenticated user.

**Authentication**: Required

**Response:**
```json
{
  "message": "All activity logs cleared successfully",
  "deleted_count": 42
}
```

**Example:**
```bash
curl -X DELETE http://localhost:8000/api/v1/logs/activity/clear \
  -H "Authorization: Bearer <token>"
```

---

## 🚨 Error Responses

All endpoints return consistent error responses:

### 400 Bad Request

```json
{
  "detail": "Invalid request parameters"
}
```

### 401 Unauthorized

```json
{
  "detail": "Invalid or missing authentication token"
}
```

### 403 Forbidden

```json
{
  "detail": "You don't have permission to access this resource"
}
```

### 404 Not Found

```json
{
  "detail": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "detail": "Internal server error. Please try again later."
}
```

---

## 📊 Rate Limiting

Currently no rate limiting is implemented. This may be added in future versions.

**Planned limits:**
- 100 requests/minute per user
- 1000 requests/hour per user

---

## 🧪 Testing APIs

### Using cURL

```bash
# Set token variable
TOKEN="your-jwt-token-here"

# Test health
curl http://localhost:8000/health

# Get resume
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/resume/

# Generate email
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"company_name": "Test Corp", "position": "Engineer"}' \
  http://localhost:8000/api/v1/emails/generate
```

### Using Swagger UI

1. Open http://localhost:8000/docs
2. Click **Authorize** button
3. Enter JWT token (get from browser cookies after login)
4. Try endpoints interactively

### Using Python

```python
import requests

BASE_URL = "http://localhost:8000"
TOKEN = "your-jwt-token"

headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

# Generate email
response = requests.post(
    f"{BASE_URL}/api/v1/emails/generate",
    headers=headers,
    json={
        "company_name": "Acme Corp",
        "position": "Engineer"
    }
)

print(response.json())
```

---

## 📚 Additional Resources

- **[OpenAPI Spec](http://localhost:8000/openapi.json)** - Machine-readable API spec
- **[Swagger UI](http://localhost:8000/docs)** - Interactive API documentation
- **[ReDoc](http://localhost:8000/redoc)** - Alternative API documentation

---

## 🆘 Support

- **Documentation**: [docs/index.md](../index.md)
- **Issues**: [GitHub Issues](https://github.com/ak-1344/AgentM/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ak-1344/AgentM/discussions)

---

**[← Back to Documentation](../index.md)** | **[View Architecture →](../architecture/OVERVIEW.md)**
