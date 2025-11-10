import bcrypt from 'bcryptjs'
import User from '../models/User.js'

const ensureDefaultAdmin = async () => {
  const username = process.env.DEFAULT_ADMIN_USERNAME || 'admin'
  const password = process.env.DEFAULT_ADMIN_PASSWORD || 'game@dmin'
  const email = process.env.DEFAULT_ADMIN_EMAIL || 'admin@gamequiz.local'

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    if (!existingUser.roles.includes('admin')) {
      existingUser.roles.push('admin')
      await existingUser.save()
      console.log(`Ensured admin role for user: ${username}`)
    }
    return
  }

  const passwordHash = await bcrypt.hash(password, 10)
  await User.create({
    username,
    email,
    passwordHash,
    roles: ['admin'],
    score: 0
  })

  console.log(`Default admin user created: ${username}`)
}

export default ensureDefaultAdmin
