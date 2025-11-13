// Start backend with in-memory MongoDB for integration testing
import { MongoMemoryServer } from 'mongodb-memory-server'
import dotenv from 'dotenv'
import { spawn } from 'child_process'

dotenv.config()

const start = async () => {
  const mongod = await MongoMemoryServer.create()
  const uri = mongod.getUri()
  process.env.MONGODB_URI_PRIMARY = uri
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret'
  process.env.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
  process.env.PORT = process.env.PORT || '3000'

  // Spawn the backend server as a child process
  const child = spawn('node', ['src/server.js'], {
    env: { ...process.env, MONGODB_URI_PRIMARY: uri },
    stdio: 'inherit',
    cwd: process.cwd(),
    shell: true
  })

  child.on('exit', code => {
    mongod.stop()
    process.exit(code)
  })
}

start().catch(err => {
  console.error('Failed to start in-memory MongoDB:', err)
  process.exit(1)
})
