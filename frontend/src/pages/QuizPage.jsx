import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QuizQuestionCard from '../components/QuizQuestionCard.jsx'
import Scoreboard from '../components/Scoreboard.jsx'
import { useQuiz } from '../hooks/useQuiz.js'
import { useAuth } from '../hooks/useAuth.js'
import { fetchQuestions, submitAnswers } from '../services/apiClient.js'
import { getSocket, initSocket } from '../services/socket.js'

const defaultTime = 30

const QuizPage = () => {
  const navigate = useNavigate()
  const { token, setUser } = useAuth()
  const {
    questions,
    setQuestions,
    currentIndex,
    setCurrentIndex,
    score,
    setScore,
    activeCategory,
    difficulty
  } = useQuiz()

  const [selected, setSelected] = useState(null)
  const [timeLeft, setTimeLeft] = useState(defaultTime)
  const [answers, setAnswers] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState('playing')
  const [locked, setLocked] = useState(false)

  const currentQuestion = useMemo(() => questions[currentIndex], [questions, currentIndex])

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token, navigate])

  useEffect(() => {
    const loadQuestions = async () => {
      if (questions.length) {
        setTimeLeft(questions[0]?.timeLimit || defaultTime)
        return
      }
      try {
        const params = { limit: 10 }
        if (activeCategory) params.category = activeCategory
        if (difficulty) params.difficulty = difficulty
        const data = await fetchQuestions(params)
        setQuestions(data)
        setTimeLeft(data[0]?.timeLimit || defaultTime)
      } catch (error) {
        console.error('Failed to fetch questions', error)
      }
    }

    loadQuestions()
  }, [activeCategory, difficulty, questions, setQuestions])

  const emitScoreUpdate = useCallback((nextScore) => {
    try {
      const socket = getSocket()
      socket.emit('score:update', { score: nextScore })
    } catch (error) {
      console.warn('Socket not ready', error)
    }
  }, [])

  const finalizeGame = useCallback(async (completeAnswers) => {
    if (!completeAnswers.length) return
    setSubmitting(true)
    try {
      const payload = { answers: completeAnswers }
      if (activeCategory) payload.category = activeCategory
      if (difficulty) payload.difficulty = difficulty
      const result = await submitAnswers(payload)
      if (result?.user) {
        setUser(result.user)
      }
      setStatus('completed')
    } catch (error) {
      console.error('Submit failed', error)
    } finally {
      setSubmitting(false)
    }
  }, [activeCategory, difficulty, setUser])

  const handleAnswer = useCallback((choice) => {
    if (!currentQuestion || submitting || locked) return

    const isCorrect = choice && choice === currentQuestion.correctAnswer
    const questionScore = isCorrect ? 10 : 0
    const nextScore = score + questionScore
    const answerEntry = { questionId: currentQuestion._id, choice }
    const updatedAnswers = [...answers, answerEntry]
    const isLastQuestion = currentIndex === questions.length - 1

    setSelected(choice)
    setLocked(true)
    setScore(nextScore)
    setAnswers(updatedAnswers)
    emitScoreUpdate(nextScore)

    if (isLastQuestion) {
      setStatus('completed')
      finalizeGame(updatedAnswers)
      return
    }

    setTimeout(() => {
      setSelected(null)
      setLocked(false)
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      setTimeLeft(questions[nextIndex].timeLimit || defaultTime)
    }, 500)
  }, [answers, currentIndex, currentQuestion, emitScoreUpdate, finalizeGame, locked, questions, score, setCurrentIndex, setScore, submitting])

  useEffect(() => {
    let timer
    if (status === 'playing' && currentQuestion) {
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [status, currentQuestion])

  useEffect(() => {
    if (status !== 'playing' || !currentQuestion) return
    if (timeLeft > 0) return
    handleAnswer(null)
  }, [handleAnswer, timeLeft, status, currentQuestion])

  useEffect(() => {
    initSocket()
  }, [])

  const resetGame = () => {
  setQuestions([])
  setAnswers([])
    setCurrentIndex(0)
    setScore(0)
    setStatus('playing')
    setTimeLeft(defaultTime)
    setLocked(false)
    setSelected(null)
  }

  if (!questions.length && status === 'playing') {
    return <div className="page-loader">Loading questions...</div>
  }

  if (status === 'completed') {
    return (
      <div className="quiz-complete">
        <h2>Game Over</h2>
        <p>Your final score is {score}</p>
        <div className="quiz-complete__actions">
          <button className="btn" onClick={resetGame} type="button">Play Again</button>
          <button className="btn btn--ghost" onClick={() => navigate('/leaderboard')} type="button">
            View Leaderboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="quiz-page">
      {currentQuestion && (
        <>
          <Scoreboard
            currentScore={score}
            timeLeft={timeLeft}
            total={`${currentIndex + 1}/${questions.length}`}
          />
          <QuizQuestionCard
            question={currentQuestion}
            selected={selected}
            locked={locked}
            onAnswer={handleAnswer}
          />
        </>
      )}
    </div>
  )
}

export default QuizPage
