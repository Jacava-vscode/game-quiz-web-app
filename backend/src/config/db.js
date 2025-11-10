import mongoose from 'mongoose'

const connectDB = async () => {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI is not defined')
  }

  mongoose.set('strictQuery', false)

  try {
    await mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB || 'game_quiz'
    })
    console.log('MongoDB connected')
  } catch (err) {
    console.error('Mongo connection error:', err.message)
    process.exit(1)
  }
}

export default connectDB
