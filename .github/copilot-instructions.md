# Agent M - GitHub Copilot Instructions

## Project Context
Agent M is an AI-powered automated outreach platform for job hunting, sponsorship, and freelancing. It uses Next.js frontend, FastAPI backend, OpenAI GPT-4, and Supabase.

## Development Phases
The project is built in 5 phases (see `Work-domains.txt`):
- **Phase 1 (Current)**: Resume upload, context setup, manual email sending
- **Phase 2**: Web crawling, company discovery
- **Phase 3**: Email approval workflow, Telegram bot
- **Phase 4**: Follow-ups, analytics
- **Phase 5**: Reply intelligence, predictions

## Code Style Guidelines

### Backend (Python/FastAPI)
- Use type hints for all functions
- Follow PEP 8 style guide
- Add docstrings to services and endpoints
- Use async/await for I/O operations
- Log errors with context
- Validate input with Pydantic models

Example:
```python
async def service_function(user_id: str, data: dict) -> dict:
    """
    Brief description of what this does
    """
    try:
        logger.info(f"Processing for user {user_id}")
        # Implementation
        return result
    except Exception as e:
        logger.error(f"Error: {e}", exc_info=True)
        raise
```

### Frontend (TypeScript/Next.js)
- Use TypeScript for all components
- Use functional components with hooks
- Follow Next.js 14 App Router conventions
- Use TailwindCSS utility classes
- Handle loading and error states
- Use the API client from `lib/api.ts`

Example:
```typescript
'use client'

export default function Component() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Implementation
}
```

## Architecture Rules

### Backend Services
- One service per domain (resume, context, smtp, email, ai)
- Services handle business logic
- Endpoints are thin wrappers calling services
- All database operations through Supabase client
- Encrypt sensitive data before storage

### Frontend Structure
- Pages in `app/` directory
- Reusable components in `components/`
- API calls through `lib/api.ts`
- Auth context in `contexts/AuthContext.tsx`
- Use Supabase client for auth only

### Database
- Use Supabase for all data storage
- Enable RLS on all tables
- Store files in Supabase Storage
- Encrypt passwords with Fernet

## Security Best Practices
- Never log passwords or sensitive data
- Always validate user ownership (user_id checks)
- Use RLS policies in database
- Encrypt SMTP passwords
- Validate JWT tokens on backend
- Use environment variables for secrets

## AI/LLM Usage
- Use GPT-4 Turbo for complex tasks
- Use LangChain for prompt management
- Always have fallback behavior if AI fails
- Parse JSON responses safely
- Log AI interactions for debugging

## File Organization
- Place new backend services in `backend/app/services/`
- Place new endpoints in `backend/app/api/v1/endpoints/`
- Place new components in `frontend/components/`
- Update schemas in `app/models/schemas.py`

## When Adding Features
1. Check which phase it belongs to
2. Follow existing patterns
3. Add appropriate error handling
4. Update CHANGELOG.md
5. Add to version tracking if significant

## Common Patterns

### Backend Endpoint Pattern
```python
@router.post("/endpoint", response_model=ResponseModel)
async def endpoint_name(
    request: RequestModel,
    user_id: str = Depends(get_current_user_id)
):
    try:
        service = MyService()
        result = await service.do_something(user_id, request.dict())
        return ResponseModel(**result)
    except Exception as e:
        logger.error(f"Error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
```

### Frontend API Call Pattern
```typescript
try {
  setLoading(true)
  setError(null)
  const response = await api.someEndpoint(data)
  // Handle success
} catch (err: any) {
  setError(err.response?.data?.detail || 'Error message')
} finally {
  setLoading(false)
}
```

## Environment Variables
- Backend: See `backend/.env.example`
- Frontend: See `frontend/.env.example`
- Always use `settings` in backend
- Always use `process.env.NEXT_PUBLIC_*` in frontend

## Testing
- Write tests for critical business logic
- Test API endpoints with various inputs
- Test error conditions
- Use pytest for backend
- Use Jest for frontend (when implemented)

## Documentation
- Update README.md for major features
- Add setup instructions to PendingWork/ if needed
- Update CHANGELOG.md for all changes
- Document API endpoints in code

## DO NOT
- ❌ Commit secrets or API keys
- ❌ Skip error handling
- ❌ Ignore type safety
- ❌ Write code without logging
- ❌ Implement features from future phases
- ❌ Hardcode configuration values
- ❌ Skip input validation

## ALWAYS
- ✅ Use type hints and TypeScript types
- ✅ Handle errors gracefully
- ✅ Log important operations
- ✅ Validate user permissions
- ✅ Follow existing code patterns
- ✅ Update documentation
- ✅ Test your changes

---

This file helps GitHub Copilot understand the project structure and conventions. Update it as the project evolves.
