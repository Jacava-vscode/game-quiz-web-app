import bcrypt from 'bcryptjs'
import { validationResult } from 'express-validator'
import User from '../models/User.js'
import { generateAccessToken, generateRefreshToken, hashToken } from '../utils/token.js'
import ms from 'ms'
import { sendMail } from '../utils/mailer.js'
import crypto from 'crypto'

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

  // set refresh token as HttpOnly cookie for improved security
  const isProd = process.env.NODE_ENV === 'production'
  const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'None' : 'Lax',
    maxAge: REFRESH_EXPIRES_MS,
    path: '/api'
  }
  res.cookie('refresh_token', refreshToken, cookieOptions)

  res.status(201).json({
    accessToken,
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

  // set refresh token cookie
  const isProd = process.env.NODE_ENV === 'production'
  const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'None' : 'Lax',
    maxAge: REFRESH_EXPIRES_MS,
    path: '/api'
  }
  res.cookie('refresh_token', refreshToken, cookieOptions)

  res.json({
    accessToken,
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
  // allow token from cookie or body for compatibility
  const incoming = req.body?.refreshToken || req.cookies?.refresh_token
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

  // set new refresh token cookie
  const isProd = process.env.NODE_ENV === 'production'
  const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'None' : 'Lax',
    maxAge: REFRESH_EXPIRES_MS,
    path: '/api'
  }
  res.cookie('refresh_token', newRefresh, cookieOptions)

  res.json({ accessToken })
}

export const logout = async (req, res) => {
  // accept from cookie or body
  const incoming = req.body?.refreshToken || req.cookies?.refresh_token
  if (!incoming) {
    // clear cookie even if not provided
    res.clearCookie('refresh_token', { path: '/api' })
    return res.status(200).json({ message: 'OK' })
  }
  const hash = hashToken(incoming)
  const user = await User.findOne({ 'refreshTokens.tokenHash': hash })
  if (!user) return res.status(200).json({ message: 'OK' })
  const tokenEntry = user.refreshTokens.find(t => t.tokenHash === hash)
  if (tokenEntry) tokenEntry.revokedAt = new Date()
  await user.save()
  res.json({ message: 'Logged out' })
}

// --- Email verification & password reset ---
const EMAIL_VERIFY_EXPIRES = process.env.EMAIL_VERIFY_EXPIRES || '24h'
const PASSWORD_RESET_EXPIRES = process.env.PASSWORD_RESET_EXPIRES || '1h'

const genRawToken = () => crypto.randomBytes(32).toString('hex')

export const sendVerificationEmail = async (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ message: 'email is required' })

  const user = await User.findOne({ email })
  if (!user) {
    // don't reveal whether email exists
    return res.status(200).json({ message: 'Verification email sent if account exists' })
  }

  const raw = genRawToken()
  const hash = hashToken(raw)
  const expiresAt = new Date(Date.now() + ms(EMAIL_VERIFY_EXPIRES))
  user.emailVerifyTokenHash = hash
  user.emailVerifyExpires = expiresAt
  await user.save()

  const verifyUrl = `${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}/verify?token=${raw}`
  await sendMail({
    to: user.email,
    subject: 'Verify your Game Quiz account',
    text: `Click to verify: ${verifyUrl}`,
    html: `<p>Click to verify: <a href="${verifyUrl}">${verifyUrl}</a></p>`
  })

  return res.status(200).json({ message: 'Verification email sent if account exists' })
}

export const verifyEmail = async (req, res) => {
  const token = req.body?.token || req.query?.token
  if (!token) return res.status(400).json({ message: 'token is required' })
  const hash = hashToken(token)
  const user = await User.findOne({ emailVerifyTokenHash: hash })
  if (!user) return res.status(400).json({ message: 'Invalid or expired token' })
  if (user.emailVerifyExpires && user.emailVerifyExpires < new Date()) return res.status(400).json({ message: 'Token expired' })
  user.emailVerified = true
  user.emailVerifyTokenHash = undefined
  user.emailVerifyExpires = undefined
  await user.save()
  return res.json({ message: 'Email verified' })
}

export const sendResetPassword = async (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ message: 'email is required' })
  const user = await User.findOne({ email })
  if (!user) return res.status(200).json({ message: 'If an account exists, a reset link has been sent' })
  const raw = genRawToken()
  const hash = hashToken(raw)
  const expiresAt = new Date(Date.now() + ms(PASSWORD_RESET_EXPIRES))
  user.resetPasswordTokenHash = hash
  user.resetPasswordExpires = expiresAt
  await user.save()

  const resetUrl = `${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}/reset-password?token=${raw}`
  await sendMail({
    to: user.email,
    subject: 'Reset your Game Quiz password',
    text: `Reset link: ${resetUrl}`,
    html: `<p>Reset link: <a href="${resetUrl}">${resetUrl}</a></p>`
  })

  return res.status(200).json({ message: 'If an account exists, a reset link has been sent' })
}

export const resetPassword = async (req, res) => {
  const { token, password } = req.body
  if (!token || !password) return res.status(400).json({ message: 'token and password required' })
  const hash = hashToken(token)
  const user = await User.findOne({ resetPasswordTokenHash: hash })
  if (!user) return res.status(400).json({ message: 'Invalid or expired token' })
  if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) return res.status(400).json({ message: 'Token expired' })

  const rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10)
  user.passwordHash = await bcrypt.hash(password, rounds)
  user.resetPasswordTokenHash = undefined
  user.resetPasswordExpires = undefined
  // revoke all refresh tokens
  user.refreshTokens = []
  await user.save()

  return res.json({ message: 'Password reset successful' })
}
