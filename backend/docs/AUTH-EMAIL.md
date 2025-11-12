# Email verification & password reset

This document describes the email flows implemented in the backend for account verification and password reset.

Endpoints

- POST /api/auth/send-verify
  - Body: { email }
  - Sends (or logs) an email with a verification link. Returns 200 regardless of whether the account exists.

- GET /api/auth/verify?token=<token>
  - Verifies the token and marks the user's email as verified.

- POST /api/auth/send-reset
  - Body: { email }
  - Sends (or logs) a password reset link. Returns 200 always.

- POST /api/auth/reset
  - Body: { token, password }
  - Validates token, sets new password (bcrypt), revokes refresh tokens for the account.

Environment variables

- EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM - (optional) SMTP settings for production.
- EMAIL_SECURE - if 'true' uses secure SMTP (boolean string).
- If SMTP vars are not present, the server uses a "dev logger" that writes emails to `backend/logs/emails.log` and prints them to the console.
- EMAIL_VERIFY_EXPIRES - token lifetime (default '24h')
- PASSWORD_RESET_EXPIRES - token lifetime (default '1h')
- CLIENT_ORIGIN - frontend base URL used in email links (default http://localhost:5173)

Security notes

- Tokens are generated randomly, hashed with SHA-256, and only the hash is stored in the database.
- Reset and verification tokens are single-use and removed/cleared after successful consumption.
- Password reset will revoke all existing refresh tokens for the user (logout everywhere).
- The send-reset endpoint returns 200 even if the email does not exist to avoid leaking account existence.

Testing locally

1. Start the backend without SMTP envs. Trigger /api/auth/send-reset or /api/auth/send-verify.
2. Check `backend/logs/emails.log` or the server console for the generated link and raw token.
3. Use the link or token in the verify/reset endpoints to complete the flow.
