# 🔐 Supabase Authentication Setup - Agent M Frontend

## Overview

Agent M uses **Supabase Authentication** for secure user management. This guide covers the complete authentication setup, configuration, and usage.

---

## ✅ What's Already Configured

The frontend is **already set up** with Supabase authentication! Here's what's included:

### 1. **Supabase Client** (`lib/supabase.ts`)
- ✅ Client initialization
- ✅ Auto token refresh
- ✅ Session persistence
- ✅ URL session detection

### 2. **Auth Context** (`contexts/AuthContext.tsx`)
- ✅ Email/password authentication
- ✅ Google OAuth support
- ✅ User session management
- ✅ Auto profile creation on signup

### 3. **Protected Routes** (`middleware.ts`)
- ✅ Automatic route protection
- ✅ Redirect to login if not authenticated
- ✅ Redirect to dashboard if already logged in

### 4. **Auth Pages**
- ✅ Login page (`/login`)
- ✅ Signup page (`/signup`)
- ✅ OAuth callback handler (`/auth/callback`)

### 5. **API Integration** (`lib/api.ts`)
- ✅ Auto JWT token injection
- ✅ Token refresh on expired
- ✅ 401 handling with redirect

---

## 🚀 Quick Start

### Step 1: Configure Environment Variables

Create `.env.local` in the frontend directory:

```bash
cd frontend
cp .env.example .env.local
```

Update with your Supabase credentials:

```bash
# Get these from: Supabase Dashboard > Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Your backend API
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Step 2: Enable Email Auth in Supabase

1. Go to **Authentication** > **Providers**
2. Enable **Email** provider
3. Configure email templates (optional)

### Step 3: (Optional) Enable Google OAuth

#### In Google Cloud Console:
1. Create OAuth 2.0 Client ID
2. Add authorized redirect URI:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```
3. Copy Client ID and Secret

#### In Supabase Dashboard:
1. Go to **Authentication** > **Providers**
2. Enable **Google** provider
3. Paste Client ID and Secret
4. Save

#### In Frontend .env.local:
```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### Step 4: Test Authentication

```bash
npm run dev
```

Visit `http://localhost:3000/signup` and create an account!

---

## 📁 File Structure

```
frontend/
├── app/
│   ├── login/
│   │   └── page.tsx              # Login page
│   ├── signup/
│   │   └── page.tsx              # Signup page
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts          # OAuth callback handler
│   └── dashboard/
│       └── page.tsx              # Protected dashboard
├── contexts/
│   └── AuthContext.tsx           # Auth provider & hooks
├── lib/
│   ├── supabase.ts               # Supabase client
│   └── api.ts                    # API client with auth
├── types/
│   └── supabase.ts               # Database types
├── middleware.ts                 # Route protection
└── .env.local                    # Environment variables
```

---

## 🔧 How It Works

### 1. User Signup Flow

```typescript
// User fills signup form
signUpWithEmail(email, password, fullName)
  ↓
// Create auth user in Supabase
supabase.auth.signUp({ email, password })
  ↓
// Create user profile in database
supabase.from('user_profiles').insert({ id, email, full_name })
  ↓
// User receives confirmation email
  ↓
// User confirms email (if required)
  ↓
// Redirect to dashboard
```

### 2. User Login Flow

```typescript
// User fills login form
signInWithEmail(email, password)
  ↓
// Authenticate with Supabase
supabase.auth.signInWithPassword({ email, password })
  ↓
// Session created & stored
  ↓
// Middleware checks session
  ↓
// Redirect to dashboard
```

### 3. Google OAuth Flow

```typescript
// User clicks "Sign in with Google"
signInWithGoogle()
  ↓
// Redirect to Google OAuth
  ↓
// User authorizes app
  ↓
// Redirect to /auth/callback?code=xxx
  ↓
// Exchange code for session
  ↓
// Create user profile (if new user)
  ↓
// Redirect to dashboard
```

### 4. Protected Route Access

```typescript
// User navigates to /dashboard
middleware.ts intercepts request
  ↓
// Check for active session
supabase.auth.getSession()
  ↓
// If no session → redirect to /login
// If session exists → allow access
  ↓
// Component loads user data from context
```

### 5. API Request with Auth

