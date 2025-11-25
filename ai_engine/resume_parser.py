"""
Resume Parser - AI-powered resume extraction
Extracts skills, experience, education, and personal info from resumes
"""

from typing import Dict, Any, Optional
import logging
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
import json

logger = logging.getLogger(__name__)


class PersonalInfo(BaseModel):
    """Personal information schema"""
    name: Optional[str] = Field(None, description="Full name")
    email: Optional[str] = Field(None, description="Email address")
    phone: Optional[str] = Field(None, description="Phone number")
    location: Optional[str] = Field(None, description="Location/Address")
    linkedin: Optional[str] = Field(None, description="LinkedIn URL")
    github: Optional[str] = Field(None, description="GitHub URL")


class Experience(BaseModel):
    """Work experience schema"""
    title: str = Field(..., description="Job title")
    company: str = Field(..., description="Company name")
    duration: Optional[str] = Field(None, description="Duration (e.g., '2020-2023')")
    description: Optional[str] = Field(None, description="Job description")


class Education(BaseModel):
    """Education schema"""
    degree: str = Field(..., description="Degree name")
    institution: str = Field(..., description="School/University name")
    year: Optional[str] = Field(None, description="Graduation year")


class ParsedResume(BaseModel):
    """Complete parsed resume schema"""
    personal_info: PersonalInfo
    skills: list[str] = Field(default_factory=list)
    experience: list[Experience] = Field(default_factory=list)
    education: list[Education] = Field(default_factory=list)
    summary: Optional[str] = Field(None, description="Professional summary")


class ResumeParser:
    """AI-powered resume parser using OpenAI GPT-4"""
    
    def __init__(self, api_key: str, model: str = "gpt-4-turbo-preview", temperature: float = 0.3):
        """
        Initialize resume parser
        
        Args:
            api_key: OpenAI API key
            model: Model name to use
            temperature: Temperature for generation (lower = more consistent)
        """
        self.llm = ChatOpenAI(
            api_key=api_key,
            model=model,
            temperature=temperature
        )
        self.parser = PydanticOutputParser(pydantic_object=ParsedResume)
        
    def parse(self, resume_text: str) -> Dict[str, Any]:
        """
        Parse resume text and extract structured information
        
        Args:
            resume_text: Raw text from resume
            
        Returns:
            Dict with parsed resume data
        """
        try:
            prompt = ChatPromptTemplate.from_messages([
                ("system", """You are an expert resume parser. Extract structured information from resumes.
                
                Extract:
                - Personal info (name, email, phone, location, LinkedIn, GitHub)
                - Skills (technical and soft skills)
                - Work experience (title, company, duration, description)
                - Education (degree, institution, year)
                - Professional summary
                
                {format_instructions}
                
                Be thorough and accurate. If information is missing, use null/empty values."""),
                ("user", "Parse this resume:\n\n{resume_text}")
            ])
            
            chain = prompt | self.llm
            
            response = chain.invoke({
                "resume_text": resume_text,
                "format_instructions": self.parser.get_format_instructions()
            })
            
            # Parse the response
            content = response.content
            
            # Try to extract JSON if wrapped in markdown
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            
            # Parse with Pydantic
            parsed = self.parser.parse(content)
            
            return parsed.dict()
            
        except Exception as e:
            logger.error(f"Error parsing resume: {e}", exc_info=True)
            raise
    
    def extract_skills(self, resume_text: str) -> list[str]:
        """
        Quick skill extraction from resume
        
        Args:
            resume_text: Raw resume text
            
        Returns:
            List of skills
        """
        try:
            prompt = ChatPromptTemplate.from_messages([
                ("system", "Extract all technical and professional skills from the resume. Return as a JSON array of strings."),
                ("user", "Resume:\n\n{text}")
            ])
            
            chain = prompt | self.llm
            response = chain.invoke({"text": resume_text})
            
            content = response.content
            
            # Extract JSON array
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            
            skills = json.loads(content)
            return skills if isinstance(skills, list) else []
            
        except Exception as e:
            logger.error(f"Error extracting skills: {e}")
            return []
