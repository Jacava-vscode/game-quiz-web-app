import express from 'express'
import { body } from 'express-validator'
import { getProfile, updateProfile } from '../controllers/profileController.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/profile', authenticate, getProfile)
router.post('/profile/update', authenticate, [
  body('username').optional().isLength({ min: 3 }),
  body('avatarUrl').optional().isURL(),
  body('achievements').optional().isArray()
], updateProfile)

export default router
