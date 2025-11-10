import mongoose from 'mongoose'

let secondaryConnection = null
let archiveConnection = null

const parseNumber = (value, fallback) => {
  if (value === undefined || value === null || value === '') return fallback
  const parsed = Number(value)
  return Number.isNaN(parsed) ? fallback : parsed
}

const buildConnectionOptions = () => ({
  dbName: process.env.MONGODB_DB || 'game_quiz',
  appName: process.env.MONGODB_APP_NAME || 'GameQuizService',
  maxPoolSize: parseNumber(process.env.MONGODB_MAX_POOL_SIZE, 20),
  serverSelectionTimeoutMS: parseNumber(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS, 10000),
  socketTimeoutMS: parseNumber(process.env.MONGODB_SOCKET_TIMEOUT_MS, 45000),
  retryReads: true,
  retryWrites: true
})

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI_PRIMARY || process.env.MONGODB_URI
  if (!primaryUri) {
    throw new Error('MONGODB_URI_PRIMARY or MONGODB_URI must be defined')
  }

  mongoose.set('strictQuery', false)
  mongoose.set('bufferCommands', false)

  const slowQueryThreshold = parseNumber(process.env.MONGODB_SLOW_QUERY_THRESHOLD_MS, 0)
  if (slowQueryThreshold > 0) {
    mongoose.set('maxTimeMS', slowQueryThreshold)
  }

  try {
    await mongoose.connect(primaryUri, buildConnectionOptions())
    console.log('[MongoDB] Primary connection established')
  } catch (err) {
    console.error('[MongoDB] Primary connection error:', err.message)
    process.exit(1)
  }

  const automaticRouting = process.env.MONGODB_AUTOMATIC_ROUTING === 'true'

  if (automaticRouting && process.env.MONGODB_URI_SECONDARY) {
    try {
      secondaryConnection = mongoose.createConnection(
        process.env.MONGODB_URI_SECONDARY,
        buildConnectionOptions()
      )
      await secondaryConnection.asPromise()
      console.log('[MongoDB] Secondary connection ready for unified data access')
    } catch (err) {
      console.error('[MongoDB] Secondary connection error:', err.message)
    }
  }

  if (automaticRouting && process.env.ARCHIVE_ENABLED === 'true' && process.env.MONGODB_URI_ARCHIVE) {
    try {
      archiveConnection = mongoose.createConnection(
        process.env.MONGODB_URI_ARCHIVE,
        buildConnectionOptions()
      )
      await archiveConnection.asPromise()
      console.log('[MongoDB] Archive connection ready')
    } catch (err) {
      console.error('[MongoDB] Archive connection error:', err.message)
    }
  }

  if (process.env.MONGODB_STORAGE_MONITOR === 'true') {
    const intervalMinutes = parseNumber(process.env.MONGODB_STORAGE_MONITOR_INTERVAL_MINUTES, 30)
    const intervalMs = Math.max(intervalMinutes, 1) * 60 * 1000
    const monitor = () => {
      const poolSize = mongoose.connection?.client?.options?.maxPoolSize || 'n/a'
      const readyState = mongoose.connection?.readyState ?? 'n/a'
      console.log(`[MongoDB] Storage monitor heartbeat | readyState: ${readyState} | maxPoolSize: ${poolSize}`)
    }
    const timer = setInterval(monitor, intervalMs)
    if (typeof timer.unref === 'function') {
      timer.unref()
    }
  }
}

export const getSecondaryConnection = () => secondaryConnection
export const getArchiveConnection = () => archiveConnection

export default connectDB
