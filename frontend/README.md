# Agent M Frontend

Next.js-based web application for Agent M's automated outreach platform.

**Version:** 1.0.0  
**Framework:** Next.js 14  
**Language:** TypeScript

---

## 📋 Overview

Modern, responsive web application providing:
- User authentication (Supabase Auth)
- Dashboard with progress tracking
- Resume upload and management
- Context profile configuration
- Email composition and management
- AI chatbot for email review
- Activity logs viewer
- SMTP configuration

---

## 🗂️ Directory Structure

```
frontend/
├── app/                      # Next.js 14 App Router
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Landing page
│   ├── login/               # Login page
│   │   └── page.tsx
│   ├── signup/              # Signup page
│   │   └── page.tsx
│   ├── dashboard/           # Dashboard home
│   │   └── page.tsx
│   ├── resume/              # Resume upload
│   │   └── page.tsx
│   ├── context/             # Context setup
│   │   └── page.tsx
│   ├── email/               # Email composer
│   │   └── page.tsx
│   ├── email-management/    # Email management
│   │   └── page.tsx
│   ├── chatbot/             # AI chatbot interface
│   │   └── page.tsx
│   ├── logs/                # Activity logs
│   │   └── page.tsx
│   └── settings/            # Settings & SMTP
│       └── page.tsx
├── components/              # Reusable components
│   ├── AuthWrapper.tsx      # Auth HOC
│   ├── DashboardLayout.tsx  # Dashboard shell
│   ├── EmailCard.tsx        # Email display
│   ├── ChatDialog.tsx       # Chat interface
│   ├── ErrorBoundary.tsx    # Error handling
│   └── ...
├── contexts/                # React contexts
│   ├── AuthContext.tsx      # Auth state
│   └── ToastContext.tsx     # Notifications
├── lib/                     # Utilities
│   ├── api.ts               # API client (Axios)
│   ├── supabase.ts          # Supabase client
│   └── utils.ts             # Helper functions
├── types/                   # TypeScript types
│   └── index.ts
├── middleware.ts            # Next.js middleware
├── next.config.js           # Next.js config
├── tailwind.config.js       # TailwindCSS config
├── tsconfig.json            # TypeScript config
├── package.json             # Dependencies
└── .env.local               # Environment variables
```

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

```bash
# Copy template
cp .env.example .env.local

# Edit with your credentials
nano .env.local
```

**Required variables:**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:8000)

### 3. Start Development Server

```bash
npm run dev
```

Access at: **http://localhost:3000**

---

## 🏗️ Architecture

### Next.js 14 App Router

Using the modern App Router with:
- Server Components (default)
- Client Components (with `'use client'`)
- React Server Actions
- Streaming and Suspense

### Key Patterns

#### 1. Authentication
```typescript
// contexts/AuthContext.tsx
export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState(null);
  // Supabase auth logic
};

// Usage in pages
'use client'
import { useAuth } from '@/contexts/AuthContext';

export default function Page() {
  const { user } = useAuth();
  // ...
}
```

#### 2. API Client
```typescript
// lib/api.ts
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-inject auth token
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### 3. Layout System
```
app/layout.tsx (Root)
  └── Providers (Auth, Toast)
      └── app/dashboard/layout.tsx
          └── DashboardLayout (Sidebar)
              └── Page Content
```

---

## 🎨 Styling

### TailwindCSS

Using utility-first CSS with custom configuration:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        // Custom colors
      },
    },
  },
};
```

### Component Structure

```tsx
// components/EmailCard.tsx
export const EmailCard: React.FC<EmailCardProps> = ({ email }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold">{email.company}</h3>
      {/* Content */}
    </div>
  );
};
```

---

## 📚 Key Technologies

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first CSS
- **@supabase/ssr** - Supabase auth for Next.js
- **Axios** - HTTP client
- **React** 18 - UI library
- **Lucide React** - Icons
- **date-fns** - Date formatting

---

## 🔐 Authentication

### Supabase Auth

Using `@supabase/ssr` for secure authentication:

```typescript
// lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

### Protected Routes

```typescript
// components/AuthWrapper.tsx
export const AuthWrapper: React.FC = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" />;
  
  return <>{children}</>;
};
```

---

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm test -- --coverage

# E2E tests with Cypress (when implemented)
npm run cypress
```

---

## 📱 Pages

### Public Pages
- `/` - Landing page
- `/login` - Login page
- `/signup` - Signup page

### Protected Pages (Dashboard)
- `/dashboard` - Dashboard home
- `/resume` - Resume upload
- `/context` - Context setup
- `/email` - Email composer
- `/email-management` - Email CRUD
- `/chatbot` - AI chatbot
- `/logs` - Activity logs
- `/settings` - SMTP config

---

## 🛠️ Development

### Code Style
- Use TypeScript for all files
- Use functional components with hooks
- Follow React best practices
- Use Prettier for formatting
- ESLint for linting

### Adding New Pages
1. Create page in `app/<route>/page.tsx`
2. Add to navigation in `DashboardLayout.tsx`
3. Add route protection if needed
4. Create reusable components in `components/`

### Adding New Components
```tsx
// components/MyComponent.tsx
import React from 'react';

interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ 
  title, 
  onAction 
}) => {
  return (
    <div>
      <h2>{title}</h2>
      <button onClick={onAction}>Action</button>
    </div>
  );
};
```

---

## 🐛 Troubleshooting

### Common Issues

**Module Not Found**
```bash
npm install
```

**Port Already in Use**
```bash
# Use different port
PORT=3001 npm run dev
```

**Environment Variables Not Loaded**
- Ensure `.env.local` exists
- Restart dev server after changes
- Check variable names have `NEXT_PUBLIC_` prefix

**Authentication Issues**
- Check Supabase credentials in `.env.local`
- Clear browser cookies
- Check browser console for errors

**API Connection Failed**
- Ensure backend is running
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify CORS is configured in backend

**[📖 Complete Troubleshooting Guide](../docs/guides/TROUBLESHOOTING.md)**

---

## 🚀 Building for Production

```bash
# Build production bundle
npm run build

# Start production server
npm start

# Or deploy to Vercel
vercel deploy
```

---

## 📚 Documentation

- **[Setup Guide](../docs/setup/FRONTEND.md)** - Frontend setup
- **[API Client](../docs/guides/api-guide.md)** - Using the API
- **[Components](../docs/architecture/FRONTEND.md)** - Component docs
- **[Deployment](../docs/deployment/vercel-deployment.md)** - Deploy guide

---

## 🔗 Related

- **[Backend README](../backend/README.md)** - Backend API
- **[Database README](../database/README.md)** - Database schema
- **[Main README](../README.md)** - Project overview

---

**Version:** 1.0.0 | **License:** MIT | **Next.js:** 14 | **React:** 18
