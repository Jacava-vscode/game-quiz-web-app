import bcrypt from 'bcryptjs'
import { validationResult } from 'express-validator'
import User from '../models/User.js'
import { generateToken } from '../utils/token.js'

export const signup = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { username, email, password } = req.body

  const userExists = await User.findOne({ $or: [{ email }, { username }] })
  if (userExists) {
    return res.status(409).json({ message: 'User already exists' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ username, email, passwordHash })

  const token = generateToken(user._id)
  res.status(201).json({
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      roles: user.roles,
      score: user.score
    }
  })
}

export const login = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash)
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = generateToken(user._id)
  res.json({
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      roles: user.roles,
      score: user.score
    }
  })
}
