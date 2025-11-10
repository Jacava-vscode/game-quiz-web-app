import { validationResult } from 'express-validator'
import Question from '../models/Question.js'
import Category from '../models/Category.js'

export const createQuestion = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const question = await Question.create(req.body)
  res.status(201).json(question)
}

export const getQuestions = async (req, res) => {
  const questions = await Question.find({}).sort({ createdAt: -1 })
  res.json(questions)
}

export const deleteQuestion = async (req, res) => {
  const { id } = req.params
  await Question.findByIdAndDelete(id)
  res.status(204).send()
}

export const createCategory = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const category = await Category.create(req.body)
  res.status(201).json(category)
}

export const getCategories = async (req, res) => {
  const categories = await Category.find({}).sort({ name: 1 })
  res.json(categories)
}
