# Agent M Frontend Architecture

**Last Updated:** December 12, 2025  
**Status:** ✅ Clean & Production-Ready

---

## 📋 Overview

Clean, professional Next.js 14 application with ChatGPT-style sidebar navigation. All pages are database-connected with no static/mock data.

---

## 🗂️ Routing Structure

### Page Routes (Flat Structure)

```
/                   → Auto-redirect to /home
/login              → Login page (Page 1)
/signup             → Signup page (Page 1)
/forgot-password    → Password reset (Page 1)
/setup              → 7-step wizard (Page 2)
/home               → Dashboard (Page 3)
/profile            → Resume + Context viewer (Page 4)
/emails             → Email management (Page 5)
/logs               → Live logs (Page 6)
/settings           → Account settings (Page 7)
```

### Route Protection

**Protected Routes** (require authentication):
- `/home`, `/profile`, `/emails`, `/logs`, `/settings`, `/setup`

**Public Routes**:
- `/login`, `/signup`, `/forgot-password`

**Redirects**:
- Authenticated users visiting auth pages → `/home`
- Unauthenticated users visiting protected pages → `/login`

---

## 🏗️ Directory Structure

```
frontend/
├── app/                          # Next.js 14 App Router
│   ├── auth/callback/           # OAuth callback handler
│   ├── emails/page.tsx          # Email management (Page 5)
│   ├── forgot-password/         # Password reset
│   ├── home/page.tsx            # Dashboard (Page 3)
│   ├── login/page.tsx           # Login (Page 1)
│   ├── logs/page.tsx            # Live logs (Page 6)
│   ├── profile/page.tsx         # Resume + Context (Page 4)
│   ├── settings/page.tsx        # Settings (Page 7)
│   ├── setup/page.tsx           # 7-step wizard (Page 2)
│   ├── signup/page.tsx          # Signup (Page 1)
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout with AuthProvider
│   └── page.tsx                 # Root → redirects to /home
│
├── components/
│   ├── dashboard/               # Dashboard-specific components
│   │   ├── ActivityTimeline.tsx # Activity feed
│   │   ├── KPICards.tsx         # Metric cards
│   │   ├── QuickActionPanel.tsx # Action buttons
│   │   ├── Recommendations.tsx  # AI suggestions
│   │   └── StatusPanel.tsx      # System status
│   │
│   ├── emails/                  # Email-specific components
│   │   ├── AIReasoningBox.tsx   # AI explanation
│   │   ├── CompanyInsightsPanel.tsx
│   │   ├── EmailChatbot.tsx     # AI chat for emails
│   │   ├── EmailDetail.tsx      # Email editor
│   │   ├── EmailList.tsx        # Email list view
│   │   └── PersonalizationScore.tsx
│   │
│   ├── profile/                 # Profile-specific components
│   │   ├── ContextSummary.tsx   # Context display
│   │   ├── PreferencesPanel.tsx # User preferences
│   │   └── ResumeViewer.tsx     # Resume display
│   │
│   ├── setup/                   # Setup wizard steps
│   │   ├── BasicDetailsStep.tsx # Step 3: Basic info
│   │   ├── OutreachTypeStep.tsx # Step 4: Outreach type
│   │   ├── ResumeParseStep.tsx  # Step 2: AI parsing
│   │   ├── ResumeUploadStep.tsx # Step 1: Upload
│   │   ├── ReviewStep.tsx       # Step 7: Review
│   │   ├── SmtpSetupStep.tsx    # Step 6: Email setup
│   │   └── ToneStyleStep.tsx    # Step 5: Tone selection
│   │
│   ├── AppLayout.tsx            # ChatGPT-style sidebar layout
│   ├── ErrorBoundary.tsx        # Error handling
│   ├── JSONEditor.tsx           # Raw JSON editor modal
│   └── SetupWizard.tsx          # Wizard progress stepper
│
├── contexts/
│   ├── AuthContext.tsx          # Authentication state
│   └── ToastContext.tsx         # Toast notifications
│
├── lib/
│   ├── api.ts                   # Backend API client
│   └── supabase.ts              # Supabase client
│
├── types/
│   ├── email.ts                 # Email types
│   └── supabase.ts              # Database types
│
├── __tests__/                   # Test utilities
├── middleware.ts                # Route protection
├── next.config.js               # Next.js config
├── tailwind.config.js           # TailwindCSS config
└── tsconfig.json                # TypeScript config
```

