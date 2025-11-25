# Agent M System Architecture

Complete architectural overview of Agent M v1.0.0.

---

## 📋 Overview

Agent M is built as a modern, scalable web application with clear separation between frontend, backend, and external services. The architecture follows best practices for security, maintainability, and extensibility.

---

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Next.js 14 Frontend (React)             │   │
│  │  • App Router  • TypeScript  • TailwindCSS           │   │
│  │  • Auth Context  • API Client  • Real-time Updates   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS
                              │ JWT Authentication
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        Backend Layer                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           FastAPI REST API (Python 3.12)             │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │              API Endpoints (v1)                │  │   │
│  │  │  • Resume  • Context  • SMTP  • Email          │  │   │
│  │  │  • Email Management  • Chatbot  • Logs         │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │             Service Layer                      │  │   │
│  │  │  • Business Logic  • Data Processing           │  │   │
│  │  │  • AI Orchestration  • Error Handling          │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │            Security & Middleware               │  │   │
│  │  │  • JWT Validation  • CORS  • Rate Limiting     │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                    │                    │
                    │                    │
        ┌───────────┘                    └──────────┐
        │                                           │
        ▼                                           ▼
┌──────────────────┐                      ┌──────────────────┐
│  Supabase        │                      │   OpenAI API     │
│  ┌────────────┐  │                      │  ┌────────────┐  │
│  │ PostgreSQL │  │                      │  │   GPT-4    │  │
│  │   + RLS    │  │                      │  │  Turbo     │  │
│  └────────────┘  │                      │  └────────────┘  │
│  ┌────────────┐  │                      │  ┌────────────┐  │
│  │    Auth    │  │                      │  │ LangChain  │  │
│  │  (JWT)     │  │                      │  │Integration │  │
│  └────────────┘  │                      │  └────────────┘  │
│  ┌────────────┐  │                      └──────────────────┘
│  │  Storage   │  │
│  │  (Files)   │  │
│  └────────────┘  │
└──────────────────┘
```

---

## 🎨 Frontend Architecture

### Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Authentication**: @supabase/ssr

### Directory Structure

```
frontend/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Home/landing page
│   ├── login/               # Login page
│   ├── signup/              # Signup page
│   ├── dashboard/           # Dashboard page
│   ├── resume/              # Resume upload page
│   ├── context/             # Context setup page
│   ├── email/               # Email composer page
│   ├── email-management/    # Email management page
│   ├── chatbot/             # AI chatbot page
│   ├── logs/                # Activity logs page
│   └── settings/            # Settings page
├── components/              # Reusable components
│   ├── AuthWrapper.tsx      # Auth HOC
│   ├── DashboardLayout.tsx  # Dashboard layout
│   ├── EmailCard.tsx        # Email display card
│   ├── ChatDialog.tsx       # Chatbot interface
│   └── ...
├── contexts/                # React contexts
│   ├── AuthContext.tsx      # Authentication state
│   └── ToastContext.tsx     # Toast notifications
├── lib/                     # Utilities
│   ├── api.ts               # API client
│   ├── supabase.ts          # Supabase client
│   └── utils.ts             # Helper functions
├── types/                   # TypeScript types
│   └── index.ts
└── public/                  # Static assets
```

### Key Components

#### 1. AuthContext
- Manages authentication state
- Provides user info across app
- Handles login/logout
- Protects routes

#### 2. API Client (`lib/api.ts`)
- Centralized HTTP client
- Automatic token injection
- Error handling
- Type-safe requests

#### 3. Layout System
- Root layout with providers
- Dashboard layout with sidebar
- Consistent navigation
- Responsive design

---

## 🔧 Backend Architecture

### Technology Stack

- **Framework**: FastAPI 0.104.1
- **Language**: Python 3.12
- **Validation**: Pydantic v2
- **Database Client**: Supabase 2.3.4
- **AI/LLM**: OpenAI 1.6.1, LangChain 0.0.350
- **Email**: aiosmtplib 3.0.1
- **Testing**: pytest 7.4.3

### Directory Structure

```
backend/
├── main.py                  # FastAPI app entry point
├── requirements.txt         # Python dependencies
├── .env                     # Environment variables
├── app/
│   ├── __init__.py
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/   # API route handlers
│   │       │   ├── resume.py
│   │       │   ├── context.py
│   │       │   ├── smtp.py
│   │       │   ├── email.py
│   │       │   ├── email_management.py
│   │       │   ├── chatbot.py
│   │       │   └── logs.py
│   │       └── router.py    # API router aggregation
│   ├── core/
│   │   ├── config.py        # Settings (Pydantic)
│   │   └── security.py      # Auth & encryption
│   ├── database/
│   │   └── supabase_client.py  # Supabase singleton
│   ├── models/
│   │   └── schemas.py       # Request/response models
│   └── services/            # Business logic layer
│       ├── resume_service.py
│       ├── context_service.py
│       ├── smtp_service.py
│       ├── email_service.py
│       ├── email_management_service.py
│       ├── chatbot_service.py
│       └── logs_service.py
└── tests/                   # Unit tests
    ├── conftest.py          # Pytest configuration
    ├── test_resume_service.py
    └── ...
