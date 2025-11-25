"""
AI Service - handles all AI/LLM operations
Uses OpenAI GPT-4 via LangChain
"""

from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from typing import List
from app.core.config import settings
from app.models.schemas import ParsedResumeData
import logging
import json

logger = logging.getLogger(__name__)


class AIService:
    """Service for AI operations"""
    
    def __init__(self):
        self.llm = ChatOpenAI(
            model=settings.OPENAI_MODEL,
            temperature=settings.OPENAI_TEMPERATURE,
            openai_api_key=settings.OPENAI_API_KEY
        )
    
    async def parse_resume(self, resume_text: str) -> ParsedResumeData:
        """
        Parse resume text using AI
        Extracts skills, experience, education, etc.
        """
        try:
            logger.info("Parsing resume with AI...")
            
            prompt = PromptTemplate(
                template="""
                You are an expert resume parser. Analyze the following resume and extract structured information.
                
                Resume Text:
                {resume_text}
                
                Extract and return the following information in JSON format:
                {{
                    "skills": ["skill1", "skill2", ...],
                    "experience_years": <number or null>,
                    "education": ["degree1", "degree2", ...],
                    "job_titles": ["title1", "title2", ...],
                    "achievements": ["achievement1", "achievement2", ...]
                }}
                
                Rules:
                - Extract all technical and soft skills mentioned
                - Calculate total years of experience if possible
                - List all degrees and certifications
                - List all job titles held
                - Extract key achievements and accomplishments
                - Return only valid JSON
                """,
                input_variables=["resume_text"]
            )
            
            chain = prompt | self.llm
            response = await chain.ainvoke({"resume_text": resume_text})
            
            # Parse JSON response
            content = response.content
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            
            parsed = json.loads(content)
            
            return ParsedResumeData(**parsed)
            
        except Exception as e:
            logger.error(f"AI resume parsing error: {e}", exc_info=True)
            # Return default structure on error
            return ParsedResumeData(
                skills=[],
                experience_years=None,
                education=[],
                job_titles=[],
                achievements=[]
            )
    
    async def refine_context(self, context_data: dict) -> dict:
        """
        Refine user context with AI suggestions
        Optional enhancement for better targeting
        """
        try:
            logger.info("Refining context with AI...")
            
            prompt = f"""
            Analyze the following user context and provide refinements:
            
            Target Roles: {', '.join(context_data.get('target_roles', []))}
            Industries: {', '.join(context_data.get('preferred_industries', []))}
            Keywords: {', '.join(context_data.get('keywords', []))}
            
            Suggest:
            1. Related job titles to target
            2. Related industries
            3. Additional keywords to include
            
            Return as JSON with keys: suggested_roles, suggested_industries, suggested_keywords
            """
            
            response = await self.llm.ainvoke(prompt)
            
            # For now, just return original context
            # TODO: Implement full refinement logic
            return context_data
            
        except Exception as e:
            logger.error(f"AI context refinement error: {e}", exc_info=True)
            return context_data
    
    async def generate_email(
        self,
        company_name: str,
        company_description: str,
        user_context: dict,
        resume_data: dict
    ) -> dict:
        """
        Generate personalized email for a company
        Phase 2 feature - placeholder for now
        """
        try:
            logger.info(f"Generating email for {company_name}...")
            
            prompt = f"""
            Generate a personalized outreach email.
            
            Company: {company_name}
            About: {company_description}
            
            Candidate Profile:
            - Target Roles: {', '.join(user_context.get('target_roles', []))}
            - Skills: {', '.join(resume_data.get('parsed_data', {}).get('skills', []))}
            - Experience: {resume_data.get('parsed_data', {}).get('job_titles', [])}
            
            Tone: {user_context.get('pitch_tone', 'professional')}
            
            Write a compelling email with:
            1. Engaging subject line
            2. Personalized body showing research about the company
            3. Clear value proposition
            4. Professional but friendly tone
            
            Return as JSON: {{"subject": "...", "body": "..."}}
            """
            
            response = await self.llm.ainvoke(prompt)
            content = response.content
            
            # Parse JSON
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            
            email_data = json.loads(content)
            
            return email_data
            
        except Exception as e:
            logger.error(f"AI email generation error: {e}", exc_info=True)
            return {
                "subject": f"Inquiry about opportunities at {company_name}",
                "body": "Email generation failed. Please write manually."
            }
