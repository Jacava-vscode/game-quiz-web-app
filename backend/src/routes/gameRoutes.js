import express from 'express'
import { body, query } from 'express-validator'
import { authenticate } from '../middleware/authMiddleware.js'
import { getQuestions, submitAnswers } from '../controllers/gameController.js'

const router = express.Router()

router.get('/questions', authenticate, [
  query('category').optional().isString(),
  query('difficulty').optional().isIn(['Easy', 'Medium', 'Hard']),
  query('limit').optional().isInt({ min: 1, max: 50 })
], getQuestions)

router.post('/answers', authenticate, [
  body('answers').isArray({ min: 1 }),
  body('answers.*.questionId').isMongoId(),
  body('answers.*.choice').optional({ nullable: true }).isString(),
  body('category').optional().isString(),
  body('difficulty').optional().isIn(['Easy', 'Medium', 'Hard'])
], submitAnswers)

export default router
