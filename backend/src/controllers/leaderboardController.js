import Leaderboard from '../models/Leaderboard.js'

export const getLeaderboard = async (req, res) => {
  const { category, timeframe = 'all' } = req.query
  const filter = {}
  if (category) filter.category = category

  if (timeframe !== 'all') {
    const now = new Date()
    const start = new Date()
    if (timeframe === 'week') {
      start.setDate(now.getDate() - 7)
    } else if (timeframe === 'month') {
      start.setMonth(now.getMonth() - 1)
    }
    filter.createdAt = { $gte: start }
  }

  const scores = await Leaderboard.find(filter)
    .sort({ score: -1, createdAt: 1 })
    .limit(50)

  res.json(scores)
}
