# Environment variable setup (Frontend & Backend)

This file explains how to set the required environment variables for local development and for deployment platforms (Vercel, Render).

## Frontend (Vite / React)

- Required variables (set in `frontend/.env` or in the deployment UI):
  - `VITE_API_URL` - full backend API base URL, e.g. `https://game-quiz-backend.onrender.com/api`
  - `VITE_SOCKET_URL` - backend socket url, e.g. `https://game-quiz-backend.onrender.com`

Local example (`frontend/.env`):

```
VITE_API_URL=https://game-quiz-backend.onrender.com/api
VITE_SOCKET_URL=https://game-quiz-backend.onrender.com
```

### Vercel

1. Open your Vercel project → Settings → Environment Variables.
2. Add variables above for the `Production` environment (and `Preview` if desired).
3. Trigger a redeploy so the new variables are applied.

### Netlify

1. Site → Site settings → Build & deploy → Environment.
2. Add the variables and redeploy the site.

## Backend (Node / Express)

- Required variables (set in `backend/.env` or in the deployment UI):
  - `MONGODB_URI_PRIMARY` - your MongoDB Atlas connection string (recommended format below)
  - `MONGODB_DB` - database name (default `game_quiz`)
  - `CLIENT_ORIGIN` - your frontend URL, e.g. `https://game-quiz-web-app.vercel.app`
  - `JWT_SECRET` - a secure random secret used to sign JWTs

MongoDB Atlas example:

```
MONGODB_URI_PRIMARY=mongodb+srv://<username>:<password>@<cluster-url>/game_quiz?retryWrites=true&w=majority
```

### Render / Vercel (Backend)

1. In your service on Render or project on Vercel, open the Environment settings.
2. Add the variables above (use the `Production` environment).
3. Redeploy the backend service.

## Provider-specific steps (detailed)

### Vercel (frontend)

1. Open the Vercel dashboard and select your frontend project.
2. Go to Settings → Environment Variables.
3. Click "Add" and create the following variables:
  - `VITE_API_URL` = `https://<your-backend-domain>/api`
  - `VITE_SOCKET_URL` = `https://<your-backend-domain>`
4. For the Environment choose `Production` (and add for `Preview` if you want review apps to use the backend).
5. Redeploy the project by clicking "Deployments" → "Redeploy" on the latest commit.

### Vercel (backend)

1. Select the backend project on Vercel.
2. Go to Settings → Environment Variables.
3. Add the following variables:
  - `MONGODB_URI_PRIMARY` = `<your-mongodb-uri>`
  - `MONGODB_DB` = `game_quiz`
  - `CLIENT_ORIGIN` = `https://<your-frontend-domain>`
  - `JWT_SECRET` = `<secure-random-secret>`
4. Redeploy the backend after saving.

### Render (backend)

1. Open your service on Render and go to the service settings.
2. Under the Environment section, add the same variables as above.
3. Save and then manually trigger a deploy (or push a small commit) to pick up the new environment.

### Verification checklist (after redeploy)

- Frontend console shows `VITE_API_URL` equals your backend API URL (open DevTools → Console).
- Network requests (signup/login) are sent to `https://<your-backend-domain>/api/signup` and return 200/201 as expected.
- Backend logs show connections to MongoDB and no errors about missing env vars.

## Security note

Do NOT commit your real `.env` files to the repository. Use `.env.example` to document variable names and placeholders.