---

## 🎨 Layout System

### AppLayout (Primary Layout)

**File:** `components/AppLayout.tsx`

**Features:**
- ✅ ChatGPT-style collapsible sidebar
- ✅ Hover expansion in collapsed mode
- ✅ Active route highlighting
- ✅ User profile section at bottom
- ✅ Smooth transitions (300ms)

**Navigation Items:**
- Home (House icon) → `/home`
- Profile (User icon) → `/profile`
- Emails (Mail icon) → `/emails`
- Logs (Terminal icon) → `/logs`
- Settings (Gear icon) → `/settings`

**User Section:**
- Avatar with email initial
- Email address display (when expanded)
- Sign out button

---

## 📄 Page Implementations

### Page 1: Authentication
**Files:** `app/login/page.tsx`, `app/signup/page.tsx`, `app/forgot-password/page.tsx`

**Features:**
- Email/password authentication
- OAuth (Google) integration
- Form validation
- Error handling
- Auto-redirect after login → `/home`

---

### Page 2: Setup Wizard
**File:** `app/setup/page.tsx`

**7 Steps:**
1. **Resume Upload** - Upload PDF/DOCX
2. **Resume Parse** - AI extraction
3. **Basic Details** - Experience, roles, industries
4. **Outreach Type** - Job hunting, freelancing, etc.
5. **Tone & Style** - Formal, friendly, assertive, etc.
6. **Email Setup** - SMTP configuration (optional)
7. **Review** - Summary & confirmation

**On Completion:** Redirects to `/home`

---

### Page 3: Dashboard (Home)
**File:** `app/home/page.tsx`

**Sections:**
1. **KPI Cards** - New mails, sent, under review, rejected
2. **Quick Actions** - Start scan, upload CSV
3. **Status Panel** - Resume, context, SMTP, AI scan status
4. **Activity Timeline** - Recent system events
5. **Recommendations** - AI-generated suggestions

**Data Source:** Backend API (`/api/v1/*`)

---

### Page 4: Profile (Resume + Context)
**File:** `app/profile/page.tsx`

**Sections:**
- Resume viewer with parsed data
- Context profile summary
- Preferences panel
- JSON editor buttons (edit raw data)

**Features:**
- View extracted resume data
- View context configuration
- Edit resume JSON
- Edit context JSON

---

### Page 5: Email Management
**File:** `app/emails/page.tsx`

**Tabs:**
- New (auto-generated drafts)
- Under Review
- Approved
- Rejected

**Email Card Features:**
- Company name
- Subject line
- Personalization score
- Quick preview
- Status badges

**Email Detail:**
- Full email body
- AI reasoning box
- Company insights
- Edit/approve/reject/regenerate buttons

---

### Page 6: Live Logs
**File:** `app/logs/page.tsx`

**Features:**
- Real-time system logs
- Terminal-style display
- Timestamps
- Log filtering (info, error, etc.)
- Auto-scroll to latest

---

### Page 7: Settings
**File:** `app/settings/page.tsx`

**Sections:**
1. **Profile Info** - Name, email, phone
2. **Security** - Change password
3. **SMTP Settings** - Email provider config
4. **Danger Zone** - Delete account, reset data

---

## 🔌 API Integration

### API Client
**File:** `lib/api.ts`

**Base Configuration:**
```typescript
baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
timeout: 30000ms
headers: { 'Content-Type': 'application/json' }
```

**Authentication:**
- Uses Supabase session tokens
- Automatically adds `Authorization: Bearer {token}` header
- Auto-redirects to login on 401 errors

