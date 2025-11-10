import express from 'express'
import { query } from 'express-validator'
import { getLeaderboard } from '../controllers/leaderboardController.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/leaderboard', authenticate, [
  query('category').optional().isString(),
  query('timeframe').optional().isIn(['all', 'week', 'month'])
], getLeaderboard)

export default router
