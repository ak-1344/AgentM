# AI Engine

AI-powered text processing, resume parsing, and email generation for Agent M.

## Components

### 1. Resume Parser (`resume_parser.py`)
- **Purpose**: Extract structured data from resumes
- **Model**: GPT-4 Turbo
- **Features**:
  - Personal info extraction
  - Skills identification
  - Experience parsing
  - Education extraction
  - Professional summary

**Usage:**
```python
from ai_engine.resume_parser import ResumeParser

parser = ResumeParser(api_key="your-openai-key")
parsed_data = parser.parse(resume_text)
```

### 2. Email Generator (`email_generator.py`)
- **Purpose**: Generate personalized outreach emails
- **Model**: GPT-4 Turbo
- **Features**:
  - Customized email generation
  - Follow-up emails
  - Multiple tones (professional, casual, enthusiastic)
  - Context-aware personalization

**Usage:**
```python
from ai_engine.email_generator import EmailGenerator

generator = EmailGenerator(api_key="your-openai-key")
email = generator.generate_outreach_email(
    user_context={"skills": ["Python", "FastAPI"], ...},
    company_info={"name": "Tech Corp", "role": "Backend Engineer"},
    email_type="job_application",
    tone="professional"
)
```

### 3. Context Refiner (`context_refiner.py`)
- **Purpose**: Improve user targeting with AI suggestions
- **Model**: GPT-4 Turbo
- **Features**:
  - Suggest additional job titles
  - Recommend related industries
  - Identify important keywords
  - Generate professional summaries

**Usage:**
```python
from ai_engine.context_refiner import ContextRefiner

refiner = ContextRefiner(api_key="your-openai-key")
suggestions = refiner.suggest_improvements(user_context)
summary = refiner.generate_professional_summary(resume_data, "Software Engineer")
```

## Installation

```bash
pip install langchain langchain-openai openai pydantic
```

## Environment Variables

```bash
OPENAI_API_KEY=your-api-key-here
OPENAI_MODEL=gpt-4-turbo-preview  # Optional
```

## Phase Implementation

- **Phase 1**: Resume parser (✅ Implemented)
- **Phase 2**: Email generator (✅ Implemented)
- **Phase 3**: Context refiner (✅ Implemented)
- **Phase 4**: Follow-up generator (✅ Implemented)
- **Phase 5**: Reply classifier (Planned)

## Models Used

- **GPT-4 Turbo Preview**: Best for complex reasoning and generation
- **Temperature**: 0.3 for parsing (consistency), 0.7 for generation (creativity)

## Error Handling

All components include:
- Comprehensive logging
- Graceful error handling
- Fallback behaviors
- Detailed error messages

## Testing

```python
# Test resume parser
python -c "from ai_engine.resume_parser import ResumeParser; print('OK')"

# Test email generator
python -c "from ai_engine.email_generator import EmailGenerator; print('OK')"
```

## Integration

These components are used by:
- `backend/app/services/ai_service.py` - Main integration point
- Backend API endpoints for parsing and generation
- Future web scraping for content analysis

## Future Enhancements

- Reply classification (Phase 5)
- Sentiment analysis
- Outcome prediction
- Multi-language support
- Template learning from successful emails