**Key Endpoints:**
```typescript
// Resume
api.uploadResume(file)
api.getCurrentResume()
api.parseResume(resumeId)

// Context
api.buildContext(data)
api.getContextProfile()

// Emails
api.getEmails(status?)
api.updateEmailStatus(emailId, status)
api.regenerateEmail(emailId, instructions?)

// SMTP
api.saveSmtpCredentials(credentials)
api.testSmtpConnection()

// Dashboard
api.getUserStats()
api.getActivityFeed(limit)
api.startOutreachScan()
```

---

## 🎨 UI/UX Principles

### Design System

**Colors:**
- Primary: Blue gradient (#0284c7 → #0369a1)
- Background: Gray-50 (#f9fafb)
- Cards: White with subtle shadows
- Text: Gray-900 for headings, Gray-600 for body

**Typography:**
- Font: Inter (Google Fonts)
- Headings: Bold, 1.5-2rem
- Body: Regular, 0.875-1rem

**Components:**
- Cards with rounded corners (8px)
- Smooth transitions (300ms)
- Hover effects on interactive elements
- Loading states for async operations

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Collapsible sidebar on mobile

---

## 🔒 Security

### Authentication
- Supabase Auth (JWT tokens)
- Session persistence
- Auto-refresh tokens
- Secure cookie storage

### Route Protection
- Middleware-based (`middleware.ts`)
- Server-side session validation
- Redirect to login for unauthenticated users

### Data Validation
- TypeScript type safety
- Form validation
- API response validation

---

## 🚀 Performance

### Optimizations
- Next.js 14 App Router (React Server Components)
- Automatic code splitting
- Image optimization
- Font optimization (Inter)

### Data Fetching
- Server-side rendering where possible
- Client-side caching
- Optimistic UI updates
- Error boundaries

---

## 🧪 Testing

### Test Setup
**Directory:** `__tests__/`

**Planned Tests:**
- Component unit tests
- Integration tests
- E2E tests (Playwright/Cypress)

---

## 📦 Dependencies

### Core
- `next`: 14.0.4
- `react`: 18.2.0
- `typescript`: 5.x

### UI
- `tailwindcss`: 3.3.0
- `lucide-react`: 0.294.0 (icons)

### Backend Integration
- `@supabase/supabase-js`: 2.38.4
- `@supabase/ssr`: 0.7.0
- `axios`: 1.6.2

### Utilities
- `date-fns`: 3.0.0 (date formatting)
- `react-dropzone`: 14.2.3 (file uploads)

---

## 🔧 Environment Variables

**Required:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Optional:**
```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

---

## 🚦 Development Workflow

### Local Development
```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Type check
npm run type-check

# Build
npm run build

# Start production
npm start
```

### File Organization Rules
1. ✅ Pages in `app/` directory (flat structure)
2. ✅ Reusable components in `components/`
3. ✅ Page-specific components in subdirectories (e.g., `components/dashboard/`)
4. ✅ Shared utilities in `lib/`
5. ✅ Type definitions in `types/`

---

## ✅ What's Clean

### Removed:
- ❌ Old `/dashboard/*` routes
- ❌ `DashboardLayout.tsx` (replaced by `AppLayout.tsx`)
- ❌ `components/wizard/` (duplicates)
- ❌ Unused components: `ContextSetupForm`, `ResumeUploader`, `SetupCompleteView`
- ❌ Static/mock data
- ❌ Console.log statements

### Kept:
- ✅ Clean flat routing structure
- ✅ Single layout system (`AppLayout.tsx`)
- ✅ Database-connected components
- ✅ Production-ready code
- ✅ Type-safe implementation

---

## 📝 Next Steps (Future Enhancements)

1. Add comprehensive test coverage
2. Implement React Query for data caching
3. Add real-time updates (WebSockets)
4. Implement dark mode
5. Add keyboard shortcuts
6. Improve accessibility (ARIA labels, keyboard navigation)
7. Add analytics tracking
8. Implement error tracking (Sentry)

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)

---

**Architecture maintained by:** Agent M Development Team  
**Last major refactor:** December 12, 2025
