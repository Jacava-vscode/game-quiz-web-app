import mongoose from 'mongoose'

const completedQuizSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  score: { type: Number, default: 0 },
  category: { type: String },
  difficulty: { type: String },
  completedAt: { type: Date, default: Date.now }
}, { _id: false })

const userSchema = new mongoose.Schema({
  // Authentication / identity
  username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  // store bcrypt (or bcryptjs) hash here
  passwordHash: { type: String, required: true },

  // Profile
  displayName: { type: String },
  bio: { type: String },
  avatarUrl: { type: String },

  // Game related
  score: { type: Number, default: 0 },
  roles: { type: [String], default: ['player'] },
  achievements: { type: [String], default: [] },
  completedQuizzes: { type: [completedQuizSchema], default: [] },

  // Administrative / metadata
  lastLoginAt: { type: Date }
}, { timestamps: true })

// Indexes: ensure fast lookups and uniqueness at the DB level
userSchema.index({ email: 1 }, { unique: true })
userSchema.index({ username: 1 }, { unique: true })

// Virtuals & JSON transform: expose `id` and hide sensitive fields
userSchema.virtual('id').get(function () {
  return this._id?.toHexString()
})

userSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id
    delete ret.__v
    // never expose password hashes
    delete ret.passwordHash
    return ret
  }
})

// Instance helper: safe public profile (no sensitive info)
userSchema.methods.publicProfile = function () {
  return {
    id: this.id,
    username: this.username,
    displayName: this.displayName,
    avatarUrl: this.avatarUrl,
    score: this.score,
    achievements: this.achievements,
    roles: this.roles
  }
}

export default mongoose.model('User', userSchema)
