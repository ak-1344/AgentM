# 🚀 Supabase Quick Setup - Agent M

## 📋 Checklist

### 1️⃣ Run Main Setup (2 min)
- [ ] Go to Supabase Dashboard > SQL Editor
- [ ] Copy `SUPABASE_SETUP.sql` and run it
- [ ] Verify: See "Setup Complete" message

### 2️⃣ Create Storage (1 min)
- [ ] Go to Storage > New Bucket
- [ ] Name: `resumes` (Private)
- [ ] Save bucket

### 3️⃣ Setup Storage Policies (1 min)
- [ ] Click on `resumes` bucket > Policies tab
- [ ] Copy policies from `SUPABASE_STORAGE_SETUP.sql`
- [ ] Paste and save each policy

### 4️⃣ Get Credentials (1 min)
- [ ] Go to Settings > API
- [ ] Copy Project URL
- [ ] Copy anon public key
- [ ] Copy service_role key (for backend only)

### 5️⃣ Update .env Files
**Backend:**
```bash
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
```

**Frontend:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

---

## ✅ Quick Verification

Run in SQL Editor:
```sql
-- Should return 4 tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_profiles', 'resumes', 'context_profiles', 'smtp_credentials');

-- Should return 9+ policies
SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public';
```

---

## 📁 Files You Need

1. **SUPABASE_SETUP.sql** - Main database setup (run first)
2. **SUPABASE_STORAGE_SETUP.sql** - Storage policies (run after bucket creation)
3. **docs/setup/SUPABASE_GUIDE.md** - Detailed guide with troubleshooting

---

## 🆘 Quick Fixes

**Tables not created?**
→ Re-run `SUPABASE_SETUP.sql`

**Upload fails?**
→ Check bucket is named exactly `resumes` and policies are applied

**Permission denied?**
→ Verify RLS policies exist and user is authenticated

---

## ⏱️ Total Time: ~5 minutes

**Ready to configure? Start with SUPABASE_SETUP.sql! 🎯**
