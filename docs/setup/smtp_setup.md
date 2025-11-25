# SMTP Setup Guide

## Overview
This guide explains how to configure SMTP for sending emails through Agent M.

## Supported Email Providers
- Gmail
- Outlook/Office365
- Yahoo Mail
- Custom SMTP servers

---

## 1. Gmail App Password Setup

### Steps:
1. **Enable 2-Factor Authentication**
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**
   - Visit https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Agent M"
   - Copy the 16-character password

3. **Configuration**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=<16-char-app-password>
   SMTP_USE_TLS=true
   ```

---

## 2. Outlook/Office365 App Password

### Steps:
1. Go to https://account.microsoft.com/security
2. Enable Two-step verification
3. Go to "App passwords"
4. Create new password for "Agent M"

### Configuration:
```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=<app-password>
SMTP_USE_TLS=true
```

---

## 3. Security Best Practices

### Backend Storage (Encrypted)
The backend must store SMTP credentials encrypted at rest:

```python
from cryptography.fernet import Fernet
import os

# Generate encryption key (store in environment)
ENCRYPTION_KEY = os.getenv('ENCRYPTION_KEY')
cipher = Fernet(ENCRYPTION_KEY.encode())

def encrypt_password(password: str) -> str:
    return cipher.encrypt(password.encode()).decode()

def decrypt_password(encrypted: str) -> str:
    return cipher.decrypt(encrypted.encode()).decode()
```

### Environment Variables:
```env
ENCRYPTION_KEY=<generate-using-Fernet.generate_key()>
```

---

## 4. Local Testing Procedure

### Test SMTP Connection:
```python
import smtplib
from email.mime.text import MIMEText

def test_smtp_connection(host, port, user, password):
    try:
        server = smtplib.SMTP(host, port)
        server.starttls()
        server.login(user, password)
        
        # Send test email
        msg = MIMEText("Test email from Agent M")
        msg['Subject'] = 'Agent M SMTP Test'
        msg['From'] = user
        msg['To'] = user
        
        server.send_message(msg)
        server.quit()
        
        print("✅ SMTP connection successful!")
        return True
    except Exception as e:
        print(f"❌ SMTP connection failed: {e}")
        return False

# Usage
test_smtp_connection(
    host="smtp.gmail.com",
    port=587,
    user="your-email@gmail.com",
    password="your-app-password"
)
```

---

## 5. Rate Limits

### Gmail
- **Daily limit**: 500 emails/day for free accounts
- **Per minute**: ~20 emails
- **Recommendation**: Add delays between sends (3-5 seconds)

### Outlook
- **Daily limit**: 300 emails/day
- **Per minute**: ~30 emails

### Best Practice:
Implement exponential backoff and retry logic:
```python
import time
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
def send_email_with_retry(email_data):
    # Send email logic
    pass
```

---

## 6. Testing Checklist

- [ ] App password generated
- [ ] Environment variables configured
- [ ] Encryption key generated and stored
- [ ] Test connection successful
- [ ] Test email sent and received
- [ ] Rate limiting implemented
- [ ] Error handling tested
- [ ] Credentials encrypted in database

---

## Troubleshooting

### Common Issues:

1. **"Username and Password not accepted"**
   - Verify 2FA is enabled
   - Regenerate app password
   - Check for extra spaces in password

2. **"SMTP connection timeout"**
   - Check firewall settings
   - Verify port (587 for TLS, 465 for SSL)
   - Try different network

3. **"Daily sending quota exceeded"**
   - Implement rate limiting
   - Use multiple sender accounts
   - Consider transactional email service (SendGrid, AWS SES)

---

## Next Steps
After completing SMTP setup:
1. Update backend `.env` file
2. Test connection using provided script
3. Configure user SMTP settings in database
4. Proceed to email sending implementation
