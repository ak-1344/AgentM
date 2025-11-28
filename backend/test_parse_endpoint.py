#!/usr/bin/env python3
"""
Quick test script to verify resume parsing endpoint
"""
import asyncio
from app.services.ai_service import AIService
from app.services.resume_service import ResumeService

async def test_parsing():
    """Test the parsing functionality"""
    
    # Sample resume text
    sample_resume = """
    John Doe
    Software Engineer
    Email: john@example.com
    LinkedIn: linkedin.com/in/johndoe
    GitHub: github.com/johndoe
    
    EXPERIENCE
    Senior Software Engineer at Tech Corp (2020-2023)
    - Built scalable microservices using Python and FastAPI
    - Led team of 5 engineers
    - Improved system performance by 40%
    
    Software Engineer at StartupXYZ (2018-2020)
    - Developed RESTful APIs
    - Worked with React and TypeScript
    
    EDUCATION
    Bachelor of Science in Computer Science
    University of Technology, 2018
    
    SKILLS
    Python, JavaScript, TypeScript, React, FastAPI, Docker, PostgreSQL, AWS
    """
    
    print("Testing AI Service parsing...")
    print("-" * 50)
    
    try:
        ai_service = AIService()
        result = await ai_service.parse_resume_text(sample_resume)
        
        print("\n✅ Parsing successful!")
        print(f"\nName: {result.name}")
        print(f"Skills: {', '.join(result.skills[:5])}...")
        print(f"Job Titles: {', '.join(result.job_titles)}")
        print(f"Experience Years: {result.experience_years}")
        print(f"Education: {', '.join(result.education)}")
        print(f"\nFull result:")
        print(result.model_dump_json(indent=2))
        
    except Exception as e:
        print(f"\n❌ Parsing failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_parsing())
