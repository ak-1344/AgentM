# AgentM User Workflow Documentation

This document outlines the user journey through the AgentM platform, from initial signup to sending an outreach email. It is designed to be understood by both non-technical users and developers, bridging the gap between user actions and technical implementation.

## Phase 1: Onboarding & Authentication

**Goal:** Create an account and access the platform.

### User Perspective
1.  **Landing:** User arrives at the login or signup page.
2.  **Action:** User enters their Full Name, Email, and Password, or chooses "Sign up with Google".
3.  **Outcome:** Upon successful signup, the user is redirected to the **Dashboard**.

### Technical Perspective
*   **Frontend Route:** `/signup`
*   **Component:** `SignUpPage` (`frontend/app/signup/page.tsx`)
*   **Authentication Provider:** Supabase Auth.
*   **Process:**
    *   **Email/Password:** Calls `signUpWithEmail` from `AuthContext`.
    *   **Google:** Calls `signInWithGoogle` from `AuthContext`.
    *   **Session:** On success, a session token is received and stored.
    *   **Navigation:** `router.push('/dashboard')` is called.

---

## Phase 2: System Configuration (The "Setup" Flow)

**Goal:** Configure the AI agent with the necessary data (Resume, Context, Email Credentials) to generate personalized outreach.

### User Perspective
The Dashboard presents a 3-step setup progress bar. The user must complete all three to unlock full functionality.

#### Step 1: Upload Resume
1.  **Action:** User clicks "Upload Your Resume" and selects a PDF or DOCX file.
2.  **System:** The system analyzes the resume to extract skills and experience.
3.  **Outcome:** Step 1 is marked as "Completed".

#### Step 2: Define Context
1.  **Action:** User clicks "Define Your Context".
2.  **Input:** User fills out a form specifying:
    *   Target Job Titles
    *   Target Industries
    *   Tone/Personality
    *   Skills to Highlight
    *   Geographic Preferences
3.  **Outcome:** The AI understands *what* the user is looking for. Step 2 is marked as "Completed".

#### Step 3: Connect Email
1.  **Action:** User clicks "Connect Email".
2.  **Input:** User provides SMTP credentials (Host, Port, Username, Password) for their email provider (e.g., Gmail, Outlook).
3.  **System:** The system tests the connection to ensure it can send emails on the user's behalf.
4.  **Outcome:** Step 3 is marked as "Completed".

### Technical Perspective
*   **Dashboard Logic:** `DashboardPage` (`frontend/app/dashboard/page.tsx`) fetches progress from 3 endpoints in parallel:
    *   `GET /api/v1/resume` (Checks for existing resumes)
    *   `GET /api/v1/context` (Checks for existing context)
    *   `GET /api/v1/smtp/credentials` (Checks for stored credentials)

*   **Step 1 (Resume):**
    *   **Endpoint:** `POST /api/v1/resume/upload` (File upload)
    *   **Processing:** `POST /api/v1/resume/parse/{resumeId}` (Triggers parsing logic to extract text)

*   **Step 2 (Context):**
    *   **Endpoint:** `POST /api/v1/context/build`
    *   **Payload:** JSON object containing user preferences (roles, industries, etc.).

*   **Step 3 (SMTP):**
    *   **Endpoint:** `POST /api/v1/smtp/credentials` (Stores encrypted credentials)
    *   **Validation:** `POST /api/v1/smtp/test` (Verifies connection)

---

## Phase 3: Email Generation & Management

**Goal:** Generate, review, and send outreach emails.

### User Perspective
Once setup is complete, the user proceeds to the **Email Management** page.

1.  **View Emails:** User sees a list of generated emails, categorized by status:
    *   **New:** Freshly generated drafts.
    *   **Under Review:** Drafts currently being edited.
    *   **Approved:** Ready to send.
    *   **Rejected:** Discarded drafts.
2.  **Review & Refine:**
    *   User selects an email to view the content (Subject, Body, Recipient).
    *   **AI Chatbot:** User can chat with the AI to request changes (e.g., "Make it more professional", "Shorten the second paragraph").
3.  **Send:**
    *   Once satisfied, the user approves and sends the email.
    *   The email is sent from the user's connected account.

### Technical Perspective
*   **Frontend Route:** `/dashboard/emails`
*   **Component:** `EmailsPage` (`frontend/app/dashboard/emails/page.tsx`)

*   **Generation (The "Magic"):**
    *   **Endpoint:** `POST /api/v1/email/generate`
    *   **Logic:** The backend combines the **Resume** (User Profile), **Context** (User Goals), and **Company Data** (Target) to prompt the LLM (Gemini) to write a personalized email.

*   **Management:**
    *   **List:** `GET /api/v1/emails?status={status}`
    *   **Detail:** `GET /api/v1/emails/{emailId}`
    *   **Update Status:** `PATCH /api/v1/emails/{emailId}/status`

*   **Refinement (Chatbot):**
    *   **Endpoint:** `POST /api/v1/email/{emailId}/chat`
    *   **Logic:** A chat interface (`EmailChatbot.tsx`) sends user instructions to the backend. The backend re-prompts the LLM with the conversation history to rewrite the email content.
    *   **Update Content:** `PATCH /api/v1/emails/{emailId}/content`

*   **Sending:**
    *   **Endpoint:** `POST /api/v1/email/send`
    *   **Logic:** Uses the stored SMTP credentials to send the email via the configured provider.

---

## Summary of Data Flow

1.  **User Data** (Resume/Context) + **Target Data** (Company Info) -> **LLM** -> **Draft Email**
2.  **Draft Email** + **User Feedback** (Chat) -> **LLM** -> **Refined Email**
3.  **Refined Email** + **SMTP Credentials** -> **Mail Server** -> **Recipient**







| Achieved Workflow |
User visits website -> 
Login/SignUp (Supabase Auth) -> 
Uploads resume (Supabase Bucket with resume table) -> 
Parse it (Sent to Gemini Api to fetch the text) -> 
Parsed Json (extracted text again sent to API to get a json formatted data) -> 
Fetch context data from user Input ->
Show the basic details collected (context stored in context table) ->

| Working Tasks |
Internet website crawler (acc to context) [BigTask] ->




| Future Tasks | 
Store the details of company and their relatable data in ai_emails table ->
Sent context of user as well as the company details to get back a personalised applying email ->
Store those details in ai_emails table and show them on frontend in card view ->
Apply editing options, review options and Ai updation/review features in each mail_page ->
Check the smtp mail sending feature ->
Check the complete workflow for a new user.


| Later on Ideas |
- Keep a datasheet for related companies info (A crawler must not need to visit each company again and again)
- Company info can become a table and have tags realted to job opportunities or fields