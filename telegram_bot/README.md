# Telegram Bot

Email approval workflow and notification system via Telegram.

## ⚠️ Phase 3+ Feature

This module is planned for **Phase 3** and beyond. Current implementation provides structure and interfaces.

## Components

### 1. Approval Bot (`bot.py`)
- **Purpose**: Handle email approval workflow via Telegram
- **Technology**: python-telegram-bot (Phase 3)
- **Features** (Planned):
  - Send email drafts for approval
  - Inline approve/reject buttons
  - Edit draft functionality
  - Notifications
  - User management

**Usage (Phase 3):**
```python
from telegram_bot.bot import ApprovalBot

bot = ApprovalBot(bot_token="your-bot-token")
await bot.initialize()

# Send approval request
await bot.send_approval_request(
    user_id=123456789,
    email_draft={
        "id": "draft-123",
        "subject": "Job Application",
        "body": "Dear Hiring Manager...",
        "recipient": "jobs@company.com"
    }
)

# Register approval callback
async def on_approval(draft_id, action, user_id, reason=None):
    if action == "approved":
        # Send the email
        pass
    elif action == "rejected":
        # Log rejection
        pass

bot.register_approval_callback(on_approval)

# Start bot
await bot.start_polling()  # Development
# OR
await bot.set_webhook()    # Production
```

### 2. Command Handlers (`commands.py`)
- **Purpose**: Handle Telegram bot commands
- **Commands** (Planned):
  - `/start` - Welcome message
  - `/status` - Current status
  - `/pending` - Pending approvals
  - `/stats` - Statistics
  - `/help` - Help message

### 3. Notification Manager (`bot.py`)
- **Purpose**: Send various notifications
- **Notifications**:
  - Email sent confirmations (Phase 3)
  - Email failed alerts (Phase 3)
  - Reply received (Phase 5)
  - Daily summaries (Phase 4)

## Installation (Phase 3)

```bash
pip install python-telegram-bot[webhooks]
```

## Setup

### 1. Create Telegram Bot

1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Send `/newbot` and follow instructions
3. Copy bot token
4. Add to `.env`:
```bash
TELEGRAM_BOT_TOKEN=your-bot-token-here
```

### 2. Get Your User ID

1. Message [@userinfobot](https://t.me/userinfobot)
2. Copy your user ID
3. Store in database linked to your account

### 3. Configure Webhook (Production)

```bash
TELEGRAM_WEBHOOK_URL=https://your-domain.com/webhook/telegram
```

## Phase Implementation

### Phase 3: Approval Workflow
- ✅ Structure created
- ⏳ Bot initialization
- ⏳ Approval keyboard
- ⏳ Approve/Reject handlers
- ⏳ Edit functionality
- ⏳ Basic notifications

### Phase 4: Enhanced Notifications
- ⏳ Follow-up reminders
- ⏳ Send status updates
- ⏳ Daily summaries
- ⏳ Weekly reports

### Phase 5: Reply Management
- ⏳ Reply notifications
- ⏳ Reply classification display
- ⏳ Complete pipeline monitoring
- ⏳ Analytics on Telegram

## Approval Flow

```
1. Email draft created
   ↓
2. Bot sends to Telegram with preview
   ↓
3. User sees inline buttons:
   [✅ Approve] [❌ Reject] [✏️ Edit]
   ↓
4. Action triggers:
   - Approve → Email sent automatically
   - Reject → Draft marked as rejected
   - Edit → Show edit options
   ↓
5. Confirmation sent
```

## Security

- Bot token stored securely in environment
- User verification (Telegram ID → Database user)
- Action authorization checks
- Rate limiting
- Command access control

## Commands Reference

| Command | Description | Phase |
|---------|-------------|-------|
| `/start` | Welcome & setup | 3 |
| `/status` | Current campaign status | 3 |
| `/pending` | Pending approvals | 3 |
| `/approve <id>` | Quick approve by ID | 3 |
| `/reject <id>` | Quick reject by ID | 3 |
| `/stats` | Email statistics | 4 |
| `/help` | Help message | 3 |

## Inline Keyboards

### Approval Keyboard
```
[✅ Approve]  [❌ Reject]
      [✏️ Edit Draft]
```

### Edit Keyboard
```
[✏️ Edit Subject]
[✏️ Edit Body]
[🔙 Back]
```

## Notification Types

### Success Notifications
- ✅ Email sent successfully
- ✅ Follow-up scheduled
- ✅ Reply received

### Error Notifications
- ❌ Email sending failed
- ❌ SMTP connection error
- ❌ Invalid recipient

### Info Notifications
- ℹ️ Daily summary
- ℹ️ New draft ready
- ℹ️ Campaign started

## Integration

Integrated with:
- `backend/app/api/v1/endpoints/email.py` - Send approval requests
- `backend/app/services/email_service.py` - Email sending
- Future: IMAP service for replies

## Webhook Setup (Production)

```python
# In your FastAPI app
@app.post("/webhook/telegram")
async def telegram_webhook(update: dict):
    await bot.process_update(update)
    return {"ok": True}

# Set webhook
await bot.set_webhook()
```

## Development Mode

```python
# Use polling for development
await bot.start_polling()

# Bot will fetch updates continuously
# No webhook setup needed
```

## Testing

```python
# Test bot connection
from telegram_bot.bot import ApprovalBot

bot = ApprovalBot(bot_token="your-token")
await bot.initialize()

# Send test message
await bot.send_notification(
    user_id=your_telegram_id,
    message="Test notification",
    notification_type="info"
)
```

## Future Features

- Voice message summaries
- Photo attachments for visual campaigns
- Group chat support for teams
- Analytics charts as images
- Auto-reply to common queries
- Template selection via bot
- Campaign scheduling via bot

## Current Status

**Status:** 🟡 Structure ready, implementation pending Phase 3

**Available Now:**
- Module structure
- Interface definitions
- Documentation

**Coming in Phase 3:**
- Full bot implementation
- Approval workflow
- Basic notifications
- Command handlers
- Testing suite
