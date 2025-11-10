import mongoose from 'mongoose'

const completedQuizSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  score: { type: Number, default: 0 },
  category: { type: String },
  difficulty: { type: String },
  completedAt: { type: Date, default: Date.now }
}, { _id: false })

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  score: { type: Number, default: 0 },
  avatarUrl: { type: String },
  roles: { type: [String], default: ['player'] },
  achievements: { type: [String], default: [] },
  completedQuizzes: { type: [completedQuizSchema], default: [] }
}, { timestamps: true })

export default mongoose.model('User', userSchema)
