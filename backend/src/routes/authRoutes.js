import express from 'express'
import { body } from 'express-validator'
import { signup, login } from '../controllers/authController.js'

const router = express.Router()

router.post('/signup', [
  body('username').isLength({ min: 3 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], signup)

router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], login)

export default router