```

### Layered Architecture

#### 1. API Layer (`app/api/v1/endpoints/`)
- **Responsibility**: Handle HTTP requests/responses
- **Tasks**:
  - Parse request data
  - Validate with Pydantic
  - Call service layer
  - Return formatted responses
  - Handle HTTP errors

**Example:**
```python
@router.post("/emails/generate")
async def generate_email(
    request: GenerateEmailRequest,
    user_id: str = Depends(get_current_user_id)
):
    service = EmailManagementService()
    result = await service.generate_email(user_id, request.dict())
    return result
```

#### 2. Service Layer (`app/services/`)
- **Responsibility**: Business logic and orchestration
- **Tasks**:
  - Implement business rules
  - Orchestrate AI/LLM calls
  - Interact with database
  - Handle errors gracefully
  - Log operations

**Example:**
```python
class EmailManagementService:
    async def generate_email(self, user_id: str, data: dict):
        # 1. Get user context
        context = await self.get_user_context(user_id)
        
        # 2. Call AI to generate email
        email = await self.ai_generate(context, data)
        
        # 3. Save to database
        email_id = await self.save_email(user_id, email)
        
        # 4. Log activity
        await self.log_activity(user_id, "email_generated")
        
        return {"email_id": email_id, ...}
```

#### 3. Database Layer (`app/database/`)
- **Responsibility**: Database connectivity
- **Tasks**:
  - Singleton Supabase client
  - Connection pooling
  - Query execution

**Example:**
```python
class SupabaseClient:
    _instance = None
    
    @classmethod
    def get_client(cls) -> Client:
        if cls._instance is None:
            cls._instance = create_client(url, key)
        return cls._instance
```

#### 4. Core Layer (`app/core/`)
- **Responsibility**: Cross-cutting concerns
- **Modules**:
  - `config.py`: Settings management
  - `security.py`: Auth, encryption, JWT

---

## 🗄️ Database Architecture

### Platform: Supabase (PostgreSQL)

### Tables

#### 1. `user_profiles`
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  full_name TEXT,
  email TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2. `resumes`
```sql
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users,
  file_path TEXT NOT NULL,
  parsed_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3. `context_profiles`
```sql
CREATE TABLE context_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users,
  target_roles TEXT[],
  target_industries TEXT[],
  target_geographies TEXT[],
  tone TEXT,
  keywords TEXT[],
  additional_info TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 4. `smtp_configurations`
```sql
CREATE TABLE smtp_configurations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users,
  smtp_host TEXT NOT NULL,
  smtp_port INTEGER NOT NULL,
  smtp_username TEXT NOT NULL,
  smtp_password_encrypted TEXT NOT NULL,
  from_email TEXT NOT NULL,
  from_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 5. `email_management`
```sql
CREATE TABLE email_management (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users,
  company_name TEXT NOT NULL,
  company_email TEXT NOT NULL,
  position TEXT,
  keywords TEXT[],
  subject TEXT NOT NULL,
  email_body TEXT NOT NULL,
  status TEXT CHECK (status IN ('new', 'under_review', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 6. `chatbot_sessions`
```sql
CREATE TABLE chatbot_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users,
  email_id UUID REFERENCES email_management,
  conversation_history JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 7. `activity_logs`
```sql
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users,
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL,
  level TEXT CHECK (level IN ('info', 'warning', 'error', 'success')),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS)

All tables have RLS enabled with policies ensuring users can only access their own data:

```sql
-- Example for email_management
CREATE POLICY "Users can view their own emails"
  ON email_management FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own emails"
  ON email_management FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Similar policies for UPDATE and DELETE
```

### Indexes

```sql
-- Performance optimization
CREATE INDEX idx_emails_user_id ON email_management(user_id);
CREATE INDEX idx_emails_status ON email_management(status);
CREATE INDEX idx_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_logs_level ON activity_logs(level);
CREATE INDEX idx_logs_created_at ON activity_logs(created_at DESC);
```

---

## 🤖 AI/LLM Integration

### OpenAI GPT-4 Integration

Agent M uses GPT-4 Turbo for:
1. Resume parsing
2. Email generation
3. Email review and editing
4. Conversational chatbot

### LangChain Orchestration

```python
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain

# Initialize LLM
llm = ChatOpenAI(
    model="gpt-4-turbo-preview",
    temperature=0.7
)

# Create prompt template
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an expert email writer..."),
    ("human", "Generate an email for {company}...")
])

# Create chain
chain = LLMChain(llm=llm, prompt=prompt)

# Execute
result = await chain.arun(company="Acme Corp")
```

### Prompt Engineering

**Email Generation Prompt:**
```
You are an expert professional email writer. Generate a personalized 
outreach email for {company_name} for the position of {position}.

