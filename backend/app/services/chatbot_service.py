"""
AI Chatbot Service - handles email review and editing via chat
"""

from app.services.ai_service import AIService
from app.services.email_management_service import EmailManagementService
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)


class ChatbotService:
    """Service for AI chatbot interactions for email editing"""
    
    def __init__(self):
        self.ai_service = AIService()
        self.email_service = EmailManagementService()
    
    async def chat(
        self,
        user_id: str,
        email_id: str,
        user_message: str,
        chat_history: List[Dict[str, str]]
    ) -> dict:
        """
        Process chat message and return AI response
        Can modify email content based on conversation
        """
        try:
            logger.info(f"Processing chat for email {email_id}")
            
            # Get email details
            email_data = await self.email_service.get_email(user_id, email_id)
            
            # Build context-aware prompt
            prompt = self._build_chat_prompt(
                email_data=email_data,
                chat_history=chat_history,
                user_message=user_message
            )
            
            # Get AI response
            response = await self.ai_service.llm.ainvoke(prompt)
            assistant_message = response.content
            
            # Save chat messages
            await self.email_service.save_chat_message(
                user_id=user_id,
                email_id=email_id,
                role="user",
                message=user_message
            )
            
            await self.email_service.save_chat_message(
                user_id=user_id,
                email_id=email_id,
                role="assistant",
                message=assistant_message
            )
            
            return {
                "message": assistant_message,
                "email_updated": False  # TODO: Detect if email should be updated
            }
            
        except Exception as e:
            logger.error(f"Chatbot error: {e}", exc_info=True)
            raise
    
    async def apply_quick_action(
        self,
        user_id: str,
        email_id: str,
        action: str
    ) -> dict:
        """
        Apply quick action to email (make formal, casual, shorter, etc.)
        """
        try:
            logger.info(f"Applying quick action '{action}' to email {email_id}")
            
            # Get email details
            email_data = await self.email_service.get_email(user_id, email_id)
            
            # Define action prompts
            action_prompts = {
                "formal": "Rewrite this email in a more formal, professional tone while keeping the key points.",
                "casual": "Rewrite this email in a friendly, casual tone while maintaining professionalism.",
                "personality": "Add more personality and warmth to this email, making it more engaging.",
                "shorten": "Make this email more concise while preserving all important information.",
                "expand": "Expand this email with more details and context.",
                "fix_grammar": "Fix any grammar, spelling, or punctuation errors in this email."
            }
            
            if action not in action_prompts:
                raise ValueError(f"Invalid action. Must be one of: {list(action_prompts.keys())}")
            
            # Build prompt
            prompt = f"""
            {action_prompts[action]}
            
            Current Subject: {email_data['subject']}
            Current Body:
            {email_data['content']}
            
            Return the updated email in JSON format:
            {{
                "subject": "updated subject (only if significantly changed)",
                "body": "updated body text"
            }}
            """
            
            # Get AI response
            response = await self.ai_service.llm.ainvoke(prompt)
            content = response.content
            
            # Parse JSON
            import json
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            
            updated_email = json.loads(content)
            
            # Update email in database
            await self.email_service.update_email_content(
                user_id=user_id,
                email_id=email_id,
                subject=updated_email.get("subject", email_data['subject']),
                content=updated_email.get("body", updated_email.get("content", ""))
            )
            
            # Save to chat history
            await self.email_service.save_chat_message(
                user_id=user_id,
                email_id=email_id,
                role="user",
                message=f"[Quick Action: {action}]"
            )
            
            await self.email_service.save_chat_message(
                user_id=user_id,
                email_id=email_id,
                role="assistant",
                message=f"I've updated the email to be more {action}."
            )
            
            return {
                "success": True,
                "updated_email": updated_email,
                "message": f"Email updated to be more {action}"
            }
            
        except Exception as e:
            logger.error(f"Quick action error: {e}", exc_info=True)
            raise
    
    def _build_chat_prompt(
        self,
        email_data: dict,
        chat_history: List[Dict[str, str]],
        user_message: str
    ) -> str:
        """
        Build context-aware prompt for chat
        """
        prompt = f"""
        You are an AI assistant helping to review and improve an outreach email.
        
        Email Context:
        - Company: {email_data.get('company_name', 'N/A')}
        - Position: {email_data.get('position_title', 'N/A')}
        - Subject: {email_data['subject']}
        - Body: {email_data['content']}
        
        Chat History:
        """
        
        # Add recent chat history (last 5 messages)
        for msg in chat_history[-5:]:
            prompt += f"\n{msg['role']}: {msg['message']}"
        
        prompt += f"\n\nUser: {user_message}"
        prompt += """
        
        Instructions:
        - Help the user improve the email
        - Suggest specific changes if asked
        - Be concise and helpful
        - If the user asks to modify the email, explain what you would change
        - Focus on clarity, professionalism, and personalization
        
        Respond naturally as an assistant:
        """
        
        return prompt
