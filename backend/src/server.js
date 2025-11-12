import http from 'http'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import ms from 'ms'
import cookieParser from 'cookie-parser'
import { Server as SocketIOServer } from 'socket.io'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import gameRoutes from './routes/gameRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import leaderboardRoutes from './routes/leaderboardRoutes.js'
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js'
import registerQuizSocketHandlers from './sockets/quizSocket.js'
import ensureDefaultAdmin from './utils/seed.js'

dotenv.config()

// Validate JWT and refresh token expiry configuration
try {
  const jwtExp = process.env.JWT_EXPIRES_IN || '15m'
  const jwtMs = ms(jwtExp)
  if (!jwtMs || jwtMs <= 0) {
    console.warn(`[Startup] Invalid JWT_EXPIRES_IN value (${jwtExp}), falling back to 15m`)
    process.env.JWT_EXPIRES_IN = '15m'
  } else if (jwtMs > ms('30d')) {
    console.warn(`[Startup] JWT_EXPIRES_IN is very long (${jwtExp}). For security prefer <= 30d. Capping to 30d.`)
    process.env.JWT_EXPIRES_IN = '30d'
  }

  const refreshExp = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'
  const refreshMs = ms(refreshExp)
  if (!refreshMs || refreshMs <= 0) {
    console.warn(`[Startup] Invalid REFRESH_TOKEN_EXPIRES_IN (${refreshExp}), falling back to 7d`)
    process.env.REFRESH_TOKEN_EXPIRES_IN = '7d'
  } else if (refreshMs > ms('365d')) {
    console.warn(`[Startup] REFRESH_TOKEN_EXPIRES_IN is very long (${refreshExp}). Capping to 365d.`)
    process.env.REFRESH_TOKEN_EXPIRES_IN = '365d'
  }
} catch (err) {
  console.warn('[Startup] Could not parse token expiry envs:', err.message)
}

const app = express()
const server = http.createServer(app)

// Enforce presence of critical secrets early
const missingEnvs = []
if (!process.env.JWT_SECRET) missingEnvs.push('JWT_SECRET')
if (!process.env.MONGODB_URI_PRIMARY && !process.env.MONGODB_URI) missingEnvs.push('MONGODB_URI_PRIMARY')
if (missingEnvs.length) {
  console.error('\n[Startup] Missing required environment variables:', missingEnvs.join(', '))
  console.error('[Startup] Add them to your deployment provider (Render/Vercel) or set in backend/.env')
  process.exit(1)
}

// Socket.io setup
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

app.set('io', io)

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan('dev'))

// Routes
app.use('/api', authRoutes)
app.use('/api', profileRoutes)
app.use('/api', gameRoutes)
app.use('/api', leaderboardRoutes)
app.use('/api/admin', adminRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Error handling
app.use(notFoundHandler)
app.use(errorHandler)

const PORT = process.env.PORT || 4000

const startServer = async () => {
  await connectDB()
  await ensureDefaultAdmin()
  registerQuizSocketHandlers(io)

  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
  })
}

startServer().catch((err) => {
  console.error('Failed to start server', err)
  process.exit(1)
})
