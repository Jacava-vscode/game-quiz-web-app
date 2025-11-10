import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LeaderboardTable from '../components/LeaderboardTable.jsx'
import { fetchLeaderboard } from '../services/apiClient.js'
import { getSocket, initSocket } from '../services/socket.js'
import { useAuth } from '../hooks/useAuth.js'

const LeaderboardPage = () => {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [category, setCategory] = useState('')
  const [timeframe, setTimeframe] = useState('week')
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token, navigate])

  const loadScores = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const data = await fetchLeaderboard({ category, timeframe })
      setScores(data)
    } catch (error) {
      console.error('Failed to fetch leaderboard', error)
    } finally {
      setLoading(false)
    }
  }, [category, timeframe, token])

  useEffect(() => {
    loadScores()
  }, [loadScores])

  useEffect(() => {
    initSocket()
    try {
      const socket = getSocket()
      socket.on('leaderboard:update', loadScores)
      return () => {
        socket.off('leaderboard:update', loadScores)
      }
    } catch (error) {
      console.warn('Socket not ready', error)
    }
  }, [loadScores])

  return (
    <section className="leaderboard-page" id="leaderboard">
      <header>
        <h1>Leaderboard</h1>
        <p>See who is dominating the quiz arena.</p>
      </header>
      <div className="leaderboard-page__filters">
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">All Categories</option>
          <option value="General Knowledge">General Knowledge</option>
          <option value="Science">Science</option>
          <option value="History">History</option>
          <option value="Gaming">Gaming</option>
        </select>
        <select value={timeframe} onChange={(event) => setTimeframe(event.target.value)}>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="all">All Time</option>
        </select>
      </div>
      {loading ? (
        <div className="page-loader">Loading leaderboard...</div>
      ) : (
        <LeaderboardTable scores={scores} />
      )}
    </section>
  )
}

export default LeaderboardPage
