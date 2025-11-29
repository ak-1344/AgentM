# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: **[security contact - add your email]**

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

Please include the following information in your report:

- Type of vulnerability (e.g., SQL injection, XSS, authentication bypass)
- Full paths of source file(s) related to the manifestation of the vulnerability
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

## Security Best Practices

When deploying Agent M, please follow these security guidelines:

### Environment Variables
- Never commit `.env` files to version control
- Use strong, randomly generated keys for `FERNET_KEY`
- Rotate API keys regularly
- Use environment-specific credentials (dev, staging, production)

### Database Security
- Enable Row Level Security (RLS) on all Supabase tables
- Use service role key only in backend, never in frontend
- Regularly review and audit RLS policies
- Enable database backup and point-in-time recovery

### API Security
- Always use HTTPS in production
- Implement rate limiting on all endpoints
- Validate all user inputs
- Use JWT tokens with appropriate expiration
- Enable CORS only for trusted domains

### SMTP Credentials
- Credentials are encrypted using Fernet encryption
- Never log or expose SMTP passwords
- Use app-specific passwords when available
- Rotate SMTP credentials if compromised

### Deployment
- Keep all dependencies up to date
- Use Docker with non-root users
- Implement proper logging and monitoring
- Regular security audits and penetration testing
- Enable firewall rules to restrict access

## Known Security Considerations

### Current Implementation (v1.0.0)
- ✅ Fernet encryption for SMTP credentials
- ✅ JWT-based authentication
- ✅ Row Level Security on all tables
- ✅ Input validation with Pydantic
- ✅ SQL injection prevention (parameterized queries)
- ✅ Secure file upload handling

### Planned Enhancements
- [ ] Rate limiting implementation (Phase 2)
- [ ] API key rotation system
- [ ] 2FA authentication option
- [ ] Audit logging for sensitive operations
- [ ] IP whitelisting capabilities
- [ ] Enhanced session management

## Security Update Process

1. Security issues are reviewed and prioritized
2. Patches are developed and tested
3. Security advisory is published (if needed)
4. Patch is released as soon as possible
5. Users are notified via GitHub releases and email (if critical)

## Attribution

We appreciate security researchers and users who report vulnerabilities responsibly. With your permission, we will acknowledge your contribution in our release notes.

## Questions?

If you have questions about this security policy, please open a GitHub Discussion or contact the maintainers.

---

**Last Updated:** November 29, 2025  
**Version:** 1.0.0
