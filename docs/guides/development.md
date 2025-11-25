# Development Workflow

Guide for contributing to Agent M development.

---

## Getting Started

### 1. Fork and Clone

```bash
# Fork on GitHub first, then:
git clone https://github.com/YOUR_USERNAME/AgentM.git
cd AgentM

# Add upstream remote
git remote add upstream https://github.com/ak-1344/AgentM.git
```

### 2. Set Up Development Environment

```bash
# Run setup script
./setup.sh

# Or manual setup:
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cd ../frontend
npm install
```

### 3. Create Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

---

## Development Process

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions

Examples:
- `feature/email-templates`
- `fix/smtp-connection-timeout`
- `docs/api-endpoints`

### Commit Messages

Follow conventional commits:

```
type(scope): subject

body (optional)

footer (optional)
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code restructuring
- `test` - Adding tests
- `chore` - Maintenance

Examples:
```
feat(backend): add email template system

Implemented customizable email templates with variable substitution.
Added new API endpoint for template management.

Closes #123
```

```
fix(frontend): resolve resume upload timeout

Increased upload timeout from 30s to 60s.
Added progress indicator for large files.
```

---

## Development Workflow

### 1. Pull Latest Changes

```bash
git checkout main
git pull upstream main
git push origin main  # Update your fork
```

### 2. Create Feature Branch

```bash
git checkout -b feature/my-feature
```

### 3. Make Changes

Edit code, following style guidelines (see below).

### 4. Test Locally

```bash
# Backend tests
cd backend
pytest

# Frontend tests (when implemented)
cd frontend
npm test

# Run manually
# Terminal 1
cd backend
uvicorn main:app --reload

# Terminal 2
cd frontend
npm run dev
```

### 5. Commit Changes

```bash
git add .
git commit -m "feat(scope): description"
```

### 6. Push to Fork

```bash
git push origin feature/my-feature
```

### 7. Create Pull Request

1. Go to your fork on GitHub
2. Click "Compare & pull request"
3. Fill in PR template
4. Submit for review

---

## Code Style Guidelines

### Python (Backend)

Follow PEP 8 and project conventions:

```python
# Use type hints
async def get_user(user_id: str) -> dict:
    """
    Get user by ID.
    
    Args:
        user_id: UUID string of user
        
    Returns:
        User dictionary with profile data
        
    Raises:
        HTTPException: If user not found
    """
    try:
        user = await db.get_user(user_id)
        return user
    except Exception as e:
        logger.error(f"Error fetching user {user_id}: {e}")
        raise HTTPException(status_code=404, detail="User not found")

# Use descriptive variable names
user_profile_data = get_profile(user_id)  # Good
upd = get_profile(uid)  # Bad

# Add docstrings to functions
# Use async/await for I/O operations
# Log errors with context
# Validate input with Pydantic models
```

**Formatting:**
```bash
# Install black and isort
pip install black isort

# Format code
black backend/
isort backend/
```

### TypeScript (Frontend)

Follow project conventions:

```typescript
// Use functional components with TypeScript
interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

export default function UserProfile({ userId, onUpdate }: UserProfileProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Effect logic
  }, [userId]);
  
  // Component logic
  
  return (
    // JSX
  );
}

// Use descriptive types
type EmailStatus = 'draft' | 'sent' | 'failed';

// Handle errors gracefully
try {
  const response = await api.sendEmail(data);
  setSuccess(true);
} catch (err: any) {
  setError(err.response?.data?.detail || 'Failed to send email');
}
```

**Formatting:**
```bash
# Install Prettier
npm install -D prettier

# Format code
npm run format
```

---

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
pytest

# Run specific test file
pytest tests/test_resume_service.py

# Run with coverage
pytest --cov=app tests/

# Run specific test
pytest tests/test_resume_service.py::test_upload_resume
```

**Writing Tests:**

```python
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_upload_resume(auth_headers):
    with open("test_resume.pdf", "rb") as f:
        response = client.post(
            "/api/v1/upload/resume",
            files={"file": f},
            headers=auth_headers
        )
    assert response.status_code == 200
    assert "id" in response.json()
```

### Frontend Tests

```bash
cd frontend

# Run tests (when implemented)
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

---

## Database Migrations

### Creating Migrations

When adding new tables or columns:

1. Create SQL file:
```bash
touch database/migrations/002_add_new_feature.sql
```

2. Write migration:
```sql
-- Add new column
ALTER TABLE resumes ADD COLUMN parsed_skills JSONB;

-- Create new table
CREATE TABLE email_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Add RLS policy
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own templates"
    ON email_templates FOR ALL
    USING (auth.uid() = user_id);
