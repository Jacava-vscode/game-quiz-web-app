# Refresh tokens as secure HttpOnly cookies

This document explains how the backend now issues refresh tokens as secure HttpOnly cookies, how the frontend should interact with the API, and required deployment configuration.

Why cookies?
- HttpOnly cookies are not accessible to JavaScript, which reduces the risk of a stolen refresh token via XSS.
- The browser automatically includes cookies on requests (when credentials are enabled), simplifying refresh flows.

Behavior implemented
- On signup and login the backend sets a cookie named `refresh_token` with these options:
  - httpOnly: true
  - secure: true when `NODE_ENV=production` (otherwise false for local dev)
  - sameSite: 'None' in production (to allow cross-site requests when frontend is on a different domain), 'Lax' in dev
  - maxAge: matches `REFRESH_TOKEN_EXPIRES_IN` (in ms)
  - path: `/api` (cookie sent only for API endpoints)
- The access token (JWT) is returned in the JSON response. The front-end should store the access token (in memory or localStorage) and use it in the Authorization header for API calls that need immediate authentication.
- To obtain a new access token, the frontend calls POST `/api/token/refresh`. The backend will read the `refresh_token` cookie, validate it, rotate it (issue a new refresh token cookie), and return a fresh access token.
- To logout, the frontend calls POST `/api/token/logout` which revokes the current refresh token server-side and clears the cookie.

Frontend integration (axios)
1. Ensure axios sends credentials (cookies):

```javascript
import axios from 'axios'
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL })
api.defaults.withCredentials = true // important
```

2. After login/signup: the backend will set the cookie automatically. Save the access token returned in the JSON response and attach it to future requests:

```javascript
localStorage.setItem('gq_token', accessToken)
api.defaults.headers.common.Authorization = `Bearer ${accessToken}`
```

3. To refresh the access token (and rotate refresh cookie):

```javascript
const { data } = await api.post('/token/refresh')
const newAccess = data.accessToken
localStorage.setItem('gq_token', newAccess)
api.defaults.headers.common.Authorization = `Bearer ${newAccess}`
```

Notes for fetch users: use `{ credentials: 'include' }` on requests that rely on the cookie.

CORS and deployment configuration
- Backend CORS must allow credentials and set the exact `CLIENT_ORIGIN` (wildcards will not work with credentials). Example in production:
  - CLIENT_ORIGIN=https://your-frontend-domain.com
- Backend must be served over HTTPS in production (cookies with SameSite=None require `secure`).
- If frontend and backend have different top-level domains and you need to share cookies, ensure `SameSite=None` and `secure=true`, and set `domain` on the cookie if necessary for subdomains.

Security considerations
- The refresh token cookie is HttpOnly; the access token is accessible to JS and should be treated carefully (store in memory or localStorage with caution).
- Rotate refresh tokens on every refresh to reduce replay risk.
- Revoke refresh tokens on password change/reset or explicit logout.
- Consider rate-limiting the refresh endpoint to prevent abuse.

Testing locally
1. Start backend and frontend locally.
2. Sign up or log in and inspect network response headers — the `Set-Cookie` header should be present on the login/signup response and the browser should store the cookie.
3. Call POST `/api/token/refresh` from the frontend (axios/fetch) — the request should include the cookie and the response should provide a new access token and set a new `Set-Cookie` header with the new refresh token.

Troubleshooting
- If cookie is not sent from the browser:
  - Ensure `withCredentials = true` (axios) or `credentials: 'include'` (fetch).
  - Check CORS: `Access-Control-Allow-Credentials: true` and `Access-Control-Allow-Origin` equals your frontend origin.
  - In production ensure `secure=true` and your site uses HTTPS.

Optional next steps
- Remove support for passing refresh tokens in the request body to enforce cookie-only flows (we currently accept both for compatibility).
- Store a device identifier (e.g., user agent hash) with refresh tokens to make revocation/auditing easier.

Update (enforced):
- The server now enforces cookie-only refresh/logout flows. Passing a refresh token in the request body will return a 400 with a short message directing clients to use the cookie-based endpoints.

Example environment settings
- In production you should set the following env vars on your backend host (Render, Vercel, Heroku, etc):
  - CLIENT_ORIGIN=https://your-frontend.example.com
  - COOKIE_DOMAIN=your-frontend.example.com  # optional; set if you need to scope cookie to a specific domain/subdomain
  - COOKIE_SAMESITE=None                    # optional override, defaults to None in production (allowed values: Lax, Strict, None)

Provider notes (quick):
- Vercel / Netlify (frontend): set `VITE_API_URL=https://your-backend.example.com/api` and `VITE_SOCKET_URL` if needed. Redeploy after setting.
- Render / Vercel (backend): set `CLIENT_ORIGIN` and, if needed, `COOKIE_DOMAIN` in the service environment variables. Ensure `NODE_ENV=production` so cookies are marked `secure`.

When to set COOKIE_DOMAIN
- If your frontend is served from `app.example.com` and backend from `api.example.com` and you want the cookie available to subdomains, set `COOKIE_DOMAIN=.example.com`. If you only need the cookie for the exact frontend origin, leave `COOKIE_DOMAIN` unset and the cookie will default to the host that set it.
