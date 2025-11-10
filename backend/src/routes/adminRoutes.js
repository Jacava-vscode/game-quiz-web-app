import express from 'express'
import { body, param } from 'express-validator'
import {
  createQuestion,
  getQuestions,
  deleteQuestion,
  createCategory,
  getCategories
} from '../controllers/adminController.js'
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(authenticate)
router.use(authorizeAdmin)

router.get('/questions', getQuestions)
router.post('/questions', [
  body('question').isString().notEmpty(),
  body('options').isArray({ min: 2 }),
  body('options.*.text').isString(),
  body('options.*.isCorrect').isBoolean(),
  body('correctAnswer').isString(),
  body('category').isString(),
  body('difficulty').isIn(['Easy', 'Medium', 'Hard']),
  body('timeLimit').optional().isInt({ min: 10, max: 120 }),
  body('assetUrl').optional().isString()
], createQuestion)

router.delete('/questions/:id', [param('id').isMongoId()], deleteQuestion)

router.get('/categories', getCategories)
router.post('/categories', [
  body('name').isString().notEmpty(),
  body('description').optional().isString()
], createCategory)

export default router
