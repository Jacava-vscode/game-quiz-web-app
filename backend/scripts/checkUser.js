#!/usr/bin/env node
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
;(async () => {
  try {
    const User = await importUser()
    console.log('[checkUser] Connecting to MongoDB (masked):', mongoUri.replace(/:\/\/(.*@)/, '://<redacted>@'))
    await mongoose.connect(mongoUri, connectOpts)
    console.log('[checkUser] Connected, querying user by email:', email)
    const user = await User.findOne({ email }).lean()

    if (!user) {
      console.log('[checkUser] User not found')
    } else {
      if (user.passwordHash) delete user.passwordHash
      console.log('[checkUser] User found:\n', JSON.stringify(user, null, 2))
    }
  } catch (err) {
    console.error('[checkUser] Error:', err.message)
    process.exitCode = 3
  } finally {
    try {
      await mongoose.disconnect()
    } catch (_) {}
  }
})()


const mongoArg = process.argv[2]
const email = process.argv[3]

if (!email) {
  usage()
  process.exit(1)
}

const mongoUri = mongoArg && mongoArg.trim() !== '' ? mongoArg : process.env.MONGODB_URI_PRIMARY || process.env.MONGODB_URI

if (!mongoUri) {
  console.error('No MongoDB URI provided. Pass as first argument or set MONGODB_URI_PRIMARY in environment.')
  process.exit(2)
}

const connectOpts = {
  dbName: process.env.MONGODB_DB || 'game_quiz',
  appName: process.env.MONGODB_APP_NAME || 'GameQuizCheckUserScript'
}

try {
  const User = await importUser()
  console.log('[checkUser] Connecting to MongoDB (masked):', mongoUri.replace(/:\/\/(.*@)/, '://<redacted>@'))
  await mongoose.connect(mongoUri, connectOpts)
  console.log('[checkUser] Connected, querying user by email:', email)
  const user = await User.findOne({ email }).lean()
  if (!user) {
    console.log('[checkUser] User not found')
  } else {
    // remove sensitive fields
    if (user.passwordHash) delete user.passwordHash
    console.log('[checkUser] User found:\n', JSON.stringify(user, null, 2))
  }
} catch (err) {
  console.error('[checkUser] Error:', err.message)
  process.exitCode = 3
} finally {
  try {
    await mongoose.disconnect()
  } catch (_) {}
}
