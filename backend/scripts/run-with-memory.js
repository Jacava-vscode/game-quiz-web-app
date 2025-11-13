#!/usr/bin/env node
/*
  Start the backend with an in-memory MongoDB for local integration testing.
  Usage: node scripts/run-with-memory.js
*/
import { MongoMemoryServer } from 'mongodb-memory-server'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

;(async () => {
  try {
    const mongod = await MongoMemoryServer.create()
    const uri = mongod.getUri()
    // Set envs expected by server
    process.env.MONGODB_URI_PRIMARY = uri
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret'
    process.env.NODE_ENV = 'development'
    // run server on 3000 to match integration script default
    process.env.PORT = process.env.PORT || '3000'

    console.log('[mem-runner] In-memory MongoDB started:', uri)
    console.log('[mem-runner] Starting backend server (development mode)...')

    // Import the existing server which will read process.env and start
    // Note: server.js uses ESM and will call connectDB() on import
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const serverFile = path.join(__dirname, '../src/server.js')
  await import(pathToFileURL(serverFile).href)

    // Keep process alive while mongod and server run
    process.on('SIGINT', async () => {
      console.log('[mem-runner] SIGINT received, stopping in-memory MongoDB')
      await mongod.stop()
      process.exit(0)
    })
  } catch (err) {
    console.error('[mem-runner] Failed to start in-memory MongoDB or server', err)
    process.exit(1)
  }
})()
