import mongoose from 'mongoose'

const leaderboardSchema = new mongoose.Schema({
  username: { type: String, required: true },
  score: { type: Number, required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  category: { type: String },
  difficulty: { type: String },
  achievedAt: { type: Date, default: Date.now }
}, { timestamps: true })

export default mongoose.model('Leaderboard', leaderboardSchema)
