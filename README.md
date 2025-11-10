# Game Quiz Web App

An immersive full-stack trivia experience with real-time score updates, 3D visuals, and an admin panel for curating quiz content. The project is split into a React/Vite frontend and an Express/MongoDB backend powered by Socket.io.

## Features

- Interactive quiz play with timers, progress tracking, and dynamic scoring
- Responsive home page with featured categories, testimonials, and 3D hero canvas
- Authenticated leaderboard with live updates via WebSockets
- Player profiles with history, achievements, and editable details
- Role-protected admin panel for managing categories and questions
- REST API secured with JWT authentication and MongoDB persistence

## Tech Stack

- **Frontend:** React 19, Vite, React Router, Axios, Socket.io Client, Three.js
- **Backend:** Node.js, Express, Socket.io, MongoDB (Mongoose), JWT, Express Validator

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or remote)

### Backend

```powershell
cd backend
cp .env.example .env  # Update values for your environment
npm install
npm run dev
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

The frontend expects the backend at `http://localhost:4000` by default. Configure `VITE_API_URL` and `VITE_SOCKET_URL` in a frontend `.env` file if needed.

## Scripts

- `npm run dev` - start development server
- `npm run build` - build production bundle
- `npm run lint` - run ESLint checks

## Folder Structure

```
backend/
	src/
		controllers/   # Express route handlers
		middleware/    # Auth & error middlewares
		models/        # Mongoose schemas
		routes/        # API routes
		sockets/       # Socket.io handlers
		config/        # Database configuration
frontend/
	src/
		components/    # Reusable UI components
		context/       # Global state providers
		hooks/         # Custom hooks
		pages/         # Routed pages
		services/      # API/socket clients
		styles/        # Global styling
```

## Next Steps

- Implement persistent sessions for Socket.io authentication
- Add comprehensive tests (Jest/React Testing Library & Supertest)
- Expand admin analytics dashboard and badge logic
