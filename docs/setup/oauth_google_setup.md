# Google OAuth Setup Guide

## Overview
Configure Google OAuth for user authentication in Agent M.

---

## 1. Create Google Cloud Project

### Steps:
1. Go to https://console.cloud.google.com
2. Click "Select a project" → "New Project"
3. Enter project details:
   - **Project Name**: Agent-M
   - **Organization**: (optional)
4. Click "Create"

---

## 2. Enable Google OAuth

### Navigate to OAuth Consent Screen:
1. In Google Cloud Console, go to "APIs & Services" → "OAuth consent screen"
2. Select **External** user type
3. Click "Create"

### Fill in Application Details:
```
App name: Agent M
User support email: your-email@gmail.com
App logo: (optional, 120x120px)
Application home page: https://your-domain.com
Application privacy policy: https://your-domain.com/privacy
Application terms of service: https://your-domain.com/terms
Authorized domains: 
  - your-domain.com
  - supabase.co (for Supabase auth)
Developer contact: your-email@gmail.com
```

4. Click "Save and Continue"

### Scopes:
Add the following scopes:
- `email`
- `profile`
- `openid`

5. Click "Save and Continue"

### Test Users (for development):
- Add your email addresses for testing
- Click "Save and Continue"

---

## 3. Create OAuth 2.0 Credentials

### Steps:
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Select **Web application**
4. Configure:

```
Name: Agent M Web Client

Authorized JavaScript origins:
  - http://localhost:3000 (local dev)
  - https://your-domain.com (production)
  - https://your-project-id.supabase.co (Supabase)

Authorized redirect URIs:
  - http://localhost:3000/auth/callback (local dev)
  - https://your-domain.com/auth/callback (production)
  - https://your-project-id.supabase.co/auth/v1/callback (Supabase)
```

5. Click "Create"

### Copy Credentials:
```env
GOOGLE_CLIENT_ID=1234567890-abc123.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123...
```

⚠️ **Keep CLIENT_SECRET secure - never commit to version control**

---

## 4. Configure Supabase

### Navigate to Supabase Dashboard > Authentication > Providers

1. Find **Google** provider
2. Enable it
3. Enter credentials:
   ```
   Client ID: <GOOGLE_CLIENT_ID>
   Client Secret: <GOOGLE_CLIENT_SECRET>
   ```
4. Save

### Supabase Redirect URL:
Copy this URL from Supabase dashboard:
```
https://your-project-id.supabase.co/auth/v1/callback
```

Add it to Google Cloud Console OAuth redirect URIs (if not already added).

---

## 5. Frontend Integration (Next.js)

### Install Supabase Client:
```bash
cd frontend
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

### Create Auth Context:
```typescript
// frontend/contexts/AuthContext.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
```

### Create Login Page:
```typescript
// frontend/app/login/page.tsx
'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const { user, signInWithGoogle } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) router.push('/dashboard')
  }, [user, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center">Welcome to Agent M</h2>
        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-6 py-3 hover:bg-gray-50"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            {/* Google logo SVG */}
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  )
}
```

### Create Auth Callback Route:
```typescript
// frontend/app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
}
```

---

## 6. Backend Verification

### Verify JWT tokens from frontend:
```python
# backend/auth/verify.py
import os
from jose import jwt, JWTError
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(
            token, 
            SUPABASE_JWT_SECRET, 
            algorithms=["HS256"],
            audience="authenticated"
        )
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication")
```

---

## 7. Environment Variables

### Frontend `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_GOOGLE_CLIENT_ID=1234567890-abc123.apps.googleusercontent.com
```

### Backend `.env`:
```env
SUPABASE_JWT_SECRET=your-jwt-secret (from Supabase Dashboard > Settings > API)
```

---

## 8. Testing Checklist

- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] OAuth credentials created
- [ ] Redirect URIs added (localhost + production)
- [ ] Supabase Google provider enabled
- [ ] Frontend auth context implemented
- [ ] Login page working
- [ ] Auth callback route working
- [ ] User can sign in with Google
- [ ] User session persists on refresh
- [ ] Sign out working
- [ ] Backend JWT verification working

---

## 9. Security Best Practices

1. **Never expose Client Secret** in frontend code
2. **Always use HTTPS** in production
3. **Validate JWT tokens** on every backend request
4. **Implement CSRF protection**
5. **Set secure cookie flags** for session management
6. **Rate limit** authentication endpoints

---

## 10. Common Issues

### "redirect_uri_mismatch" error
- Check that redirect URI in Google Console exactly matches request
- Include protocol (http/https)
- No trailing slashes

### "Access blocked: Agent M has not completed verification"
- For development, add test users in OAuth consent screen
- For production, submit app for verification

### Session not persisting
- Check cookie settings
- Verify Supabase URL matches in all configs
- Check browser privacy settings

---

## Next Steps
After OAuth setup:
1. Test complete authentication flow
2. Implement protected routes
3. Add user profile creation on first login
4. Proceed to dashboard implementation
