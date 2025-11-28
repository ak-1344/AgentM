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
        Uses the google.genai.Client() format for guaranteed JSON response
        """
        try:
            logger.info("Parsing resume text with Gemini...")
            
            # Use GENERATOR key for parsing as per user requirement
            api_key = settings.GOOGLE_API_KEY_GENERATOR or settings.GOOGLE_API_KEY
            client = genai.Client(api_key=api_key)
            
            prompt = f"""
            You are an expert resume parser. Analyze the following resume text and extract structured information.
            
            Resume Text:
            {resume_text}
            
            Extract and return the following information in JSON format:
            {{
                "name": "Candidate Name",
                "links": {{"LinkedIn": "url", "GitHub": "url", "Portfolio": "url"}},
                "skills": ["skill1", "skill2", ...],
                "experience_years": <number or null>,
                "education": ["degree1", "degree2", ...],
                "job_titles": ["title1", "title2", ...],
                "achievements": ["achievement1", "achievement2", ...]
            }}
            
            Rules:
            - Extract the candidate's full name
            - Extract all profile links as key-value pairs where key is the platform name (LinkedIn, GitHub, Portfolio, Website, etc.) and value is the URL
            - Extract all technical and soft skills mentioned
            - Calculate total years of experience if possible
            - List all degrees and certifications
            - List all job titles held
            - Extract key achievements and accomplishments
            - Return only valid JSON
            - For links, use platform names as keys (e.g., "LinkedIn", "GitHub", "Portfolio", "Website")
            """
            
            # Use the guaranteed response format with GENERATOR model
            response = client.models.generate_content(
                model=settings.GEMINI_MODEL_GENERATOR, 
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.3  # Lower temperature for more consistent parsing
                )
            )
            
            # Parse JSON response
            content = response.text
            parsed = json.loads(content)
            
            logger.info(f"Successfully parsed resume for: {parsed.get('name', 'Unknown')}")
            
            return ParsedResumeData(**parsed)
            
        except Exception as e:
            logger.error(f"AI resume text parsing error: {e}", exc_info=True)
            # Return default structure on error
            return ParsedResumeData(
                name=None,
                links={},
                skills=[],
                experience_years=None,
                education=[],
                job_titles=[],
                achievements=[]
            )

    async def parse_resume_file(self, file_content: bytes, mime_type: str) -> ParsedResumeData:
        """
        Parse resume file using Gemini (Native File Support)
        PARSER model extracts text from PDF/DOCX files
        """
        try:
            logger.info("Parsing resume file with Gemini PARSER model...")
            
            # Use PARSER Key for file extraction (multimodal capability)
            api_key = settings.GOOGLE_API_KEY_PARSER or settings.GOOGLE_API_KEY
            client = genai.Client(api_key=api_key)
            
            prompt = """
            Analyze the attached resume document and extract structured information.
            
            Extract and return the following information in JSON format:
            {
                "name": "Candidate Name",
                "links": {"LinkedIn": "url", "GitHub": "url", "Portfolio": "url"},
                "skills": ["skill1", "skill2", ...],
                "experience_years": <number or null>,
                "education": ["degree1", "degree2", ...],
                "job_titles": ["title1", "title2", ...],
                "achievements": ["achievement1", "achievement2", ...]
            }
            
            Rules:
            - Extract the candidate's full name
            - Extract all profile links as key-value pairs where key is the platform name (LinkedIn, GitHub, Portfolio, Website, etc.) and value is the URL
            - Extract all technical and soft skills mentioned
            - Calculate total years of experience if possible
            - List all degrees and certifications
            - List all job titles held
            - Extract key achievements and accomplishments
            - Return only valid JSON
            - For links, use platform names as keys (e.g., "LinkedIn", "GitHub", "Portfolio", "Website")
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
            return ParsedResumeData(
                name=None,
                links={},
                skills=[],
                experience_years=None,
                education=[],
                job_titles=[],
                achievements=[]
            )

    async def refine_context(self, context_data: dict) -> dict:
        """
        Refine user context with AI suggestions
        CHATBOT model provides conversational analysis
        """
        try:
            logger.info("Refining context with AI CHATBOT model...")
            
            # Use CHATBOT Key for conversation and analysis
            api_key = settings.GOOGLE_API_KEY_CHATBOT or settings.GOOGLE_API_KEY
            client = genai.Client(api_key=api_key)
            
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
    
    async def generate_context_suggestions(self, parsed_resume: ParsedResumeData) -> dict:
        """
        Generate context suggestions based on parsed resume data
        GENERATOR model creates text suggestions efficiently
        """
        try:
            logger.info("Generating context suggestions with GENERATOR model...")
            
            # Use GENERATOR Key for text generation
            api_key = settings.GOOGLE_API_KEY_GENERATOR or settings.GOOGLE_API_KEY
            client = genai.Client(api_key=api_key)
            
            # Build resume context for the prompt
            skills_str = ', '.join(parsed_resume.skills) if parsed_resume.skills else 'None provided'
            job_titles_str = ', '.join(parsed_resume.job_titles) if parsed_resume.job_titles else 'None provided'
            education_str = ', '.join(parsed_resume.education) if parsed_resume.education else 'None provided'
            
            prompt = f"""
            Based on the following resume data, suggest appropriate job search context:
            
            Resume Information:
            - Name: {parsed_resume.name or 'Not provided'}
            - Skills: {skills_str}
            - Job Titles/Experience: {job_titles_str}
            - Education: {education_str}
            - Years of Experience: {parsed_resume.experience_years or 'Unknown'}
            
            Provide smart suggestions for:
            1. **suggested_roles**: 5-7 relevant job titles the person should target (be specific, considering their background)
            2. **suggested_industries**: 4-6 industries that match their profile
            3. **suggested_keywords**: 8-12 important keywords for their job search (skills, technologies, methodologies)
            4. **suggested_geography**: 3-5 locations/regions that typically have opportunities in their field (can include "Remote")
            
            Return ONLY valid JSON in this exact format:
            {{
                "suggested_roles": ["role1", "role2", ...],
                "suggested_industries": ["industry1", "industry2", ...],
                "suggested_keywords": ["keyword1", "keyword2", ...],
                "suggested_geography": ["location1", "location2", ...]
            }}
            """
            
            response = client.models.generate_content(
                model=settings.GEMINI_MODEL_CHATBOT,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.7
                )
            )
            
            # Parse JSON response
            content = response.text
            suggestions = json.loads(content)
            
            logger.info(f"Generated suggestions: {suggestions}")
            return suggestions
            
        except Exception as e:
            logger.error(f"AI context suggestions error: {e}", exc_info=True)
            # Return empty suggestions on error
            return {
                "suggested_roles": [],
                "suggested_industries": [],
                "suggested_keywords": [],
                "suggested_geography": []
            }
    
    async def generate_email(
        self,
        company_name: str,
        company_description: str,
        user_context: dict,
        resume_data: dict
    ) -> dict:
        """
        Generate personalized email for a company
        GENERATOR model creates compelling outreach emails
        """
        try:
            logger.info(f"Generating email for {company_name} with GENERATOR model...")
            
            # Use GENERATOR Key for email generation
            api_key = settings.GOOGLE_API_KEY_GENERATOR or settings.GOOGLE_API_KEY
            client = genai.Client(api_key=api_key)
            
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
