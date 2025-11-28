# Quick Start Guide - 4-Step Wizard

## How to Test the New 4-Step Wizard

### Prerequisites
1. Backend is running on `http://localhost:8000`
2. Frontend is running on `http://localhost:3000`
3. Environment variables are configured (especially `GOOGLE_API_KEY`)
4. Supabase is connected and tables are set up

### Testing Steps

#### 1. Start Fresh
```bash
# Clear any existing setup data (optional, for clean testing)
# You can delete your user's resume, context, and SMTP records from Supabase
```

#### 2. Navigate to Dashboard
- Go to `http://localhost:3000/dashboard`
- You should see the new 4-step wizard interface

#### 3. Step 1 - Upload Resume
- Click the upload area or drag a resume file
- Supported formats: PDF, DOC, DOCX
- Wait for upload to complete
- Should auto-advance to Step 2

#### 4. Step 2 - Parse Resume
- Parsing should start automatically
- Watch the Gemini AI animation
- After 10-30 seconds, you'll see parsed data:
  - Your name
  - Skills (with badges)
  - Job titles
  - Years of experience
- Should auto-advance to Step 3

#### 5. Step 3 - Setup Context
- AI suggestions will load automatically (purple tags)
- Click on any purple suggestion tag to add it
- You can also type and add custom entries
- Try the different sections:
  - **Target Roles**: Click suggested roles or add your own
  - **Industries**: Click suggested industries or add custom
  - **Keywords**: Click suggested skills/technologies or add more
  - **Locations**: Click suggested locations or add preferred cities
- Select an email tone
- Optionally add a custom message
- Click "Save & Continue"
- Should auto-advance to Step 4

#### 6. Step 4 - Email Integration
- You can either:
  - **Configure SMTP**: Fill in your email settings and test connection
  - **Skip**: Click "Skip for now" at the top right
- If configuring:
  - Use Gmail with an App Password (recommended)
  - Test the connection before saving
  - Save credentials

#### 7. Completion
- After Step 4, you'll see a success message
- Click the link to go to the Email page
- You're now ready to use Agent M!

## Expected API Calls

When testing, you should see these API calls in Network tab:

### On Dashboard Load
```
GET /api/v1/resume
GET /api/v1/context
GET /api/v1/smtp/credentials
```

### Step 1
```
POST /api/v1/resume/upload
```

### Step 2
```
POST /api/v1/resume/parse/{resume_id}
```

### Step 3
```
GET /api/v1/context/suggestions  ← NEW!
POST /api/v1/context/build
```

### Step 4
```
POST /api/v1/smtp/credentials
POST /api/v1/smtp/test
```

## Troubleshooting

### Resume Won't Upload
- Check file type (must be PDF, DOC, or DOCX)
- Check file size (should be under 10MB)
- Check backend logs for errors

### Parsing Takes Too Long
- Gemini API can take 10-30 seconds
- Check your `GOOGLE_API_KEY` is valid
- Check backend logs for API errors
- If it fails, you can click "Try again"

### No Suggestions Appear
- Make sure resume was parsed successfully
- Check browser console for errors
- Check backend logs for `/api/v1/context/suggestions` errors
- Gemini might return empty arrays - that's okay, you can still add custom entries

### Can't Advance to Next Step
- Make sure current step is completed
- Check for error messages on the page
- Check browser console for JavaScript errors

### SMTP Test Fails
- Verify credentials are correct
- For Gmail, use an App Password, not your regular password
- Check port: 587 for TLS, 465 for SSL
- Ensure TLS checkbox is checked for port 587

## Backend Logs to Monitor

Watch the backend logs for:
```
INFO: User {user_id} uploading resume
INFO: User {user_id} parsing resume
INFO: Parsing resume text with Gemini...
INFO: Generating context suggestions from resume...
INFO: Generated suggestions: {...}
INFO: User {user_id} building context
```

## Testing Different Scenarios

### 1. New User (No Setup)
- Should start at Step 1
- All steps should be clickable only after previous completion

### 2. Resume Uploaded, Not Parsed
- Should start at Step 2
- Parsing should auto-start

### 3. Resume Parsed, No Context
- Should start at Step 3
- Suggestions should load automatically

### 4. Context Set, No SMTP
- Should start at Step 4
- Can skip or configure SMTP

### 5. Everything Complete
- Should show success message
- All steps should be clickable for editing

## Success Criteria

✅ Resume uploads successfully  
✅ Gemini parses resume and extracts data  
✅ Parsed data displays correctly  
✅ Context suggestions load from AI  
✅ Suggestions can be clicked to add  
✅ Custom entries can be added  
✅ Context saves successfully  
✅ SMTP can be configured or skipped  
✅ Wizard completes and shows success message  
✅ User can navigate between completed steps  

## Notes

- The first 3 steps are required, SMTP is optional
- Users can click on completed steps to go back
- Auto-advance happens after each step completes
- AI suggestions are loaded asynchronously
- All state is persisted in Supabase