```

3. Create rollback:
```bash
touch database/migrations/002_add_new_feature_rollback.sql
```

```sql
-- Rollback changes
DROP TABLE IF EXISTS email_templates;
ALTER TABLE resumes DROP COLUMN IF EXISTS parsed_skills;
```

### Running Migrations

```bash
# Apply migration (in Supabase SQL Editor)
# Copy contents of migration file
# Run in SQL Editor

# Or use migration tool (future)
python scripts/migrate.py up
```

---

## Adding New Features

### Backend Endpoint

1. **Create Pydantic Model** (`app/models/schemas.py`):
```python
class TemplateCreate(BaseModel):
    name: str
    content: str
    
class TemplateResponse(BaseModel):
    id: str
    name: str
    content: str
    created_at: datetime
```

2. **Create Service** (`app/services/template_service.py`):
```python
class TemplateService:
    def __init__(self):
        self.db = get_supabase_client()
    
    async def create_template(
        self, 
        user_id: str, 
        template_data: dict
    ) -> dict:
        # Implementation
        pass
```

3. **Create Endpoint** (`app/api/v1/endpoints/templates.py`):
```python
from fastapi import APIRouter, Depends

router = APIRouter()

@router.post("/", response_model=TemplateResponse)
async def create_template(
    template: TemplateCreate,
    user_id: str = Depends(get_current_user_id)
):
    service = TemplateService()
    result = await service.create_template(user_id, template.dict())
    return result
```

4. **Register Router** (`app/api/v1/router.py`):
```python
from app.api.v1.endpoints import templates

api_router.include_router(
    templates.router, 
    prefix="/templates", 
    tags=["templates"]
)
```

### Frontend Component

1. **Create Component** (`components/TemplateForm.tsx`):
```typescript
'use client'

import { useState } from 'react'
import { api } from '@/lib/api'

export default function TemplateForm() {
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.createTemplate({ name, content })
      // Handle success
    } catch (error) {
      // Handle error
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  )
}
```

2. **Add API Method** (`lib/api.ts`):
```typescript
createTemplate: async (data: TemplateCreate) => {
  const response = await apiClient.post('/api/v1/templates', data)
  return response.data
},
```

3. **Create Page** (`app/dashboard/templates/page.tsx`):
```typescript
import TemplateForm from '@/components/TemplateForm'

export default function TemplatesPage() {
  return (
    <div>
      <h1>Email Templates</h1>
      <TemplateForm />
    </div>
  )
}
```

---

## Code Review Process

### Before Submitting PR

- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No console.log or debugging code
- [ ] Environment variables documented
- [ ] Error handling implemented
- [ ] Loading states added (frontend)

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Added/updated tests
- [ ] Manual testing steps:
  1. Step 1
  2. Step 2

## Screenshots (if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex logic
- [ ] Documentation updated
- [ ] No new warnings
```

### Review Criteria

Reviewers will check:
- Code quality and readability
- Test coverage
- Error handling
- Security implications
- Performance impact
- Documentation completeness

---

## Release Process

### Version Numbers

Follow Semantic Versioning (semver):
- `MAJOR.MINOR.PATCH`
- `1.0.0` → `1.0.1` (patch: bug fixes)
- `1.0.0` → `1.1.0` (minor: new features)
- `1.0.0` → `2.0.0` (major: breaking changes)

### Creating Release

1. Update version numbers:
```bash
# Update docs/reference/VERSION.md
# Update docs/reference/CHANGELOG.md
# Update package.json (frontend)
```

2. Create release branch:
```bash
git checkout -b release/v1.1.0
git push origin release/v1.1.0
```

3. Create GitHub release:
- Tag: `v1.1.0`
- Title: `Release v1.1.0`
- Description: Copy from CHANGELOG.md

4. Merge to main:
```bash
git checkout main
git merge release/v1.1.0
git tag v1.1.0
git push origin main --tags
```

---

## Troubleshooting Development Issues

### Backend Issues

**Import errors:**
```bash
# Make sure virtual environment is activated
source venv/bin/activate
pip install -r requirements.txt
```

**Database connection:**
```bash
# Check .env file has correct Supabase credentials
# Test connection in Python:
python -c "from app.database.supabase_client import get_supabase_client; print(get_supabase_client())"
```

### Frontend Issues

**Module not found:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Environment variables not working:**
```bash
# Make sure they start with NEXT_PUBLIC_
# Restart dev server after changes
npm run dev
```

---

## Resources

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [OpenAI API Docs](https://platform.openai.com/docs)

---

**Happy coding! 🚀**
