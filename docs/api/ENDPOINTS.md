# Agent M - API Documentation

**Version:** 1.0.0  
**Base URL:** `http://localhost:8000` (Development) | `https://api.agentm.com` (Production)  
**Last Updated:** November 29, 2025

---

## Table of Contents

1. [Authentication](#authentication)
2. [Resume Management](#resume-management)
3. [Context Management](#context-management)
4. [SMTP Configuration](#smtp-configuration)
5. [Email Management](#email-management)
6. [Email Sending](#email-sending)
7. [Activity Logs](#activity-logs)
8. [Health Check](#health-check)

---

## Authentication

All API endpoints (except `/health` and auth endpoints) require JWT authentication.

### Headers Required

```http
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

### Get JWT Token

**Note:** Authentication is handled by Supabase Auth. Obtain your JWT token from Supabase authentication flow on the frontend.

---

## Resume Management

### 1. Upload Resume

Upload a PDF, DOC, or DOCX resume file.

**Endpoint:** `POST /api/v1/resume/upload`

**Headers:**
```http
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Request Body:**
```http
Content-Disposition: form-data; name="file"; filename="resume.pdf"
Content-Type: application/pdf

<binary file data>
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "user_123",
  "filename": "resume.pdf",
  "file_path": "resumes/user_123/resume.pdf",
  "file_size": 245678,
  "file_type": "application/pdf",
  "created_at": "2025-11-29T10:30:00Z",
  "message": "Resume uploaded successfully"
}
```

**Error Responses:**
```json
// 400 Bad Request
{
  "detail": "Invalid file type. Only PDF, DOC, and DOCX files are allowed"
}

// 413 Payload Too Large
{
  "detail": "File too large. Maximum size is 10MB"
}
```

---

### 2. Parse Resume with AI

Extract structured data from uploaded resume using AI.

**Endpoint:** `POST /api/v1/resume/parse`

**Headers:**
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "resume_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response (200 OK):**
```json
{
  "resume_id": "550e8400-e29b-41d4-a716-446655440000",
  "parsed_data": {
    "name": "John Doe",
    "email": "john.doe@email.com",
    "phone": "+1-234-567-8900",
    "summary": "Experienced software engineer with 5+ years...",
    "skills": ["Python", "JavaScript", "React", "FastAPI"],
    "experience": [
      {
        "title": "Senior Software Engineer",
        "company": "Tech Corp",
        "duration": "2021-2024",
        "description": "Led development of..."
      }
    ],
    "education": [
      {
        "degree": "BS Computer Science",
        "institution": "University Name",
        "year": "2020"
      }
    ]
  },
  "message": "Resume parsed successfully"
}
```

---

### 3. Get Current Resume

Retrieve the user's current resume data.

**Endpoint:** `GET /api/v1/resume/current`

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "user_123",
  "filename": "resume.pdf",
  "file_path": "resumes/user_123/resume.pdf",
  "file_size": 245678,
  "file_type": "application/pdf",
  "parsed_data": {
    "name": "John Doe",
    "skills": ["Python", "React"]
  },
  "created_at": "2025-11-29T10:30:00Z",
  "updated_at": "2025-11-29T10:35:00Z"
}
```

**Error (404):**
```json
{
  "detail": "No resume found"
}
```

---

## Context Management

### 4. Build/Update Context Profile

Create or update user's context profile for personalized emails.

**Endpoint:** `POST /api/v1/context/build`

**Request Body:**
```json
{
  "purpose": "job_search",
  "target_roles": ["Software Engineer", "Backend Developer"],
  "target_industries": ["Technology", "FinTech", "SaaS"],
  "target_locations": ["San Francisco, CA", "Remote"],
  "preferred_keywords": ["python", "fastapi", "microservices", "cloud"],
  "additional_info": "Seeking full-time positions with visa sponsorship"
}
```

**Response (200 OK):**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "user_id": "user_123",
  "purpose": "job_search",
  "target_roles": ["Software Engineer", "Backend Developer"],
  "target_industries": ["Technology", "FinTech", "SaaS"],
  "target_locations": ["San Francisco, CA", "Remote"],
  "preferred_keywords": ["python", "fastapi", "microservices", "cloud"],
  "additional_info": "Seeking full-time positions with visa sponsorship",
  "resume_id": "550e8400-e29b-41d4-a716-446655440000",
  "created_at": "2025-11-29T10:40:00Z",
  "updated_at": "2025-11-29T10:40:00Z"
}
```

---

### 5. Get Current Context

Retrieve user's current context profile.

**Endpoint:** `GET /api/v1/context/current`

**Response (200 OK):**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "user_id": "user_123",
  "purpose": "job_search",
  "target_roles": ["Software Engineer"],
  "target_industries": ["Technology"],
  "target_locations": ["San Francisco, CA"],
  "preferred_keywords": ["python", "fastapi"],
  "additional_info": "Seeking full-time positions",
  "created_at": "2025-11-29T10:40:00Z"
}
```

---

### 6. Get AI Context Suggestions

Get AI-powered suggestions based on resume.

**Endpoint:** `GET /api/v1/context/suggestions`

**Response (200 OK):**
```json
{
  "suggested_roles": ["Backend Developer", "API Engineer", "Python Developer"],
  "suggested_industries": ["SaaS", "Cloud Computing", "FinTech"],
  "suggested_keywords": ["microservices", "REST APIs", "docker", "kubernetes"],
  "suggested_locations": ["Remote", "San Francisco", "New York"]
}
```

---

### 7. Get Predefined Tags

Get predefined options for dropdowns and multi-select fields.

**Endpoint:** `GET /api/v1/context/predefined-tags`

**Response (200 OK):**
```json
{
  "purposes": [
    "job_search",
    "sponsorship",
    "freelance",
    "internship",
    "consulting"
  ],
  "tech_roles": [
    "Software Engineer",
    "Backend Developer",
    "Frontend Developer",
    "Full Stack Developer",
    "DevOps Engineer"
  ],
  "tech_industries": [
    "SaaS",
    "FinTech",
    "E-commerce",
    "AI/ML",
    "Cloud Computing"
  ],
  "tech_keywords": [
    "python",
    "javascript",
    "react",
    "fastapi",
    "docker"
  ],
  "locations": [
    "Remote",
    "San Francisco, CA",
    "New York, NY",
    "Seattle, WA"
  ]
}
```

---

## SMTP Configuration

### 8. Save SMTP Credentials

Store encrypted SMTP credentials for email sending.

**Endpoint:** `POST /api/v1/smtp/save`

**Request Body:**
```json
{
  "smtp_server": "smtp.gmail.com",
  "smtp_port": 587,
  "smtp_username": "your-email@gmail.com",
  "smtp_password": "your-app-password",
  "from_email": "your-email@gmail.com",
  "from_name": "John Doe"
}
```

**Response (200 OK):**
```json
{
  "message": "SMTP credentials saved successfully",
  "smtp_server": "smtp.gmail.com",
  "smtp_port": 587,
  "from_email": "your-email@gmail.com"
}
```

**Note:** Password is encrypted using Fernet before storage.

---

### 9. Test SMTP Connection

Verify SMTP credentials by sending a test email.

**Endpoint:** `POST /api/v1/smtp/test`

**Request Body:**
```json
{
  "test_recipient": "test@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Test email sent successfully to test@example.com"
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "SMTP Authentication failed. Please check your credentials."
}
```

---

### 10. Get SMTP Configuration

Retrieve current SMTP settings (password excluded).

**Endpoint:** `GET /api/v1/smtp/config`

**Response (200 OK):**
```json
{
  "smtp_server": "smtp.gmail.com",
  "smtp_port": 587,
  "smtp_username": "your-email@gmail.com",
  "from_email": "your-email@gmail.com",
  "from_name": "John Doe",
  "created_at": "2025-11-29T10:50:00Z"
}
```

---

## Email Management

### 11. Generate Email with AI

Generate a personalized email using AI based on company and context.

**Endpoint:** `POST /api/v1/email_management/generate`

**Request Body:**
```json
{
  "company_name": "Tech Innovations Inc",
  "company_website": "https://techinnovations.com",
  "company_location": "San Francisco, CA",
  "position_title": "Senior Backend Engineer",
  "job_type": "Full-time",
  "salary_range": "$150k-$180k",
  "keywords": ["python", "fastapi", "microservices"],
  "custom_prompt": "Emphasize my experience with distributed systems"
}
```

**Response (200 OK):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "user_id": "user_123",
  "company_name": "Tech Innovations Inc",
  "company_email": "",
  "position": "Senior Backend Engineer",
  "keywords": ["python", "fastapi", "microservices"],
  "subject": "Application for Senior Backend Engineer Position",
  "body": "Dear Hiring Manager,\n\nI am writing to express my strong interest...",
  "status": "new",
  "metadata": {
    "company_website": "https://techinnovations.com",
    "job_type": "Full-time",
    "salary_range": "$150k-$180k"
  },
  "created_at": "2025-11-29T11:00:00Z",
  "updated_at": "2025-11-29T11:00:00Z"
}
```

---

### 12. List All Emails

Get list of all generated emails with optional filtering.

**Endpoint:** `GET /api/v1/email_management/list`

**Query Parameters:**
- `status` (optional): Filter by status (`new`, `under_review`, `approved`, `rejected`)
- `company_name` (optional): Filter by company name

**Example:** `/api/v1/email_management/list?status=new`

**Response (200 OK):**
```json
{
  "emails": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "company_name": "Tech Innovations Inc",
      "position": "Senior Backend Engineer",
      "subject": "Application for Senior Backend Engineer Position",
      "status": "new",
      "created_at": "2025-11-29T11:00:00Z"
    },
    {
      "id": "880e8400-e29b-41d4-a716-446655440003",
      "company_name": "Cloud Solutions LLC",
      "position": "DevOps Engineer",
      "subject": "DevOps Engineer Opportunity Inquiry",
      "status": "approved",
      "created_at": "2025-11-28T15:30:00Z"
    }
  ],
  "total": 2
}
```

---

### 13. Get Email Details

Retrieve full details of a specific email.

**Endpoint:** `GET /api/v1/email_management/{email_id}`

**Response (200 OK):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "user_id": "user_123",
  "company_name": "Tech Innovations Inc",
  "company_email": "hr@techinnovations.com",
  "position": "Senior Backend Engineer",
  "keywords": ["python", "fastapi", "microservices"],
  "subject": "Application for Senior Backend Engineer Position",
  "body": "Dear Hiring Manager,\n\nI am writing to express...",
  "status": "new",
  "metadata": {
    "company_website": "https://techinnovations.com",
    "job_type": "Full-time",
    "salary_range": "$150k-$180k"
  },
  "created_at": "2025-11-29T11:00:00Z",
  "updated_at": "2025-11-29T11:00:00Z"
}
```

---

### 14. Update Email Status

Change the status of an email in the workflow.

**Endpoint:** `PUT /api/v1/email_management/{email_id}/status`

**Request Body:**
```json
{
  "status": "approved"
}
```

**Valid Statuses:**
- `new` - Newly generated
- `under_review` - Being reviewed
- `approved` - Ready to send
- `rejected` - Not suitable

**Response (200 OK):**
```json
{
  "message": "Email status updated successfully",
  "email_id": "770e8400-e29b-41d4-a716-446655440002",
  "new_status": "approved"
}
```

---

### 15. Update Email Content

Edit the subject or body of an email.

**Endpoint:** `PUT /api/v1/email_management/{email_id}/content`

**Request Body:**
```json
{
  "subject": "Updated Subject Line",
  "body": "Updated email body content...",
  "company_email": "newemail@company.com"
}
```

**Response (200 OK):**
```json
{
  "message": "Email updated successfully",
  "email": {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "subject": "Updated Subject Line",
    "body": "Updated email body content...",
    "company_email": "newemail@company.com",
    "updated_at": "2025-11-29T11:15:00Z"
  }
}
```

---

### 16. Delete Email

Delete a specific email.

**Endpoint:** `DELETE /api/v1/email_management/{email_id}`

**Response (200 OK):**
```json
{
  "message": "Email deleted successfully",
  "email_id": "770e8400-e29b-41d4-a716-446655440002"
}
```

---

### 17. Chat with AI About Email

Start an interactive chat session to review and improve an email.

**Endpoint:** `POST /api/v1/email_management/chatbot/message`

**Request Body:**
```json
{
  "email_id": "770e8400-e29b-41d4-a716-446655440002",
  "message": "Can you make this email more concise?",
  "session_id": "session_123"
}
```

**Response (200 OK):**
```json
{
  "response": "I can help make the email more concise. Here's a shorter version:\n\n[Revised email content]",
  "session_id": "session_123",
  "suggestions": [
    "The introduction is now more direct",
    "Removed redundant phrases",
    "Kept key qualifications highlighted"
  ]
}
```

---

### 18. Apply Quick Action

Apply predefined AI transformations to an email.

**Endpoint:** `POST /api/v1/email_management/chatbot/quick-action`

**Request Body:**
```json
{
  "email_id": "770e8400-e29b-41d4-a716-446655440002",
  "action": "make_formal"
}
```

**Available Actions:**
- `make_formal` - Make the tone more formal
- `make_casual` - Make the tone more casual
- `make_shorter` - Condense the content
- `make_engaging` - Add more engaging language

**Response (200 OK):**
```json
{
  "updated_content": {
    "subject": "Formal Application: Senior Backend Engineer",
    "body": "Dear Hiring Manager,\n\nI respectfully submit my application..."
  },
  "action_applied": "make_formal"
}
```

---

## Email Sending

### 19. Send Email via SMTP

Send a composed email through configured SMTP.

**Endpoint:** `POST /api/v1/email/send`

**Request Body:**
```json
{
  "to_email": "hr@company.com",
  "subject": "Application for Backend Engineer Position",
  "body": "Dear Hiring Manager,\n\nI am writing to apply...",
  "cc": ["backup@myemail.com"],
  "bcc": []
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Email sent successfully to hr@company.com",
  "timestamp": "2025-11-29T11:30:00Z"
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "Failed to send email: SMTP authentication error"
}
```

---

## Activity Logs

### 20. Create Activity Log

Log an activity event (usually called automatically by system).

**Endpoint:** `POST /api/v1/logs/activity`

**Request Body:**
```json
{
  "level": "info",
  "message": "Resume uploaded successfully",
  "metadata": {
    "filename": "resume.pdf",
    "file_size": 245678
  }
}
```

**Valid Levels:** `info`, `warning`, `error`, `success`

**Response (200 OK):**
```json
{
  "id": "990e8400-e29b-41d4-a716-446655440004",
  "message": "Activity logged successfully"
}
```

---

### 21. Get Activity Logs

Retrieve activity logs with optional filtering.

**Endpoint:** `GET /api/v1/logs/activity`

**Query Parameters:**
- `level` (optional): Filter by log level
- `limit` (optional): Number of logs to return (default: 50)

**Example:** `/api/v1/logs/activity?level=error&limit=20`

**Response (200 OK):**
```json
{
  "logs": [
    {
      "id": "990e8400-e29b-41d4-a716-446655440004",
      "user_id": "user_123",
      "level": "info",
      "message": "Resume uploaded successfully",
      "metadata": {
        "filename": "resume.pdf",
        "file_size": 245678
      },
      "created_at": "2025-11-29T11:35:00Z"
    },
    {
      "id": "aa0e8400-e29b-41d4-a716-446655440005",
      "user_id": "user_123",
      "level": "success",
      "message": "Email sent successfully",
      "metadata": {
        "recipient": "hr@company.com"
      },
      "created_at": "2025-11-29T11:30:00Z"
    }
  ],
  "total": 2
}
```

---

### 22. Delete Activity Log

Delete a specific activity log.

**Endpoint:** `DELETE /api/v1/logs/activity/{log_id}`

**Response (200 OK):**
```json
{
  "message": "Activity log deleted successfully"
}
```

---

### 23. Clear All Activity Logs

Delete all activity logs for the current user.

**Endpoint:** `DELETE /api/v1/logs/activity/clear`

**Response (200 OK):**
```json
{
  "message": "All activity logs cleared successfully",
  "deleted_count": 15
}
```

---

## Health Check

### 24. Health Check

Check if the API is running and healthy.

**Endpoint:** `GET /health`

**No authentication required**

**Response (200 OK):**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "environment": "production",
  "timestamp": "2025-11-29T11:40:00Z"
}
```

---

## Error Responses

All endpoints follow a consistent error response format:

### 400 Bad Request
```json
{
  "detail": "Invalid input data: [specific error message]"
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication required. Please provide a valid JWT token."
}
```

### 403 Forbidden
```json
{
  "detail": "You don't have permission to access this resource."
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
  "detail": "An internal server error occurred. Please try again later."
}
```

---

## Rate Limiting

**Note:** Rate limiting is planned for future implementation.

Current limits: None (to be implemented in Phase 2)

---

## SDK Examples

### Python Example

```python
import requests

BASE_URL = "http://localhost:8000"
TOKEN = "your_jwt_token"

headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

# Upload resume
with open("resume.pdf", "rb") as f:
    files = {"file": f}
    response = requests.post(
        f"{BASE_URL}/api/v1/resume/upload",
        files=files,
        headers={"Authorization": f"Bearer {TOKEN}"}
    )
    print(response.json())

# Build context
context_data = {
    "purpose": "job_search",
    "target_roles": ["Software Engineer"],
    "target_industries": ["Technology"],
    "target_locations": ["Remote"],
    "preferred_keywords": ["python", "fastapi"]
}
response = requests.post(
    f"{BASE_URL}/api/v1/context/build",
    json=context_data,
    headers=headers
)
print(response.json())
```

### JavaScript Example

```javascript
const BASE_URL = "http://localhost:8000";
const TOKEN = "your_jwt_token";

const headers = {
  "Authorization": `Bearer ${TOKEN}`,
  "Content-Type": "application/json"
};

// Generate email
async function generateEmail() {
  const response = await fetch(`${BASE_URL}/api/v1/email_management/generate`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      company_name: "Tech Corp",
      company_website: "https://techcorp.com",
      position_title: "Backend Engineer",
      job_type: "Full-time",
      keywords: ["python", "fastapi"]
    })
  });
  
  const data = await response.json();
  console.log(data);
}

// List emails
async function listEmails() {
  const response = await fetch(`${BASE_URL}/api/v1/email_management/list?status=new`, {
    method: "GET",
    headers: headers
  });
  
  const data = await response.json();
  console.log(data);
}
```

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-11-29 | Initial comprehensive API documentation |

---

## Support

For issues or questions about the API:
- GitHub Issues: https://github.com/ak-1344/AgentM/issues
- Documentation: See `/docs` folder in repository

---

**Last Updated:** November 29, 2025  
**Maintained By:** Agent M Team
