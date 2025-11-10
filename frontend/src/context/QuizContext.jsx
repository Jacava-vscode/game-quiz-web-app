/* eslint-disable react-refresh/only-export-components */
import { createContext, useMemo, useState } from 'react'
export const QuizContext = createContext(null)

export const QuizProvider = ({ children }) => {
  const [activeCategory, setActiveCategory] = useState(null)
  const [difficulty, setDifficulty] = useState('Medium')
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)

  const value = useMemo(() => ({
    activeCategory,
    difficulty,
    questions,
    currentIndex,
    score,
    setActiveCategory,
    setDifficulty,
    setQuestions,
    setCurrentIndex,
    setScore
  }), [activeCategory, difficulty, questions, currentIndex, score])

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  )
}
