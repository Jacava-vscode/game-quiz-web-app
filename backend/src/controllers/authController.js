import bcrypt from 'bcryptjs'
import { validationResult } from 'express-validator'
import User from '../models/User.js'
import { generateAccessToken, generateRefreshToken, hashToken } from '../utils/token.js'
import ms from 'ms'

const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'
const REFRESH_EXPIRES_MS = ms(REFRESH_EXPIRES) || 7 * 24 * 60 * 60 * 1000
const MAX_FAILED_ATTEMPTS = parseInt(process.env.MAX_FAILED_LOGIN_ATTEMPTS || '5', 10)
const LOCK_TIME_MS = parseInt(process.env.ACCOUNT_LOCK_TIME_MS || String(15 * 60 * 1000), 10) // default 15 minutes

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

  const rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10)
  const passwordHash = await bcrypt.hash(password, rounds)
  const user = await User.create({ username, email, passwordHash })

  // generate tokens
  const accessToken = generateAccessToken(user._id)
  const refreshToken = generateRefreshToken()
  const refreshHash = hashToken(refreshToken)
  const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_MS)
  user.refreshTokens = user.refreshTokens || []
  user.refreshTokens.push({ tokenHash: refreshHash, createdAt: new Date(), expiresAt })
  await user.save()

  res.status(201).json({
    accessToken,
    refreshToken,
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

  // Check account lock
  if (user.lockUntil && user.lockUntil > new Date()) {
    return res.status(423).json({ message: 'Account locked. Try again later.' })
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash)
  if (!isMatch) {
    // increment failed attempts
    user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1
    if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
      user.lockUntil = new Date(Date.now() + LOCK_TIME_MS)
      user.failedLoginAttempts = 0
    }
    await user.save()
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  // success: reset failed attempts
  user.failedLoginAttempts = 0
  user.lockUntil = undefined
  user.lastLoginAt = new Date()

  // generate tokens
  const accessToken = generateAccessToken(user._id)
  const refreshToken = generateRefreshToken()
  const refreshHash = hashToken(refreshToken)
  const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_MS)
  user.refreshTokens = user.refreshTokens || []
  user.refreshTokens.push({ tokenHash: refreshHash, createdAt: new Date(), expiresAt })
  await user.save()

  res.json({
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      roles: user.roles,
      score: user.score
    }
  })
}

export const refreshToken = async (req, res) => {
  const { refreshToken: incoming } = req.body
  if (!incoming) return res.status(400).json({ message: 'refreshToken required' })
  const hash = hashToken(incoming)

  // Find user with this refresh token
  const user = await User.findOne({ 'refreshTokens.tokenHash': hash })
  if (!user) return res.status(401).json({ message: 'Invalid refresh token' })

  const tokenEntry = user.refreshTokens.find(t => t.tokenHash === hash)
  if (!tokenEntry) return res.status(401).json({ message: 'Invalid refresh token' })
  if (tokenEntry.revokedAt) return res.status(401).json({ message: 'Refresh token revoked' })
  if (tokenEntry.expiresAt && tokenEntry.expiresAt < new Date()) return res.status(401).json({ message: 'Refresh token expired' })

  // Rotate: revoke old and issue new
  const newRefresh = generateRefreshToken()
  const newHash = hashToken(newRefresh)
  const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_MS)
  tokenEntry.revokedAt = new Date()
  tokenEntry.replacedByTokenHash = newHash
  user.refreshTokens.push({ tokenHash: newHash, createdAt: new Date(), expiresAt })
  await user.save()

  const accessToken = generateAccessToken(user._id)
  res.json({ accessToken, refreshToken: newRefresh })
}

export const logout = async (req, res) => {
  const { refreshToken: incoming } = req.body
  if (!incoming) return res.status(400).json({ message: 'refreshToken required' })
  const hash = hashToken(incoming)
  const user = await User.findOne({ 'refreshTokens.tokenHash': hash })
  if (!user) return res.status(200).json({ message: 'OK' })
  const tokenEntry = user.refreshTokens.find(t => t.tokenHash === hash)
  if (tokenEntry) tokenEntry.revokedAt = new Date()
  await user.save()
  res.json({ message: 'Logged out' })
}