```typescript
// User makes API call
api.uploadResume(file)
  ↓
// Interceptor gets session token
supabase.auth.getSession()
  ↓
// Add Authorization header
config.headers.Authorization = `Bearer ${token}`
  ↓
// Send request to backend
  ↓
// Backend verifies JWT token
  ↓
// Return response
```

---

## 🎨 Using Auth in Components

### Get Current User

```typescript
import { useAuth } from '@/contexts/AuthContext'

export default function MyComponent() {
  const { user, session, loading } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Not authenticated</div>

  return <div>Welcome, {user.email}!</div>
}
```

### Sign Out

```typescript
import { useAuth } from '@/contexts/AuthContext'

export default function LogoutButton() {
  const { signOut } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return <button onClick={handleLogout}>Sign Out</button>
}
```

### Protect Component

```typescript
'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) return <div>Loading...</div>
  if (!user) return null

  return <div>Protected content</div>
}
```

---

## 🔒 Security Features

### 1. **Row Level Security (RLS)**
All database tables have RLS enabled:
```sql
-- Users can only access their own data
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);
```

### 2. **JWT Token Verification**
Backend verifies Supabase JWT tokens:
```python
from supabase import create_client

async def get_current_user_id(token: str):
    user = supabase.auth.get_user(token)
    return user.id
```

### 3. **Secure Session Storage**
Sessions stored in httpOnly cookies (protected from XSS)

### 4. **Auto Token Refresh**
Tokens refreshed automatically before expiration

### 5. **CORS Protection**
Backend CORS configured for frontend origin only

---

## 🛠️ Configuration Options

### Email Confirmation

**Require email confirmation** (Recommended for production):

1. Go to **Authentication** > **Settings**
2. Enable "Confirm email"
3. Users must verify email before login

**Disable for development**:
```
Uncheck "Confirm email" in Supabase settings
```

### Session Duration

Default: 1 hour (configurable in Supabase)

1. Go to **Authentication** > **Settings**
2. Set "JWT expiry limit"

### Password Requirements

Configure in **Authentication** > **Settings**:
- Minimum password length
- Password complexity rules

---

## 🐛 Troubleshooting

### "Invalid API key"
**Solution:** Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`

### "User already registered"
**Solution:** User exists. Use login instead or reset password.

### Google OAuth not working
**Solutions:**
1. Check redirect URI matches exactly
2. Verify Client ID and Secret in Supabase
3. Ensure Google provider is enabled

### Session not persisting
**Solutions:**
1. Check browser allows cookies
2. Verify `persistSession: true` in supabase client
3. Clear browser cache and retry

### "401 Unauthorized" on API calls
**Solutions:**
1. Verify token is being sent: Check Network tab
2. Backend JWT verification setup correctly
3. Token not expired (check session)

### Redirect loop after login
**Solution:** Check middleware.ts routes don't conflict

---

## 📊 Database Schema

### auth.users (Managed by Supabase)
- `id` - UUID (Primary Key)
- `email` - Text
- `encrypted_password` - Text
- `email_confirmed_at` - Timestamp
- `created_at` - Timestamp
- `updated_at` - Timestamp

### public.user_profiles (Your table)
- `id` - UUID (FK to auth.users)
- `email` - Text
- `full_name` - Text
- `phone_number` - Text
- `domain_context` - Text
- `created_at` - Timestamp
- `updated_at` - Timestamp

---

## 🎯 Best Practices

1. ✅ **Always use `useAuth()` hook** - Don't access Supabase client directly
2. ✅ **Check loading state** - Avoid flash of unauthenticated content
3. ✅ **Handle errors gracefully** - Show user-friendly error messages
4. ✅ **Use middleware for protection** - Don't rely on client-side checks only
5. ✅ **Keep secrets in .env.local** - Never commit sensitive keys
6. ✅ **Use service_role key on backend only** - Never expose in frontend

---

## 📚 Additional Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Next.js Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## ✅ Verification Checklist

- [ ] `.env.local` configured with Supabase credentials
- [ ] Email provider enabled in Supabase
- [ ] Google OAuth configured (if needed)
- [ ] User can sign up successfully
- [ ] User can log in successfully
- [ ] User profile created in database
- [ ] Protected routes redirect to login
- [ ] API calls include JWT token
- [ ] Sign out works correctly
- [ ] Session persists on page reload

---

**Authentication is ready to use! 🎉**

Start testing at `http://localhost:3000/signup`
