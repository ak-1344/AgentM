"""
Email service - handles email sending operations
"""

from app.services.smtp_service import SMTPService
import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)


class EmailService:
    """Service for email operations"""
    
    def __init__(self):
        self.smtp_service = SMTPService()
    
    async def send_email(
        self,
        user_id: str,
        to_email: str,
        subject: str,
        body: str,
        cc: Optional[List[str]] = None,
        bcc: Optional[List[str]] = None
    ):
        """
        Send email using user's SMTP credentials
        Phase 1: Direct send
        """
        try:
            # Get SMTP credentials
            credentials = await self.smtp_service.get_credentials(
                user_id,
                include_password=True
            )
            
            if not credentials:
                raise Exception("SMTP credentials not configured")
            
            # Connect to SMTP server
            smtp = aiosmtplib.SMTP(
                hostname=credentials["smtp_host"],
                port=credentials["smtp_port"],
                use_tls=credentials["use_tls"]
            )
            
            await smtp.connect()
            await smtp.login(
                credentials["smtp_user"],
                credentials["smtp_password"]
            )
            
            # Create message
            message = MIMEMultipart()
            message["From"] = credentials["smtp_user"]
            message["To"] = to_email
            message["Subject"] = subject
            
            if cc:
                message["Cc"] = ", ".join(cc)
            if bcc:
                message["Bcc"] = ", ".join(bcc)
            
            # Attach body
            message.attach(MIMEText(body, "plain"))
            
            # Send email
            recipients = [to_email]
            if cc:
                recipients.extend(cc)
            if bcc:
                recipients.extend(bcc)
            
            await smtp.send_message(message)
            await smtp.quit()
            
            logger.info(f"Email sent successfully to {to_email}")
            
            # TODO: Log to database (Phase 3)
            
        except Exception as e:
            logger.error(f"Email send error: {e}", exc_info=True)
            raise
