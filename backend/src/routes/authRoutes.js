import express from 'express'
import rateLimit from 'express-rate-limit'
import { body } from 'express-validator'
import { signup, login } from '../controllers/authController.js'

const router = express.Router()

// Rate limiter for auth endpoints to mitigate brute-force attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 6, // limit each IP to 6 requests per windowMs
  message: { message: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
})

router.post('/signup', authLimiter, [
  body('username').isLength({ min: 3 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], signup)

router.post('/login', authLimiter, [
  body('email').isEmail(),
  body('password').notEmpty()
], login)

export default router
