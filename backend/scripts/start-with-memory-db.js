#!/usr/bin/env node
import { MongoMemoryServer } from 'mongodb-memory-server'
import { spawn } from 'child_process'

// Starts an in-memory MongoDB instance and then spawns the backend server
// Usage: node scripts/start-with-memory-db.js

const start = async () => {
  console.log('Starting in-memory MongoDB...')
  const mongod = await MongoMemoryServer.create()
  const uri = mongod.getUri()
  console.log('In-memory MongoDB running at', uri)

  // Provide minimal env required by the server
  const env = { ...process.env }
  env.MONGODB_URI_PRIMARY = uri
  env.JWT_SECRET = env.JWT_SECRET || 'test_jwt_secret'
  env.NODE_ENV = env.NODE_ENV || 'development'
  env.CLIENT_ORIGIN = env.CLIENT_ORIGIN || 'http://localhost:5173'

  console.log('Spawning backend server with ephemeral DB...')
  const child = spawn(process.execPath, ['src/server.js'], { env, stdio: 'inherit' })

  child.on('exit', (code) => {
    console.log('Backend process exited with code', code)
    mongod.stop()
    process.exit(code ?? 0)
  })

  // forward SIGINT/SIGTERM to child
  const forward = (sig) => {
    child.kill(sig)
  }
  process.on('SIGINT', forward)
  process.on('SIGTERM', forward)
}

start().catch(err => {
  console.error('Failed to start in-memory MongoDB + server:', err)
  process.exit(1)
})