User Context:
- Skills: {skills}
- Experience: {experience}
- Target Role: {target_role}
- Tone: {tone}

Requirements:
- Professional and engaging
- Highlight relevant skills
- Express genuine interest
- Keep under 300 words
- Include clear call-to-action
```

---

## 🔐 Security Architecture

### Authentication Flow

```
1. User signs up/logs in via Supabase Auth
2. Supabase returns JWT token
3. Frontend stores token in secure HTTP-only cookie
4. Frontend sends token in Authorization header for API requests
5. Backend validates JWT signature using SUPABASE_JWT_SECRET
6. Backend extracts user_id from token payload
7. Backend enforces RLS at database level
```

### Encryption

**SMTP Passwords:**
- Encrypted using Fernet (symmetric encryption)
- Encryption key stored in `ENCRYPTION_KEY` env var
- Encrypted before storage, decrypted on use

```python
from cryptography.fernet import Fernet

cipher = Fernet(ENCRYPTION_KEY)
encrypted = cipher.encrypt(password.encode())
decrypted = cipher.decrypt(encrypted).decode()
```

### CORS Configuration

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", ...],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📊 Data Flow Examples

### Email Generation Flow

```
1. User fills form on frontend (company, position, keywords)
2. Frontend sends POST /api/v1/emails/generate
3. Backend validates JWT, extracts user_id
4. EmailManagementService:
   a. Fetches user's resume and context from database
   b. Constructs prompt with user data + company data
   c. Calls OpenAI GPT-4 via LangChain
   d. Parses AI response (subject + body)
   e. Saves email to email_management table
   f. Creates activity log
5. Backend returns email_id and generated email
6. Frontend displays email to user
```

### AI Chatbot Interaction Flow

```
1. User clicks "Review with AI" on an email
2. Frontend sends POST /api/v1/emails/chatbot/review
3. Backend:
   a. Fetches email from database
   b. Creates chatbot session
   c. Generates initial review message with GPT-4
   d. Saves session with conversation history
4. Backend returns session_id and initial message
5. Frontend displays chat interface
6. User types message
7. Frontend sends POST /api/v1/emails/chatbot/message
8. Backend:
   a. Fetches session and conversation history
   b. Appends user message to history
   c. Calls GPT-4 with full context
   d. Updates email if AI makes changes
   e. Appends AI response to history
   f. Saves session
9. Backend returns AI response + updated email
10. Frontend updates chat and email display
```

---

## 🚀 Deployment Architecture

### Development

```
Local Machine
├── Frontend: http://localhost:3000 (npm run dev)
├── Backend: http://localhost:8000 (uvicorn with --reload)
└── Database: Supabase Cloud (shared dev project)
```

### Production (Recommended)

```
Frontend: Vercel
├── Next.js deployed via Git integration
├── Automatic builds on push
├── Edge CDN for global performance
└── Environment variables in Vercel settings

Backend: Render/Railway/Fly.io
├── Docker container or Python buildpack
├── Environment variables in platform settings
├── Auto-scaling based on load
└── Health check monitoring

Database: Supabase Production Project
├── Separate from dev environment
├── Automated backups
├── Read replicas for scaling
└── Point-in-time recovery
```

---

## 📈 Scalability Considerations

### Current Architecture (v1.0.0)
- Single backend instance
- Connection pooling via Supabase
- Stateless API (horizontal scaling ready)
- Database: Supabase managed PostgreSQL

### Future Enhancements
1. **Caching**: Redis for session storage, frequently accessed data
2. **Queue System**: Celery/RQ for background jobs (email sending)
3. **Load Balancer**: Nginx/HAProxy for multiple backend instances
4. **CDN**: CloudFlare for static assets
5. **Monitoring**: Sentry (errors), DataDog (metrics)

---

## 🧪 Testing Architecture

### Backend Testing

```
tests/
├── conftest.py              # Pytest fixtures
├── test_resume_service.py   # Service layer tests
├── test_context_service.py
├── test_email_management.py
└── test_api_endpoints.py    # API integration tests
```

**Test Strategy:**
- Unit tests for services (business logic)
- Integration tests for API endpoints
- Mocked external dependencies (Supabase, OpenAI)
- Pytest fixtures for test data

### Frontend Testing (Planned)

```
frontend/__tests__/
├── components/
├── pages/
└── utils/
```

**Test Strategy:**
- Jest for unit tests
- React Testing Library for components
- Cypress for E2E tests

---

## 📚 Additional Resources

- **[API Documentation](../api/README.md)** - Endpoint reference
- **[Database Schema](DATABASE.md)** - Detailed schema docs
- **[Security Guide](SECURITY.md)** - Security best practices
- **[Deployment Guide](../deployment/PRODUCTION.md)** - Production deployment

---

**[← Back to Documentation](../index.md)** | **[View API Docs →](../api/README.md)**
