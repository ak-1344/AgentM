"""
Email Generator - AI-powered personalized email creation
Generates customized outreach emails based on context and company info
"""

from typing import Dict, Any, Optional
import logging
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

logger = logging.getLogger(__name__)


class EmailGenerator:
    """AI-powered email generator for personalized outreach"""
    
    def __init__(self, api_key: str, model: str = "gpt-4-turbo-preview", temperature: float = 0.7):
        """
        Initialize email generator
        
        Args:
            api_key: OpenAI API key
            model: Model to use
            temperature: Temperature for generation (higher = more creative)
        """
        self.llm = ChatOpenAI(
            api_key=api_key,
            model=model,
            temperature=temperature
        )
    
    def generate_outreach_email(
        self,
        user_context: Dict[str, Any],
        company_info: Dict[str, Any],
        email_type: str = "job_application",
        tone: str = "professional"
    ) -> Dict[str, str]:
        """
        Generate personalized outreach email
        
        Args:
            user_context: User's resume data and preferences
            company_info: Company information (name, description, role, etc.)
            email_type: Type of email (job_application, sponsorship, freelance)
            tone: Email tone (professional, casual, enthusiastic)
            
        Returns:
            Dict with subject and body
        """
        try:
            # Build context string
            user_summary = self._build_user_summary(user_context)
            company_summary = self._build_company_summary(company_info)
            
            prompt = ChatPromptTemplate.from_messages([
                ("system", """You are an expert at writing compelling, personalized outreach emails.
                
                Email Type: {email_type}
                Tone: {tone}
                
                Guidelines:
                - Be concise (150-250 words)
                - Personalize based on company and user background
                - Show genuine interest and research
                - Clear call-to-action
                - Professional but warm
                - No generic templates
                
                Return in JSON format:
                {{
                    "subject": "Email subject line",
                    "body": "Email body with proper formatting"
                }}"""),
                ("user", """Write an outreach email.
                
                About Me:
                {user_summary}
                
                About Company:
                {company_summary}
                
                Generate a personalized email that connects my background with their needs.""")
            ])
            
            chain = prompt | self.llm
            
            response = chain.invoke({
                "email_type": email_type,
                "tone": tone,
                "user_summary": user_summary,
                "company_summary": company_summary
            })
            
            content = response.content
            
            # Extract JSON
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            
            import json
            result = json.loads(content)
            
            return {
                "subject": result.get("subject", ""),
                "body": result.get("body", "")
            }
            
        except Exception as e:
            logger.error(f"Error generating email: {e}", exc_info=True)
            raise
    
    def generate_follow_up(
        self,
        original_email: str,
        days_since: int,
        context: Optional[str] = None
    ) -> Dict[str, str]:
        """
        Generate follow-up email
        
        Args:
            original_email: The original email sent
            days_since: Days since original email
            context: Additional context for follow-up
            
        Returns:
            Dict with subject and body
        """
        try:
            prompt = ChatPromptTemplate.from_messages([
                ("system", """You are an expert at writing polite, effective follow-up emails.
                
                Guidelines:
                - Reference original email briefly
                - Be polite and understanding
                - Restate interest
                - Keep it short (50-100 words)
                - Professional tone
                
                Return in JSON format:
                {{
                    "subject": "Follow-up subject",
                    "body": "Follow-up email body"
                }}"""),
                ("user", """Generate a follow-up email.
                
                Original Email:
                {original_email}
                
                Days Since Sent: {days_since}
                {context_str}
                
                Write a polite follow-up.""")
            ])
            
            chain = prompt | self.llm
            
            context_str = f"\nAdditional Context: {context}" if context else ""
            
            response = chain.invoke({
                "original_email": original_email,
                "days_since": days_since,
                "context_str": context_str
            })
            
            content = response.content
            
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            
            import json
            result = json.loads(content)
            
            return {
                "subject": result.get("subject", ""),
                "body": result.get("body", "")
            }
            
        except Exception as e:
            logger.error(f"Error generating follow-up: {e}", exc_info=True)
            raise
    
    def _build_user_summary(self, user_context: Dict[str, Any]) -> str:
        """Build user summary from context"""
        parts = []
        
        if "skills" in user_context:
            parts.append(f"Skills: {', '.join(user_context['skills'][:10])}")
        
        if "experience" in user_context:
            exp = user_context['experience']
            if exp:
                latest = exp[0]
                parts.append(f"Current/Recent Role: {latest.get('title')} at {latest.get('company')}")
        
        if "target_roles" in user_context:
            parts.append(f"Target Roles: {', '.join(user_context['target_roles'])}")
        
        if "additional_context" in user_context:
            parts.append(f"Additional: {user_context['additional_context']}")
        
        return "\n".join(parts)
    
    def _build_company_summary(self, company_info: Dict[str, Any]) -> str:
        """Build company summary"""
        parts = []
        
        if "name" in company_info:
            parts.append(f"Company: {company_info['name']}")
        
        if "role" in company_info:
            parts.append(f"Role: {company_info['role']}")
        
        if "description" in company_info:
            parts.append(f"About: {company_info['description']}")
        
        if "industry" in company_info:
            parts.append(f"Industry: {company_info['industry']}")
        
        return "\n".join(parts)
