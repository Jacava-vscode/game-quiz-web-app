import http from 'http'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
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

const app = express()
const server = http.createServer(app)

// Socket.io setup
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

app.set('io', io)

// Middleware
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
