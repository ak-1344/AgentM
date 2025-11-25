"""
SMTP Client - Async SMTP email sending
"""

import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)


class SMTPClient:
    """Async SMTP client for sending emails"""
    
    def __init__(
        self,
        host: str,
        port: int,
        username: str,
        password: str,
        use_tls: bool = True
    ):
        """
        Initialize SMTP client
        
        Args:
            host: SMTP server hostname
            port: SMTP server port
            username: SMTP username
            password: SMTP password
            use_tls: Whether to use TLS
        """
        self.host = host
        self.port = port
        self.username = username
        self.password = password
        self.use_tls = use_tls
    
    async def send_email(
        self,
        to_email: str,
        subject: str,
        body: str,
        from_email: Optional[str] = None,
        from_name: Optional[str] = None,
        is_html: bool = False
    ) -> Dict[str, Any]:
        """
        Send an email via SMTP
        
        Args:
            to_email: Recipient email address
            subject: Email subject
            body: Email body
            from_email: Sender email (defaults to username)
            from_name: Sender name
            is_html: Whether body is HTML
            
        Returns:
            Dict with status and message
        """
        try:
            # Create message
            message = MIMEMultipart()
            message["From"] = f"{from_name} <{from_email or self.username}>" if from_name else (from_email or self.username)
            message["To"] = to_email
            message["Subject"] = subject
            
            # Attach body
            mime_type = "html" if is_html else "plain"
            message.attach(MIMEText(body, mime_type))
            
            # Connect and send
            async with aiosmtplib.SMTP(hostname=self.host, port=self.port, use_tls=self.use_tls) as smtp:
                await smtp.login(self.username, self.password)
                await smtp.send_message(message)
            
            logger.info(f"Email sent successfully to {to_email}")
            
            return {
                "success": True,
                "message": "Email sent successfully",
                "recipient": to_email
            }
            
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {e}", exc_info=True)
            return {
                "success": False,
                "message": str(e),
                "recipient": to_email
            }
    
    async def test_connection(self) -> Dict[str, Any]:
        """
        Test SMTP connection
        
        Returns:
            Dict with connection status
        """
        try:
            async with aiosmtplib.SMTP(hostname=self.host, port=self.port, use_tls=self.use_tls) as smtp:
                await smtp.login(self.username, self.password)
            
            logger.info(f"SMTP connection successful to {self.host}:{self.port}")
            
            return {
                "success": True,
                "message": "Connection successful"
            }
            
        except Exception as e:
            logger.error(f"SMTP connection failed: {e}", exc_info=True)
            return {
                "success": False,
                "message": str(e)
            }
