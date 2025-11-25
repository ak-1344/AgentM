# Email Engine

SMTP email sending and management for Agent M.

## Components

### 1. SMTP Client (`smtp_client.py`)
- **Purpose**: Send emails via SMTP
- **Features**:
  - Async email sending
  - Connection testing
  - TLS support
  - Multiple SMTP providers
  - Error handling

**Usage:**
```python
from email_engine.smtp_client import SMTPClient

client = SMTPClient(
    host="smtp.gmail.com",
    port=587,
    username="your@email.com",
    password="app_password",
    use_tls=True
)

# Send email
result = await client.send_email(
    to_email="recipient@example.com",
    subject="Hello",
    body="Email body",
    from_name="Your Name"
)

# Test connection
status = await client.test_connection()
```

### 2. Email Templates (`templates.py`)
- **Purpose**: Pre-built email templates
- **Templates**:
  - Job application
  - Sponsorship request
  - Freelance outreach

**Usage:**
```python
from email_engine.templates import EmailTemplates

# Fill template
email_body = EmailTemplates.fill_template(
    template_type="job_application",
    data={
        "role": "Software Engineer",
        "company": "Tech Corp",
        "name": "John Doe",
        "intro_paragraph": "...",
        "experience_paragraph": "...",
        "closing_paragraph": "..."
    }
)
```

## Installation

```bash
pip install aiosmtplib email-validator
```

## Supported SMTP Providers

- **Gmail**: smtp.gmail.com:587
- **Outlook**: smtp.office365.com:587
- **Yahoo**: smtp.mail.yahoo.com:587
- **Custom SMTP servers**

## Configuration

```python
# Gmail (App Password required)
{
    "host": "smtp.gmail.com",
    "port": 587,
    "use_tls": True
}

# Outlook
{
    "host": "smtp.office365.com",
    "port": 587,
    "use_tls": True
}
```

## Security

- Passwords encrypted with Fernet before storage
- TLS encryption for SMTP connections
- App passwords recommended for Gmail
- No plaintext password storage

## Error Handling

- Connection failures handled gracefully
- Authentication errors logged
- Per-email error tracking
- Retry logic (future)

## Phase Implementation

- **Phase 1**: Basic SMTP sending (✅ Implemented)
- **Phase 3**: Auto-send on approval (Integrated with backend)
- **Phase 4**: Scheduled follow-ups (Planned)
- **Phase 5**: IMAP reply reading (Planned)

## Integration

Used by:
- `backend/app/services/email_service.py`
- `backend/app/services/smtp_service.py`
- API endpoints for email sending

## Future Features

- Email scheduling
- Rate limiting
- Bulk sending with delays
- Bounce handling
- IMAP integration for replies
- Email tracking pixels
- Delivery receipts
