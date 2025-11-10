import mongoose from 'mongoose'

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false }
}, { _id: false })

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [optionSchema], validate: v => v?.length >= 2 },
  correctAnswer: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
  timeLimit: { type: Number, default: 30 },
  assetUrl: { type: String }
}, { timestamps: true })

export default mongoose.model('Question', questionSchema)
