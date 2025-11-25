"""
SMTP service - manages SMTP credentials and connections
"""

from app.database.supabase_client import get_supabase
from app.core.security import encrypt_password, decrypt_password
import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging

logger = logging.getLogger(__name__)


class SMTPService:
    """Service for SMTP operations"""
    
    def __init__(self):
        self.supabase = get_supabase()
    
    async def save_credentials(self, user_id: str, credentials: dict) -> dict:
        """
        Save SMTP credentials with encrypted password
        Uses upsert to handle both create and update
        """
        try:
            # Encrypt password
            encrypted_password = encrypt_password(credentials["smtp_password"])
            
            data = {
                "user_id": user_id,
                "smtp_host": credentials["smtp_host"],
                "smtp_port": credentials["smtp_port"],
                "smtp_user": credentials["smtp_user"],
                "smtp_password_encrypted": encrypted_password,
                "use_tls": credentials.get("use_tls", True),
                "is_active": True
            }
            
            response = self.supabase.table("smtp_credentials")\
                .upsert(data, on_conflict="user_id")\
                .execute()
            
            # Return without password
            result = response.data[0].copy()
            result.pop("smtp_password_encrypted", None)
            
            return result
            
        except Exception as e:
            logger.error(f"Save SMTP credentials error: {e}", exc_info=True)
            raise
    
    async def get_credentials(self, user_id: str, include_password: bool = False) -> dict:
        """Get user's SMTP credentials"""
        try:
            response = self.supabase.table("smtp_credentials")\
                .select("*")\
                .eq("user_id", user_id)\
                .eq("is_active", True)\
                .execute()
            
            if not response.data:
                return None
            
            credentials = response.data[0].copy()
            
            # Decrypt password if requested
            if include_password:
                credentials["smtp_password"] = decrypt_password(
                    credentials["smtp_password_encrypted"]
                )
            
            # Remove encrypted password from response
            credentials.pop("smtp_password_encrypted", None)
            
            return credentials
            
        except Exception as e:
            logger.error(f"Get SMTP credentials error: {e}", exc_info=True)
            raise
    
    async def test_connection(self, user_id: str) -> dict:
        """
        Test SMTP connection
        Attempts to connect and send a test email
        """
        try:
            credentials = await self.get_credentials(user_id, include_password=True)
            
            if not credentials:
                raise Exception("SMTP credentials not found")
            
            # Test connection
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
            
            # Send test email
            message = MIMEMultipart()
            message["From"] = credentials["smtp_user"]
            message["To"] = credentials["smtp_user"]
            message["Subject"] = "Agent M - SMTP Test"
            
            body = """
            This is a test email from Agent M.
            
            Your SMTP configuration is working correctly!
            
            You can now use Agent M to send automated emails.
            """
            
            message.attach(MIMEText(body, "plain"))
            
            await smtp.send_message(message)
            await smtp.quit()
            
            return {
                "success": True,
                "message": "SMTP connection successful! Test email sent."
            }
            
        except Exception as e:
            logger.error(f"SMTP test error: {e}", exc_info=True)
            return {
                "success": False,
                "message": f"SMTP connection failed: {str(e)}"
            }
    
    async def delete_credentials(self, user_id: str):
        """Delete user's SMTP credentials"""
        try:
            self.supabase.table("smtp_credentials")\
                .delete()\
                .eq("user_id", user_id)\
                .execute()
            
        except Exception as e:
            logger.error(f"Delete SMTP credentials error: {e}", exc_info=True)
            raise
