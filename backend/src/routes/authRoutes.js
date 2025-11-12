import express from 'express'
import rateLimit from 'express-rate-limit'
import { body } from 'express-validator'
import { signup, login, refreshToken, logout } from '../controllers/authController.js'

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
  body('username').isLength({ min: 3 }).withMessage('username must be at least 3 characters'),
  body('email').isEmail().withMessage('invalid email'),
  // Strong password policy: min 8, at least 1 uppercase, 1 lowercase and 1 number
  body('password')
    .isLength({ min: 8 }).withMessage('password must be at least 8 characters')
    .matches(/(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/)
    .withMessage('password must include upper and lower case letters and numbers')
], signup)

router.post('/login', authLimiter, [
  body('email').isEmail(),
  body('password').notEmpty()
], login)

router.post('/token/refresh', authLimiter, (req, res, next) => {
  // simple body validation: expect { refreshToken }
  if (!req.body || !req.body.refreshToken) return res.status(400).json({ message: 'refreshToken is required' })
  return refreshToken(req, res, next)
})

router.post('/token/logout', authLimiter, (req, res, next) => {
  if (!req.body || !req.body.refreshToken) return res.status(400).json({ message: 'refreshToken is required' })
  return logout(req, res, next)
})

export default router
