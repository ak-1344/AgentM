"""
Context Refiner - AI-powered context enhancement and refinement
Helps users improve their targeting context with AI suggestions
"""

from typing import Dict, Any, List
import logging
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

logger = logging.getLogger(__name__)


class ContextRefiner:
    """AI-powered context refinement for better targeting"""
    
    def __init__(self, api_key: str, model: str = "gpt-4-turbo-preview"):
        """
        Initialize context refiner
        
        Args:
            api_key: OpenAI API key
            model: Model to use
        """
        self.llm = ChatOpenAI(api_key=api_key, model=model, temperature=0.7)
    
    def suggest_improvements(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Suggest improvements to user's context
        
        Args:
            context: Current user context
            
        Returns:
            Dict with suggestions
        """
        try:
            prompt = ChatPromptTemplate.from_messages([
                ("system", """You are a career coach helping someone improve their job search targeting.
                
                Analyze their context and provide:
                1. Additional relevant job titles they might have missed
                2. Related industries they should consider
                3. Important keywords to include
                4. Suggestions for their pitch/context
                
                Return as JSON:
                {{
                    "suggested_roles": ["role1", "role2"],
                    "suggested_industries": ["ind1", "ind2"],
                    "suggested_keywords": ["kw1", "kw2"],
                    "advice": "Brief advice text"
                }}"""),
                ("user", """Current Context:
                Target Roles: {roles}
                Industries: {industries}
                Skills: {skills}
                Experience Level: {exp_level}
                
                Provide suggestions to improve this targeting.""")
            ])
            
            chain = prompt | self.llm
            
            response = chain.invoke({
                "roles": ", ".join(context.get("target_roles", [])),
                "industries": ", ".join(context.get("preferred_industries", [])),
                "skills": ", ".join(context.get("keywords", [])[:10]),
                "exp_level": context.get("experience_level", "Not specified")
            })
            
            content = response.content
            
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            
            import json
            return json.loads(content)
            
        except Exception as e:
            logger.error(f"Error suggesting improvements: {e}", exc_info=True)
            return {
                "suggested_roles": [],
                "suggested_industries": [],
                "suggested_keywords": [],
                "advice": "Unable to generate suggestions at this time."
            }
    
    def generate_professional_summary(
        self,
        resume_data: Dict[str, Any],
        target_role: str
    ) -> str:
        """
        Generate a professional summary for emails
        
        Args:
            resume_data: Parsed resume data
            target_role: Target job role
            
        Returns:
            Professional summary text
        """
        try:
            skills = ", ".join(resume_data.get("skills", [])[:8])
            experience = resume_data.get("experience", [])
            exp_text = ""
            if experience:
                latest = experience[0]
                exp_text = f"Currently: {latest.get('title')} at {latest.get('company')}"
            
            prompt = ChatPromptTemplate.from_messages([
                ("system", "You are a professional resume writer. Create a compelling 2-3 sentence summary."),
                ("user", """Create a professional summary for someone targeting: {target_role}
                
                Their background:
                Skills: {skills}
                {exp_text}
                
                Write a compelling, concise summary (2-3 sentences).""")
            ])
            
            chain = prompt | self.llm
            
            response = chain.invoke({
                "target_role": target_role,
                "skills": skills,
                "exp_text": exp_text
            })
            
            return response.content.strip()
            
        except Exception as e:
            logger.error(f"Error generating summary: {e}")
            return ""
