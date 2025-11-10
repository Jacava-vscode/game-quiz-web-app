import { validationResult } from 'express-validator'
import User from '../models/User.js'

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-passwordHash')
  res.json(user)
}

export const updateProfile = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { username, avatarUrl, achievements } = req.body
  const updates = {}
  if (username) updates.username = username
  if (avatarUrl) updates.avatarUrl = avatarUrl
  if (achievements) updates.achievements = achievements

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true, runValidators: true, context: 'query' }
  ).select('-passwordHash')

  res.json(updatedUser)
}
