"""
AI Service - handles all AI/LLM operations
Uses Google Gemini via google-genai SDK
"""

from google import genai
from google.genai import types
from app.core.config import settings
from app.models.schemas import ParsedResumeData
import logging
import json

logger = logging.getLogger(__name__)


class AIService:
    """Service for AI operations"""
    
    def __init__(self):
        pass
    
    def _get_client(self, api_key: str) -> genai.Client:
        """Helper to get Gemini Client with specific key"""
        return genai.Client(api_key=api_key)
    
    async def parse_resume_text(self, resume_text: str) -> ParsedResumeData:
        """
        Parse resume text using Gemini (Text-based)
        Fallback when file parsing fails or for better reliability
        """
        try:
            logger.info("Parsing resume text with Gemini...")
            
            # Use Parser Key if available, else fallback
            api_key = settings.GOOGLE_API_KEY_PARSER or settings.GOOGLE_API_KEY
            client = self._get_client(api_key)
            
            prompt = f"""
            You are an expert resume parser. Analyze the following resume text and extract structured information.
            
            Resume Text:
            {resume_text}
            
            Extract and return the following information in JSON format:
            {{
                "name": "Candidate Name",
                "links": ["Platform: URL", ...],
                "skills": ["skill1", "skill2", ...],
                "experience_years": <number or null>,
                "education": ["degree1", "degree2", ...],
                "job_titles": ["title1", "title2", ...],
                "achievements": ["achievement1", "achievement2", ...]
            }}
            
            Rules:
            - Extract the candidate's full name
            - Extract all profile links (LinkedIn, GitHub, Portfolio, etc.) with platform name
            - Extract all technical and soft skills mentioned
            - Calculate total years of experience if possible
            - List all degrees and certifications
            - List all job titles held
            - Extract key achievements and accomplishments
            - Return only valid JSON
            """
            
            # Use gemini-pro for text parsing as it's reliable
            response = client.models.generate_content(
                model=settings.GEMINI_MODEL_PARSER, 
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )
            
            # Parse JSON response
            content = response.text
            parsed = json.loads(content)
            
            return ParsedResumeData(**parsed)
            
        except Exception as e:
            logger.error(f"AI resume text parsing error: {e}", exc_info=True)
            # Return default structure on error
            # Return default structure on error
            return ParsedResumeData(
                name=None,
                links=[],
                skills=[],
                experience_years=None,
                education=[],
                job_titles=[],
                achievements=[]
            )

    async def parse_resume_file(self, file_content: bytes, mime_type: str) -> ParsedResumeData:
        """
        Parse resume file using Gemini 1.5 Flash (Native File Support)
        """
        try:
            logger.info("Parsing resume file with Gemini...")
            
            # Use Parser Key if available, else fallback
            api_key = settings.GOOGLE_API_KEY_PARSER or settings.GOOGLE_API_KEY
            client = self._get_client(api_key)
            
            prompt = """
            Analyze the attached resume document and extract structured information.
            
            Extract and return the following information in JSON format:
            {
                "name": "Candidate Name",
                "links": ["Platform: URL", ...],
                "skills": ["skill1", "skill2", ...],
                "experience_years": <number or null>,
                "education": ["degree1", "degree2", ...],
                "job_titles": ["title1", "title2", ...],
                "achievements": ["achievement1", "achievement2", ...]
            }
            
            Rules:
            - Extract the candidate's full name
            - Extract all profile links (LinkedIn, GitHub, Portfolio, etc.) with platform name
            - Extract all technical and soft skills mentioned
            - Calculate total years of experience if possible
            - List all degrees and certifications
            - List all job titles held
            - Extract key achievements and accomplishments
            - Return only valid JSON
            """
            
            response = client.models.generate_content(
                model=settings.GEMINI_MODEL_PARSER,
                contents=[
                    types.Part.from_bytes(
                        data=file_content,
                        mime_type=mime_type,
                    ),
                    prompt
                ],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )
            
            # Parse JSON response
            content = response.text
            parsed = json.loads(content)
            
            return ParsedResumeData(**parsed)
            
        except Exception as e:
            logger.error(f"AI resume parsing error: {e}", exc_info=True)
            # Return default structure on error
            # Return default structure on error
            return ParsedResumeData(
                name=None,
                links=[],
                skills=[],
                experience_years=None,
                education=[],
                job_titles=[],
                achievements=[]
            )

    async def refine_context(self, context_data: dict) -> dict:
        """
        Refine user context with AI suggestions
        """
        try:
            logger.info("Refining context with AI...")
            
            # Use Chatbot Key if available
            api_key = settings.GOOGLE_API_KEY_CHATBOT or settings.GOOGLE_API_KEY
            client = self._get_client(api_key)
            
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
            
            response = client.models.generate_content(
                model=settings.GEMINI_MODEL_CHATBOT,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )
            
            # For now, just return original context with suggestions logged or merged
            # The current implementation just returned context_data, so we keep it simple
            # but we could merge suggestions if the frontend supported it.
            # For now, let's just log it to prove it works
            logger.info(f"Refinement suggestions: {response.text}")
            
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
        """
        try:
            logger.info(f"Generating email for {company_name}...")
            
            # Use Generator Key if available
            api_key = settings.GOOGLE_API_KEY_GENERATOR or settings.GOOGLE_API_KEY
            client = self._get_client(api_key)
            
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
            
            response = client.models.generate_content(
                model=settings.GEMINI_MODEL_GENERATOR,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )
            
            content = response.text
            email_data = json.loads(content)
            
            return email_data
            
        except Exception as e:
            logger.error(f"AI email generation error: {e}", exc_info=True)
            return {
                "subject": f"Inquiry about opportunities at {company_name}",
                "body": "Email generation failed. Please write manually."
            }
