import { validationResult } from 'express-validator'
import Question from '../models/Question.js'
import Leaderboard from '../models/Leaderboard.js'
import User from '../models/User.js'

export const getQuestions = async (req, res) => {
  const { category, difficulty, limit = 10 } = req.query
  const query = {}
  if (category) query.category = category
  if (difficulty) query.difficulty = difficulty

  const questions = await Question.aggregate([
    { $match: query },
    { $sample: { size: Number(limit) } },
    {
      $project: {
        question: 1,
        options: {
          $map: {
            input: '$options',
            as: 'option',
            in: {
              text: '$$option.text'
            }
          }
        },
        category: 1,
        difficulty: 1,
        timeLimit: 1,
        assetUrl: 1
      }
    }
  ])

  res.json(questions)
}

export const submitAnswers = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { answers, category, difficulty } = req.body
  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ message: 'Answers are required' })
  }

  let score = 0
  for (const answer of answers) {
    const question = await Question.findById(answer.questionId)
    if (question && question.correctAnswer === answer.choice) {
      score += 10
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $inc: { score },
      $push: {
        completedQuizzes: {
          quizId: answers[0]?.questionId,
          score,
          category,
          difficulty
        }
      }
    },
    { new: true }
  ).select('-passwordHash')

  const leaderboardEntry = await Leaderboard.create({
    username: updatedUser.username,
    score,
    quizId: answers[0]?.questionId,
    category,
    difficulty
  })

  const io = req.app.get('io')
  io.emit('leaderboard:update', leaderboardEntry)

  res.json({ score, user: updatedUser })
}
