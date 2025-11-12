import jwt from 'jsonwebtoken'
import crypto from 'crypto'

export const generateAccessToken = (userId) => {
  const expiresIn = process.env.JWT_EXPIRES_IN || '15m'
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn })
}

export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET)
}

export const generateRefreshToken = () => {
  // return a secure random token (string). Store a hash of it in DB.
  return crypto.randomBytes(64).toString('hex')
}

export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex')
}
